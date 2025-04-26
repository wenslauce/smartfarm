import React, { useState, useEffect } from "react";
import { Sprout, Loader2, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { sendMessageToGroq } from '@/lib/groq';
import { getWeatherData, KENYA_LOCATIONS } from '@/lib/openweather';
import ReactMarkdown from "react-markdown";

// Maximum retries for API calls
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Kenyan crops and seasons
const crops = [
  'Maize', 'Tea', 'Coffee', 'Wheat', 'Rice', 'Potatoes', 'Beans', 
  'Sorghum', 'Millet', 'Cassava', 'Sweet Potatoes', 'Bananas'
];

const seasons = [
  { id: 'long-rains', name: 'Long Rains (March-May)' },
  { id: 'short-rains', name: 'Short Rains (October-December)' },
  { id: 'dry-season', name: 'Dry Season (June-September)' }
];

function YieldPredict() {
  const [formData, setFormData] = useState({
    Area: 100,
    District: "",
    Crop: "",
    Season: "",
  });
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(KENYA_LOCATIONS.counties[0]);
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  // Helper function for delay
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Retry wrapper for API calls
  const retryApiCall = async (apiCall, retries = MAX_RETRIES) => {
    for (let i = 0; i < retries; i++) {
      try {
        return await apiCall();
      } catch (err) {
        if (i === retries - 1) throw err;
        await delay(RETRY_DELAY * (i + 1));
      }
    }
  };

  // Fetch weather data when location changes
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const data = await retryApiCall(() => getWeatherData(selectedLocation.lat, selectedLocation.lon));
        if (data && data.main) {
          setWeatherData(data);
          setFormData(prev => ({
            ...prev,
            District: selectedLocation.name
          }));
        }
      } catch (err) {
        console.error("Error fetching weather data:", err);
        setError("Failed to fetch weather data. Please try again.");
      }
    };

    fetchWeatherData();
  }, [selectedLocation]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "Area" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      // Validate form data
      if (!formData.Crop || !formData.Season) {
        throw new Error("Please select both crop and season");
      }

      // Create a detailed prompt for yield prediction
      const yieldPredictionPrompt = `As an agricultural AI expert, analyze and predict the crop yield for the following scenario in Kenya:

Farming Details:
- Crop: ${formData.Crop}
- Area: ${formData.Area} hectares
- Season: ${formData.Season}
- Location: ${formData.District}

Current Weather:
- Temperature: ${weatherData && weatherData.main ? Math.round(weatherData.main.temp - 273.15) : 'N/A'}°C
- Humidity: ${weatherData && weatherData.main ? weatherData.main.humidity : 'N/A'}%
- Conditions: ${weatherData && weatherData.weather ? weatherData.weather[0].description : 'N/A'}

Based on historical data and current conditions:
1. Calculate the expected yield in tons considering:
   - Average yield per hectare for ${formData.Crop} in Kenya
   - Local weather conditions
   - Seasonal patterns
   - Soil conditions in ${formData.District}

2. Provide a detailed analysis including:
   - Expected total yield in tons
   - Yield per hectare
   - Comparison with typical yields
   - Impact of current weather
   - Local market potential
   - Risk factors
   - Optimization recommendations

Format the yield prediction as a number in the first line, followed by the detailed analysis.`;

      // Get prediction and analysis from Groq
      const groqResponse = await retryApiCall(async () => {
        const response = await sendMessageToGroq([{
          role: 'user',
          content: yieldPredictionPrompt
        }]);

        if (!response || !response.content) {
          throw new Error("Invalid response from Groq API");
        }

        return response;
      });

      // Extract the predicted yield from the first line of the response
      const lines = groqResponse.content.split('\n');
      const predictedYield = parseFloat(lines[0]) || 0;

      // Remove the first line (yield number) from the analysis
      const analysis = lines.slice(1).join('\n');

      setPrediction({
        yield: predictedYield,
        analysis: analysis
      });
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "Failed to get yield prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-green-800 flex items-center justify-center gap-2">
            <Sprout className="h-6 w-6 text-green-600" />
            Smart Yield Prediction
          </CardTitle>
          <CardDescription className="text-center">
            Get AI-powered yield predictions based on local conditions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="mb-6">
            <Label>Location</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {KENYA_LOCATIONS.counties.map((location) => (
                <Button
                  key={location.id}
                  variant={selectedLocation.id === location.id ? "default" : "outline"}
                  className="flex items-center gap-2"
                  onClick={() => setSelectedLocation(location)}
                >
                  <Cloud className="h-4 w-4" />
                  {location.name}
                </Button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="Area">Area (hectares)</Label>
                <Input
                  id="Area"
                  name="Area"
                  type="number"
                  required
                  onChange={handleInputChange}
                  value={formData.Area || ""}
                  placeholder="e.g., 100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="Crop">Crop Type</Label>
                <Select
                  name="Crop"
                  onValueChange={(value) => handleSelectChange("Crop", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select crop" />
                  </SelectTrigger>
                  <SelectContent>
                    {crops.map((crop) => (
                      <SelectItem key={crop} value={crop}>
                        {crop}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="Season">Growing Season</Label>
                <Select
                  name="Season"
                  onValueChange={(value) => handleSelectChange("Season", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select season" />
                  </SelectTrigger>
                  <SelectContent>
                    {seasons.map((season) => (
                      <SelectItem key={season.id} value={season.id}>
                        {season.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {weatherData && weatherData.main && (
                <div className="col-span-2 space-y-2">
                  <Label>Current Weather</Label>
                  <div className="p-3 bg-white/50 rounded-lg border border-green-100">
                    <div className="flex items-center gap-2 text-sm text-green-800">
                      <Cloud className="h-4 w-4" />
                      <span>{Math.round(weatherData.main.temp - 273.15)}°C</span>
                      <span>•</span>
                      <span>{weatherData.main.humidity}% Humidity</span>
                      <span>•</span>
                      <span className="capitalize">{weatherData.weather?.[0]?.description || 'No weather data'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Data
                </>
              ) : (
                "Predict Yield"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          {prediction && (
            <div className="w-full space-y-4">
              <div className="text-center">
                <h3 className="font-semibold text-lg text-green-700">
                  Predicted Yield:
                </h3>
                <p className="text-2xl font-bold text-green-900">
                  {typeof prediction.yield === "number"
                    ? `${prediction.yield.toFixed(2)} tons`
                    : prediction.yield}
                </p>
              </div>
              <div className="prose prose-green max-w-none">
                <ReactMarkdown>{prediction.analysis}</ReactMarkdown>
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export default YieldPredict;

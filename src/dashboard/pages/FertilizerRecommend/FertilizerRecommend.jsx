import React, { useState, useEffect } from "react";
import { Loader2, Cloud } from "lucide-react";
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

// Kenyan-specific crop and soil types
const cropTypes = [
  'Maize', 'Tea', 'Coffee', 'Wheat', 'Rice', 'Potatoes', 'Beans', 
  'Sorghum', 'Millet', 'Cassava', 'Sweet Potatoes', 'Bananas'
];

const soilTypes = [
  'Black Cotton Soil',
  'Red Volcanic Soil',
  'Sandy Soil',
  'Loam Soil',
  'Clay Soil',
  'Sandy Loam',
  'Clay Loam',
  'Silt Loam',
  'Alluvial Soil'
];

export default function FertilizerRecommend() {
  const [formData, setFormData] = useState({
    CropType: "",
    SoilType: "",
    Humidity: 51,
    Nitrogen: 8,
    Phosphorous: 28,
    Potassium: 12,
    SoilMoisture: 63,
    Temperature: 31,
  });
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(KENYA_LOCATIONS.counties[0]);
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  // Fetch weather data when location changes
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const data = await getWeatherData(selectedLocation.lat, selectedLocation.lon);
        if (data && data.main) {
          setWeatherData(data);
          
          // Update form with weather data
          setFormData(prev => ({
            ...prev,
            Temperature: Math.round(data.main.temp - 273.15), // Convert from Kelvin to Celsius
            Humidity: data.main.humidity || 0
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
    setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const prompt = `As an agricultural expert AI, analyze the following data and provide a comprehensive fertilizer recommendation for farming in ${selectedLocation.name}, Kenya:

Crop and Soil Information:
- Crop Type: ${formData.CropType}
- Soil Type: ${formData.SoilType}
- Location: ${selectedLocation.name}

Soil Nutrients (Current Levels):
- Nitrogen: ${formData.Nitrogen} kg/ha
- Phosphorous: ${formData.Phosphorous} kg/ha
- Potassium: ${formData.Potassium} kg/ha
- Soil Moisture: ${formData.SoilMoisture}%

Environmental Conditions:
- Temperature: ${formData.Temperature}°C
- Humidity: ${formData.Humidity}%
- Current Weather: ${weatherData && weatherData.weather ? weatherData.weather[0].description : 'N/A'}

Please provide a detailed analysis in the following format:

FERTILIZER_NAME
BRIEF_DESCRIPTION

Detailed Analysis:
1. Nutrient Analysis
- Evaluate current soil nutrient levels
- Identify deficiencies and excesses
- Calculate optimal nutrient ratios for ${formData.CropType}

2. Recommended Fertilizer Details
- Primary nutrients (NPK ratio)
- Secondary nutrients
- Micronutrients
- Form (granular, liquid, etc.)
- Application rate per hectare

3. Application Guidelines
- Timing of application
- Method of application
- Frequency of application
- Pre-application soil preparation
- Post-application management

4. Environmental Considerations
- Impact on soil pH
- Environmental risks
- Sustainability factors
- Runoff prevention
- Soil health impact

5. Economic Analysis
- Cost-benefit analysis
- Expected yield impact
- Local market availability
- Alternative options
- ROI estimation

6. Safety and Storage
- Handling precautions
- Storage requirements
- Environmental safety
- Worker protection

7. Organic Alternatives
- Natural fertilizer options
- Composting recommendations
- Cover crop suggestions
- Integrated nutrient management

Format the response with the fertilizer name and brief description in the first two lines, followed by the detailed analysis.`;

      const groqResponse = await sendMessageToGroq([{
        role: 'user',
        content: prompt
      }]);

      // Split the response to extract fertilizer name and description
      const lines = groqResponse.content.split('\n');
      const fertilizerName = lines[0];
      const description = lines[1];
      const analysis = lines.slice(2).join('\n');

      setRecommendation({
        fertilizer: fertilizerName,
        description: description,
        analysis: analysis
      });
    } catch (error) {
      console.error("Error:", error);
      setError(
        "Failed to get fertilizer recommendation. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-lime-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-lime-800 flex items-center justify-center gap-2">
            Smart Fertilizer Recommendation
          </CardTitle>
          <CardDescription className="text-center">
            Get AI-powered fertilizer recommendations based on soil and environmental data
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
                <Label htmlFor="CropType">Crop Type</Label>
                <Select
                  name="CropType"
                  onValueChange={(value) => handleSelectChange("CropType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select crop type" />
                  </SelectTrigger>
                  <SelectContent>
                    {cropTypes.map((crop) => (
                      <SelectItem key={crop} value={crop}>
                        {crop}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="SoilType">Soil Type</Label>
                <Select
                  name="SoilType"
                  onValueChange={(value) => handleSelectChange("SoilType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select soil type" />
                  </SelectTrigger>
                  <SelectContent>
                    {soilTypes.map((soil) => (
                      <SelectItem key={soil} value={soil}>
                        {soil}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="Nitrogen">Nitrogen (N) kg/ha</Label>
                <Input
                  id="Nitrogen"
                  name="Nitrogen"
                  type="number"
                  required
                  onChange={handleInputChange}
                  value={formData.Nitrogen || ""}
                  placeholder="e.g., 8"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="Phosphorous">Phosphorous (P) kg/ha</Label>
                <Input
                  id="Phosphorous"
                  name="Phosphorous"
                  type="number"
                  required
                  onChange={handleInputChange}
                  value={formData.Phosphorous || ""}
                  placeholder="e.g., 28"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="Potassium">Potassium (K) kg/ha</Label>
                <Input
                  id="Potassium"
                  name="Potassium"
                  type="number"
                  required
                  onChange={handleInputChange}
                  value={formData.Potassium || ""}
                  placeholder="e.g., 12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="SoilMoisture">Soil Moisture (%)</Label>
                <Input
                  id="SoilMoisture"
                  name="SoilMoisture"
                  type="number"
                  required
                  onChange={handleInputChange}
                  value={formData.SoilMoisture || ""}
                  placeholder="e.g., 63"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="Temperature">Temperature (°C)</Label>
                <Input
                  id="Temperature"
                  name="Temperature"
                  type="number"
                  required
                  value={formData.Temperature || ""}
                  placeholder="Loading from weather data..."
                  className="bg-gray-50"
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="Humidity">Humidity (%)</Label>
                <Input
                  id="Humidity"
                  name="Humidity"
                  type="number"
                  required
                  value={formData.Humidity || ""}
                  placeholder="Loading from weather data..."
                  className="bg-gray-50"
                  readOnly
                />
              </div>

              {weatherData && weatherData.main && (
                <div className="col-span-2 space-y-2">
                  <Label>Current Weather</Label>
                  <div className="p-3 bg-white/50 rounded-lg border border-lime-100">
                    <div className="flex items-center gap-2 text-sm text-lime-800">
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
                "Get Recommendation"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          {recommendation && (
            <div className="w-full space-y-4">
              <div className="text-center">
                <h3 className="font-semibold text-lg text-lime-700">
                  Recommended Fertilizer:
                </h3>
                <p className="text-2xl font-bold text-lime-900">
                  {recommendation.fertilizer}
                </p>
                <p className="mt-2 text-lime-600">
                  {recommendation.description}
                </p>
              </div>
              <div className="prose prose-lime max-w-none">
                <ReactMarkdown>{recommendation.analysis}</ReactMarkdown>
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

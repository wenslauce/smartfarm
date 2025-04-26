"use client";

import React, { useState, useEffect } from "react";
import { Leaf, Loader2, Cloud } from "lucide-react";
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
import { sendMessageToGroq } from '@/lib/groq';
import { getWeatherData, KENYA_LOCATIONS } from '@/lib/openweather';
import { Alert, AlertDescription } from "@/components/ui/alert";
import ReactMarkdown from "react-markdown";

export default function CropRecommend() {
  const [formData, setFormData] = useState({
    n: 0,
    p: 0,
    k: 0,
    temperature: 0,
    humidity: 0,
    ph: 0,
    rainfall: 0,
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
        setWeatherData(data);
        
        // Update form with weather data
        if (data && data.main) {
          setFormData(prev => ({
            ...prev,
            temperature: Math.round(data.main.temp - 273.15), // Convert from Kelvin to Celsius
            humidity: data.main.humidity || 0,
            rainfall: data.rain?.["1h"] || 0 // Use 1h rainfall if available
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // First get basic recommendation from ML model
      const mlResponse = await fetch(
        "https://nfc-api-l2z3.onrender.com/crop_rec",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      
      const mlData = await mlResponse.json();
      const basicRecommendation = mlData.predictions[0];

      // Then get detailed analysis from Groq
      const prompt = `Analyze the following agricultural data for ${selectedLocation.name}, Kenya:

Soil Nutrients:
- Nitrogen: ${formData.n} kg/ha
- Phosphorus: ${formData.p} kg/ha
- Potassium: ${formData.k} kg/ha
- pH: ${formData.ph}

Weather Conditions:
- Temperature: ${formData.temperature}°C
- Humidity: ${formData.humidity}%
- Rainfall: ${formData.rainfall}mm

ML Model Recommendation: ${basicRecommendation}

Please provide:
1. Detailed analysis of why this crop is recommended
2. Local considerations for ${selectedLocation.name}
3. Best practices for cultivation in this region
4. Potential challenges and mitigation strategies
5. Expected yield and market potential in Kenya`;

      const groqResponse = await sendMessageToGroq([{
        role: 'user',
        content: prompt
      }]);

      setRecommendation({
        crop: basicRecommendation,
        analysis: groqResponse.content
      });
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to get recommendation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-emerald-800 flex items-center justify-center gap-2">
            <Leaf className="h-6 w-6 text-emerald-600" />
            Smart Crop Recommendation
          </CardTitle>
          <CardDescription className="text-center">
            Get AI-powered crop recommendations based on soil and environmental data
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
                <Label htmlFor="n">Nitrogen (N) kg/ha</Label>
                <Input
                  id="n"
                  name="n"
                  type="number"
                  required
                  onChange={handleInputChange}
                  value={formData.n || ""}
                  placeholder="e.g., 40"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="p">Phosphorus (P) kg/ha</Label>
                <Input
                  id="p"
                  name="p"
                  type="number"
                  required
                  onChange={handleInputChange}
                  value={formData.p || ""}
                  placeholder="e.g., 50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="k">Potassium (K) kg/ha</Label>
                <Input
                  id="k"
                  name="k"
                  type="number"
                  required
                  onChange={handleInputChange}
                  value={formData.k || ""}
                  placeholder="e.g., 30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ph">pH Level</Label>
                <Input
                  id="ph"
                  name="ph"
                  type="number"
                  step="0.1"
                  required
                  onChange={handleInputChange}
                  value={formData.ph || ""}
                  placeholder="e.g., 6.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature (°C)</Label>
                <Input
                  id="temperature"
                  name="temperature"
                  type="number"
                  required
                  onChange={handleInputChange}
                  value={formData.temperature || ""}
                  placeholder="Loading from weather data..."
                  className="bg-gray-50"
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="humidity">Humidity (%)</Label>
                <Input
                  id="humidity"
                  name="humidity"
                  type="number"
                  required
                  onChange={handleInputChange}
                  value={formData.humidity || ""}
                  placeholder="Loading from weather data..."
                  className="bg-gray-50"
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rainfall">Rainfall (mm)</Label>
                <Input
                  id="rainfall"
                  name="rainfall"
                  type="number"
                  required
                  onChange={handleInputChange}
                  value={formData.rainfall || ""}
                  placeholder="Loading from weather data..."
                  className="bg-gray-50"
                  readOnly
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Data
                </>
              ) : (
                "Get Smart Recommendation"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          {recommendation && (
            <div className="w-full space-y-4">
              <div className="text-center">
                <h3 className="font-semibold text-lg text-emerald-700">
                  Recommended Crop:
                </h3>
                <p className="text-2xl font-bold text-emerald-900">
                  {recommendation.crop}
                </p>
              </div>
              <div className="prose prose-emerald max-w-none">
                <ReactMarkdown>{recommendation.analysis}</ReactMarkdown>
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

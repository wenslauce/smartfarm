import { useState, useEffect } from 'react';
import { sendMessageToGroq } from '@/lib/groq';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

// Constants
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // Base delay in milliseconds

// Helper function for delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Retry wrapper for API calls
async function retryApiCall(apiCall, maxRetries = MAX_RETRIES) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        // Exponential backoff
        const backoffDelay = RETRY_DELAY * Math.pow(2, attempt - 1);
        await delay(backoffDelay);
      }
    }
  }
  
  throw lastError;
}

export function YieldPredict() {
  const [crop, setCrop] = useState('');
  const [season, setSeason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const data = await retryApiCall(async () => {
          const response = await fetch('/api/weather');
          if (!response.ok) {
            throw new Error(`Weather API error: ${response.statusText}`);
          }
          const data = await response.json();
          if (!data.temperature || !data.rainfall || !data.humidity) {
            throw new Error('Invalid weather data format');
          }
          return data;
        });
        
        setWeatherData(data);
      } catch (error) {
        setError('Failed to fetch weather data. Please try again later.');
        console.error('Weather data fetch error:', error);
      }
    };

    fetchWeatherData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPrediction(null);

    // Validate inputs
    if (!crop || !season) {
      setError('Please select both crop and season.');
      return;
    }

    if (!weatherData) {
      setError('Weather data is not available. Please try again.');
      return;
    }

    setLoading(true);

    try {
      // Make ML model prediction
      const mlPrediction = await retryApiCall(async () => {
        const response = await fetch('/api/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            crop,
            season,
            temperature: weatherData.temperature,
            rainfall: weatherData.rainfall,
            humidity: weatherData.humidity
          })
        });

        if (!response.ok) {
          throw new Error(`Prediction API error: ${response.statusText}`);
        }

        const data = await response.json();
        if (!data.prediction) {
          throw new Error('Invalid prediction data format');
        }

        return data.prediction;
      });

      // Get Groq explanation
      const explanation = await retryApiCall(async () => {
        const messages = [{
          role: 'user',
          content: `Based on the following data:
            - Crop: ${crop}
            - Season: ${season}
            - Temperature: ${weatherData.temperature}°C
            - Rainfall: ${weatherData.rainfall}mm
            - Humidity: ${weatherData.humidity}%
            - Predicted Yield: ${mlPrediction} tons/hectare
            
            Provide a brief explanation of this yield prediction and any recommendations for the farmer.`
        }];

        const response = await sendMessageToGroq(messages);
        return response.content;
      });

      setPrediction({
        yield: mlPrediction,
        explanation
      });
    } catch (error) {
      console.error('Prediction error:', error);
      setError(
        error.message.includes('API error') 
          ? error.message 
          : 'Failed to generate prediction. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="crop" className="block text-sm font-medium">
            Crop
          </label>
          <Select
            id="crop"
            value={crop}
            onValueChange={setCrop}
            disabled={loading}
          >
            <option value="">Select a crop</option>
            <option value="rice">Rice</option>
            <option value="wheat">Wheat</option>
            <option value="maize">Maize</option>
            {/* Add more crops as needed */}
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="season" className="block text-sm font-medium">
            Season
          </label>
          <Select
            id="season"
            value={season}
            onValueChange={setSeason}
            disabled={loading}
          >
            <option value="">Select a season</option>
            <option value="kharif">Kharif</option>
            <option value="rabi">Rabi</option>
            <option value="zaid">Zaid</option>
          </Select>
        </div>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button 
          type="submit" 
          className="w-full"
          disabled={loading || !weatherData}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Prediction...
            </>
          ) : (
            'Predict Yield'
          )}
        </Button>
      </form>

      {weatherData && (
        <div className="mt-6 p-4 bg-muted/50 rounded-lg space-y-2">
          <h3 className="font-medium">Current Weather Conditions:</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Temperature</p>
              <p className="font-medium">{weatherData.temperature}°C</p>
            </div>
            <div>
              <p className="text-muted-foreground">Rainfall</p>
              <p className="font-medium">{weatherData.rainfall}mm</p>
            </div>
            <div>
              <p className="text-muted-foreground">Humidity</p>
              <p className="font-medium">{weatherData.humidity}%</p>
            </div>
          </div>
        </div>
      )}

      {prediction && (
        <div className="mt-6 space-y-4">
          <div className="p-6 bg-primary/10 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">
              Predicted Yield: {prediction.yield.toFixed(2)} tons/hectare
            </h3>
            <p className="text-muted-foreground whitespace-pre-line">
              {prediction.explanation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 
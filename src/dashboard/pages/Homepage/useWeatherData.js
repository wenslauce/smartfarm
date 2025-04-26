import { useState, useEffect } from "react";
import { getWeatherData, getLocationFromIP, searchLocations, KENYA_LOCATIONS } from '@/lib/openweather';

const useWeatherData = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [kenyaLocations] = useState(KENYA_LOCATIONS);

  // Get user's location on initial load
  useEffect(() => {
    const detectLocation = async () => {
      try {
        const ipLocation = await getLocationFromIP();
        setSelectedLocation({
          id: `${ipLocation.lat},${ipLocation.lon}`,
          name: `${ipLocation.city}, ${ipLocation.country}`,
          lat: ipLocation.lat,
          lon: ipLocation.lon
        });
      } catch (error) {
        console.error('Failed to detect location:', error);
        // Fallback to Nairobi
        setSelectedLocation(KENYA_LOCATIONS.popular[0]);
      }
    };

    detectLocation();
  }, []);

  // Fetch weather data when location changes
  useEffect(() => {
    const fetchWeather = async () => {
      if (!selectedLocation) return;

      setLoading(true);
      setError(null);

      try {
        const { current, forecast } = await getWeatherData(selectedLocation.lat, selectedLocation.lon);

        // Format current weather
        setCurrentWeather({
          temp: current.main.temp,
          feelsLike: current.main.feels_like,
          humidity: current.main.humidity,
          pressure: current.main.pressure,
          windSpeed: current.wind.speed,
          windDeg: current.wind.deg,
          description: current.weather[0].description,
          icon: `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`,
          sunrise: new Date(current.sys.sunrise * 1000).toLocaleTimeString(),
          sunset: new Date(current.sys.sunset * 1000).toLocaleTimeString(),
          visibility: current.visibility / 1000 // Convert to km
        });

        // Process 5-day forecast data
        const dailyForecasts = forecast.list.reduce((acc, item) => {
          const date = new Date(item.dt * 1000).toLocaleDateString();
          if (!acc[date]) {
            acc[date] = {
              temps: [],
              humidity: [],
              pressure: [],
              windSpeed: [],
              descriptions: [],
              icons: []
            };
          }
          acc[date].temps.push(item.main.temp);
          acc[date].humidity.push(item.main.humidity);
          acc[date].pressure.push(item.main.pressure);
          acc[date].windSpeed.push(item.wind.speed);
          acc[date].descriptions.push(item.weather[0].description);
          acc[date].icons.push(item.weather[0].icon);
          return acc;
        }, {});

        // Calculate daily averages and most common conditions
        const formattedForecast = Object.entries(dailyForecasts).map(([date, data]) => ({
          date,
          temp: data.temps.reduce((a, b) => a + b, 0) / data.temps.length,
          humidity: data.humidity.reduce((a, b) => a + b, 0) / data.humidity.length,
          pressure: data.pressure.reduce((a, b) => a + b, 0) / data.pressure.length,
          windSpeed: data.windSpeed.reduce((a, b) => a + b, 0) / data.windSpeed.length,
          // Get most common description and icon
          description: getMostFrequent(data.descriptions),
          icon: `https://openweathermap.org/img/wn/${getMostFrequent(data.icons)}@2x.png`
        }));

        setForecastData(formattedForecast);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setError(error.message || 'Failed to load weather data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [selectedLocation]);

  // Helper function to get most frequent item in array
  const getMostFrequent = (arr) => {
    return arr.reduce((a, b) =>
      arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b
    );
  };

  // Search locations
  const searchLocation = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await searchLocations(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching locations:', error);
      setError('Failed to search locations');
    }
  };

  return {
    currentWeather,
    forecastData,
    loading,
    error,
    selectedLocation,
    setSelectedLocation,
    searchLocation,
    searchResults,
    kenyaLocations,
    refreshData: async () => {
      if (selectedLocation) {
        return getWeatherData(selectedLocation.lat, selectedLocation.lon);
      }
    }
  };
};

export default useWeatherData;
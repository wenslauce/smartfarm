const API_KEY = 'f59621dcc5ce367407317c2739e61557';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// Add error handling and validation
async function validateApiKey() {
  try {
    const response = await fetch(`${BASE_URL}/weather?q=London&appid=${API_KEY}`);
    if (response.status === 401) {
      console.error('OpenWeather API key is invalid or not yet activated. Please note it may take 2-4 hours for a new API key to become active.');
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error validating API key:', error);
    return false;
  }
}

// Fetch weather data for a location using coordinates
export async function getWeatherData(lat, lon) {
  try {
    // Validate API key first
    const isValid = await validateApiKey();
    if (!isValid) {
      throw new Error('API key is invalid or not yet activated. Please wait 2-4 hours for new API keys to activate.');
    }

    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`),
      fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
    ]);

    if (!currentResponse.ok || !forecastResponse.ok) {
      const currentData = await currentResponse.json();
      const forecastData = await forecastResponse.json();
      throw new Error(currentData.message || forecastData.message || 'Weather data fetch failed');
    }

    const [current, forecast] = await Promise.all([
      currentResponse.json(),
      forecastResponse.json()
    ]);

    return { current, forecast };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

// Get user's location from IP using a free IP geolocation service
export async function getLocationFromIP() {
  try {
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) {
      throw new Error('IP location fetch failed');
    }
    const data = await response.json();
    return {
      city: data.city,
      lat: data.latitude,
      lon: data.longitude,
      country: data.country_name
    };
  } catch (error) {
    console.error('Error fetching IP location:', error);
    throw error;
  }
}

// Search for locations using OpenWeather Geocoding API
export async function searchLocations(query) {
  try {
    // Validate API key first
    const isValid = await validateApiKey();
    if (!isValid) {
      throw new Error('API key is invalid or not yet activated. Please wait 2-4 hours for new API keys to activate.');
    }

    const response = await fetch(
      `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Location search failed');
    }
    
    const data = await response.json();
    return data.map(location => ({
      id: `${location.lat},${location.lon}`,
      name: `${location.name}, ${location.country}`,
      lat: location.lat,
      lon: location.lon,
      country: location.country,
      state: location.state
    }));
  } catch (error) {
    console.error('Error searching locations:', error);
    throw error;
  }
}

// Kenya locations data
export const KENYA_LOCATIONS = {
  counties: [
    { id: 'nairobi', name: 'Nairobi', lat: -1.2921, lon: 36.8219 },
    { id: 'mombasa', name: 'Mombasa', lat: -4.0435, lon: 39.6682 },
    { id: 'kisumu', name: 'Kisumu', lat: -0.1022, lon: 34.7617 },
    { id: 'nakuru', name: 'Nakuru', lat: -0.3031, lon: 36.0800 },
    { id: 'eldoret', name: 'Eldoret', lat: 0.5143, lon: 35.2698 }
  ],
  popular: [
    { id: 'nairobi', name: 'Nairobi', lat: -1.2921, lon: 36.8219 },
    { id: 'mombasa', name: 'Mombasa', lat: -4.0435, lon: 39.6682 },
    { id: 'kisumu', name: 'Kisumu', lat: -0.1022, lon: 34.7617 },
    { id: 'nakuru', name: 'Nakuru', lat: -0.3031, lon: 36.0800 },
    { id: 'eldoret', name: 'Eldoret', lat: 0.5143, lon: 35.2698 }
  ]
}; 
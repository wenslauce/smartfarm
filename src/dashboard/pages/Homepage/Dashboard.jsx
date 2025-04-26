import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, Loader2, LogOut, RefreshCw } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import CitySelector from './CitySelector'
import MetricCard from './MetricCard'
import WeatherTable from './WeatherTable'
import useWeatherData from './useWeatherData'

export default function Dashboard() {
  const [isDemoUser, setIsDemoUser] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const navigate = useNavigate()
  
  const { 
    currentWeather, 
    forecastData, 
    loading, 
    error,
    selectedLocation: selectedCity,
    setSelectedLocation: setSelectedCity,
    searchLocation,
    searchResults,
    kenyaLocations,
    refreshData
  } = useWeatherData()

  useEffect(() => {
    // Check authentication
    const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true' || 
                          localStorage.getItem('isAuthenticated') === 'true'
    if (!isAuthenticated) {
      navigate('/auth/login')
      return
    }

    // Check if demo user
    const isDemoUser = sessionStorage.getItem('isDemoUser') === 'true'
    setIsDemoUser(isDemoUser)

    // Get user data if demo user
    if (isDemoUser) {
      const demoUser = JSON.parse(sessionStorage.getItem('demoUser'))
      console.log('Demo User:', demoUser)
    }
  }, [navigate])

  const handleLogout = () => {
    // Clear all auth data
    sessionStorage.removeItem('isAuthenticated')
    sessionStorage.removeItem('isDemoUser')
    sessionStorage.removeItem('demoUser')
    localStorage.removeItem('isAuthenticated')
    
    // Navigate to home
    navigate('/')
  }

  const handleRefresh = async () => {
    await refreshData()
    setLastUpdate(new Date())
  }

  // Calculate changes for metric cards
  const calculateChange = (current, previous) => {
    if (!current || !previous) return { trend: 'stable', percentage: 0 }
    const diff = current - previous
    const percentage = ((diff / previous) * 100).toFixed(1)
    return {
      trend: diff > 0 ? 'up' : diff < 0 ? 'down' : 'stable',
      percentage: Math.abs(percentage)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto px-4 py-8">
        {isDemoUser && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Demo Mode</AlertTitle>
            <AlertDescription>
              You are currently viewing the dashboard in demo mode. Some features may be limited.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-8">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="space-y-1">
              <h1 className="text-4xl font-bold">Weather Dashboard</h1>
              <p className="text-gray-600">
                Welcome{isDemoUser ? ' Demo User' : ''}! Monitor real-time weather data across different cities.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>

          {/* City Selector and Last Update */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <CitySelector 
              selectedLocation={selectedCity}
              onLocationChange={setSelectedCity}
              searchLocation={searchLocation}
              searchResults={searchResults}
              kenyaLocations={kenyaLocations}
            />
            <p className="text-sm text-gray-500">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard 
                title="Temperature" 
                value={`${currentWeather?.temp.toFixed(1)}°C`}
                previousValue={`${(currentWeather?.temp - 2).toFixed(1)}°C`}
                {...calculateChange(currentWeather?.temp, currentWeather?.temp - 2)}
                isLoading={loading}
              />
              <MetricCard 
                title="Humidity" 
                value={`${currentWeather?.humidity.toFixed(0)}%`}
                previousValue={`${(currentWeather?.humidity - 5).toFixed(0)}%`}
                {...calculateChange(currentWeather?.humidity, currentWeather?.humidity - 5)}
                isLoading={loading}
              />
              <MetricCard 
                title="Wind Speed" 
                value={`${currentWeather?.windSpeed.toFixed(1)} m/s`}
                previousValue={`${(currentWeather?.windSpeed - 1).toFixed(1)} m/s`}
                {...calculateChange(currentWeather?.windSpeed, currentWeather?.windSpeed - 1)}
                isLoading={loading}
              />
              <MetricCard 
                title="Pressure" 
                value={`${currentWeather?.pressure.toFixed(0)} hPa`}
                previousValue={`${(currentWeather?.pressure - 2).toFixed(0)} hPa`}
                {...calculateChange(currentWeather?.pressure, currentWeather?.pressure - 2)}
                isLoading={loading}
              />
            </div>

            {/* Weather Table */}
            <Card className="overflow-hidden">
              <WeatherTable 
                data={forecastData || []}
                isLoading={loading}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
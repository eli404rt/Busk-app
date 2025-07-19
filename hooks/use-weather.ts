"use client"

import { useState, useEffect } from "react"

interface WeatherData {
  temperature: number
  conditions: string
  windSpeed?: number
  humidity?: number
}

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchWeather = async (latitude?: number, longitude?: number) => {
    setLoading(true)
    setError(null)

    try {
      // Use Open-Meteo API (free, no API key required)
      let url =
        "https://api.open-meteo.com/v1/forecast?current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&timezone=auto"

      if (latitude && longitude) {
        url += `&latitude=${latitude}&longitude=${longitude}`
      } else {
        // Try to get user's location
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
            enableHighAccuracy: false,
          })
        })

        url += `&latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`
      }

      const response = await fetch(url)
      if (!response.ok) throw new Error("Weather API request failed")

      const data = await response.json()

      // Map weather codes to conditions (simplified)
      const getWeatherCondition = (code: number): string => {
        if (code === 0) return "Clear"
        if (code <= 3) return "Partly Cloudy"
        if (code <= 48) return "Foggy"
        if (code <= 67) return "Rainy"
        if (code <= 77) return "Snowy"
        if (code <= 82) return "Showers"
        if (code <= 99) return "Thunderstorm"
        return "Unknown"
      }

      const weatherData: WeatherData = {
        temperature: Math.round(data.current.temperature_2m),
        conditions: getWeatherCondition(data.current.weather_code),
        windSpeed: data.current.wind_speed_10m ? Math.round(data.current.wind_speed_10m) : undefined,
        humidity: data.current.relative_humidity_2m,
      }

      setWeather(weatherData)
    } catch (err) {
      console.error("Failed to fetch weather:", err)
      setError("Failed to fetch weather data")

      // Fallback: set default weather data
      setWeather({
        temperature: 20,
        conditions: "Unknown",
      })
    } finally {
      setLoading(false)
    }
  }

  // Auto-fetch weather on component mount
  useEffect(() => {
    fetchWeather()
  }, [])

  return {
    weather,
    loading,
    error,
    refetch: fetchWeather,
  }
}

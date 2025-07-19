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

  const fetchWeather = async (lat?: number, lon?: number) => {
    if (!lat || !lon) return

    setLoading(true)
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`,
      )
      const data = await response.json()

      if (data.current_weather) {
        setWeather({
          temperature: Math.round(data.current_weather.temperature),
          conditions: getWeatherCondition(data.current_weather.weathercode),
          windSpeed: Math.round(data.current_weather.windspeed),
          humidity: data.hourly?.relative_humidity_2m?.[0],
        })
      }
    } catch (error) {
      console.error("Failed to fetch weather:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude)
        },
        (error) => {
          console.error("Geolocation error:", error)
        },
      )
    }
  }, [])

  return { weather, loading, fetchWeather }
}

function getWeatherCondition(code: number): string {
  const conditions: { [key: number]: string } = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    95: "Thunderstorm",
    96: "Thunderstorm with hail",
    99: "Thunderstorm with heavy hail",
  }

  return conditions[code] || "Unknown"
}

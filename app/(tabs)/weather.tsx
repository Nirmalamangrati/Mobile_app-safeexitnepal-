import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CurrentWeather {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  iconName: keyof typeof Ionicons.glyphMap;
}

interface ForecastDay {
  day: string;
  temp: string;
  condition: string;
  iconName: keyof typeof Ionicons.glyphMap;
}

const getIconName = (conditionId: number): keyof typeof Ionicons.glyphMap => {
  if (conditionId >= 200 && conditionId < 300) return "thunderstorm";
  if (conditionId >= 300 && conditionId < 600) return "rainy";
  if (conditionId >= 600 && conditionId < 700) return "snow";
  if (conditionId === 800) return "sunny";
  return "cloudy";
};

export default function WeatherScreen() {
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(
    null,
  );
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Your key is perfectly added here
  const API_KEY = "5129d2e16d58ee35c833af12c71ce3ee";
  const CITY = "Kathmandu";

  useEffect(() => {
    const fetchWeatherPayloads = async () => {
      try {
        setErrorMsg(null);

        const [currentRes, forecastRes] = await Promise.all([
          fetch(
            `https://openweathermap.org{CITY}&units=metric&appid=${API_KEY}`,
          ),
          fetch(
            `https://openweathermap.org{CITY}&units=metric&appid=${API_KEY}`,
          ),
        ]);

        // DEBUG LOGS: Check your terminal/metro bundler to see these prints!
        console.log("Current Weather HTTP Status:", currentRes.status);
        console.log("Forecast HTTP Status:", forecastRes.status);

        if (!currentRes.ok) {
          const errData = await currentRes.json();
          throw new Error(
            `Current Weather API Error: ${errData.message || currentRes.statusText}`,
          );
        }
        if (!forecastRes.ok) {
          const errData = await forecastRes.json();
          throw new Error(
            `Forecast API Error: ${errData.message || forecastRes.statusText}`,
          );
        }

        const currentData = await currentRes.json();
        const forecastData = await forecastRes.json();

        setCurrentWeather({
          temp: Math.round(currentData.main.temp),
          condition: currentData.weather[0].main, // Fixed array target index bug here
          humidity: currentData.main.humidity,
          windSpeed: Math.round(currentData.wind.speed * 3.6),
          iconName: getIconName(currentData.weather[0].id),
        });

        const dailySnapshots: ForecastDay[] = [];
        const uniqueDayTracker = new Set<string>();
        const labelToday = new Date().toLocaleDateString("en-US", {
          weekday: "short",
        });

        interface ApiForecastItem {
          dt: number;
          main: { temp_max: number; temp_min: number };
          weather: Array<{ id: number; main: string }>;
        }

        forecastData.list.forEach((item: ApiForecastItem) => {
          const mappedDate = new Date(item.dt * 1000);
          const computedDayString = mappedDate.toLocaleDateString("en-US", {
            weekday: "short",
          });

          if (
            computedDayString !== labelToday &&
            !uniqueDayTracker.has(computedDayString) &&
            dailySnapshots.length < 3
          ) {
            uniqueDayTracker.add(computedDayString);
            dailySnapshots.push({
              day: dailySnapshots.length === 0 ? "Tomorrow" : computedDayString,
              temp: `${Math.round(item.main.temp_max)}° / ${Math.round(item.main.temp_min)}°`,
              condition: item.weather[0].main,
              iconName: getIconName(item.weather[0].id),
            });
          }
        });

        setForecast(dailySnapshots);
      } catch (err: any) {
        console.error("Full Error Stack:", err);
        // This will print the exact reason on your phone screen
        setErrorMsg(err.message || "Could not update weather records.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherPayloads();
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#0a0f1d] justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </SafeAreaView>
    );
  }

  if (errorMsg) {
    return (
      <SafeAreaView className="flex-1 bg-[#0a0f1d] justify-center items-center p-6">
        <Ionicons name="alert-circle" size={48} color="#ef4444" />
        <Text className="text-white text-base mt-4 font-medium text-center">
          {errorMsg}
        </Text>
        <Text className="text-slate-500 text-xs mt-2 text-center">
          Check your terminal log stream for network diagnostics.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-[#0a0f1d]">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Real-time Status Card */}
        <View className="bg-[#111827] rounded-2xl p-6 items-center mb-6 border border-[#1f2937]">
          <Text className="text-xl font-bold text-white mb-4">
            {CITY}, Nepal
          </Text>
          <Ionicons
            name={currentWeather?.iconName ?? "cloudy"}
            size={80}
            color="#3b82f6"
            className="my-2"
          />
          <Text className="text-5xl font-bold text-white">
            {currentWeather?.temp ?? "--"}°C
          </Text>
          <Text className="text-base text-slate-400 mt-2 mb-6">
            {currentWeather?.condition ?? "Unknown"}
          </Text>

          <View className="flex-row justify-between w-full border-t border-[#1f2937] pt-5">
            <View className="items-center flex-1">
              <Ionicons name="water" size={20} color="#94a3b8" />
              <Text className="text-xs text-slate-500 mt-1">Humidity</Text>
              <Text className="text-sm font-semibold text-white mt-0.5">
                {currentWeather?.humidity ?? "--"}%
              </Text>
            </View>
            <View className="items-center flex-1">
              <Ionicons name="speedometer" size={20} color="#94a3b8" />
              <Text className="text-xs text-slate-500 mt-1">Wind Speed</Text>
              <Text className="text-sm font-semibold text-white mt-0.5">
                {currentWeather?.windSpeed ?? "--"} km/h
              </Text>
            </View>
          </View>
        </View>

        {/* 3-Day Forecast */}
        <View className="bg-[#111827] rounded-2xl p-5 border border-[#1f2937]">
          <Text className="text-base font-bold text-white mb-4">
            3-Day Forecast
          </Text>

          {forecast.map((item, index) => (
            <View
              key={index}
              className={`flex-row justify-between items-center py-3 ${
                index !== forecast.length - 1 ? "border-b border-[#1f2937]" : ""
              }`}
            >
              <Text className="text-sm text-white w-24">{item.day}</Text>
              <View className="flex-row items-center flex-1 ml-2">
                <Ionicons name={item.iconName} size={24} color="#3b82f6" />
                <Text className="text-sm text-slate-400 ml-3">
                  {item.condition}
                </Text>
              </View>
              <Text className="text-sm text-white font-semibold text-right">
                {item.temp}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

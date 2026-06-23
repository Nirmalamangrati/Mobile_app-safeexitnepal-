import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  StatusBar,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface ForecastDay {
  day: string;
  temp: string;
  icon: string;
  condition: string;
}

export default function Home() {
  const [city, setCity] = useState("Kathmandu");
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(false);
  const getBackgroundColors = (): [string, string] => {
    if (!weather || !weather.weather) return ["#0f172a", "#1e293b"];

    const mainCondition = weather.weather.main.toLowerCase();
    if (mainCondition.includes("clear") || mainCondition.includes("sunny"))
      return ["#0284c7", "#0369a1"];
    if (mainCondition.includes("rain") || mainCondition.includes("drizzle"))
      return ["#334155", "#1e293b"];
    if (mainCondition.includes("cloud")) return ["#1e293b", "#0f172a"];
    if (mainCondition.includes("thunder")) return ["#18181b", "#09090b"];

    return ["#0f172a", "#1e293b"];
  };

  const searchWeather = async () => {
    if (!city.trim()) {
      Alert.alert("Error", "Enter city name");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `http://192.168.43.132:8000/api/weather/${city}`,
      );
      if (!response.ok) {
        throw new Error("City not found or server error");
      }
      const data = await response.json();
      setWeather(data.current);
      const dailySnapshots: ForecastDay[] = [];
      const seenDates = new Set<string>();

      if (data.forecast && data.forecast.list) {
        data.forecast.list.forEach((item: any) => {
          const dateStr = item.dt_txt.split(" ")[0];

          if (!seenDates.has(dateStr)) {
            seenDates.add(dateStr);

            const mappedDate = new Date(item.dt * 1000);
            const dayName = mappedDate.toLocaleDateString("en-US", {
              weekday: "short",
            });
            const todayName = new Date().toLocaleDateString("en-US", {
              weekday: "short",
            });

            dailySnapshots.push({
              day: dayName === todayName ? "Today" : dayName,
              temp: `${Math.round(item.main.temp_max)}° / ${Math.round(item.main.temp_min)}°`,
              icon:
                item.weather && item.weather[0] ? item.weather[0].icon : "01d",
              condition:
                item.weather && item.weather[0]
                  ? item.weather[0].main
                  : "Clear",
            });
          }
        });
      }

      setForecast(dailySnapshots);
    } catch (error) {
      console.log("Weather Fetch Error Detail: ", error);
      Alert.alert("Error", "City not found or network error");
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      searchWeather();
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  return (
    <LinearGradient colors={getBackgroundColors()} style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 10,
            paddingBottom: 40,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="items-center mb-8 mt-4">
            <MaterialCommunityIcons
              name="weather-partly-cloudy"
              size={55}
              color="white"
            />
            <Text className="text-white text-4xl font-extrabold mt-2 tracking-wide">
              Weather App
            </Text>
            <Text className="text-blue-100/80 font-medium">
              Beautiful Weather Forecast
            </Text>
          </View>

          {/* Search Input Bar */}
          <View className="bg-white/20 rounded-full flex-row items-center px-5 py-2.5 border border-white/30 shadow-sm">
            <Ionicons name="location-outline" size={22} color="white" />
            <TextInput
              value={city}
              onChangeText={setCity}
              placeholder="Search city..."
              placeholderTextColor="#e2e8f0"
              className="flex-1 ml-3 text-white text-lg py-1"
              onSubmitEditing={searchWeather}
            />
            <TouchableOpacity onPress={searchWeather}>
              <Ionicons name="search" size={22} color="white" />
            </TouchableOpacity>
          </View>

          {/* Loading Indicator */}
          {loading && (
            <ActivityIndicator size="large" color="#ffffff" className="mt-12" />
          )}

          {/* Weather Main Content */}
          {weather && !loading && weather.weather && (
            <View>
              <View className="bg-white/10 mt-8 rounded-[30px] p-6 border border-white/20 shadow-lg">
                <View className="items-center">
                  <Text className="text-white text-3xl font-extrabold tracking-wide">
                    {weather.name}
                  </Text>
                  <Text className="text-blue-200 text-sm font-semibold tracking-widest uppercase mt-0.5">
                    {weather.sys?.country}
                  </Text>
                  <Image
                    source={{
                      uri: `https://openweathermap.org{weather.weather.icon}@4x.png`,
                    }}
                    className="w-36 h-36 mt-2"
                  />

                  <Text className="text-white text-7xl font-black mt-2">
                    {Math.round(weather.main?.temp)}°
                  </Text>
                  <Text className="text-blue-100 text-lg font-medium capitalize mt-1">
                    {weather.weather.description}
                  </Text>
                </View>
                <View className="flex-row justify-between mt-8">
                  <View className="bg-white/10 rounded-2xl p-3.5 items-center w-[30%] border border-white/10">
                    <Ionicons name="water" color="#38bdf8" size={26} />
                    <Text className="text-white mt-1.5 font-bold text-base">
                      {weather.main?.humidity}%
                    </Text>
                    <Text className="text-blue-200 text-xs">Humidity</Text>
                  </View>

                  <View className="bg-white/10 rounded-2xl p-3.5 items-center w-[30%] border border-white/10">
                    <Ionicons name="speedometer" color="#4ade80" size={26} />
                    <Text className="text-white mt-1.5 font-bold text-base">
                      {Math.round(weather.wind?.speed * 3.6)}
                    </Text>
                    <Text className="text-blue-200 text-xs">km/h</Text>
                  </View>

                  <View className="bg-white/10 rounded-2xl p-3.5 items-center w-[30%] border border-white/10">
                    <MaterialCommunityIcons
                      name="thermometer"
                      color="#fb923c"
                      size={26}
                    />
                    <Text className="text-white mt-1.5 font-bold text-base">
                      {Math.round(weather.main?.feels_like)}°
                    </Text>
                    <Text className="text-blue-200 text-xs">Feels</Text>
                  </View>
                </View>
              </View>

              {/* 7 Day Forecast List */}
              <View className="mt-8">
                <Text className="text-white text-lg font-bold mb-4 ml-1">
                  7-Day Forecast
                </Text>
                {forecast.map((day, index) => (
                  <View
                    key={index}
                    className="bg-white/10 rounded-2xl p-4 flex-row justify-between items-center mb-3 border border-white/10 shadow-sm"
                  >
                    <Text className="text-white font-semibold w-16">
                      {day.day}
                    </Text>
                    <View className="flex-row items-center flex-1 justify-center">
                      <Image
                        source={{
                          uri: `https://openweathermap.org{day.icon}.png`,
                        }}
                        className="w-10 h-10"
                      />
                      <Text className="text-blue-200 text-sm ml-2 capitalize font-medium">
                        {day.condition}
                      </Text>
                    </View>
                    <Text className="text-white font-bold text-right w-16">
                      {day.temp}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

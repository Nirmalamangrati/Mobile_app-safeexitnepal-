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

const API_KEY = "895284fb665f4814a4ab1a7e29b6c03d";

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

  const getBackgroundClass = () => {
    if (!weather || !weather.weather || weather.weather.length === 0)
      return "bg-slate-900";
    const mainCondition = weather.weather.main.toLowerCase();
    if (mainCondition.includes("clear") || mainCondition.includes("sunny"))
      return "bg-sky-600";
    if (mainCondition.includes("rain") || mainCondition.includes("drizzle"))
      return "bg-slate-700";
    if (mainCondition.includes("cloud")) return "bg-slate-800";
    if (mainCondition.includes("thunder")) return "bg-zinc-900";
    return "bg-slate-900";
  };

  const searchWeather = async () => {
    if (!city.trim()) {
      Alert.alert("Error", "Enter city name");
      return;
    }

    try {
      setLoading(true);

      // १. हालको मौसम: एन्ड्रोइड सेक्युरिटी बाइपास गर्न ऑल-ओरिजिन प्राक्सी प्रयोग गरिएको छ
      const currentUrl = encodeURIComponent(
        `https://openweathermap.org{city}&appid=${API_KEY}&units=metric`,
      );
      const currentResponse = await fetch(`https://allorigins.win{currentUrl}`);

      if (!currentResponse.ok) {
        throw new Error("City not found");
      }
      const currentRaw = await currentResponse.json();
      const currentData = JSON.parse(currentRaw.contents); // प्राक्सीबाट आएको डेटा सुरक्षित रूपमा पार्स गरेको
      setWeather(currentData);

      // २. ५ दिनको पूर्वानुमान: यहाँ पनि सुरक्षित प्राक्सी टनेल प्रयोग गरिएको छ
      const forecastUrl = encodeURIComponent(
        `https://openweathermap.org{city}&appid=${API_KEY}&units=metric`,
      );
      const forecastResponse = await fetch(
        `https://allorigins.win{forecastUrl}`,
      );

      if (!forecastResponse.ok) {
        throw new Error("Forecast data failed");
      }
      const forecastRaw = await forecastResponse.json();
      const forecastData = JSON.parse(forecastRaw.contents);

      const dailySnapshots: ForecastDay[] = [];
      const seenDates = new Set<string>();

      forecastData.list.forEach((item: any) => {
        const dateStr = item.dt_txt.split(" ");

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
            icon: item.weather.icon,
            condition: item.weather.main,
          });
        }
      });

      setForecast(dailySnapshots);
    } catch (error) {
      console.log("Proxy API Fetch Error: ", error);
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
    <View className={`flex-1 ${getBackgroundClass()}`}>
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
            <Text className="text-white text-4xl font-extrabold mt-2">
              Weather App
            </Text>
            <Text className="text-blue-100">Beautiful Weather Forecast</Text>
          </View>

          {/* Search Input Bar */}
          <View className="bg-white/20 rounded-full flex-row items-center px-5 py-3 border border-white/20">
            <Ionicons name="location-outline" size={22} color="white" />
            <TextInput
              value={city}
              onChangeText={setCity}
              placeholder="Search city..."
              placeholderTextColor="#ddd"
              className="flex-1 ml-3 text-white text-lg py-1"
              onSubmitEditing={searchWeather}
            />
            <TouchableOpacity onPress={searchWeather}>
              <Ionicons name="search" size={25} color="white" />
            </TouchableOpacity>
          </View>

          {/* Loading Indicator */}
          {loading && (
            <ActivityIndicator size="large" color="white" className="mt-12" />
          )}

          {/* Weather Main Content */}
          {weather && !loading && weather.weather && weather.weather && (
            <View>
              <View className="bg-white/15 mt-8 rounded-[35px] p-6 border border-white/20">
                <View className="items-center">
                  <Text className="text-white text-3xl font-bold">
                    {weather.name}
                  </Text>
                  <Text className="text-blue-100">{weather.sys?.country}</Text>

                  <Image
                    source={{
                      uri: `https://openweathermap.org{weather.weather.icon}@4x.png`,
                    }}
                    className="w-40 h-40"
                  />

                  <Text className="text-white text-7xl font-extrabold">
                    {Math.round(weather.main?.temp)}°
                  </Text>
                  <Text className="text-blue-100 text-xl capitalize mt-1">
                    {weather.weather.description}
                  </Text>
                </View>

                {/* ग्रिड विवरण */}
                <View className="flex-row justify-between mt-8">
                  <View className="bg-white/10 rounded-2xl p-4 items-center w-[30%]">
                    <Ionicons name="water" color="#38bdf8" size={28} />
                    <Text className="text-white mt-2 font-bold">
                      {weather.main?.humidity}%
                    </Text>
                    <Text className="text-blue-100 text-xs">Humidity</Text>
                  </View>

                  <View className="bg-white/10 rounded-2xl p-4 items-center w-[30%]">
                    <Ionicons name="speedometer" color="#22c55e" size={28} />
                    <Text className="text-white mt-2 font-bold">
                      {Math.round(weather.wind?.speed * 3.6)}
                    </Text>
                    <Text className="text-blue-100 text-xs">km/h</Text>
                  </View>

                  <View className="bg-white/10 rounded-2xl p-4 items-center w-[30%]">
                    <MaterialCommunityIcons
                      name="thermometer"
                      color="#fb923c"
                      size={28}
                    />
                    <Text className="text-white mt-2 font-bold">
                      {Math.round(weather.main?.feels_like)}°
                    </Text>
                    <Text className="text-blue-100 text-xs">Feels</Text>
                  </View>
                </View>
              </View>

              {/* ५ दिनको पूर्वानुमान खण्ड */}
              {forecast.length > 0 && (
                <View className="bg-white/15 mt-6 rounded-[30px] p-5 border border-white/20">
                  <Text className="text-white text-lg font-bold mb-4 ml-1">
                    5-Day Forecast
                  </Text>

                  {forecast.map((item, index) => (
                    <View
                      key={index}
                      className={`flex-row justify-between items-center py-3 ${
                        index !== forecast.length - 1
                          ? "border-b border-white/10"
                          : ""
                      }`}
                    >
                      <Text className="text-white text-base font-semibold w-20">
                        {item.day}
                      </Text>

                      <View className="flex-row items-center flex-1 justify-start ml-2">
                        <Image
                          source={{
                            uri: `https://openweathermap.org{item.icon}.png`,
                          }}
                          className="w-10 h-10"
                        />
                        <Text className="text-blue-100 text-sm ml-2 capitalize">
                          {item.condition}
                        </Text>
                      </View>

                      <Text className="text-white text-sm font-bold text-right w-24">
                        {item.temp}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

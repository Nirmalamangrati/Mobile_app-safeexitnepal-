import { MapPin, Clock3, Navigation } from "lucide-react-native";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import { router } from "expo-router";
// Prop maa real shelters data receive garne banako
export const FindShelters = ({ shelters = [] }: { shelters?: any }) => {
  const [locationName, setLocationName] = useState<string>(
    "Click to fetch location...",
  );
  const [nearestShelter, setNearestShelter] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // 1. real 'shelters' data use garera KNN Search garne algorithm
  function calculateNearestShelter(
    userLat: number,
    userLng: number,
    realShelters: any[],
  ) {
    console.log("Admin list fetched:", realShelters);
    // if admin bata khali data aayo vane screen test garna yo use hunxa
    let finalShelters = realShelters;
    if (!realShelters || realShelters.length === 0) {
      finalShelters = [
        {
          name: "Lalitpur community center",
          latitude: 27.659,
          longitude: 85.345,
          status: "Open",
          shelterType: "Educational Buildings",
        },
      ];
    }
    let closest: any = null;
    let minDistance = Infinity;
    finalShelters.forEach((shelter) => {
      const shelterLat = Number(
        shelter.latitude || shelter.lat || shelter.location?.coordinates?.[1],
      );
      const shelterLng = Number(
        shelter.longitude || shelter.lng || shelter.location?.coordinates?.[0],
      );
      if (isNaN(shelterLat) || isNaN(shelterLng)) return;
      const R = 6371; // earth radius (KM)
      const dLat = (shelterLat - userLat) * (Math.PI / 180);
      const dLon = (shelterLng - userLng) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(userLat * (Math.PI / 180)) *
          Math.cos(shelterLat * (Math.PI / 180)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      if (distance < minDistance) {
        minDistance = distance;
        closest = { ...shelter, distance: distance };
      }
    });

    if (closest) {
      const walkTimeMinutes = Math.round((closest.distance / 5) * 60);

      setNearestShelter({
        name: closest.name,
        status: closest.status || "Open",
        distance: closest.distance.toFixed(2),
        eta: walkTimeMinutes,
        shelterType: closest.shelterType || "Buildings",
      });
    }
  }
  // 2. real GPS location tanne ra AI command chalaune function
  const handleGetLocation = async () => {
    setIsLoading(true);
    setLocationName("Fetching current GPS location...");
    try {
      // location permission magne
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Please enable location services in settings.",
        );
        setLocationName("Location permission denied");
        setIsLoading(false);
        return;
      }
      // real GPS coordination tanne
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const lat = location.coords.latitude;
      const lng = location.coords.longitude;
      // AI algorithms (KNN Search) maa data sent garne
      calculateNearestShelter(lat, lng, shelters);
      // cordination lai manxele bujhne address maa convert garne(Reverse Geocoding)
      let geocode = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: lng,
      });
      if (geocode && geocode.length > 0) {
        const address = geocode[0];
        setLocationName(
          `${address.name || address.street || "Current Location"}, ${address.district || address.city || "Nepal"}`,
        );
      } else {
        setLocationName(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Error",
        "Could not fetch GPS location. Please check your internet or GPS.",
      );
      setLocationName("Failed to get location");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <View className="bg-[#0f172a] p-4 rounded-2xl w-full border border-slate-800">
      {/* Header */}
      <View className="flex-row items-center mb-1">
        <Text className="text-white text-base font-bold">
          Find Safe Shelters
        </Text>
      </View>
      <Text className="text-gray-400 text-xs mb-4">
        Discover nearby shelters with real-time availability and navigation.
      </Text>
      {/* Current Location Input / Button */}
      <TouchableOpacity
        onPress={handleGetLocation}
        disabled={isLoading}
        className="bg-[#111827] rounded-xl p-3 border border-gray-800 mb-3 flex-row items-center justify-between"
      >
        <View className="flex-row items-center flex-1">
          <MapPin color="#60a5fa" size={18} />
          <TextInput
            placeholder="Fetching current GPS location..."
            placeholderTextColor="#94a3b8"
            value={locationName}
            className="flex-1 text-white ml-2 p-0 text-xs"
            editable={false}
          />
        </View>
        {isLoading && <ActivityIndicator size="small" color="#60a5fa" />}
      </TouchableOpacity>
      {/* Shelter Status Block */}
      <View className="bg-[#111827] rounded-xl p-3 border border-gray-800 mb-3">
        <View className="flex-row justify-between items-center">
          <Text
            className="text-white font-semibold flex-1 mr-2"
            numberOfLines={1}
          >
            {nearestShelter
              ? nearestShelter.name
              : "Tap GPS to find nearest shelter"}
          </Text>
          <View
            className={`px-3 py-1 rounded-full ${nearestShelter?.status === "Closed" || nearestShelter?.status === "Unsafe" ? "bg-red-500/20" : "bg-green-500/20"}`}
          >
            <Text
              className={`text-xs font-bold ${nearestShelter?.status === "Closed" || nearestShelter?.status === "Unsafe" ? "text-red-400" : "text-green-400"}`}
            >
              {nearestShelter
                ? `${nearestShelter.status.toUpperCase()} NOW`
                : "STANDBY"}
            </Text>
          </View>
        </View>
        <Text className="text-gray-400 text-xs mt-1">
          {nearestShelter
            ? `Type: ${nearestShelter.shelterType}`
            : "Real-time sync active with admin panel"}
        </Text>
      </View>
      {/* ETA & Distance Row */}
      <View className="flex-row justify-between mb-3">
        {/* ETA Box */}
        <View className="bg-[#111827] flex-1 mr-2 p-3 rounded-xl border border-gray-800">
          <View className="flex-row items-center mb-1">
            <Clock3 size={16} color="#facc15" />
            <Text className="text-yellow-400 ml-2 text-xs">ETA</Text>
          </View>
          <Text className="text-white font-bold text-lg">
            {nearestShelter ? `${nearestShelter.eta} min` : "-- min"}
          </Text>
          <Text className="text-gray-400 text-xs"> Walking</Text>
        </View>
        {/* Distance Box */}
        <View className="bg-[#111827] flex-1 ml-2 p-3 rounded-xl border border-gray-800">
          <View className="flex-row items-center mb-1">
            <Navigation size={16} color="#60a5fa" />
            <Text className="text-blue-400 ml-2 text-xs">Distance</Text>
          </View>
          <Text className="text-white font-bold text-lg">
            {nearestShelter ? `${nearestShelter.distance} km` : "-- km"}
          </Text>
          <Text className="text-gray-400 text-xs">From your location</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          if (nearestShelter) {
            router.push({
              pathname: "/map-screen",
              params: {
                name: nearestShelter.name,
                lat: nearestShelter.latitude || nearestShelter.lat,
                lng: nearestShelter.longitude || nearestShelter.lng,
              },
            });
          } else {
            Alert.alert(
              "Notice",
              "Please fetch your current GPS location first.",
            );
          }
        }}
        className="bg-blue-600 rounded-xl py-3 items-center active:opacity-80"
      >
        <Text className="text-white font-bold">Open Dynamic Map</Text>
      </TouchableOpacity>
    </View>
  );
};

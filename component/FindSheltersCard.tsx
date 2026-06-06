import { MapPin, Clock3, Navigation, RefreshCw } from "lucide-react-native";
import React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";

export const FindShelters = () => {
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

      {/* Current Location */}
      <TouchableOpacity className="bg-[#111827] rounded-xl p-3 border border-gray-800 mb-3">
        <View className="flex-row items-center">
          <MapPin color="#60a5fa" size={18} />
          <TextInput
            placeholder="Fetching current GPS location..."
            placeholderTextColor="#94a3b8"
            className="flex-1 text-white ml-2"
            editable={false}
          />
        </View>
      </TouchableOpacity>

      {/* Shelter Status */}
      <View className="bg-[#111827] rounded-xl p-3 border border-gray-800 mb-3">
        <View className="flex-row justify-between items-center">
          <Text className="text-white font-semibold">Community Shelter A</Text>

          <View className="bg-green-500/20 px-3 py-1 rounded-full">
            <Text className="text-green-400 text-xs font-bold">OPEN NOW</Text>
          </View>
        </View>

        <Text className="text-gray-400 text-xs mt-1">Open until 10:00 PM</Text>
      </View>

      {/* ETA & Distance */}
      <View className="flex-row justify-between mb-3">
        <View className="bg-[#111827] flex-1 mr-2 p-3 rounded-xl border border-gray-800">
          <View className="flex-row items-center mb-1">
            <Clock3 size={16} color="#facc15" />
            <Text className="text-yellow-400 ml-2 text-xs">ETA</Text>
          </View>

          <Text className="text-white font-bold text-lg">12 min</Text>

          <Text className="text-gray-400 text-xs"> Walking</Text>
        </View>

        <View className="bg-[#111827] flex-1 ml-2 p-3 rounded-xl border border-gray-800">
          <View className="flex-row items-center mb-1">
            <Navigation size={16} color="#60a5fa" />
            <Text className="text-blue-400 ml-2 text-xs">Distance </Text>
          </View>

          <Text className="text-white font-bold text-lg">2.4 km</Text>

          <Text className="text-gray-400 text-xs">From your location</Text>
        </View>
      </View>

      {/* Live Admin Sync */}
      <View className="bg-[#111827] rounded-xl p-3 border border-gray-800 mb-3">
        <View className="flex-row items-center">
          <RefreshCw size={16} color="#22c55e" />

          <Text className="text-green-400 ml-2 text-sm font-semibold">
            Live Admin Data Synced
          </Text>
        </View>

        <Text className="text-gray-400 text-xs mt-1">
          Latest shelter information fetched from admin panel.
        </Text>
      </View>

      {/* Dynamic Map Button */}
      <TouchableOpacity className="bg-blue-600 rounded-xl py-3 items-center">
        <Text className="text-white font-bold">Open Dynamic Map</Text>
      </TouchableOpacity>
    </View>
  );
};

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export const FindShelters = () => {
  return (
    <View className="bg-[#0f172a] p-4 rounded-2xl w-full  border border-slate-800">
      {/* Header */}
      <View className="flex-row items-center mb-1">
        <Text className="text-blue-400 mr-2">📍</Text>
        <Text className="text-white text-base font-bold">Find Shelters</Text>
      </View>
      <Text className="text-gray-400 text-xs mb-3">Shelters Desc</Text>

      {/* Map Placeholder */}
      <TouchableOpacity className="bg-[#111827] h-24 rounded-xl items-center justify-center mb-3 border border-gray-800">
        <Text className="text-gray-500 text-xs">Map View</Text>
      </TouchableOpacity>

      {/* Footer Info */}
      <View className="flex-row justify-between items-center">
        <Text className="text-red-400 text-xs">📍 Naya Bazaar Shelter</Text>
        <Text className="text-gray-400 text-xs">(0.5 km)</Text>
      </View>
      <Text className="text-amber-500 text-xs mt-1">Capacity: 70% Full</Text>
    </View>
  );
};

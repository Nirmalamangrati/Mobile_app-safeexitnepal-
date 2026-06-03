import React from "react";
import { View, Text } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

export default function FindShelters() {
  return (
    <View className="bg-[#0f172a] rounded-2xl p-4 w-[48.5%] mb-4">
      <View className="flex-row items-center mb-1">
        <Ionicons name="location-outline" size={18} color="#5c8df6" />
        <Text className="text-white text-[15px] font-semibold ml-1.5">
          Find Shelters
        </Text>
      </View>
      <Text className="text-white text-[12px] mb-3">Shelters Desc</Text>

      <View className="bg-[#1c2638] rounded-xl h-[100px] justify-center items-center mb-3">
        <Text className="text-white text-[14px] font-medium">Map View</Text>
      </View>

      <View className="flex-row justify-between items-center mb-1">
        <Text className="text-white text-[11px]">
          <FontAwesome5 name="map-pin" size={11} color="#ef4444" /> Naya Bazaar
          Shelter
        </Text>
        <Text className="text-white text-[11px]">(0.5 km)</Text>
      </View>
      <Text className="text-white text-[11px] font-bold">
        Capacity: 70% Full
      </Text>
    </View>
  );
}

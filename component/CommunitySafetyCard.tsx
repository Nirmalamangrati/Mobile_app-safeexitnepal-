import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CommunitySafety() {
  return (
    <View className="bg-[#0f172a] rounded-xl aspect-square p-4 w-[48.5%] mb-4 justify-between">
      <View>
        <View className="flex-row items-center mb-1">
          <Ionicons name="shield-outline" size={18} color="#5c8df6" />
          <Text className="text-white text-[15px] font-semibold ml-1.5">
            Community Safety
          </Text>
        </View>
        <Text className="text-white text-[12px] mb-2">
          Community Safety Desc
        </Text>
      </View>

      <View className="bg-[#1c2638] rounded-lg h-[70px] justify-center items-center mb-2">
        <Text className="text-white text-[14px] font-medium">Map View</Text>
      </View>

      <Text className="text-white text-[11px] font-bold">
        Capacity: 70% Full
      </Text>
    </View>
  );
}

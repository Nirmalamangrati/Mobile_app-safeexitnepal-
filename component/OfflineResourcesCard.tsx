import React from "react";
import { View, Text } from "react-native";
import {
  Feather,
  MaterialCommunityIcons,
  Octicons,
  Ionicons,
} from "@expo/vector-icons";

export default function OfflineResources() {
  return (
    <View className="bg-[#0f172a] rounded-2xl p-4 w-[48.5%] mb-4 justify-between">
      <View>
        <Text className="text-white text-[15px] font-semibold">
          Offline Resources
        </Text>
        <Text className="text-white text-[12px] mb-4">
          Important data cached.
        </Text>
      </View>

      <View className="flex-row justify-around">
        <View className="items-center w-[45%]">
          <Feather name="download" size={22} color="#22c55e" />
          <Text className="text-white text-[10px] mt-1.5 text-center">
            Download maps
          </Text>
        </View>
        <View className="items-center w-[45%]">
          <MaterialCommunityIcons
            name="wrench-outline"
            size={22}
            color="#3b82f6"
          />
          <Text className="text-white text-[10px] mt-1.5 text-center">
            Mesh tools
          </Text>
        </View>
      </View>

      <View className="flex-row justify-around mt-4">
        <View className="items-center w-[45%]">
          <Octicons name="graph" size={20} color="#eab308" />
          <Text className="text-white text-[10px] mt-1.5 text-center">
            Procedures
          </Text>
        </View>
        <View className="items-center w-[45%]">
          <Ionicons name="play-circle-outline" size={24} color="#ef4444" />
          <Text className="text-white text-[10px] mt-1 text-center">
            First Aid Guides
          </Text>
        </View>
      </View>
    </View>
  );
}

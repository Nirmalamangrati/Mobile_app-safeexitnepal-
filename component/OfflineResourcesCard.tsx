import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export const OfflineResources = () => {
  return (
    <View className="bg-[#0f172a] p-4 rounded-2xl w-full mb-4 border border-slate-800">
      {/* Header */}
      <Text className="text-white text-base font-bold mb-1">
        Offline Resources
      </Text>
      <Text className="text-gray-400 text-xs mb-4">Important data cached.</Text>

      {/* Grid Quick Actions */}
      <View className="flex-row flex-wrap justify-between">
        {/* Download Maps */}
        <TouchableOpacity className="w-[48%] items-center justify-center py-2 mb-2 rounded-xl bg-[#111827] text-white">
          <Text className="text-green-400 text-lg mb-1">📥</Text>
          <Text className="text-white text-xs">Download maps</Text>
        </TouchableOpacity>

        {/* Mesh Tools */}
        <TouchableOpacity className="w-[48%] items-center justify-center py-2 mb-2 rounded-xl bg-[#111827]">
          <Text className="text-blue-400 text-lg mb-1">🔧</Text>
          <Text className="text-white text-xs">Mesh tools</Text>
        </TouchableOpacity>

        {/* Procedures */}
        <TouchableOpacity className="w-[48%] items-center justify-center py-2 rounded-xl bg-[#111827]">
          <Text className="text-yellow-500 text-lg mb-1">📊</Text>
          <Text className="text-white text-xs">Procedures</Text>
        </TouchableOpacity>

        {/* First Aid Guides */}
        <TouchableOpacity className="w-[48%] items-center justify-center py-2 rounded-xl bg-[#111827]">
          <Text className="text-red-500 text-lg mb-1">▶️</Text>
          <Text className="text-white text-xs">First Aid Guides</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

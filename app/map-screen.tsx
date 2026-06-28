import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import MapView, { Marker } from "react-native-maps";
import { ArrowLeft, MapPin } from "lucide-react-native";

export default function MapScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const shelterName = params.name ? String(params.name) : "Safe Shelter";
  const shelterLat = params.lat ? Number(params.lat) : 27.6564;
  const shelterLng = params.lng ? Number(params.lng) : 85.342;
  return (
    <View className="flex-1 bg-[#0f172a] relative">
      {/* Fixed Full Screen Map View Component wrapper */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.mapStyle}
          provider="google" // Forces Google Maps rendering engine
          initialRegion={{
            latitude: shelterLat,
            longitude: shelterLng,
            latitudeDelta: 0.012,
            longitudeDelta: 0.012,
          }}
        >
          <Marker
            coordinate={{ latitude: shelterLat, longitude: shelterLng }}
            title={shelterName}
            description="Nearest evacuation endpoint"
          />
        </MapView>
      </View>

      {/* Floating Floating Header Overlay Card */}
      <View className="absolute top-12 left-4 right-4 bg-[#111827]/95 p-4 rounded-2xl border border-slate-800 shadow-2xl z-50">
        <View className="flex-row items-center mb-2">
          <MapPin color="#60a5fa" size={20} />
          <Text
            className="text-white text-base font-bold flex-1 ml-2"
            numberOfLines={1}
          >
            {shelterName}
          </Text>
        </View>

        <Text className="text-gray-400 text-xs mb-4">
          Routing you safe towards the nearest active shelter point.
        </Text>

        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-blue-600 rounded-xl py-2.5 px-4 flex-row items-center justify-center self-start active:opacity-80"
        >
          <ArrowLeft color="#fff" size={16} />
          <Text className="text-white font-bold text-xs ml-2">
            Return to Dashboard
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Solid fallback styling override blocks to guarantee native dimensions rendering
const styles = {
  mapContainer: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end" as const,
    alignItems: "center" as const,
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
};

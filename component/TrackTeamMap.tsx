import React, { useState, useEffect, useMemo } from "react";
import { View, Text, Dimensions, TouchableOpacity, Modal } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { io } from "socket.io-client";
import { Users, X } from "lucide-react-native"; // बन्द गर्न X थपियो

export default function TrackTeamMap({
  route,
  navigation,
  isMiniMap = true,
  item,
}: {
  route?: any;
  navigation?: any;
  isMiniMap?: boolean;
  item?: any;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false); // 🎯 मोडल स्टेट

  const team = useMemo(() => route?.params?.team || {}, [route?.params?.team]);
  const clientLoc = useMemo(
    () => ({
      latitude: team.clientLatitude || 27.7007,
      longitude: team.clientLongitude || 85.3001,
    }),
    [team.clientLatitude, team.clientLongitude],
  );

  const [teamLoc, setTeamLoc] = useState({
    latitude: team.latitude || 27.7172,
    longitude: team.longitude || 85.324,
  });

  const [roadRoute, setRoadRoute] = useState<any[]>([]);

  useEffect(() => {
    if (team.roadRoute && team.roadRoute.length > 0) {
      setRoadRoute(team.roadRoute);
    } else {
      setRoadRoute([clientLoc, teamLoc]);
    }
  }, [team.roadRoute, clientLoc, teamLoc]);

  const [eta, setEta] = useState<string>(team.eta || "Calculating...");
  const [distance, setDistance] = useState<string>(
    team.distanceFromMe || team.roadDistance || "Calculating...",
  );

  useEffect(() => {
    if (!team.id) return;
    const socket = io("http://192.168.43.132:8000");
    socket.on("team-location-updated", (data) => {
      if (data.teamId === team.id) {
        setTeamLoc({ latitude: data.latitude, longitude: data.longitude });
        if (
          data.route &&
          data.route.roadCoordinates &&
          data.route.roadCoordinates.length > 0
        ) {
          setRoadRoute(data.route.roadCoordinates);
          setEta(
            data.route.etaMinutes ? data.route.etaMinutes + " mins" : "N/A",
          );
          setDistance(
            data.route.roadDistanceKm
              ? data.route.roadDistanceKm + " km"
              : "N/A",
          );
        }
      }
    });
    return () => {
      socket.disconnect();
    };
  }, [team.id]);

  const latDelta = Math.abs(clientLoc.latitude - teamLoc.latitude) * 2;
  const lngDelta = Math.abs(clientLoc.longitude - teamLoc.longitude) * 2;

  // 🗺️ म्याप कम्पोनेन्ट (जसलाई हामी मोडल र फुल स्क्रिन दुबैमा चलाउन सक्छौँ)
  const RenderMap = () => (
    <MapView
      style={{
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
      }}
      initialRegion={{
        latitude: (clientLoc.latitude + teamLoc.latitude) / 2,
        longitude: (clientLoc.longitude + teamLoc.longitude) / 2,
        latitudeDelta: latDelta < 0.005 ? 0.01 : latDelta,
        longitudeDelta: lngDelta < 0.005 ? 0.01 : lngDelta,
      }}
    >
      <Marker
        coordinate={clientLoc}
        title="Your Emergency Location"
        pinColor="red"
      />
      <Marker
        coordinate={teamLoc}
        title={team.name || "Rescue Team"}
        description={`Arriving in ${eta}`}
        pinColor="blue"
      />
      {roadRoute.length > 0 && (
        <Polyline
          coordinates={roadRoute}
          strokeColor="#00e5ff"
          strokeWidth={5}
        />
      )}
    </MapView>
  );

  if (isMiniMap) {
    return (
      <View className="w-[48.5%] bg-[#0f172a] rounded-2xl p-3 mb-4 border border-white/5 overflow-hidden">
        <View className="p-1">
          <View className="flex-row items-center mb-1">
            <Users size={14} color="#60a5fa" />
            <Text
              className="text-white text-[11px] font-bold ml-2"
              numberOfLines={1}
            >
              Rescue Teams
            </Text>
          </View>
          <Text className="text-gray-400 text-[9px] mb-2" numberOfLines={1}>
            Rescue Teams Desc
          </Text>
        </View>

        <View className="px-1 pb-1">
          {/* 🎯 फिक्स: View लाई TouchableOpacity बनाइयो र onClick मा स्टेट चेन्ज थपियो */}
          <TouchableOpacity
            onPress={() => setIsModalOpen(true)}
            className="h-20 bg-[#0f172a]/40 rounded-lg items-center justify-center border border-white/10"
          >
            <Text className="text-white font-medium tracking-wide">View</Text>
          </TouchableOpacity>
        </View>

        {/* 🎯 थपिएको मोडल लेआउट */}
        <Modal
          visible={isModalOpen}
          animationType="slide"
          onRequestClose={() => setIsModalOpen(false)}
        >
          <View className="flex-1">
            <RenderMap />
            <TouchableOpacity
              onPress={() => setIsModalOpen(false)}
              className="absolute top-12 right-5 bg-black/60 p-3 rounded-full"
            >
              <X size={20} color="white" />
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }
  return (
    <View className="flex-1 w-full h-full">
      <RenderMap />
    </View>
  );
}

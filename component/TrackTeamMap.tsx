import React, { useState, useEffect, useMemo } from "react";
import { View, Text, Dimensions, TouchableOpacity } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { io } from "socket.io-client";
import { Users } from "lucide-react-native";

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

  // 🎯 फिक्स: झुन्डिएका र दोहोरिएका पुराना ट्यागहरू हटाएर सफा २x२ बक्स बनाइयो
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
          {/* 🗺️ प्रिमियम म्याप प्लेसहोल्डर बक्स */}
          <View className="h-20 bg-[#0f172a]/40 rounded-lg items-center justify-center ">
            <Text className="text-gray-500 text-white font-medium tracking-wide">
              Map View
            </Text>
          </View>

          <View className="mt-2.5">
            <View className="flex-row justify-between items-center">
              <Text
                className="text-white text-[8px] flex-1 mr-1"
                numberOfLines={1}
              >
                📍 Pokhara City Hall
              </Text>
              <Text className="text-gray-400 text-[8px]">
                ({(1.2).toFixed(1)} km)
              </Text>
            </View>
            <Text className="text-white text-[8px] font-semibold mt-1">
              Capacity: 70% Full
            </Text>
          </View>
        </View>
      </View>
    );
  }

  // फुल स्क्रिन म्याप लेआउट (जब isMiniMap = false हुन्छ)
  return (
    <View className="flex-1 w-full h-full">
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
    </View>
  );
}

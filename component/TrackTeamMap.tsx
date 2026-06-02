import React, { useState, useEffect } from "react";
import { View, Text, Dimensions, TouchableOpacity } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { io } from "socket.io-client";

export default function TrackTeamMap({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  const { team } = route.params;

  const [clientLoc] = useState({
    latitude: team.clientLatitude || 27.7007,
    longitude: team.clientLongitude || 85.3001,
  });

  const [teamLoc, setTeamLoc] = useState({
    latitude: team.latitude || 27.7172,
    longitude: team.longitude || 85.324,
  });

  useEffect(() => {
    const socket = io("http://192.168.43.132:8000");

    socket.on("team-location-updated", (data) => {
      if (data.teamId === team.id) {
        setTeamLoc({
          latitude: data.latitude,
          longitude: data.longitude,
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [team.id]);

  return (
    <View className="flex-1">
      <MapView
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
        }}
        initialRegion={{
          latitude: (clientLoc.latitude + teamLoc.latitude) / 2,
          longitude: (clientLoc.longitude + teamLoc.longitude) / 2,
          latitudeDelta: Math.abs(clientLoc.latitude - teamLoc.latitude) * 2,
          longitudeDelta: Math.abs(clientLoc.longitude - teamLoc.longitude) * 2,
        }}
      >
        <Marker
          coordinate={clientLoc}
          title="Your Emergency Location"
          pinColor="red"
        />

        <Marker
          coordinate={teamLoc}
          title={team.name}
          description="Rescue Team is on the way!"
          pinColor="blue"
        />

        <Polyline
          coordinates={[clientLoc, teamLoc]}
          strokeColor="#00e5ff"
          strokeWidth={4}
        />
      </MapView>

      {/* उबर जस्तो लाइभ ट्र्याकिङ ब्यानर कार्ड */}
      <View className="absolute bottom-[30px] left-[20px] right-[20px] bg-[#0f172a] p-5 rounded-[24px] border border-[#1e293b] shadow-2xl elevation-10">
        <Text className="text-white text-[16px] font-black mb-1">
          {team.name} is En Route
        </Text>
        <Text className="text-[#22c55e] text-[12px] font-bold uppercase mb-[10px]">
          Status: {team.status}
        </Text>
        <Text className="text-[#94a3b8] text-[13px] mb-[15px]">
          📞 Contact: {team.contact}
        </Text>
        <TouchableOpacity
          className="bg-[#1e293b] p-3 rounded-[12px] items-center"
          onPress={() => navigation.goBack()} // यहाँ onClick लाई onPress बनाइएको छ
        >
          <Text className="text-white font-bold text-[13px]">Back to List</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

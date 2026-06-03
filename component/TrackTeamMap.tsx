import React, { useState, useEffect, useMemo } from "react";
import { View, Text, Dimensions, TouchableOpacity } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { io } from "socket.io-client";

export default function TrackTeamMap({
  route,
  navigation,
  isMiniMap = true,
}: {
  route: any;
  navigation: any;
  isMiniMap?: boolean;
}) {
  const team = useMemo(() => route?.params?.team || {}, [route?.params?.team]);
  const clientLoc = useMemo(
    () => ({
      latitude: team.clientLatitude || 27.7007,
      longitude: team.clientLongitude || 85.3001,
    }),
    [team.clientLatitude, team.clientLongitude],
  );

  // २. रेस्क्यु टोलीको लोकेसन
  const [teamLoc, setTeamLoc] = useState({
    latitude: team.latitude || 27.7172,
    longitude: team.longitude || 85.324,
  });

  // ३. रोड रुट र दुरी म्याप गर्ने
  const [roadRoute, setRoadRoute] = useState<any[]>([]);

  // team.roadRoute परिवर्तन हुँदा मात्र यो सेट हुन्छ
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

  // 🎯 फिक्स २: सकेट डिपेन्डेन्सी लुप रोक्ने
  useEffect(() => {
    if (!team.id) return;

    const socket = io("http://192.168.43.132:8000");

    socket.on("team-location-updated", (data) => {
      if (data.teamId === team.id) {
        setTeamLoc({
          latitude: data.latitude,
          longitude: data.longitude,
        });

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
        } else if (data.eta || data.roadDistance) {
          if (data.eta) setEta(data.eta);
          if (data.roadDistance) setDistance(data.roadDistance + " km");
        }
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [team.id]);

  const latDelta = Math.abs(clientLoc.latitude - teamLoc.latitude) * 2;
  const lngDelta = Math.abs(clientLoc.longitude - teamLoc.longitude) * 2;

  return (
    <View className="flex-1 w-full h-full">
      <MapView
        style={
          isMiniMap
            ? { width: "100%", height: "100%" }
            : {
                width: Dimensions.get("window").width,
                height: Dimensions.get("window").height,
              }
        }
        // 🎯 फिक्स ३: region को सट्टा initialRegion नै राख्ने ताकि यो हल्लिरहन नखोजोस्
        initialRegion={{
          latitude: (clientLoc.latitude + teamLoc.latitude) / 2,
          longitude: (clientLoc.longitude + teamLoc.longitude) / 2,
          latitudeDelta: latDelta < 0.005 ? 0.01 : latDelta,
          longitudeDelta: lngDelta < 0.005 ? 0.01 : lngDelta,
        }}
        scrollEnabled={!isMiniMap}
        zoomEnabled={!isMiniMap}
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
            strokeWidth={isMiniMap ? 3 : 5}
          />
        )}
      </MapView>

      {!isMiniMap && (
        <View className="absolute bottom-[30px] left-[20px] right-[20px] bg-[#0f172a] p-5 rounded-[24px] border border-[#1e293b] shadow-2xl elevation-10">
          <View className="flex-row justify-between items-start mb-2">
            <View className="flex-1 pr-2">
              <Text
                className="text-white text-[16px] font-black mb-1"
                numberOfLines={1}
              >
                {team.name || "Team"} is En Route
              </Text>
              <Text className="text-[#94a3b8] text-[13px]">
                📞 Contact: {team.contact || team.phone || "N/A"}
              </Text>
            </View>
            <View className="items-end min-w-[70px]">
              <Text className="text-[#00e5ff] text-[18px] font-black">
                {eta}
              </Text>
              <Text className="text-slate-400 text-[11px] text-right">
                {distance}
              </Text>
            </View>
          </View>
          <Text className="text-[#22c55e] text-[12px] font-bold uppercase mb-[15px]">
            Status: {team.status || "Active"}
          </Text>
          <TouchableOpacity
            style={{ elevation: 2 }}
            className="bg-[#1e293b] p-3 rounded-[12px] items-center active:opacity-70"
            onPress={() => navigation.goBack()}
          >
            <Text className="text-white font-bold text-[13px]">
              Back to List
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

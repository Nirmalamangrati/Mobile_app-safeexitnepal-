import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { io } from "socket.io-client";
import { Users, Shield, Phone, MapPin } from "lucide-react-native";
const BASE_URL = "https://safeexitnepal-backend-2.onrender.com";
const socket = io("https://safeexitnepal-backend-2.onrender.com");

interface AdminDataField {
  _id: string;
  title?: string;
  description?: string;
  name?: string;
  status?: string;
}
export default function TrackTeamMap({
  route,
  navigation,
  isMiniMap = true,
  item,
  rescueTeams = [],
}: {
  route?: any;
  navigation?: any;
  isMiniMap?: boolean;
  item?: any;
  rescueTeams?: any[];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const initialTeam = useMemo(
    () => route?.params?.team || item || {},
    [route?.params?.team, item],
  );
  const [dynamicTeam, setDynamicTeam] = useState<any>(initialTeam);
  const [adminData, setAdminData] = useState<AdminDataField[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const clientLoc = useMemo(
    () => ({
      latitude: dynamicTeam.clientLatitude || 27.7007,
      longitude: dynamicTeam.clientLongitude || 85.3001,
    }),
    [dynamicTeam.clientLatitude, dynamicTeam.clientLongitude],
  );
  const [teamLoc, setTeamLoc] = useState({
    latitude: dynamicTeam.latitude || 27.7172,
    longitude: dynamicTeam.longitude || 85.324,
  });

  const [roadRoute, setRoadRoute] = useState<any[]>([]);
  const [eta, setEta] = useState<string>(dynamicTeam.eta || "Calculating...");
  const [distance, setDistance] = useState<string>(
    dynamicTeam.distanceFromMe || dynamicTeam.roadDistance || "Calculating...",
  );

  useEffect(() => {
    if (rescueTeams && rescueTeams.length > 0) {
      const activeAiTeam = rescueTeams[0];
      setDynamicTeam(activeAiTeam);
      if (activeAiTeam.latitude && activeAiTeam.longitude) {
        setTeamLoc({
          latitude: activeAiTeam.latitude,
          longitude: activeAiTeam.longitude,
        });
      }
    }
  }, [rescueTeams]);

  useEffect(() => {
    const fetchLatestTeam = async () => {
      try {
        if (initialTeam && Object.keys(initialTeam).length > 0) {
          setDynamicTeam(initialTeam);
          return;
        }
        const response = await fetch(`${BASE_URL}/api/teams`);
        const data = await response.json();
        if (data && data.length > 0) {
          const latest = data[data.length - 1];
          setDynamicTeam(latest);
        } else if (data && !Array.isArray(data)) {
          setDynamicTeam(data);
        }
      } catch (error) {
        console.log("Error fetching initial team via HTTP:", error);
      }
    };
    fetchLatestTeam();
  }, [initialTeam]);
  useEffect(() => {
    if (dynamicTeam.roadRoute && dynamicTeam.roadRoute.length > 0) {
      setRoadRoute(dynamicTeam.roadRoute);
    } else {
      setRoadRoute([clientLoc, teamLoc]);
    }
  }, [dynamicTeam.roadRoute, clientLoc, teamLoc]);
  useEffect(() => {
    const socket = io(BASE_URL, {
      transports: ["websocket"],
    });
    socket.on("connect", () => {
      console.log("Socket connected successfully to mobile!");
    });
    socket.on("team-location-updated", (data) => {
      setDynamicTeam((currentTeam: any) => {
        const currentId = currentTeam?.id || currentTeam?._id;
        if (currentId && data.teamId === currentId) {
          setTeamLoc({ latitude: data.latitude, longitude: data.longitude });
          if (data.route?.roadCoordinates?.length > 0) {
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
        return currentTeam;
      });
    });
    socket.on("team-added-or-updated", (data) => {
      console.log("Received team-added-or-updated via socket:", data);
      if (data) {
        setDynamicTeam((currentTeam: any) => {
          const currentId = currentTeam?.id || currentTeam?._id;
          if (!currentId || data.id === currentId || data._id === currentId) {
            if (data.latitude && data.longitude) {
              setTeamLoc({
                latitude: data.latitude,
                longitude: data.longitude,
              });
            }
            return data;
          }
          return currentTeam;
        });
      }
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  // 3. Admin le haleko real data API bata tanna useEffect
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await fetch(
          "https://safeexitnepal-backend-2.onrender.com/api/teams",
        );
        const data = await response.json();
        setAdminData(data); // Real data state maa set garyo
      } catch (error) {
        console.error("Data fetch garda error aayo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
    socket.on("team-updated", () => {
      console.log("➔ [SOCKET] Teams changed, re-fetching data...");
      fetchAdminData();
    });
    return () => {
      socket.off("team-updated");
    };
  }, []);

  const latDelta = Math.abs(clientLoc.latitude - teamLoc.latitude) * 2;
  const lngDelta = Math.abs(clientLoc.longitude - teamLoc.longitude) * 2;

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
        title={dynamicTeam.name || "Rescue Team"}
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
      <View className="w-full bg-[#0f172a] rounded-2xl p-5 mb-4 border border-white/5 shadow-md">
        {/* Header Section */}
        <View className="mt-3 ml-2 mb-4 border-b border-white/5 pb-3">
          <View className="flex-row items-center mb-1">
            <Users size={20} color="#60a5fa" />
            <Text className="text-white text-lg font-bold ml-3">
              Rescue Teams
            </Text>
          </View>
          <Text className="text-gray-400 text-xs ml-[32px]">
            Rescue Teams Desc
          </Text>
        </View>
        {/* Dynamic Detail List */}
        <View className="space-y-2.5 mb-4">
          {/* 1. Team Name */}
          <View className="flex-row items-center justify-between bg-slate-800/40 p-2.5 rounded-xl ">
            <View className="flex-row items-center">
              <Users size={14} color="#3b82f6" />
              <Text className="text-slate-300 text-xs ml-2">Team Name:</Text>
            </View>
            <Text
              className="text-white font-bold text-xs max-w-[65%]"
              numberOfLines={1}
            >
              {dynamicTeam.name || "Assigning Team..."}
            </Text>
          </View>
          {/* 2. Status */}
          <View className="flex-row items-center justify-between bg-slate-800/40 p-2.5 rounded-xl ">
            <View className="flex-row items-center">
              <Shield size={14} color="#60a5fa" />
              <Text className="text-slate-300 text-xs ml-2">Status:</Text>
            </View>
            <Text className="text-emerald-400 font-bold text-xs">
              {dynamicTeam.status || "Available"}
            </Text>
          </View>
          {/* 3. Crew/Members */}
          <View className="flex-row items-center justify-between bg-slate-800/40 p-2.5 rounded-xl ">
            <View className="flex-row items-center">
              <Users size={14} color="#60a5fa" />
              <Text className="text-slate-300 text-xs ml-2">Crew/Members:</Text>
            </View>
            <Text className="text-white font-semibold text-xs">
              {dynamicTeam.crew || dynamicTeam.members || "N/A"}
            </Text>
          </View>
          {/* 4. Contact */}
          <View className="flex-row items-center justify-between bg-slate-800/40 p-2.5 rounded-xl ">
            <View className="flex-row items-center">
              <Phone size={14} color="#60a5fa" />
              <Text className="text-slate-300 text-xs ml-2">Contact:</Text>
            </View>
            <Text className="text-white font-semibold text-xs">
              {dynamicTeam.contact || "N/A"}
            </Text>
          </View>
          {/* 5. Location */}
          <View className="flex-row items-center justify-between bg-slate-800/40 p-2.5 rounded-xl ">
            <View className="flex-row items-center">
              <MapPin size={14} color="#60a5fa" />
              <Text className="text-slate-300 text-xs ml-2">Location:</Text>
            </View>
            <Text
              className="text-white font-semibold text-xs max-w-[65%]"
              numberOfLines={1}
            >
              {dynamicTeam.location || dynamicTeam.locationName || "N/A"}
            </Text>
          </View>
        </View>
        {/* View details simple link */}
        <TouchableOpacity
          onPress={() => setIsModalOpen(true)}
          className="py-1 mt-1 flex-row items-center active:opacity-70 ml-2"
        >
          <Text className="text-blue-400 font-semibold text-xs tracking-wide">
            View more...
          </Text>
        </TouchableOpacity>
        {/* Modal Window */}
        <Modal
          visible={isModalOpen}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsModalOpen(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/60 px-4">
            <View className="bg-white w-full max-w-md max-h-[75%] rounded-3xl p-6 shadow-2xl elevation-5 overflow-hidden">
              {/* Modal Header */}
              <View className="flex-row justify-between items-center mb-5 pb-3 border-b border-gray-100">
                <View>
                  <Text className="text-xl font-bold text-gray-900 tracking-tight">
                    Details List
                  </Text>
                  <Text className="text-xs text-gray-400 mt-0.5">
                    Available data overview
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setIsModalOpen(false)}
                  className="bg-red-50 px-3 py-1.5 rounded-full active:bg-red-100"
                >
                  <Text className="text-red-600 font-bold text-xs uppercase tracking-wider">
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
              {/* Content Scroll Wrapper */}
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 0 }}
              >
                {loading ? (
                  <View className="py-10 items-center justify-center">
                    <Text className="text-sm font-medium text-blue-400 animate-pulse">
                      Loading data...
                    </Text>
                  </View>
                ) : adminData.length > 0 ? (
                  adminData.map((item: any, index) => (
                    <View
                      key={item._id || String(index)}
                      className="mb-4 p-4 bg-[#1c2541]/50 rounded-2xl border border-slate-800/80 shadow-sm"
                    >
                      {/* 1. Team Name Row */}
                      <View className="flex-row justify-between items-start mb-2.5">
                        <Text className="text-xs text-slate-400 font-medium w-1/3">
                          Team Name:
                        </Text>
                        <Text className="text-sm font-bold text-white text-right flex-1 pl-2">
                          {item.name || item.title || "Untitled Team"}
                        </Text>
                      </View>
                      {/* 2. Status Row */}
                      <View className="flex-row justify-between items-center mb-2.5 border-t border-b border-slate-800/40 py-2">
                        <Text className="text-xs text-slate-400 font-medium">
                          Status:
                        </Text>
                        <View className="flex-row items-center">
                          <View
                            className={`h-2 w-2 rounded-full mr-1.5 ${
                              item.status?.toLowerCase() === "unavailable"
                                ? "bg-red-500"
                                : "bg-green-500"
                            }`}
                          />
                          <Text
                            className={`text-xs font-bold uppercase tracking-wide ${
                              item.status?.toLowerCase() === "unavailable"
                                ? "text-red-400"
                                : "text-green-400"
                            }`}
                          >
                            {item.status || "Unknown"}
                          </Text>
                        </View>
                      </View>
                      {/* 3. Crew/Members Row */}
                      <View className="flex-row justify-between items-center mb-2.5">
                        <Text className="text-xs text-slate-400 font-medium">
                          Crew/Members:
                        </Text>
                        <Text className="text-sm font-semibold text-slate-200">
                          {/* dynamicTeam ko sato block item variable map flow use gareko */}
                          {item.crewMembers ||
                            item.crew ||
                            item.members ||
                            "N/A"}
                        </Text>
                      </View>
                      {/* 4. Contact Row */}
                      <View className="flex-row justify-between items-center mb-2.5">
                        <Text className="text-xs text-slate-400 font-medium">
                          Contact:
                        </Text>
                        <Text className="text-sm font-semibold text-slate-200">
                          {item.contact || item.phone || "N/A"}
                        </Text>
                      </View>
                      {/* 5. Location Row */}
                      <View className="flex-row justify-between items-start">
                        <Text className="text-xs text-slate-400 font-medium w-1/3">
                          Location:
                        </Text>
                        <Text className="text-sm font-medium text-slate-300 text-right flex-1 pl-2 capitalize">
                          {item.location ||
                            item.locationName ||
                            item.address ||
                            "N/A"}
                        </Text>
                      </View>
                      {/* 6. Distance  */}
                      <View className="flex-row items-center justify-between bg-slate-800/40 p-2.5 rounded-xl ">
                        <View className="flex-row items-center">
                          <MapPin size={14} color="#f87171" />
                          <Text className="text-slate-300 text-xs ml-2">
                            Distance:
                          </Text>
                        </View>
                        <Text className="text-white font-semibold text-xs">
                          {distance}
                        </Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <View className="py-12 items-center">
                    <Text className="text-sm text-slate-500 font-medium">
                      No data available.
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>
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

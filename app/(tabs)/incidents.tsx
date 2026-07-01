import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";

export default function IncidentsTab(): React.JSX.Element {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const BASE_URL = "https://safeexitnepal-backend-2.onrender.com";

  useEffect(() => {
    const fetchApprovedIncidents = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      try {
        console.log("➔ [FETCH DISPATCH] Requesting approved feed...");
        const response = await fetch(`${BASE_URL}/api/incidents/approved`, {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Server returned status: ${response.status}`);
        }

        const data = await response.json();
        console.log("➔ [FETCH SUCCESS] Incidents loaded count:", data.length);
        setIncidents(data);
      } catch (error: any) {
        clearTimeout(timeoutId);
        console.error("Incidents Fetch Crash:", error);

        if (error.name !== "AbortError") {
          Alert.alert(
            "Connection Failure",
            "Cannot connect to server. Check IP Address config.",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedIncidents();
  }, []);

  // Google Maps
  const openLocationInMaps = (lat: number, lng: number, label: string) => {
    if (!lat || !lng) {
      Alert.alert(
        "Location Error",
        "GPS coordinates are not available for this incident.",
      );
      return;
    }
    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q=",
    });
    const latLng = `${lat},${lng}`;
    const url =
      Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`,
      }) || `https://google.com{latLng}`;

    Linking.openURL(url).catch(() => {
      Alert.alert("Error", "Could not open Google Maps app.");
    });
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-900">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-slate-400 text-xs mt-3 font-semibold tracking-wider">
          Connecting to feed...
        </Text>
      </View>
    );
  }

  const renderAttachment = (filePath: string) => {
    if (!filePath) return null;

    const fileUrl = `${BASE_URL}/${filePath.replace(/\\/g, "/")}`;
    const fileExtension = filePath.split(".").pop()?.toLowerCase();
    if (
      fileExtension &&
      ["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension)
    ) {
      return (
        <View className="mt-3 rounded-xl overflow-hidden bg-slate-900 border border-slate-700/50">
          <Image
            source={{ uri: fileUrl }}
            className="w-full h-48"
            resizeMode="cover"
          />
        </View>
      );
    }

    return (
      <View className="mt-3 p-3 bg-slate-900 rounded-xl border border-slate-700/50 flex-row items-center">
        <Text
          className="text-xs font-semibold text-blue-400 flex-1"
          numberOfLines={1}
        >
          {filePath.split("/").pop() || "Attached File"} (
          {fileExtension?.toUpperCase()})
        </Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-slate-900 p-4 pt-14">
      <Text className="text-2xl font-black text-white text-center mb-6 tracking-wide">
        Public Incidents Feed
      </Text>

      {incidents.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-base text-slate-400 font-medium text-center">
            No approved incidents posted yet.
          </Text>
        </View>
      ) : (
        <FlatList
          data={incidents}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View className="bg-slate-800 border border-slate-700/60 rounded-2xl p-4 mb-4 shadow-lg">
              {/* 1. Header Box */}
              <View className="flex-row justify-between items-center border-b border-slate-700 pb-3 mb-3">
                <Text
                  className="text-base font-extrabold text-blue-400 tracking-wide uppercase flex-1 mr-2"
                  numberOfLines={1}
                >
                  {" "}
                  {item.reporterInfo?.yourName ||
                    item.reporterInfo?.name ||
                    "Anonymous"}
                </Text>
                <View
                  className={`px-2.5 py-1 rounded-md ${
                    item.incidentCategory === "critical"
                      ? "bg-red-950 border border-red-500/30"
                      : item.incidentCategory === "high"
                        ? "bg-amber-950 border border-amber-500/30"
                        : "bg-blue-950 border border-blue-500/30"
                  }`}
                >
                  <Text
                    className={`text-[10px] font-black uppercase ${
                      item.incidentCategory === "critical"
                        ? "text-red-400"
                        : item.incidentCategory === "high"
                          ? "text-amber-400"
                          : "text-blue-400"
                    }`}
                  >
                    {item.incidentCategory || "medium"}
                  </Text>
                </View>
              </View>

              {/* 2. Incident Type Block */}
              <View className="mb-2">
                <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Incident Type
                </Text>
                <Text className="text-sm font-semibold text-red-400 mt-0.5 uppercase tracking-wide">
                  {item.incidentType || "CRISIS ALERT"}
                </Text>
              </View>

              {/* 3. Interactive Location Block  */}
              <View className="mb-2">
                <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Location
                </Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() =>
                    openLocationInMaps(
                      item.latitude,
                      item.longitude,
                      item.locationName,
                    )
                  }
                  className="flex-row items-center justify-between bg-slate-900/40 border border-slate-700/50 p-2.5 rounded-xl mt-1"
                >
                  <Text
                    className="text-sm font-semibold text-slate-200 flex-1 mr-2"
                    numberOfLines={1}
                  >
                    {item.locationName}
                  </Text>
                  <View className="bg-blue-950/80 px-2 py-1 rounded-md border border-blue-500/30">
                    <Text className="text-[10px] font-bold text-blue-400">
                      View Map
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* 4. Description Block */}
              <View className="mb-3">
                <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Description
                </Text>
                <Text className="text-sm text-slate-300 leading-relaxed mt-0.5">
                  {item.description}
                </Text>
              </View>

              {/* 5. Attached File Section */}
              {item.attachedFilePath ? (
                <View className="mb-3">
                  <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Attached Media / File
                  </Text>
                  {renderAttachment(item.attachedFilePath)}
                </View>
              ) : null}

              {/* 6. Suspect Details Section */}
              {item.suspectInfo && item.suspectInfo.name ? (
                <View className="bg-slate-900/50 border border-slate-700/40 rounded-xl p-3 mb-2">
                  <Text className="text-[10px] font-extrabold text-amber-500 uppercase tracking-wider mb-1.5">
                    Suspect Information
                  </Text>
                  <View className="flex-row justify-between mb-1">
                    <Text className="text-xs text-slate-400">
                      Suspect Name:
                    </Text>
                    <Text className="text-xs font-semibold text-slate-200">
                      {item.suspectInfo.name}
                    </Text>
                  </View>
                  {(item.suspectInfo.age || item.suspectInfo.gender) && (
                    <View className="flex-row justify-between">
                      <Text className="text-xs text-slate-400">
                        Age / Gender:
                      </Text>
                      <Text className="text-xs font-semibold text-slate-300">
                        {item.suspectInfo.age || "N/A"} /{" "}
                        {item.suspectInfo.gender || "N/A"}
                      </Text>
                    </View>
                  )}
                </View>
              ) : null}

              {/* 7. Time Footer */}
              <Text className="pt-2 mt-3 border-t border-slate-700/40 text-slate-400">
                Date: {item.incidentDate}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

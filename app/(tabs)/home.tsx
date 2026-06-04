import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import {
  Shield,
  MapPin,
  AlertTriangle,
  Target,
  Zap,
  ShieldCheck,
} from "lucide-react-native";
import { Ionicons } from "@expo/vector-icons";
import ReportIncident from "@/component/ReportIncident";
import TrackTeamMap from "@/component/TrackTeamMap";

// Type definition for counts mapping
interface IncidentCounts {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export default function HomeScreen() {
  const [language, setLanguage] = useState("en");
  const [showReportForm, setShowReportForm] = useState(false);
  const [sosLoading, setSosLoading] = useState(false);
  const [counts, setCounts] = useState<IncidentCounts>({
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  });

  const [countsLoading, setCountsLoading] = useState<boolean>(true);

  const BASE_URL = "http://192.168.43.132:8000";
  const currentUserId = "6644bc231f23ab0017f8a91c";

  // 1. Fetch Dynamic Incident Counts from Backend
  const fetchIncidentCounts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/incidents/counts`);
      const data = await response.json();
      if (response.ok) {
        setCounts(data);
      }
    } catch (error) {
      console.error("Fetch Counts Error:", error);
    } finally {
      setCountsLoading(false);
    }
  };

  useEffect(() => {
    // Permission Check + Prompt
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location access is required to use the SOS feature. Please enable it in settings.",
        );
      }
    })();

    // Load initial counters
    fetchIncidentCounts();
  }, []);

  // 2. SOS BUTTON LOGIC
  const handleSOSPress = async () => {
    Alert.alert(
      "TRIGGER EMERGENCY SOS?",
      "Are you sure you want to send an SOS alert to your emergency contacts and authorities? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "YES, SEND SOS",
          style: "destructive",
          onPress: async () => {
            setSosLoading(true);
            try {
              let currentPosition = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
              });

              const { latitude, longitude } = currentPosition.coords;
              console.log("GPS Coordinates Pulled:", latitude, longitude);

              const payload = {
                userId: currentUserId,
                location: {
                  lat: latitude,
                  lng: longitude,
                },
              };

              const response = await fetch(`${BASE_URL}/api/user/trigger`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
              });

              const data = await response.json();

              if (response.ok) {
                Alert.alert(
                  " SOS ACTIVATED",
                  "Your emergency contacts have been sent an alarm notification. If no one responds within 30 seconds, the Nepal Police and admin will be automatically alerted.",
                );
              } else {
                Alert.alert("Error", data.error || "SOS trigger failed.");
              }
            } catch (error) {
              console.log("SOS Activation Error:", error);
              Alert.alert(
                "Network Error",
                "Backend cannot be connected with server. Please try again later.",
              );
            } finally {
              setSosLoading(false);
            }
          },
        },
      ],
    );
  };

  if (countsLoading) {
    return (
      <View className="flex-1 bg-[#020617] justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-[#020617]">
      {/* HEADER */}
      <View className="bg-[#0f172a] px-4 pt-[50px] pb-5 border-b border-[#1e293b] flex-row justify-between items-center">
        <View className="flex-row items-center">
          <View className="w-9 h-9 rounded-full bg-blue-500 items-center justify-center mr-2">
            <Shield color="white" size={18} />
          </View>
          <Text className="text-white text-xl font-bold">SafeExit Nepal</Text>
        </View>

        <TouchableOpacity
          onPress={() => setLanguage(language === "en" ? "ne" : "en")}
          className="bg-[#1e293b] px-3 py-1.5 rounded-lg"
        >
          <Text className="text-white">
            {language === "en" ? "नेपाली" : "English"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* BODY PANEL */}
      <View className="p-4">
        {/* EMERGENCY SOS BUTTON */}
        <View className="items-center mb-4">
          <TouchableOpacity
            onPress={handleSOSPress}
            disabled={sosLoading}
            className="bg-red-600 px-8 py-4 rounded-full flex-row items-center active:opacity-80 w-full justify-center"
            style={{ opacity: sosLoading ? 0.6 : 1 }}
          >
            {sosLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Ionicons name="alert-circle" size={22} color="white" />
                <Text className="text-white text-lg font-bold ml-2">
                  Emergency SOS
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* GPS LOCATION FIELD */}
        <View className="bg-[#0f172a] flex-row items-center p-3 rounded-xl mb-4 h-12 border border-white/5">
          <MapPin color="#60a5fa" size={20} />
          <TextInput
            placeholder="Current Location: Pulling GPS coordinates..."
            placeholderTextColor="#94a3b8"
            className="flex-1 text-white ml-2 h-10"
            editable={false}
          />
        </View>

        {/* STATUS CARDS WITH LIVE DYNAMIC BACKEND COUNTS */}
        <View className="flex-row flex-wrap justify-between mb-4">
          {[
            {
              title: "Critical",
              color: "bg-red-600",
              count: counts.critical,
              icon: AlertTriangle,
            },
            {
              title: "High",
              color: "bg-orange-500",
              count: counts.high,
              icon: Target,
            },
            {
              title: "Medium",
              color: "bg-yellow-500",
              count: counts.medium,
              icon: Zap,
            },
            {
              title: "Low",
              color: "bg-green-600",
              count: counts.low,
              icon: ShieldCheck,
            },
          ].map((item, i) => (
            <View
              key={i}
              className={`w-[48%] h-15 p-3 rounded-lg mb-3 flex-row justify-between items-center ${item.color}`}
            >
              <View>
                <Text className="text-white text-xs font-bold opacity-90">
                  {item.title}
                </Text>
                <Text className="text-white text-xl font-bold">
                  {item.count}
                </Text>
              </View>
              <View className="opacity-30">
                <item.icon color="white" size={24} />
              </View>
            </View>
          ))}
        </View>

        {/* ACTIVE HAZARDS NOTIFIER */}
        <View className="flex-row justify-between items-center mb-6 bg-[#0f172a] p-4 rounded-xl border border-white/5">
          <View>
            <Text className="text-white text-xl font-bold">Active Hazards</Text>
            <Text className="text-gray-400 text-xs">
              Hazards Desc via AI Clustering
            </Text>
          </View>
          <View className="w-12 h-12 bg-blue-600 rounded-xl items-center justify-center">
            <Text className="text-white font-bold">AI</Text>
          </View>
        </View>

        {/* FEATURE CARDS MATRIX CONTAINER */}
        <View className="flex-row flex-wrap justify-between gap-y-2 gap-x-2">
          <TrackTeamMap isMiniMap={true} />
        </View>

        {/* NEW LAUNCH COMPONENT: REPORT INCIDENT TRIGGER MODAL BUTTON */}
        <TouchableOpacity
          onPress={() => setShowReportForm(true)}
          className="bg-blue-600 p-4 rounded-xl flex-row justify-center items-center mt-4 mb-8"
        >
          <Ionicons name="document-text" size={20} color="white" />
          <Text className="text-white font-bold text-lg ml-2">
            Report New Incident
          </Text>
        </TouchableOpacity>
      </View>

      {/* REPORT FORM COMPONENT INJECTED SLIDE MODAL LAYER */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={showReportForm}
        onRequestClose={() => setShowReportForm(false)}
      >
        <View className="flex-1 bg-[#0f172a]">
          {/* Modal Header */}
          <View className="p-4 border-b border-[#1e293b] flex-row justify-between items-center pt-12">
            <Text className="text-white text-lg font-bold">
              Log Incident Report
            </Text>
            <TouchableOpacity
              onPress={() => {
                setShowReportForm(false);
                fetchIncidentCounts();
              }}
            >
              <Ionicons name="close-circle" size={28} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {/* Actual Injected Form view scroll child component */}
          <ScrollView className="flex-1">
            <ReportIncident />
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}

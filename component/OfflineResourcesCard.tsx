import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

//  फायरबेस क्र्यास हुनबाट जोगाउन सेफ इम्पोट र चेक
let messaging: any = null;
try {
  messaging = require("@react-native-firebase/messaging").default;
} catch (e) {
  console.log("Firebase native module not linked yet.");
}

// Data Structure
interface OfflineResource {
  _id: string;
  title: string;
  version: string;
  size: string;
  resourceType: "Map" | "Tool" | "Procedure" | "Guide";
  status: "Synced" | "Update Available" | "Downloaded";
  fileUrl: string;
}

const BACKEND_URL = "http://192.168.43.132:8000";

export const OfflineResources: React.FC = () => {
  const [resources, setResources] = useState<OfflineResource[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  //  1. Push Notification (सुरक्षित तरिकाले चेक गरेर मात्र चल्ने)
  useEffect(() => {
    // यदि एन्ड्रोइडमा फायरबेस बिल्ड भएको छैन भने यो कोड चुपचाप बस्छ, एप क्र्यास गर्दैन
    if (!messaging) {
      console.log(
        "Skipping notification setup: Firebase native module missing.",
      );
      return;
    }

    const setupNotifications = async () => {
      try {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          const token = await messaging().getToken();
          if (token) {
            await fetch(`${BACKEND_URL}/api/resources/save-token`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token }),
            });
          }
        }
      } catch (err) {
        console.error("Notification setup error:", err);
      }
    };

    setupNotifications();

    const unsubscribe = messaging().onMessage(async (remoteMessage: any) => {
      Alert.alert(
        remoteMessage.notification?.title || "New Update",
        remoteMessage.notification?.body || "A new file is available.",
      );
      fetchFromServer();
    });

    return unsubscribe;
  }, []);

  //  2. Fetch Data and Cache to AsyncStorage
  const fetchFromServer = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/resources`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setResources(data);
        await AsyncStorage.setItem("cached_resources", JSON.stringify(data));
      }
    } catch (error) {
      console.log("No internet or server down, loading offline data...");
      loadOfflineData();
    }
  };

  const loadOfflineData = async () => {
    try {
      const cachedData = await AsyncStorage.getItem("cached_resources");
      if (cachedData) {
        setResources(JSON.parse(cachedData));
      }
    } catch (e) {
      console.error("Failed to load local data", e);
    }
  };

  useEffect(() => {
    fetchFromServer();
  }, []);

  //  3. Download File and Update Local Status
  const handleDownloadFile = async (id: string, fileUrl: string) => {
    try {
      await Linking.openURL(fileUrl);

      const updated = resources.map((res) =>
        res._id === id ? { ...res, status: "Downloaded" as const } : res,
      );
      setResources(updated);
      await AsyncStorage.setItem("cached_resources", JSON.stringify(updated));
    } catch (error) {
      Alert.alert("Error", "Could not open or download the file.");
    }
  };

  const filteredResources = resources.filter(
    (res) => res.resourceType === selectedCategory,
  );
  return (
    <ScrollView className="bg-[#0f172a] flex-1 p-5 p-4 rounded-2xl w-full border border-slate-800">
      <Text className="text-2xl font-bold text-white mt-5">
        Offline Resources
      </Text>
      <Text className="text-gray-400 mb-5">Important data cached.</Text>

      {/*  4 Boxes Grid Layout */}
      <View className="flex-row flex-wrap justify-between mb-8">
        <TouchableOpacity
          className="w-[47%] bg-[#0f172a] p-5 rounded-2xl   items-center mb-4"
          onPress={() => setSelectedCategory("Map")}
        >
          <Text className="text-2xl mb-1">📥</Text>
          <Text className="text-white text-sm text-center font-semibold">
            Download maps
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-[47%] bg-[#0f172a] p-5 rounded-2xl  items-center mb-4"
          onPress={() => setSelectedCategory("Tool")}
        >
          <Text className="text-2xl mb-1">🔧</Text>
          <Text className="text-white text-sm text-center font-semibold">
            Mesh tools
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-[47%] bg-[#0f172a] p-5 rounded-2xl  items-center mb-4"
          onPress={() => setSelectedCategory("Procedure")}
        >
          <Text className="text-2xl mb-1">📊</Text>
          <Text className="text-white text-sm text-center font-semibold">
            Procedures
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-[47%] bg-[#0f172a] p-5 rounded-2xl  items-center mb-4"
          onPress={() => setSelectedCategory("Guide")}
        >
          <Text className="text-2xl mb-1">▶️</Text>
          <Text className="text-white text-sm text-center font-semibold">
            First Aid Guides
          </Text>
        </TouchableOpacity>
      </View>

      {/*  Dynamic File List View */}
      {selectedCategory && (
        <View className="bg-[#0f172a] p-4 rounded-2xl w-full  mb-10">
          <Text className="text-white text-base font-bold mb-3">
            Available Files ({selectedCategory}):
          </Text>

          {filteredResources.length === 0 ? (
            <Text className="text-gray-400 italic">
              No files available in this category.
            </Text>
          ) : (
            filteredResources.map((res) => (
              <View
                key={res._id}
                className="flex-row justify-between items-center py-3 "
              >
                <View className="flex-1 pr-2">
                  <Text className="text-white text-sm font-bold">
                    {res.title} ({res.size})
                  </Text>
                  <Text
                    className={`text-xs mt-1 ${res.status === "Downloaded" ? "text-green-500" : "text-amber-500"}`}
                  >
                    Status: {res.status}
                  </Text>
                </View>
                <View className="bg-slate-800/50 border border-slate-700 px-2 py-0.5 rounded">
                  <Text className="text-[11px] text-slate-300 font-medium">
                    Type: {res.resourceType || "Map"}
                  </Text>
                </View>
                <TouchableOpacity
                  className={`py-1.5 px-3 rounded-md ${res.status === "Downloaded" ? "bg-green-500" : "bg-amber-500"}`}
                  onPress={() => handleDownloadFile(res._id, res.fileUrl)}
                >
                  <Text className="text-white text-xs font-bold">
                    {res.status === "Downloaded" ? "Open" : "Download"}
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
};

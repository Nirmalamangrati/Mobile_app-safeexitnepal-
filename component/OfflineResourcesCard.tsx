import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import * as Sharing from "expo-sharing";
import { Paths, getInfoAsync, downloadAsync } from "expo-file-system";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

interface OfflineResource {
  _id: string;
  title: string;
  version: string;
  size: string;
  resourceType: "Map" | "Tool" | "Procedure" | "Guide" | "Manual" | "Image";
  status: "Synced" | "Update Available" | "Downloaded";
  fileUrl: string;
}

const BACKEND_URL = "http://192.168.43.132:8000";

export const OfflineResources: React.FC = () => {
  const [resources, setResources] = useState<OfflineResource[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const setupNotifications = async () => {
      try {
        const messagingModule =
          await import("@react-native-firebase/messaging");
        const messaging = messagingModule.default;
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (enabled) {
          await Notifications.requestPermissionsAsync();
          if (Platform.OS === "android") {
            await Notifications.setNotificationChannelAsync("default", {
              name: "Default",
              importance: Notifications.AndroidImportance.MAX,
              lightColor: "#FF231F7A",
            });
          }
          const token = await messaging().getToken();
          if (token) {
            await fetch(`${BACKEND_URL}/api/resources/save-token`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token }),
            });
          }
        }
        const unsubscribe = messaging().onMessage(
          async (remoteMessage: any) => {
            console.log("Foreground message received:", remoteMessage);
            await Notifications.scheduleNotificationAsync({
              content: {
                title: remoteMessage.notification?.title || "New Update 📂",
                body:
                  remoteMessage.notification?.body ||
                  "A new file is available.",
                data: remoteMessage.data,
              },
              trigger: null,
            });

            fetchFromServer();
          },
        );
        return unsubscribe;
      } catch (err) {
        console.log("Firebase native module missing or error occurred:", err);
      }
    };
    const init = async () => {
      const unsub = await setupNotifications();
      return () => {
        if (unsub) unsub();
      };
    };

    init();
  }, []);

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

  const handleDownloadFile = async (id: string, fileUrl: string) => {
    const extension = fileUrl.split(".").pop();
    const localUri = `${Paths.document}/${id}.${extension}`;
    try {
      const fileInfo = await getInfoAsync(localUri);

      if (fileInfo.exists) {
        await Sharing.shareAsync(localUri);
        return;
      }

      Alert.alert(
        "Downloading",
        "Please wait while the file is downloading...",
      );

      const { uri } = await downloadAsync(fileUrl, localUri);
      await Sharing.shareAsync(uri);

      const updated = resources.map((res) =>
        res._id === id ? { ...res, status: "Downloaded" as const } : res,
      );
      setResources(updated);
      await AsyncStorage.setItem("cached_resources", JSON.stringify(updated));
    } catch (error) {
      Alert.alert("Error", "Could not download or open the file offline.");
      console.error(error);
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

      <View className="flex-row flex-wrap justify-between mb-8">
        <TouchableOpacity
          className="w-[47%] bg-[#0f172a] p-5 rounded-2xl items-center mb-4"
          onPress={() => setSelectedCategory("Map")}
        >
          <Text className="text-2xl mb-1">📥</Text>
          <Text className="text-white text-sm text-center font-semibold">
            Download maps
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-[47%] bg-[#0f172a] p-5 rounded-2xl items-center mb-4"
          onPress={() => setSelectedCategory("Tool")}
        >
          <Text className="text-2xl mb-1">🔧</Text>
          <Text className="text-white text-sm text-center font-semibold">
            Mesh tools
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-[47%] bg-[#0f172a] p-5 rounded-2xl items-center mb-4"
          onPress={() => setSelectedCategory("Procedure")}
        >
          <Text className="text-2xl mb-1">📊</Text>
          <Text className="text-white text-sm text-center font-semibold">
            Procedures
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-[47%] bg-[#0f172a] p-5 rounded-2xl items-center mb-4"
          onPress={() => setSelectedCategory("Guide")}
        >
          <Text className="text-2xl mb-1">▶️</Text>
          <Text className="text-white text-sm text-center font-semibold">
            First Aid Guides
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-[47%] bg-[#0f172a] p-5 rounded-2xl items-center mb-4"
          onPress={() => setSelectedCategory("Manual")}
        >
          <Text className="text-2xl mb-1">📖</Text>
          <Text className="text-white text-sm text-center font-semibold">
            Manual
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-[47%] bg-[#0f172a] p-5 rounded-2xl items-center mb-4"
          onPress={() => setSelectedCategory("Image")}
        >
          <Text className="text-2xl mb-1">📷</Text>
          <Text className="text-white text-sm text-center font-semibold">
            Image
          </Text>
        </TouchableOpacity>
      </View>

      {selectedCategory && (
        <View className="bg-[#0f172a] p-4 rounded-2xl w-full mb-10">
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
                className="flex-row justify-between items-center py-3"
              >
                <View className="flex-1 pr-2">
                  <Text className="text-white text-sm font-bold">
                    {res.title} ({res.size})
                  </Text>
                  <Text
                    className={`text-xs mt-1 ${
                      res.status === "Downloaded"
                        ? "text-green-500"
                        : "text-amber-500"
                    }`}
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
                  className={`py-1.5 px-3 rounded-md ${
                    res.status === "Downloaded"
                      ? "bg-green-500"
                      : "bg-amber-500"
                  }`}
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

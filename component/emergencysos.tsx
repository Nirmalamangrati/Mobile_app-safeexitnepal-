import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SMS from "expo-sms";
import * as Location from "expo-location";
// Interface structure for component props - contact parameters are now handled dynamically internally
interface EmergencySOSProps {
  userId: string;
  baseUrl: string;
}
//  ADVANCED HAVERSINE ALGORITHM (Great-Circle Distance Calculation)
const getStrictDistanceKM = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const TO_RAD = Math.PI / 180;
  const R = 6371;
  const dLat = (lat2 - lat1) * TO_RAD;
  const dLon = (lon2 - lon1) * TO_RAD;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * TO_RAD) * Math.cos(lat2 * TO_RAD) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};
// Global system locks
let lastExecutionTime = 0;
let retryDelay = 1000;
let isSystemLocked = false;
// CORE BACKGROUND LOGIC ENGINE
export const triggerUltimateSOS = async (config: {
  userId: string;
  contact1: string;
  contact2: string;
  baseUrl: string;
}) => {
  const { userId, contact1, contact2, baseUrl } = config;
  const now = Date.now();
  if (isSystemLocked || now - lastExecutionTime < 1500) {
    console.warn(
      "[CRITICAL ALERT] Rate Limit Triggered: Panic clicking ignored.",
    );
    return;
  }
  isSystemLocked = true;
  lastExecutionTime = now;
  try {
    const cachedHubsRaw = await AsyncStorage.getItem("cached_security_hubs");
    const NEPAL_SECURITY_HUBS = cachedHubsRaw ? JSON.parse(cachedHubsRaw) : [];
    const DEFAULT_BACKUP_HUB = {
      id: "DEFAULT",
      name: "Emergency Police Headquarters",
      lat: 27.7172,
      lng: 85.324,
      //yaa number chnage garne (police number rakhne aafno phone number ko sato)
      phone: "+9779825716885",
    };
    console.log(" Accessing Satellites for GPS Lock...");
    const locationPromise = Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.BestForNavigation,
    });
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("GPS_TIMEOUT")), 5000),
    );
    const currentPosition = (await Promise.race([
      locationPromise,
      timeoutPromise,
    ])) as Location.LocationObject;
    const { latitude, longitude } = currentPosition.coords;
    // clickable map routing targets
    const mapsLink = `https://google.com{latitude},${longitude}`;
    let optimizedHub = DEFAULT_BACKUP_HUB;
    let shortestDistance = Infinity;
    if (NEPAL_SECURITY_HUBS.length > 0) {
      for (const hub of NEPAL_SECURITY_HUBS) {
        const distance = getStrictDistanceKM(
          latitude,
          longitude,
          hub.lat,
          hub.lng,
        );
        if (distance < shortestDistance) {
          shortestDistance = distance;
          optimizedHub = hub;
        }
      }
    } else {
      shortestDistance = getStrictDistanceKM(
        latitude,
        longitude,
        DEFAULT_BACKUP_HUB.lat,
        DEFAULT_BACKUP_HUB.lng,
      );
    }
    const netInfo = await NetInfo.fetch();
    const abortController = new AbortController();
    const networkTimeout = setTimeout(() => abortController.abort(), 2500);
    if (netInfo.isConnected && netInfo.isInternetReachable !== false) {
      try {
        const response = await fetch(`${baseUrl}/api/user/trigger`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            coordinates: { lat: latitude, lng: longitude },
            assignedHub: optimizedHub.id,
          }),
          signal: abortController.signal,
        });
        clearTimeout(networkTimeout);
        if (response.ok) {
          retryDelay = 1000;
          Alert.alert(
            "SOS ACTIVATED",
            `Online alert and push notification successfully dispatched to ${optimizedHub.name}!`,
          );
          return;
        }
      } catch {
        retryDelay = Math.min(retryDelay * 2 + Math.random() * 500, 30000);
        console.log(
          `Server Unreachable. Jitter Backoff Delayed to: ${retryDelay}ms.`,
        );
      }
    }
    console.log("Hardware Native SMS Controller Active");
    const isHardwareReady = await SMS.isAvailableAsync();
    if (isHardwareReady) {
      const emergencyTargets = [contact1, contact2, optimizedHub.phone].filter(
        Boolean,
      );
      const emergencyMessage = `CRITICAL SOS! User ID: ${userId} is in danger. \n📍 Location: ${mapsLink} \n🎯 Closest Hub: ${optimizedHub.name} (${shortestDistance.toFixed(2)} KM away)`;
      await SMS.sendSMSAsync(emergencyTargets, emergencyMessage);
      Alert.alert(
        " OFFLINE SOS SENT",
        "Emergency SMS alerts have been sent to your contacts and the nearest security hub via cellular network.",
      );
    } else {
      throw new Error("HARDWARE_FAILURE");
    }
  } catch (globalError: any) {
    const errorMessage =
      globalError instanceof Error ? globalError.message : "UNKNOWN_ERROR";
    console.error("FAILED EXECUTION:", errorMessage);
    if (errorMessage === "GPS_TIMEOUT") {
      Alert.alert(
        "GPS Error",
        "Satellite connection took too long. Please dial local emergency numbers immediately.",
      );
    } else {
      Alert.alert(
        "CRITICAL HARDWARE FAULT",
        "System failure. Please manually dial 100 or 108 immediately.",
      );
    }
  } finally {
    isSystemLocked = false;
  }
};
//  MAIN EXPORTED VISUAL COMPONENT
export default function EmergencySOS({ userId, baseUrl }: EmergencySOSProps) {
  const [sosLoading, setSosLoading] = useState(false);
  // Local state references for true setup variables fetched from your user document fields
  const [realContacts, setRealContacts] = useState({
    contact1: "",
    contact2: "",
  });
  useEffect(() => {
    const syncSecurityHubsFromServer = async () => {
      try {
        console.log(" System Action: Syncing security hubs database...");
        const response = await fetch(`${baseUrl}/api/hubs/list`);
        if (response.ok) {
          const realHubsData = await response.json();
          await AsyncStorage.setItem(
            "cached_security_hubs",
            JSON.stringify(realHubsData),
          );
          console.log(" System Success: Security Hubs database synced safely.");
        }
      } catch {
        console.log(
          " System Warning: Server unreachable. Running on offline cached storage context.",
        );
      }
    };
    // Automated profiling fetch engine: Obtains genuine details input during the account signup cycle
    const fetchGenuineSignupContacts = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/user/profile/${userId}`);
        if (response.ok) {
          const profileData = await response.json();

          // Maps strings from your specific emergency contact arrays properties
          const firstContact = profileData.emergencyContacts?.[0]?.phone || "";
          const secondContact = profileData.emergencyContacts?.[1]?.phone || "";
          setRealContacts({ contact1: firstContact, contact2: secondContact });

          // Stores data locally to ensure phone operations persist securely offline
          await AsyncStorage.setItem(
            `offline_contacts_${userId}`,
            JSON.stringify({ contact1: firstContact, contact2: secondContact }),
          );
        }
      } catch {
        // Hydrates component using offline context fallback parameters if paths break down
        const fallbackRaw = await AsyncStorage.getItem(
          `offline_contacts_${userId}`,
        );
        if (fallbackRaw) {
          setRealContacts(JSON.parse(fallbackRaw));
        }
      }
    };
    if (baseUrl && userId) {
      syncSecurityHubsFromServer();
      fetchGenuineSignupContacts();
    }
  }, [baseUrl, userId]);
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
              // Invokes processing loops with true runtime signup contact state values
              await triggerUltimateSOS({
                userId,
                contact1: realContacts.contact1,
                contact2: realContacts.contact2,
                baseUrl,
              });
            } finally {
              setSosLoading(false);
            }
          },
        },
      ],
    );
  };
  return (
    <View className="items-center mb-4 w-full">
      <TouchableOpacity
        onPress={handleSOSPress}
        disabled={sosLoading}
        className="bg-red-600 px-8 py-6 rounded-full flex-row items-center active:opacity-80 w-full justify-center"
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
  );
}

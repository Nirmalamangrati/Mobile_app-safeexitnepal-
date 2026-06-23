import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
export default function RootLayout() {
  useEffect(() => {
    async function configureSirenChannel() {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync(
          "safeexit_sos_channel",
          {
            name: "Critical Emergency Alerts",
            importance: Notifications.AndroidImportance.MAX,
            sound: "emergency_alarm",
            // vibrationPattern:'',
            enableLights: true,
          },
        );
        console.log(
          " System Log: SOS Siren Notification Channel Configured Successfully!",
        );
      }
    }
    configureSirenChannel();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

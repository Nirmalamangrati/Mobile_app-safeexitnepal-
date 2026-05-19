import { Stack } from "expo-router";
import React from "react";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#0f172a" },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="(auth)/verifyOtp" />
        <Stack.Screen name="(auth)/signupForm" />
        <Stack.Screen name="(tabs)/home" options={{ title: "Home" }} />
      </Stack>
    </>
  );
}

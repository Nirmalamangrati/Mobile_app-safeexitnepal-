import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import "@/global.css";
import Profile from "./(tabs)/profile";

export default function RootLayout() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isReady) {
      router.replace("/(auth)/login");
    }
  }, [isReady]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="index" />
    </Stack>
  );
}

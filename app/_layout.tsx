import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import "@/global.css";

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/(auth)/login");
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

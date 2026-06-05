import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="loginForm" />
      <Stack.Screen name="signupForm" />
      <Stack.Screen name="verifyOtp" />
    </Stack>
  );
}

import { Redirect } from "expo-router";
import React from "react";
export default function Index() {
  const isUserLoggedIn = false;
  if (isUserLoggedIn) {
    return <Redirect href="/(tabs)/home" />;
  } else {
    return <Redirect href="/(auth)/loginForm" />;
  }
}

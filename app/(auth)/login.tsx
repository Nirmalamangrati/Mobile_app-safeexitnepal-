import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Mail, Lock, ArrowRight } from "lucide-react-native";
import { useRouter } from "expo-router";
// 1. Import the modular functions instead of the default export
import { getMessaging, getToken } from "@react-native-firebase/messaging";

const BASE_URL = "https://rummage-tucking-dividend.ngrok-free.dev";

// 1. ALGORITHM: LEVENSHTEIN DISTANCE (STRING SIMILARITY)
const getLevenshteinDistance = (a, b) => {
  if (!a || !b) return Math.abs((a || "").length - (b || "").length);
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1,
        );
      }
    }
  }
  return matrix[b.length][a.length];
};

const LoginForm = () => {
  const router = useRouter();
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [emailHint, setEmailHint] = useState("");

  const handleContactChange = (text) => {
    setContact(text);

    if (text.includes("@")) {
      const domain = text.split("@")[1];
      const commonDomains = ["gmail.com", "yahoo.com", "outlook.com"];

      if (domain) {
        for (let d of commonDomains) {
          const distance = getLevenshteinDistance(domain, d);
          if (distance > 0 && distance <= 2) {
            setEmailHint(`Did you mean @${d}?`);
            return;
          }
        }
      }
    }
    setEmailHint("");
  };

  const handleLogin = async () => {
    // 2. ALGORITHM: REGEX PATTERN MATCHING (DETERMINISTIC FINITE AUTOMATON)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (emailRegex.test(contact) || phoneRegex.test(contact)) {
      try {
        let deviceToken = "";
        try {
          // 2. Initialize messaging using the modular pattern and fetch token
          const messagingInstance = getMessaging();
          deviceToken = await getToken(messagingInstance);
          console.log("FCM Token Generated for Login:", deviceToken);
        } catch (fcmError) {
          console.log(
            "Firebase token extraction bypassed or failed:",
            fcmError,
          );
        }
        const response = await fetch(`${BASE_URL}/api/auth/send-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: contact,
            password: password,
            fcmToken: deviceToken,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          Alert.alert(
            "Success",
            "OTP has been sent to your contact. Please check.",
          );
          router.push({
            pathname: "/(auth)/verifyOtp",
            params: { contact: contact },
          } as any);
        } else {
          Alert.alert("Error", data.error || "Failed to send OTP.");
        }
      } catch (error) {
        console.log("", error);
        Alert.alert("Connection Error", "Unable to connect to the server.");
      }
    } else {
      Alert.alert(
        "Error",
        "Please enter a valid email or 10-digit phone number.",
      );
    }
  };

  return (
    <View className="flex-1 bg-[#0f172a] justify-center p-6">
      <View className="mb-8">
        <Text className="text-white text-3xl font-bold">Welcome Back</Text>
        <Text className="text-gray-400 mt-2">
          Login with your verified email or phone
        </Text>
      </View>

      {/* Input: Email or Phone */}
      <View className="bg-[#1e293b] flex-row items-center p-4 rounded-2xl mb-1 border border-white/5">
        <Mail color="#b91c1c" size={20} />
        <TextInput
          placeholder="Email or Phone Number"
          placeholderTextColor="#94a3b8"
          className="flex-1 text-white ml-3"
          keyboardType="email-address"
          value={contact}
          onChangeText={handleContactChange}
          autoCapitalize="none"
        />
      </View>

      {/* Email Hint Display */}
      {emailHint ? (
        <TouchableOpacity
          onPress={() => {
            const prefix = contact.split("@")[0];
            const correctDomain = emailHint
              .replace("Did you mean @", "")
              .replace("?", "");
            setContact(`${prefix}@${correctDomain}`);
            setEmailHint("");
          }}
          className="mb-3 pl-2"
        >
          <Text className="text-yellow-400 text-xs font-semibold">
            {emailHint} Click to fix.
          </Text>
        </TouchableOpacity>
      ) : (
        <View className="mb-3" />
      )}

      {/* Input: Password */}
      <View className="bg-[#1e293b] flex-row items-center p-4 rounded-2xl mb-6 border border-white/5">
        <Lock color="#b91c1c" size={20} />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#94a3b8"
          className="flex-1 text-white ml-3"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Login Button */}
      <TouchableOpacity
        onPress={handleLogin}
        style={{ backgroundColor: "#b91c1c" }}
        className="p-4 rounded-2xl flex-row justify-between items-center px-6 shadow-lg shadow-red-900/30"
      >
        <View className="flex-1 items-center">
          <Text className="text-white font-bold text-lg">Next</Text>
        </View>
        <ArrowRight color="white" size={20} />
      </TouchableOpacity>

      {/* Sign Up Link */}
      <TouchableOpacity
        onPress={() => router.push("/signupForm")}
        className="mt-6"
      >
        <Text className="text-gray-400 text-center">
          Don't have an account?{" "}
          <Text style={{ color: "#b91c1c" }} className="font-bold">
            {"\u00A0\u00A0"} Sign Up
          </Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginForm;

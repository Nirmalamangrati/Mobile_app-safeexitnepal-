import React, { useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowRight, ArrowLeft } from "lucide-react-native";

const BASE_URL = "http://192.168.43.132:8000";

const VerifyOtpForm = () => {
  const router = useRouter();
  const { contact } = useLocalSearchParams<{ contact: string }>();
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputs = useRef<any[]>([]);

  /**
   * 1. ALGORITHM: LINEAR SCAN & INDEX-BASED FOCUS SHIFT
   * Processes data entry one character at a time. It matches the current text index
   * and automatically executes a forward or backward focus operation on the adjacent element.
   */
  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Forward Scan: Shift focus to next cell if character is inputted
    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Backward Scan: Shift focus back if user hits delete/backspace on an empty input
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    // Array join operation to compress individual index strings into a single token
    const fullOtp = otp.join("");

    /**
     * 2. ALGORITHM: DETERMINISTIC LENGTH VALIDATION (REGEX)
     * Performs a standard integrity check evaluating exact numeric sequence match.
     */
    const otpRegex = /^[0-9]{6}$/;

    if (!otpRegex.test(fullOtp)) {
      return Alert.alert(
        "Invalid Input",
        "Please enter a valid 6-digit OTP code.",
      );
    }

    try {
      const response = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: contact, otp: fullOtp }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Verified ", "Login successful!", [
          {
            text: "Continue",
            // Fixed: Routes directly to the tab layout home dashboard
            onPress: () => router.push("/(tabs)/home" as any),
          },
        ]);
      } else {
        Alert.alert("Verification Failed", data.error || "Incorrect OTP code.");
      }
    } catch (error) {
      Alert.alert("Network Error", "Unable to connect to the server.");
    }
  };

  return (
    <View className="flex-1 bg-[#0f172a] justify-center p-6">
      {/* Back to Login Button */}
      <TouchableOpacity
        onPress={() => router.push("/(auth)/login" as any)}
        className="absolute top-14 left-6 flex-row items-center"
      >
        <ArrowLeft color="#94a3b8" size={18} />
        <Text className="text-gray-400 ml-2 font-medium">Back</Text>
      </TouchableOpacity>

      <View className="mb-8 items-center">
        <Text className="text-white text-3xl font-bold tracking-tight">
          Enter Code
        </Text>
        <Text className="text-gray-400 mt-2 text-center leading-relaxed">
          We have sent a verification code to{"\n"}
          <Text style={{ color: "#b91c1c" }} className="font-bold">
            {contact || "your account"}
          </Text>
        </Text>
      </View>

      {/* Grid containing 6 distinct input elements */}
      <View className="flex-row justify-between mb-8 px-2">
        {otp.map((digit, idx) => (
          <TextInput
            key={idx}
            ref={(ref) => (inputs.current[idx] = ref)}
            className="w-12 h-14 bg-[#1e293b] border border-white/5 rounded-xl text-center text-white text-xl font-bold focus:border-[#b91c1c]"
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleOtpChange(text, idx)}
            onKeyPress={(e) => handleKeyPress(e, idx)}
          />
        ))}
      </View>

      {/* Confirm Action Trigger Button */}
      <TouchableOpacity
        onPress={handleVerify}
        style={{ backgroundColor: "#b91c1c" }}
        className="p-4 rounded-2xl flex-row justify-between items-center px-6 shadow-lg shadow-red-900/30"
      >
        <View className="flex-1 items-center">
          <Text className="text-white font-bold text-lg">Verify & Proceed</Text>
        </View>
        <ArrowRight color="white" size={20} />
      </TouchableOpacity>
    </View>
  );
};

export default VerifyOtpForm;

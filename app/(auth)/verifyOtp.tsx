import React, { useState, useRef, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowRight, ArrowLeft, RotateCcw } from "lucide-react-native";
const BASE_URL = "https://safeexitnepal-backend-2.onrender.com";
const VerifyOtpForm = () => {
  const router = useRouter();
  const { contact } = useLocalSearchParams<{ contact: string }>();
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState<number>(60);
  const [loading, setLoading] = useState<boolean>(false);
  const [resending, setResending] = useState<boolean>(false);
  const inputs = useRef<any[]>([]);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);
  //ALGORITHM: LINEAR SCAN & INDEX-BASED FOCUS SHIFT
  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleResendOtp = async () => {
    if (!contact) {
      return Alert.alert("App Error", "Contact information is missing.");
    }

    setResending(true);
    try {
      const response = await fetch(`${BASE_URL}/api/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: contact }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log("[Resend Failed Raw Text Output]:", errorText);
        return Alert.alert("Server Error", `Status code: ${response.status}`);
      }
      const data = await response.json();
      // BACKEND BYPASS CONFIGURATION LAYER (Alert Screen Bypass Engine)
      if (data.otp) {
        // Alert nadekhaikana backend bata aako testing code lai layout input box maa automatically pathaune:
        const otpArray = data.otp.split("");
        setOtp(otpArray);
      } else {
        // Yadi production backend le real SMS gateway successfully trigger garyo bhane matra success popup dinxa
        Alert.alert(
          "Success",
          "A new OTP verification code has been dispatched.",
        );
      }
      setTimer(60);
    } catch (error: any) {
      console.error("[Resend OTP Network Exception]:", error);
      Alert.alert("Network Error", error?.message || "Unable to reach server.");
    } finally {
      setResending(false);
    }
  };

  const handleVerify = async () => {
    if (timer === 0) {
      return Alert.alert(
        "Code Expired",
        "The 1-minute window has closed. Please click 'Resend OTP' to get a new code.",
      );
    }

    const fullOtp = otp.join("");
    //ALGORITHM: DETERMINISTIC LENGTH VALIDATION (REGEX)
    const otpRegex = /^[0-9]{6}$/;

    if (!otpRegex.test(fullOtp)) {
      return Alert.alert(
        "Invalid Input",
        "Please enter a valid 6-digit OTP code.",
      );
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: contact, phone: contact, otp: fullOtp }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem("userToken", data.token);
        await AsyncStorage.setItem("userData", JSON.stringify(data.user));
        router.push("/home" as any);
      } else {
        Alert.alert("Verification Failed", data.error || "Incorrect OTP code.");
      }
    } catch (error) {
      Alert.alert("Network Error", "Unable to connect to the server.");
    } finally {
      setLoading(false);
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
      <View className="flex-row justify-between mb-4 px-2">
        {otp.map((digit, idx) => (
          <TextInput
            key={idx}
            ref={(ref) => {
              inputs.current[idx] = ref;
            }}
            className="w-12 h-14 bg-[#1e293b] border border-white/5 rounded-xl text-center text-white text-xl font-bold focus:border-[#b91c1c]"
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleOtpChange(text, idx)}
            onKeyPress={(e) => handleKeyPress(e, idx)}
          />
        ))}
      </View>
      <View className="items-center mb-8h-6 justify-center">
        {timer > 0 ? (
          <Text className="text-gray-400">
            Resend code in{" "}
            <Text className="text-white font-bold">{timer}s</Text>
          </Text>
        ) : (
          <TouchableOpacity
            onPress={handleResendOtp}
            disabled={resending}
            className="flex-row items-center"
          >
            {resending ? (
              <ActivityIndicator size="small" color="#b91c1c" />
            ) : (
              <>
                <RotateCcw color="#b91c1c" size={16} />
                <Text className="text-[#b91c1c] ml-2 font-semibold">
                  Resend OTP
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
      {/* Confirm Action Trigger Button */}
      <TouchableOpacity
        onPress={handleVerify}
        disabled={loading || timer === 0}
        style={{ backgroundColor: timer === 0 ? "#475569" : "#b91c1c" }}
        className="p-4 rounded-2xl flex-row justify-between items-center px-6 shadow-lg"
      >
        <View className="flex-1 items-center">
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">
              {timer === 0 ? "Code Expired" : "Verify & Proceed"}
            </Text>
          )}
        </View>
        <ArrowRight color="white" size={20} />
      </TouchableOpacity>
    </View>
  );
};
export default VerifyOtpForm;

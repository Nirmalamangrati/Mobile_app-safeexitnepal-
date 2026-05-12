import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Mail, Lock, ChevronRight } from "lucide-react-native";

// 1. TypeScript ko lagi Interface define gareko
interface LoginFormProps {
  onToggleSignup: () => void;
}

const LoginForm = ({ onToggleSignup }: LoginFormProps) => {
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (emailRegex.test(contact)) {
      Alert.alert("Success", "Verified Email: " + contact);
    } else if (phoneRegex.test(contact)) {
      Alert.alert("Success", "Verified Phone: " + contact);
    } else {
      Alert.alert("Error", "Valid email or 10-digit phone number halnuhos.");
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

      {/* Email/Phone Input */}
      <View className="bg-[#1e293b] flex-row items-center p-4 rounded-2xl mb-4 border border-white/5">
        <Mail color="#60a5fa" size={20} />
        <TextInput
          placeholder="Email or Phone Number"
          placeholderTextColor="#94a3b8"
          className="flex-1 text-white ml-3"
          keyboardType="email-address"
          value={contact}
          onChangeText={setContact}
          autoCapitalize="none"
        />
      </View>

      {/* Password Input */}
      <View className="bg-[#1e293b] flex-row items-center p-4 rounded-2xl mb-6 border border-white/5">
        <Lock color="#60a5fa" size={20} />
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
        className="bg-blue-600 p-4 rounded-2xl flex-row justify-center items-center"
      >
        <Text className="text-white font-bold text-lg mr-2">Login</Text>
        <ChevronRight color="white" size={20} />
      </TouchableOpacity>

      {/* Switch to Signup - Yahan toggle logic chha */}
      <TouchableOpacity onPress={onToggleSignup} className="mt-6">
        <Text className="text-gray-400 text-center">
          Do not have an account?{" "}
          <Text className="text-blue-500 font-bold">Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginForm;

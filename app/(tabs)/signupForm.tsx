import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { User, Mail, Lock, CheckCircle2 } from "lucide-react-native";

// 1. TypeScript interface thapiyo
interface SignupFormProps {
  onToggle: () => void;
}

const SignupForm = ({ onToggle }: SignupFormProps) => {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (name.length < 3) {
      Alert.alert("Error", "Please enter your full name.");
      return;
    }

    if (emailRegex.test(contact) || phoneRegex.test(contact)) {
      Alert.alert(
        "Verification Sent",
        `We have sent a verification code to ${contact}. Please check.`,
      );
    } else {
      Alert.alert(
        "Invalid Input",
        "Please enter a valid email or 10-digit phone number.",
      );
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-[#0f172a] p-6"
    >
      <View className="mt-10 mb-8">
        <Text className="text-white text-3xl font-bold">Create Account</Text>
        <Text className="text-gray-400 mt-2">
          Join us to stay safe and connected
        </Text>
      </View>

      {/* Full Name Field */}
      <View className="bg-[#1e293b] flex-row items-center p-4 rounded-2xl mb-4 border border-white/5">
        <User color="#60a5fa" size={20} />
        <TextInput
          placeholder="Full Name"
          placeholderTextColor="#94a3b8"
          className="flex-1 text-white ml-3"
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* Email or Phone Field */}
      <View className="bg-[#1e293b] flex-row items-center p-4 rounded-2xl mb-4 border border-white/5">
        <Mail color="#60a5fa" size={20} />
        <TextInput
          placeholder="Email or Phone Number"
          placeholderTextColor="#94a3b8"
          className="flex-1 text-white ml-3"
          keyboardType="email-address"
          autoCapitalize="none"
          value={contact}
          onChangeText={setContact}
        />
      </View>

      {/* Password Field */}
      <View className="bg-[#1e293b] flex-row items-center p-4 rounded-2xl mb-6 border border-white/5">
        <Lock color="#60a5fa" size={20} />
        <TextInput
          placeholder="Create Password"
          placeholderTextColor="#94a3b8"
          className="flex-1 text-white ml-3"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Signup Button */}
      <TouchableOpacity
        onPress={handleSignup}
        className="bg-green-600 p-4 rounded-2xl flex-row justify-center items-center"
      >
        <Text className="text-white font-bold text-lg mr-2">Sign Up</Text>
        <CheckCircle2 color="white" size={20} />
      </TouchableOpacity>

      {/* Back to Login */}
      <TouchableOpacity onPress={onToggle} className="mt-6">
        <Text className="text-gray-400 text-center">
          Already have an account?{" "}
          <Text className="text-blue-500 font-bold">Login</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SignupForm;

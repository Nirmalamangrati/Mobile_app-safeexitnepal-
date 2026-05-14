import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ArrowLeft, User, Phone, Calendar, MapPin } from "lucide-react-native";

export default function EditProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // १. सुरुमा खाली स्टेट बनाउने
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");

  // २. स्क्रिन खुल्ने बित्तिकै params बाट आएको डाटा स्टेटमा जबर्जस्ती भर्ने (Safely Load Params)
  useEffect(() => {
    if (params) {
      if (params.currentName) setName(String(params.currentName));
      if (params.currentPhone) setPhone(String(params.currentPhone));
      if (params.currentDob) setDob(String(params.currentDob));
      if (params.currentAddress) setAddress(String(params.currentAddress));
      if (params.currentGender) setGender(String(params.currentGender));
    }
  }, [params]);

  // ३. सेभ गर्ने फङ्सन (बाँकी कोड पहिलेकै जस्तै)
  const handleSave = async () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert("Error", "Name and Phone Number cannot be empty.");
      return;
    }

    try {
      const updatedUser = {
        fullName: name.trim(),
        phone: phone.trim(),
        gender: gender,
        dob: dob.trim(),
        address: address.trim(),
        email: params.currentEmail ? String(params.currentEmail) : "",
        bloodGroup: params.currentBloodGroup
          ? String(params.currentBloodGroup)
          : "",
      };

      await AsyncStorage.setItem("userData", JSON.stringify(updatedUser));

      Alert.alert("Success", "Your profile has been updated successfully.", [
        { text: "OK", onPress: () => router.replace("/(tabs)/profile" as any) },
      ]);
    } catch (error) {
      console.error("Failed to save user data:", error);
      Alert.alert("Error", "Failed to update profile.");
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-[#0f172a]"
    >
      {/* शीर्ष हेडर */}
      <View className="flex-row items-center justify-between px-6 pt-14 pb-4 border-b border-white/5">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 -ml-2 rounded-full active:bg-slate-800"
        >
          <ArrowLeft color="white" size={22} />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold">Edit Profile Mode</Text>
        <View className="w-8" />
      </View>

      <ScrollView className="flex-1 p-6 space-y-5">
        {/* Full Name सम्पादन क्षेत्र */}
        <View className="mb-4">
          <Text className="text-gray-400 text-xs font-semibold mb-2 px-1">
            FULL NAME
          </Text>
          <View className="flex-row items-center bg-[#1e293b] rounded-xl px-4 py-3 border border-white/5">
            <User color="#64748b" size={18} />
            <TextInput
              value={name}
              onChangeText={setName}
              className="flex-1 text-white ml-3 font-medium text-base py-0.5"
              placeholder="Enter your name"
              placeholderTextColor="#475569"
            />
          </View>
        </View>

        {/* Phone Number सम्पादन क्षेत्र */}
        <View className="mb-4">
          <Text className="text-gray-400 text-xs font-semibold mb-2 px-1">
            PHONE NUMBER
          </Text>
          <View className="flex-row items-center bg-[#1e293b] rounded-xl px-4 py-3 border border-white/5">
            <Phone color="#64748b" size={18} />
            <TextInput
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              className="flex-1 text-white ml-3 font-medium text-base py-0.5"
              placeholder="Enter phone number"
              placeholderTextColor="#475569"
            />
          </View>
        </View>

        {/* Date of Birth सम्पादन क्षेत्र */}
        <View className="mb-4">
          <Text className="text-gray-400 text-xs font-semibold mb-2 px-1">
            DATE OF BIRTH
          </Text>
          <View className="flex-row items-center bg-[#1e293b] rounded-xl px-4 py-3 border border-white/5">
            <Calendar color="#64748b" size={18} />
            <TextInput
              value={dob}
              onChangeText={setDob}
              className="flex-1 text-white ml-3 font-medium text-base py-0.5"
              placeholder="e.g., 2060-9-19"
              placeholderTextColor="#475569"
            />
          </View>
        </View>

        {/* Permanent Address सम्पादन क्षेत्र */}
        <View className="mb-6">
          <Text className="text-gray-400 text-xs font-semibold mb-2 px-1">
            PERMANENT ADDRESS
          </Text>
          <View className="flex-row items-center bg-[#1e293b] rounded-xl px-4 py-3 border border-white/5">
            <MapPin color="#64748b" size={18} />
            <TextInput
              value={address}
              onChangeText={setAddress}
              className="flex-1 text-white ml-3 font-medium text-base py-0.5"
              placeholder="Enter your address"
              placeholderTextColor="#475569"
            />
          </View>
        </View>

        {/* परिवर्तनहरू सुरक्षित गर्ने बटन */}
        <TouchableOpacity
          onPress={handleSave}
          className="bg-red-600 p-4 rounded-xl items-center shadow-lg active:bg-red-700"
        >
          <Text className="text-white font-bold text-base">Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

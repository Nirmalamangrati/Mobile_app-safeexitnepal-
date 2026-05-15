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
import {
  ArrowLeft,
  User,
  Phone,
  Calendar,
  MapPin,
  Plus,
  Trash2,
} from "lucide-react-native";

interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}
export default function EditProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  // Personal Details States
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");

  // Emergency Contacts State
  const [emergencyContacts, setEmergencyContacts] = useState<
    EmergencyContact[]
  >([]);

  useEffect(() => {
    if (params) {
      if (params.currentName) setName(String(params.currentName));
      if (params.currentPhone) setPhone(String(params.currentPhone));
      if (params.currentDob) setDob(String(params.currentDob));
      if (params.currentAddress) setAddress(String(params.currentAddress));
      if (params.currentGender) setGender(String(params.currentGender));

      if (params.currentEmergencyContacts) {
        try {
          const rawData = String(params.currentEmergencyContacts);
          if (rawData.startsWith("[") || rawData.startsWith("{")) {
            const parsed = JSON.parse(rawData);
            if (Array.isArray(parsed)) {
              setEmergencyContacts(parsed);
            } else if (parsed && typeof parsed === "object") {
              setEmergencyContacts([parsed as EmergencyContact]);
            }
          } else if (rawData.trim().length > 0) {
            setEmergencyContacts([
              {
                name: "Emergency Contact",
                relationship: "Contact",
                phone: rawData.trim(),
              },
            ]);
          }
        } catch (e) {
          console.log("Safe catch: legacy data handled.");
          setEmergencyContacts([]);
        }
      }
    }
  }, []);

  // add new contact form (add only if less than 5 contacts exist, otherwise show alert)
  const addEmergencyContact = () => {
    if (emergencyContacts.length >= 5) {
      Alert.alert(
        "Limit Reached",
        "You can add a maximum of 5 emergency contacts only.",
      );

      return;
    }
    setEmergencyContacts([
      ...emergencyContacts,
      { name: "", relationship: "", phone: "" },
    ]);
  };

  // remove contact form (remove only if more than 2 contacts exist, otherwise show alert)
  const removeEmergencyContact = (index: number) => {
    if (emergencyContacts.length <= 2) {
      Alert.alert(
        "Cannot Delete",
        "For safety reasons, at least 2 emergency contacts must be maintained.",
      );
      return;
    }
    const updated = emergencyContacts.filter((_, i) => i !== index);
    setEmergencyContacts(updated);
  };

  const updateContactField = (
    index: number,
    field: keyof EmergencyContact,
    value: string,
  ) => {
    const updated = [...emergencyContacts];
    updated[index][field] = value;
    setEmergencyContacts(updated);
  };

  const handleSave = async () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert("Error", "Name and Phone Number cannot be empty.");
      return;
    }
    if (emergencyContacts.length < 2) {
      Alert.alert(
        "Incomplete Form",
        "Please add at least 2 emergency contacts before saving.",
      );
      return;
    }

    try {
      const storedUserRaw = await AsyncStorage.getItem("userData");
      const currentUserObj = storedUserRaw ? JSON.parse(storedUserRaw) : {};
      const userId =
        currentUserObj._id || currentUserObj.id || "65f1a2b3c4d5e6f7a8b9c0d1";

      const updatedUserData = {
        fullName: name.trim(),
        phone: phone.trim(),
        gender: gender,
        dob: dob.trim(),
        emergencyContacts: emergencyContacts,
        safetyInfo: {
          address: address.trim(),
          bloodGroup: params.currentBloodGroup
            ? String(params.currentBloodGroup)
            : "",
          medicalConditions: currentUserObj.safetyInfo?.medicalConditions || "",
          allergies: currentUserObj.safetyInfo?.allergies || "",
          hospital: currentUserObj.safetyInfo?.hospital || "",
        },
      };

      const response = await fetch(
        `http://192.168.43.132:8000/api/profile/update/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUserData),
        },
      );

      const result = await response.json();
      if (response.ok && result.success) {
        await AsyncStorage.setItem("userData", JSON.stringify(result.user));

        Alert.alert("Success", "Your profile has been updated successfully.", [
          {
            text: "OK",
            onPress: () => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/profile");
              }
            },
          },
        ]);
      } else {
        Alert.alert(
          "Error",
          result.message || "Failed to update profile on server.",
        );
      }
    } catch (error) {
      console.error("Failed to save user data to backend:", error);
      Alert.alert(
        "Error",
        "Network connection failed. Could not update profile.",
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-[#0f172a]"
    >
      {/* Header */}
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

      <ScrollView className="flex-1 p-6" keyboardShouldPersistTaps="handled">
        {/* PERSONAL DETAILS */}
        <Text className="text-red-500 text-xs font-bold mb-4 tracking-wider">
          PERSONAL DETAILS
        </Text>

        <View className="mb-5">
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

        <View className="mb-5">
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

        <View className="mb-5">
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

        {/* EMERGENCY SETUP */}
        <View className="flex-row items-center justify-between mb-4 mt-2">
          <Text className="text-red-500 text-xs font-bold tracking-wider">
            EMERGENCY SETUP ({emergencyContacts.length}/5)
          </Text>

          {/* Add Contact Button */}
          {emergencyContacts.length < 5 && (
            <TouchableOpacity
              onPress={addEmergencyContact}
              className="flex-row items-center bg-red-600/20 px-3 py-1.5 rounded-lg border border-red-600/30"
            >
              <Plus color="#ef4444" size={14} />
              <Text className="text-red-500 font-bold text-xs ml-1">
                Add Contact
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {emergencyContacts.map((contact, index) => (
          <View
            key={index}
            className="bg-[#1e293b]/50 border border-white/5 p-4 rounded-2xl mb-4"
          >
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-gray-400 text-xs font-bold">
                CONTACT #{index + 1}
              </Text>

              {/* Remove Contact Button */}
              {emergencyContacts.length > 2 && (
                <TouchableOpacity
                  onPress={() => removeEmergencyContact(index)}
                  className="p-1"
                >
                  <Trash2 color="#ef4444" size={16} />
                </TouchableOpacity>
              )}
            </View>

            <View className="mb-3">
              <TextInput
                value={contact.name}
                onChangeText={(val) => updateContactField(index, "name", val)}
                className="bg-[#1e293b] border border-white/5 rounded-xl px-4 py-2.5 text-white font-medium text-sm"
                placeholder="Contact Name"
                placeholderTextColor="#475569"
              />
            </View>

            <View className="mb-3">
              <TextInput
                value={contact.relationship}
                onChangeText={(val) =>
                  updateContactField(index, "relationship", val)
                }
                className="bg-[#1e293b] border border-white/5 rounded-xl px-4 py-2.5 text-white font-medium text-sm"
                placeholder="Relationship (e.g., Father, Mother)"
                placeholderTextColor="#475569"
              />
            </View>

            <View>
              <TextInput
                value={contact.phone}
                onChangeText={(val) => updateContactField(index, "phone", val)}
                keyboardType="phone-pad"
                className="bg-[#1e293b] border border-white/5 rounded-xl px-4 py-2.5 text-white font-medium text-sm"
                placeholder="Phone Number"
                placeholderTextColor="#475569"
              />
            </View>
          </View>
        ))}

        {emergencyContacts.length === 0 && (
          <Text className="text-gray-500 text-sm text-center my-4 italic">
            No emergency contacts added yet.
          </Text>
        )}

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          className="bg-red-600 p-4 rounded-xl items-center shadow-lg active:bg-red-700 mb-10 mt-4"
        >
          <Text className="text-white font-bold text-base">Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

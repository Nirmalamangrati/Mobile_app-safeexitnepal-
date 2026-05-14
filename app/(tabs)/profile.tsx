import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  User,
  Phone,
  Shield,
  ShieldAlert,
  Heart,
  LogOut,
  ChevronRight,
  Edit2,
} from "lucide-react-native";
interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  primary: boolean;
}
interface UserData {
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  bloodGroup: string;
  medicalConditions: string;
  allergies: string;
  address: string;
  hospital: string;
  emergencyContacts: EmergencyContact[];
  permissions: {
    location: boolean;
    notifications: boolean;
    background: boolean;
    sms: boolean;
    phone: boolean;
  };
}

const ProfileScreen = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // एप खुल्नासाथ सेभ भएको साइनअप/लगइन डेटा लोड गर्ने हूक
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("userData");
        if (storedData) {
          setUser(JSON.parse(storedData));
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to log out from SafeExit?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.clear(); // सबै सेभ डेटा सफा गर्ने
          router.replace("/(auth)/login" as any);
        },
      },
    ]);
  };

  // नामको पहिलो अक्षरहरू निकाल्ने फङ्सन (जस्तै: Nisha Mangrati -> NM)
  const getAvatarInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length > 1) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  if (loading) {
    return (
      <View className="flex-1 bg-[#0f172a] justify-center items-center">
        <ActivityIndicator size="large" color="#b91c1c" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-[#0f172a]"
      showsVerticalScrollIndicator={false}
    >
      {/* १. HEADER BLOCK: प्रोफाइल कार्ड */}
      <View className="bg-[#1e293b] pt-16 pb-8 px-6 rounded-b-[32px] items-center border-b border-white/5 shadow-xl">
        <View className="relative mb-4">
          <View className="w-24 h-24 bg-[#b91c1c]/10 border-2 border-[#b91c1c] rounded-full items-center justify-center shadow-lg">
            <Text className="text-white text-3xl font-black">
              {getAvatarInitials(user?.fullName || "")}
            </Text>
          </View>
          <TouchableOpacity className="absolute bottom-0 right-0 bg-[#b91c1c] p-2 rounded-full border-2 border-[#1e293b]">
            <Edit2 color="white" size={14} />
          </TouchableOpacity>
        </View>

        <Text className="text-white text-2xl font-bold tracking-tight">
          {user?.fullName || "Guest User"}
        </Text>
        <Text className="text-gray-400 text-sm mt-1">
          {user?.email || "No email bound"}
        </Text>

        <View className="mt-4 bg-[#b91c1c]/20 border border-[#b91c1c]/30 px-4 py-1.5 rounded-full flex-row items-center">
          <Heart color="#b91c1c" size={14} fill="#b91c1c" />
          <Text className="text-white text-xs font-bold ml-2">
            Blood Group: {user?.bloodGroup || "Not Specified"}
          </Text>
        </View>
      </View>

      <View className="p-6 space-y-6">
        {/* २. SECTION 1: व्यक्तिगत विवरण */}
        <View>
          <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3 px-1">
            Personal Details
          </Text>
          <View className="bg-[#1e293b] rounded-2xl overflow-hidden border border-white/5">
            {/* फोन नम्बर */}
            <View className="flex-row items-center justify-between p-4 border-b border-white/5">
              <View className="flex-row items-center flex-1">
                <View className="w-9 h-9 bg-slate-800 rounded-xl items-center justify-center">
                  <Phone color="#94a3b8" size={18} />
                </View>
                <View className="ml-4">
                  <Text className="text-gray-400 text-xs">Phone Number</Text>
                  <Text className="text-white font-medium mt-0.5">
                    {user?.phone || "N/A"}
                  </Text>
                </View>
              </View>
            </View>

            {/* लिङ्ग */}
            <View className="flex-row items-center justify-between p-4">
              <View className="flex-row items-center flex-1">
                <View className="w-9 h-9 bg-slate-800 rounded-xl items-center justify-center">
                  <User color="#94a3b8" size={18} />
                </View>
                <View className="ml-4">
                  <Text className="text-gray-400 text-xs">Gender</Text>
                  <Text className="text-white font-medium mt-0.5">
                    {user?.gender || "Female"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        {/* जन्ममिति (DOB) - नयाँ थपिएको */}
        <View className="flex-row items-center justify-between p-4 border-b border-white/5">
          <View className="flex-row items-center flex-1">
            <View className="w-9 h-9 bg-slate-800 rounded-xl items-center justify-center">
              <User color="#94a3b8" size={18} />
            </View>
            <View className="ml-4">
              <Text className="text-gray-400 text-xs">Date of Birth</Text>
              <Text className="text-white font-medium mt-0.5">
                {user?.dob || "Not Provided"}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row items-center justify-between p-4">
          <View className="flex-row items-center flex-1">
            <View className="w-9 h-9 bg-slate-800 rounded-xl items-center justify-center">
              <Shield color="#94a3b8" size={18} />
            </View>
            <View className="ml-4">
              <Text className="text-gray-400 text-xs">Permanent Address</Text>
              <Text className="text-white font-medium mt-0.5">
                {user?.address || "Not Provided"}
              </Text>
            </View>
          </View>
        </View>

        {/* ३. SECTION 2: सुरक्षा सेटिङ */}
        <View>
          <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3 px-1">
            Emergency Setup
          </Text>
          <View className="bg-[#1e293b] rounded-2xl overflow-hidden border border-white/5">
            {/* १. EMERGENCY CONTACTS SECTION */}
            <View className="border-b border-white/5">
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/emergency-contacts" as any,
                    params: {
                      contacts: JSON.stringify(user?.emergencyContacts || []),
                    },
                  })
                }
                className="flex-row items-center justify-between p-4"
              >
                <View className="flex-row items-center">
                  <View className="w-9 h-9 bg-red-950/30 rounded-xl items-center justify-center">
                    <ShieldAlert color="#b91c1c" size={18} />
                  </View>
                  <Text className="text-white font-semibold ml-4">
                    Emergency Contacts
                  </Text>
                </View>
                <ChevronRight color="#475569" size={18} />
              </TouchableOpacity>

              {/* ➔ साइनअपको आकस्मिक नम्बरहरू यहाँ भिजुअल रूपमा देखिनेछ */}
              <View className="bg-[#0f172a]/40 mx-4 mb-4 p-3 rounded-xl space-y-2 border border-white/5">
                {user?.emergencyContacts &&
                user.emergencyContacts.length > 0 ? (
                  user.emergencyContacts.map((contact, idx) => (
                    <View
                      key={idx}
                      className="flex-row justify-between items-center py-1"
                    >
                      <View>
                        <Text className="text-white text-sm font-medium">
                          {contact.name}
                        </Text>
                        <Text className="text-gray-400 text-xs">
                          {contact.relationship}{" "}
                          {contact.primary ? "• Primary" : ""}
                        </Text>
                      </View>
                      <Text className="text-[#b91c1c] text-sm font-bold">
                        {contact.phone}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text className="text-gray-500 text-xs italic">
                    No emergency contacts configured.
                  </Text>
                )}
              </View>
            </View>

            {/* २. MEDICAL & SAFETY INFO SECTION */}
            <View className="border-b border-white/5">
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/medical-info" as any,
                    params: {
                      bloodGroup: user?.bloodGroup,
                      medicalConditions: user?.medicalConditions,
                      allergies: user?.allergies,
                      hospital: user?.hospital,
                    },
                  })
                }
                className="flex-row items-center justify-between p-4"
              >
                <View className="flex-row items-center">
                  <View className="w-9 h-9 bg-slate-800 rounded-xl items-center justify-center">
                    <Heart color="#94a3b8" size={18} />
                  </View>
                  <Text className="text-white font-semibold ml-4">
                    Medical & Safety Info
                  </Text>
                </View>
                <ChevronRight color="#475569" size={18} />
              </TouchableOpacity>

              {/* ➔ साइनअपको मेडिकल विवरण यहाँ भिजुअल रूपमा देखिनेछ */}
              <View className="bg-[#0f172a]/40 mx-4 mb-4 p-3 rounded-xl space-y-1.5 border border-white/5">
                <View className="flex-row justify-between">
                  <Text className="text-gray-400 text-xs">
                    Medical Conditions:
                  </Text>
                  <Text className="text-white text-xs font-medium">
                    {user?.medicalConditions || "None"}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-400 text-xs">Allergies:</Text>
                  <Text className="text-white text-xs font-medium">
                    {user?.allergies || "None"}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-400 text-xs">
                    Preferred Hospital:
                  </Text>
                  <Text className="text-white text-xs font-medium">
                    {user?.hospital || "Not Provided"}
                  </Text>
                </View>
              </View>
            </View>

            {/* ३. PRIVACY & PERMISSIONS SECTION */}
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/privacy-permissions" as any,
                  params: {
                    permissions: JSON.stringify(user?.permissions || {}),
                  },
                })
              }
              className="flex-row items-center justify-between p-4"
            >
              <View className="flex-row items-center">
                <View className="w-9 h-9 bg-slate-800 rounded-xl items-center justify-center">
                  <Shield color="#94a3b8" size={18} />
                </View>
                <Text className="text-white font-semibold ml-4">
                  Privacy & Permissions
                </Text>
              </View>
              <ChevronRight color="#475569" size={18} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ४. LOGOUT BUTTON */}
        <TouchableOpacity
          onPress={handleLogout}
          className="w-full bg-[#1e293b] border border-red-900/20 p-4 rounded-2xl flex-row justify-center items-center mt-4"
        >
          <LogOut color="#ef4444" size={18} />
          <Text className="text-red-500 font-bold text-base ml-2">
            Log Out From SafeExit
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
export default ProfileScreen;

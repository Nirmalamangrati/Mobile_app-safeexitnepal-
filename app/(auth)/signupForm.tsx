import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  Switch,
} from "react-native";

import { useRouter } from "expo-router";

import {
  User,
  Mail,
  Lock,
  Phone,
  Calendar,
  Shield,
  Trash2,
  ArrowRight,
  ArrowLeft,
} from "lucide-react-native";

const BASE_URL = "https://safeexitnepal-backend-2.onrender.com";

type PermissionKey =
  | "location"
  | "notifications"
  | "sms"
  | "phone"
  | "background";

const SafeExitSignup = () => {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(true);

  // Emergency Contact Input
  const [newContactName, setNewContactName] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [newContactRelationship, setNewContactRelationship] = useState("");
  // Main Form Data
  const [formData, setFormData] = useState({
    fcmToken: "",
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "Male",
    dob: "",

    emergencyContacts: [] as {
      name: string;
      relationship: string;
      phone: string;
      primary: boolean;
    }[],

    safetyInfo: {
      bloodGroup: "",
      medicalConditions: "",
      allergies: "",
      address: "",
      hospital: "",
    },

    permissions: {
      location: true,
      notifications: true,
      sms: true,
      phone: true,
      background: true,
    },

    agreed: false,
  });

  // Toggle Permission
  const togglePermission = (key: PermissionKey) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [key]: !prev.permissions[key],
      },
    }));
  };
  // safetyInfo
  const handleSafetyInfoChange = (
    field: keyof typeof formData.safetyInfo,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      safetyInfo: {
        ...prev.safetyInfo,
        [field]: value,
      },
    }));
  };
  // Add Contact
  const handleAddContact = () => {
    if (
      !newContactName.trim() ||
      !newContactPhone.trim() ||
      !newContactRelationship.trim()
    ) {
      return Alert.alert(
        "Error",
        "Please enter name, phone number and relationship.",
      );
    }

    const newContact = {
      name: newContactName.trim(),
      relationship: newContactRelationship.trim(),
      phone: newContactPhone.trim(),
      primary: formData.emergencyContacts.length === 0,
    };

    setFormData((prev) => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, newContact],
    }));

    setNewContactName("");
    setNewContactPhone("");
    setNewContactRelationship("");
  };

  // Remove Contact
  const handleRemoveContact = (index: number) => {
    const filtered = formData.emergencyContacts.filter(
      (_, idx) => idx !== index,
    );

    setFormData((prev) => ({
      ...prev,
      emergencyContacts: filtered,
    }));
  };

  // Next Step
  const handleNext = () => {
    // STEP 1 VALIDATION
    if (step === 1) {
      if (
        !formData.fullName.trim() ||
        !formData.phone.trim() ||
        !formData.email.trim() ||
        !formData.password.trim()
      ) {
        return Alert.alert(
          "Required Fields",
          "Please fill all required fields.",
        );
      }

      if (formData.password !== formData.confirmPassword) {
        return Alert.alert(
          "Password Error",
          "Password and Confirm Password do not match.",
        );
      }
    }

    // STEP 2 VALIDATION
    if (step === 2) {
      if (formData.emergencyContacts.length < 2) {
        return Alert.alert(
          "Emergency Contacts",
          "Please add at least 2 emergency contacts.",
        );
      }
    }

    setStep((prev) => prev + 1);
  };

  // Back Step
  const handleBack = () => {
    setStep((prev) => (prev > 1 ? prev - 1 : prev));
  };

  // Submit Signup
  const handleSignupSubmit = async () => {
    if (!formData.agreed) {
      return Alert.alert(
        "Terms & Conditions",
        "Please agree to the Terms & Conditions.",
      );
    }

    try {
      const response = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsModalVisible(false);

        Alert.alert("Success ", "Account created successfully!", [
          {
            text: "OK",
            onPress: () => router.push("/(auth)/loginForm"),
          },
        ]);
      } else {
        Alert.alert("Signup Failed", data.error || "Something went wrong.");
      }
    } catch (error) {
      Alert.alert("Connection Error", "Unable to connect to the server.");
    }
  };

  return (
    <View className="flex-1 bg-white">
      <Modal visible={isModalVisible} animationType="slide">
        <ScrollView
          className="flex-1 bg-white"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* HEADER */}
          <View className="items-center pt-14 pb-5 bg-gray-50 border-b border-gray-100">
            <Text className="text-2xl font-black text-red-700">
              SafeExit Nepal
            </Text>

            <Text className="text-[11px] text-gray-400 mt-1 tracking-widest uppercase">
              Stay Safe. Stay Connected.
            </Text>
          </View>

          {/* STEP BAR */}
          <View className="flex-row items-center justify-between px-8 py-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <View
                key={i}
                className="flex-row items-center flex-1 last:flex-none"
              >
                <View
                  className={`w-7 h-7 rounded-full items-center justify-center ${
                    step >= i ? "bg-red-700" : "bg-gray-200"
                  }`}
                >
                  <Text
                    className={`text-xs font-bold ${
                      step >= i ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {i}
                  </Text>
                </View>

                {i < 5 && (
                  <View
                    className={`flex-1 h-[2px] mx-2 ${
                      step > i ? "bg-red-700" : "bg-gray-200"
                    }`}
                  />
                )}
              </View>
            ))}
          </View>

          <View className="px-6">
            {/* STEP 1 */}
            {step === 1 && (
              <View>
                <Text className="text-2xl font-bold text-center text-gray-900">
                  Create Account
                </Text>

                <Text className="text-center text-gray-400 text-xs mt-1 mb-7">
                  Enter your personal information.
                </Text>

                {/* NAME */}
                <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 mb-3">
                  <User size={18} color="#94a3b8" />

                  <TextInput
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChangeText={(t) =>
                      setFormData((prev) => ({
                        ...prev,
                        fullName: t,
                      }))
                    }
                    className="flex-1 ml-3 text-sm text-gray-800"
                  />
                </View>

                {/* PHONE */}
                <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 mb-3">
                  <Phone size={18} color="#94a3b8" />

                  <Text className="text-gray-400 text-sm ml-3 border-r border-gray-200 pr-2">
                    +977
                  </Text>

                  <TextInput
                    placeholder="Phone Number"
                    keyboardType="phone-pad"
                    value={formData.phone}
                    onChangeText={(t) =>
                      setFormData((prev) => ({
                        ...prev,
                        phone: t,
                      }))
                    }
                    className="flex-1 ml-2 text-sm text-gray-800"
                  />
                </View>

                {/* EMAIL */}
                <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 mb-3">
                  <Mail size={18} color="#94a3b8" />

                  <TextInput
                    placeholder="Email Address"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={formData.email}
                    onChangeText={(t) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: t,
                      }))
                    }
                    className="flex-1 ml-3 text-sm text-gray-800"
                  />
                </View>

                {/* PASSWORD */}
                <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 mb-3">
                  <Lock size={18} color="#94a3b8" />

                  <TextInput
                    placeholder="Password"
                    secureTextEntry
                    value={formData.password}
                    onChangeText={(t) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: t,
                      }))
                    }
                    className="flex-1 ml-3 text-sm text-gray-800"
                  />
                </View>

                {/* CONFIRM PASSWORD */}
                <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 mb-5">
                  <Lock size={18} color="#94a3b8" />

                  <TextInput
                    placeholder="Confirm Password"
                    secureTextEntry
                    value={formData.confirmPassword}
                    onChangeText={(t) =>
                      setFormData((prev) => ({
                        ...prev,
                        confirmPassword: t,
                      }))
                    }
                    className="flex-1 ml-3 text-sm text-gray-800"
                  />
                </View>

                {/* GENDER */}
                <Text className="text-xs font-semibold text-gray-500 mb-2">
                  Gender
                </Text>

                <View className="flex-row justify-between mb-4">
                  {["Male", "Female", "Other"].map((g) => (
                    <TouchableOpacity
                      key={g}
                      onPress={() =>
                        setFormData((prev) => ({
                          ...prev,
                          gender: g,
                        }))
                      }
                      className={`flex-1 p-3 rounded-xl border items-center mx-1 ${
                        formData.gender === g
                          ? "bg-red-50 border-red-700"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <Text
                        className={`text-xs font-medium ${
                          formData.gender === g
                            ? "text-red-700"
                            : "text-gray-600"
                        }`}
                      >
                        {g}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* DOB */}
                <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 mb-8">
                  <Calendar size={18} color="#94a3b8" />

                  <TextInput
                    placeholder="YYYY-MM-DD"
                    value={formData.dob}
                    onChangeText={(t) =>
                      setFormData((prev) => ({
                        ...prev,
                        dob: t,
                      }))
                    }
                    className="flex-1 ml-3 text-sm text-gray-800"
                  />
                </View>

                <TouchableOpacity
                  onPress={handleNext}
                  className="bg-red-700 rounded-xl p-4 flex-row justify-center items-center"
                >
                  <Text className="text-white font-bold mr-2">Next</Text>

                  <ArrowRight size={16} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push("/(auth)/loginForm")}
                  className="bg-transparent py-3 flex-row justify-center items-center mt-2"
                >
                  <ArrowLeft size={16} color="#b91c1c" />
                  <Text className="text-[#b91c1c] font-bold ml-2 text-sm">
                    Back to login
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <View>
                <Text className="text-2xl font-bold text-gray-900">
                  Emergency Contacts
                </Text>

                <Text className="text-xs text-gray-400 mt-1 mb-5">
                  Add people who will receive SOS alerts.
                </Text>

                {/* ADD CONTACT */}
                <View className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
                  <TextInput
                    placeholder="Contact Name"
                    value={newContactName}
                    onChangeText={setNewContactName}
                    className="border-b border-gray-200 py-2 mb-3 text-sm"
                  />
                  <TextInput
                    placeholder="Relationship (e.g. Mother, Friend, Brother)"
                    value={newContactRelationship}
                    onChangeText={setNewContactRelationship}
                    className="border-b border-gray-200 py-2 mb-3 text-sm"
                  />
                  <TextInput
                    placeholder="Phone Number"
                    keyboardType="phone-pad"
                    value={newContactPhone}
                    onChangeText={setNewContactPhone}
                    className="border-b border-gray-200 py-2 mb-4 text-sm"
                  />

                  <TouchableOpacity
                    onPress={handleAddContact}
                    className="bg-blue-600 rounded-lg p-3 items-center"
                  >
                    <Text className="text-white font-bold text-xs">
                      Add Contact
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* CONTACT LIST */}
                {formData.emergencyContacts.map((item, idx) => (
                  <View
                    key={idx}
                    className="flex-row items-center bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-3"
                  >
                    <View className="flex-1">
                      <Text className="font-bold text-gray-800 text-sm">
                        {item.name}
                      </Text>

                      <Text className="text-gray-500 text-xs mt-1">
                        {item.phone}
                      </Text>
                    </View>

                    <TouchableOpacity onPress={() => handleRemoveContact(idx)}>
                      <Trash2 size={18} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                ))}

                <View className="bg-red-50 border border-red-100 rounded-xl p-3 flex-row items-start mt-4 mb-8">
                  <Shield size={16} color="#b91c1c" />

                  <Text className="text-[11px] text-gray-500 ml-2 flex-1">
                    Add at least 2 emergency contacts.
                  </Text>
                </View>

                <View className="flex-row justify-between">
                  <TouchableOpacity
                    onPress={handleBack}
                    className="w-[47%] border border-gray-200 rounded-xl p-4 flex-row justify-center items-center"
                  >
                    <ArrowLeft size={16} color="#475569" />

                    <Text className="ml-2 font-bold text-gray-600">Back</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleNext}
                    className="w-[47%] bg-red-700 rounded-xl p-4 flex-row justify-center items-center"
                  >
                    <Text className="text-white font-bold mr-2">Next</Text>

                    <ArrowRight size={16} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <View>
                <Text className="text-2xl font-bold text-center text-gray-900">
                  Safety Information
                </Text>

                <Text className="text-center text-gray-400 text-xs mt-1 mb-6">
                  Optional medical and safety information.
                </Text>

                {[
                  {
                    placeholder: "Blood Group",
                    key: "bloodGroup",
                  },
                  {
                    placeholder: "Medical Conditions",
                    key: "medicalConditions",
                  },
                  {
                    placeholder: "Allergies",
                    key: "allergies",
                  },
                  {
                    placeholder: "Home Address",
                    key: "address",
                  },
                  {
                    placeholder: "Preferred Hospital",
                    key: "hospital",
                  },
                ].map((item, idx) => (
                  <TextInput
                    key={idx}
                    placeholder={item.placeholder}
                    value={
                      formData.safetyInfo[
                        item.key as keyof typeof formData.safetyInfo
                      ]
                    }
                    onChangeText={(text) =>
                      handleSafetyInfoChange(
                        item.key as keyof typeof formData.safetyInfo,
                        text,
                      )
                    }
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 mb-3 text-sm"
                  />
                ))}

                <View className="bg-red-50 border border-red-100 rounded-xl p-3 flex-row items-start mb-8">
                  <Shield size={16} color="#b91c1c" />

                  <Text className="text-[11px] text-gray-500 ml-2 flex-1">
                    This information remains private and secure.
                  </Text>
                </View>

                <View className="flex-row justify-between">
                  <TouchableOpacity
                    onPress={handleBack}
                    className="w-[47%] border border-gray-200 rounded-xl p-4 flex-row justify-center items-center"
                  >
                    <ArrowLeft size={16} color="#475569" />

                    <Text className="ml-2 font-bold text-gray-600">Back</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleNext}
                    className="w-[47%] bg-red-700 rounded-xl p-4 flex-row justify-center items-center"
                  >
                    <Text className="text-white font-bold mr-2">Next</Text>

                    <ArrowRight size={16} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <View>
                <Text className="text-2xl font-bold text-gray-900">
                  Permissions
                </Text>

                <Text className="text-xs text-gray-400 mt-1 mb-6">
                  Enable permissions for better safety.
                </Text>

                {(Object.keys(formData.permissions) as PermissionKey[]).map(
                  (perm) => (
                    <View
                      key={perm}
                      className="flex-row justify-between items-center bg-gray-50 border border-gray-100 rounded-xl p-4 mb-3"
                    >
                      <View className="flex-1">
                        <Text className="font-bold text-gray-800 text-xs capitalize">
                          {perm} Access
                        </Text>

                        <Text className="text-[10px] text-gray-400 mt-1">
                          Required for safety features.
                        </Text>
                      </View>

                      <Switch
                        value={formData.permissions[perm]}
                        onValueChange={() => togglePermission(perm)}
                        trackColor={{
                          false: "#e2e8f0",
                          true: "#fecaca",
                        }}
                        thumbColor={
                          formData.permissions[perm] ? "#b91c1c" : "#94a3b8"
                        }
                      />
                    </View>
                  ),
                )}

                <View className="flex-row justify-between mt-8">
                  <TouchableOpacity
                    onPress={handleBack}
                    className="w-[47%] border border-gray-200 rounded-xl p-4 flex-row justify-center items-center"
                  >
                    <ArrowLeft size={16} color="#475569" />

                    <Text className="ml-2 font-bold text-gray-600">Back</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleNext}
                    className="w-[47%] bg-red-700 rounded-xl p-4 flex-row justify-center items-center"
                  >
                    <Text className="text-white font-bold mr-2">Review</Text>

                    <ArrowRight size={16} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* STEP 5 */}
            {step === 5 && (
              <View>
                <Text className="text-2xl font-bold text-gray-900 mb-5">
                  Review Information
                </Text>

                <View className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-4">
                  <Text className="text-red-700 font-bold text-xs mb-2">
                    Account Details
                  </Text>

                  <Text className="text-xs text-gray-700">
                    Name: {formData.fullName}
                  </Text>

                  <Text className="text-xs text-gray-700 mt-1">
                    Phone: {formData.phone}
                  </Text>

                  <Text className="text-xs text-gray-700 mt-1">
                    Email: {formData.email}
                  </Text>
                </View>

                <View className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-5">
                  <Text className="text-red-700 font-bold text-xs mb-2">
                    Emergency Contacts
                  </Text>

                  {formData.emergencyContacts.map((c, i) => (
                    <Text key={i} className="text-xs text-gray-600 mt-1">
                      • {c.name} ({c.phone})
                    </Text>
                  ))}
                </View>

                {/* TERMS */}
                <TouchableOpacity
                  onPress={() =>
                    setFormData((prev) => ({
                      ...prev,
                      agreed: !prev.agreed,
                    }))
                  }
                  className="flex-row items-center mb-6"
                >
                  <View
                    className={`w-4 h-4 rounded border items-center justify-center ${
                      formData.agreed
                        ? "bg-red-700 border-red-700"
                        : "border-gray-300"
                    }`}
                  >
                    {formData.agreed && (
                      <Text className="text-white text-[9px]">✓</Text>
                    )}
                  </View>

                  <Text className="text-[11px] text-gray-500 ml-2">
                    I agree to the Terms & Conditions
                  </Text>
                </TouchableOpacity>

                {/* SUBMIT */}
                <TouchableOpacity
                  onPress={handleSignupSubmit}
                  className="bg-red-700 rounded-xl p-4 items-center mb-3"
                >
                  <Text className="text-white font-bold text-base">
                    Create Account
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleBack}
                  className="items-center p-2"
                >
                  <Text className="text-xs text-gray-400 font-bold">Back</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
};

export default SafeExitSignup;

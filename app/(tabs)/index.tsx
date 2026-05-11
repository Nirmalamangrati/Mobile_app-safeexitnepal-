import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import { Shield, MapPin, X } from "lucide-react-native";
import { Ionicons } from "@expo/vector-icons";
export default function HomeScreen() {
  const [language, setLanguage] = useState("en");
  const [showReportForm, setShowReportForm] = useState(false);

  const [formData, setFormData] = useState({
    type: "fire",
    latitude: "27.7172",
    longitude: "85.3240",
    description: "Fire affected area",
  });
  const translations = {
    en: {
      title: "SafeExit Nepal",
      formTitle: "Report Incident",
      reportSubtitle: "Help your community stay safe",
      incidentType: "Incident Type",
      latitude: "Latitude",
      longitude: "Longitude",
      description: "Description",
      descriptionPlaceholder: "Describe the incident...",
      submitReport: "Submit Report",
      emergencySOS: "Emergency SOS",
      reportIncident: "Report Incident",
      location: "Enter your location",
      critical: "Critical",
      high: "High",
      medium: "Medium",
      low: "Low",
      activeHazards: "Active Hazards",
      hazardDesc: "Real-time disaster monitoring",
      findShelters: "Find Shelters",
      sheltersDesc: "Nearby safe locations",
      communitySafety: "Community Safety",
      communityDesc: "Crowdsourced reports",
      rescueTeams: "Rescue Teams",
      rescueDesc: "Emergency responders",
      offlineResources: "Offline Resources",
      offlineDesc: "Guides and maps",
    },
    ne: {
      title: "सेफ एग्जिट नेपाल",
      formTitle: "घटना रिपोर्ट गर्नुहोस्",
      reportSubtitle: "समुदायलाई सुरक्षित राख्न मद्दत गर्नुहोस्",
      incidentType: "घटनाको प्रकार",
      latitude: "अक्षांश",
      longitude: "देशान्तर",
      description: "विवरण",
      descriptionPlaceholder: "घटनाको विवरण लेख्नुहोस्...",
      submitReport: "रिपोर्ट पठाउनुहोस्",
      emergencySOS: "आपतकालीन SOS",
      reportIncident: "घटना रिपोर्ट गर्नुहोस्",
      location: "स्थान लेख्नुहोस्",
      critical: "गम्भीर",
      high: "उच्च",
      medium: "मध्यम",
      low: "कम",
      activeHazards: "सक्रिय जोखिमहरू",
      hazardDesc: "रियल-टाइम विपद् निगरानी",
      findShelters: "आश्रय खोज्नुहोस्",
      sheltersDesc: "नजिकका सुरक्षित स्थानहरू",
      communitySafety: "समुदाय सुरक्षा",
      communityDesc: "समुदायबाट प्राप्त रिपोर्टहरू",
      rescueTeams: "उद्धार टोली",
      rescueDesc: "आपतकालीन उद्धारकर्ता",
      offlineResources: "अफलाइन स्रोतहरू",
      offlineDesc: "गाइड र नक्साहरू",
    },
  };

  const t = translations[language];

  return (
    <ScrollView className="flex-1 bg-[#020617]">
      {/* HEADER */}
      <View className="bg-[#0f172a] px-4 pt-[50px] pb-5 border-b border-[#1e293b] flex-row justify-between items-center">
        <View className="flex-row items-center">
          <View className="w-9 h-9 rounded-full bg-blue-500 items-center justify-center mr-2">
            <Shield color="white" size={18} />
          </View>

          <Text className="text-white text-xl font-bold">{t.title}</Text>
        </View>

        <TouchableOpacity
          onPress={() => setLanguage(language === "en" ? "ne" : "en")}
          className="bg-[#1e293b] px-3 py-1.5 rounded-lg"
        >
          <Text className="text-white">
            {language === "en" ? "नेपाली" : "English"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* BODY */}
      <View className="p-4">
        {/* SOS */}
        <View className="items-center mb-6">
          <TouchableOpacity className="bg-red-600 px-8 py-4 rounded-full flex-row items-center">
            <Ionicons name="alert-circle" size={22} color="white" />
            <Text className="text-white text-lg font-bold ml-2">
              {t.emergencySOS}
            </Text>
          </TouchableOpacity>
        </View>

        {/* LOCATION */}
        <View className="bg-[#0f172a] flex-row items-center p-3 rounded-xl mb-6">
          <MapPin color="#60a5fa" size={20} />
          <TextInput
            placeholder={t.location}
            placeholderTextColor="#94a3b8"
            className="flex-1 text-white ml-2"
          />
        </View>

        {/* STATUS CARDS */}
        <View className="flex-row flex-wrap justify-between mb-6">
          {[
            {
              title: t.critical,
              color: "bg-red-600",
              colorIcon: "white",
            },
            { title: t.high, color: "bg-orange-500" },
            { title: t.medium, color: "bg-yellow-500" },
            { title: t.low, color: "bg-green-600" },
          ].map((item, i) => (
            <View
              key={i}
              className={`w-[48%] p-4 rounded-xl mb-3 ${item.color}`}
            >
              <Text className="text-white">{item.title}</Text>
              <Text className="text-white text-3xl font-bold mt-2">0</Text>
            </View>
          ))}
        </View>

        {/* ACTIVE HAZARDS */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-white text-xl font-bold">
              {t.activeHazards}
            </Text>
            <Text className="text-gray-400">{t.hazardDesc}</Text>
          </View>

          <View className="w-12 h-12 bg-blue-600 rounded-xl items-center justify-center">
            <Text className="text-white font-bold">AI</Text>
          </View>
        </View>

        {/* FEATURE CARDS */}
        {[
          { title: t.findShelters, desc: t.sheltersDesc },
          { title: t.communitySafety, desc: t.communityDesc },
          { title: t.rescueTeams, desc: t.rescueDesc },
          { title: t.offlineResources, desc: t.offlineDesc },
        ].map((item, i) => (
          <View
            key={i}
            className="bg-[#0f172a] p-4 rounded-xl mb-4 border border-[#1e293b]"
          >
            <Text className="text-white text-lg font-bold mb-1">
              {item.title}
            </Text>
            <Text className="text-gray-400">{item.desc}</Text>
          </View>
        ))}

        {/* REPORT BUTTON */}
        <TouchableOpacity
          onPress={() => setShowReportForm(true)}
          className="bg-blue-600 p-4 rounded-xl items-center mt-2 mb-10"
        >
          <Text className="text-white font-bold text-lg">
            {t.reportIncident}
          </Text>
        </TouchableOpacity>
      </View>

      {/* MODAL */}
      <Modal visible={showReportForm} animationType="slide">
        <View className="flex-1 bg-[#020617] p-5 pt-16">
          <Text className="text-white text-2xl font-bold mb-2">
            {t.formTitle}
          </Text>

          <Text className="text-gray-400 mb-6">{t.reportSubtitle}</Text>

          <TextInput
            placeholder="Type"
            placeholderTextColor="#64748b"
            className="bg-[#1e293b] text-white p-3 rounded-lg mb-3"
          />

          <TextInput
            placeholder="Latitude"
            placeholderTextColor="#64748b"
            className="bg-[#1e293b] text-white p-3 rounded-lg mb-3"
          />

          <TextInput
            placeholder="Longitude"
            placeholderTextColor="#64748b"
            className="bg-[#1e293b] text-white p-3 rounded-lg mb-3"
          />

          <TextInput
            placeholder={t.descriptionPlaceholder}
            placeholderTextColor="#64748b"
            multiline
            className="bg-[#1e293b] text-white p-3 rounded-lg h-28"
          />

          <TouchableOpacity className="bg-blue-600 p-4 rounded-xl mt-5 items-center">
            <Text className="text-white font-bold">{t.submitReport}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowReportForm(false)}
            className="mt-6 items-center"
          >
            <X color="white" size={28} />
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
}

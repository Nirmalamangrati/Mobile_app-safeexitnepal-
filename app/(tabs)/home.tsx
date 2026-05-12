import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import {
  Shield,
  MapPin,
  X,
  AlertTriangle,
  Target,
  Zap,
  ShieldCheck,
  Users,
  Download,
  Wrench,
  BarChart2,
  PlayCircle,
} from "lucide-react-native";
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
        <View className="items-center mb-4">
          <TouchableOpacity className="bg-red-600 px-8 py-4 rounded-full flex-row items-center">
            <Ionicons name="alert-circle" size={22} color="white" />
            <Text className="text-white text-lg font-bold ml-2">
              {t.emergencySOS}
            </Text>
          </TouchableOpacity>
        </View>

        {/* LOCATION */}
        <View className="bg-[#0f172a] flex-row items-center p-3 rounded-xl mb-4 h-12">
          <MapPin color="#60a5fa" size={20} />
          <TextInput
            placeholder={t.location}
            placeholderTextColor="#94a3b8"
            className="flex-1 text-white ml-2 h-10"
          />
        </View>

        {/* STATUS CARDS */}
        <View className="flex-row flex-wrap justify-between mb-0">
          {[
            { title: t.critical, color: "bg-red-600", icon: AlertTriangle },
            { title: t.high, color: "bg-orange-500", icon: Target },
            { title: t.medium, color: "bg-yellow-500", icon: Zap },
            { title: t.low, color: "bg-green-600", icon: ShieldCheck },
          ].map((item, i) => (
            <View
              key={i}
              className={`w-[48%] h-15 p-3 rounded-lg mb-3 flex-row justify-between items-center ${item.color}`}
            >
              <View>
                <Text className="text-white text-xs font-bold opacity-90">
                  {item.title}
                </Text>
                <Text className="text-white text-xl font-bold">0</Text>
              </View>
              <View className="opacity-30">
                <item.icon color="white" size={24} />
              </View>
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
        <View className="flex-row flex-wrap justify-between">
          {[
            {
              title: t.findShelters,
              desc: t.sheltersDesc,
              icon: MapPin,
              location: "Naya Bazaar Shelter",
              dist: "0.5 km",
            },
            {
              title: t.rescueTeams,
              desc: t.rescueDesc,
              icon: Users,
              location: "Pokhara City Hall",
              dist: "1.2 km",
            },
            { title: t.communitySafety, desc: t.communityDesc, icon: Shield },
            { title: "Offline Resources", isOffline: true },
          ].map((item, i) => {
            const IconComponent = item.icon;
            return (
              <View
                key={i}
                className="w-[48.5%] bg-[#1e293b]/50 rounded-2xl mb-4 border border-white/5 overflow-hidden"
              >
                <View className="p-3">
                  <View className="flex-row items-center mb-1">
                    {IconComponent && (
                      <IconComponent
                        size={14}
                        color={item.isOffline ? "#22c55e" : "#60a5fa"}
                      />
                    )}
                    <Text
                      className="text-white text-[11px] font-bold ml-2"
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                  </View>
                  <Text className="text-gray-400 text-[9px]" numberOfLines={1}>
                    {item.desc || "Important data cached."}
                  </Text>
                </View>
                <View className="px-2 pb-2">
                  {item.isOffline ? (
                    <View className="bg-[#0f172a]/60 p-2 rounded-xl">
                      <View className="flex-row flex-wrap justify-between">
                        {[
                          {
                            title: "Download maps",
                            icon: Download,
                            color: "#22c55e",
                          },
                          {
                            title: "Mesh networking tools",
                            icon: Wrench,
                            color: "#3b82f6",
                          },
                          {
                            title: "Emergency Procedures",
                            icon: BarChart2,
                            color: "#f59e0b",
                          },
                          {
                            title: "First Aid Guides",
                            icon: PlayCircle,
                            color: "#ef4444",
                          },
                        ].map((res, idx) => (
                          <View
                            key={idx}
                            className="w-[45%] items-center my-1.5"
                          >
                            <res.icon color={res.color} size={18} />
                            <Text className="text-white text-[8px] mt-1">
                              {res.title}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  ) : (
                    <View>
                      <View className="h-20 bg-gray-700 rounded-lg items-center justify-center">
                        <Text className="text-gray-500 text-[10px]">
                          Map View
                        </Text>
                      </View>
                      <View className="mt-2 h-8">
                        {item.location && (
                          <View className="flex-row justify-between items-center">
                            <Text
                              className="text-white text-[8px] flex-1"
                              numberOfLines={1}
                            >
                              📍 {item.location}
                            </Text>
                            <Text className="text-gray-400 text-[8px]">
                              ({item.dist})
                            </Text>
                          </View>
                        )}
                        <Text className="text-orange-400 text-[8px] font-medium mt-1">
                          Capacity: 70% Full
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>

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

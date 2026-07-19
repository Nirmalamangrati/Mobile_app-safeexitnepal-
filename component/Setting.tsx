import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Switch,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useTranslation } from "react-i18next";
import "./i18n";

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  animationType?: "none" | "slide" | "fade";
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  visible,
  onClose,
  animationType = "slide",
}) => {
  const { t, i18n } = useTranslation();
  const [currentView, setCurrentView] = useState<"menu" | "lang" | "pass">(
    "menu",
  );
  const selectedLang = i18n.language;
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  const handleClose = () => {
    setCurrentView("menu");
    onClose();
  };
  const changeLanguage = (lang: "en" | "ne") => {
    i18n.changeLanguage(lang);
  };
  return (
    <Modal
      animationType={animationType}
      transparent={false}
      visible={visible}
      onRequestClose={handleClose}
      statusBarTranslucent={true}
    >
      <View className="flex-1 w-full h-full bg-[#0B1528] p-6 pt-14">
        <View className="flex-row justify-between items-center mb-6  pb-4">
          <View className="flex-row items-center gap-3">
            {currentView !== "menu" && (
              <TouchableOpacity
                onPress={() => setCurrentView("menu")}
                className="p-2 bg-slate-800/50 rounded-full"
              >
                <MaterialIcons name="arrow-back" size={18} color="#94A3B8" />
              </TouchableOpacity>
            )}
            <Text className="text-white text-xl font-bold tracking-tight">
              {currentView === "menu" && t("Settings")}
              {currentView === "lang" && t("langSelection")}
              {currentView === "pass" && t("changePassword")}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleClose}
            className="p-2 bg-slate-800/40 rounded-full"
          >
            <MaterialIcons name="close" size={20} color="#94A3B8" />
          </TouchableOpacity>
        </View>
        {currentView === "menu" && (
          <View className="w-full">
            {/* 1. offline mode*/}
            <View className="flex-row justify-between items-center bg-slate-800/20  p-5 rounded-2xl mb-4">
              <View className="flex-row items-center">
                <View className="p-2 bg-sky-500/10 rounded-xl mr-3">
                  <MaterialIcons name="wifi-off" size={20} color="#38BDF8" />
                </View>
                <Text className="text-slate-200 text-base font-semibold">
                  {t("Offlinemode")}
                </Text>
              </View>
              <Switch
                trackColor={{ false: "#334155", true: "#651d03" }}
                thumbColor={isOfflineMode ? "#651d03" : "#cbd5e1"}
                ios_backgroundColor="#334155"
                onValueChange={() => setIsOfflineMode(!isOfflineMode)}
                value={isOfflineMode}
              />
            </View>
            {/* 2. language change*/}
            <TouchableOpacity
              className="flex-row justify-between items-center bg-slate-800/20  p-5 rounded-2xl"
              onPress={() => setCurrentView("lang")}
            >
              <View className="flex-row items-center">
                <View className="p-2 bg-emerald-500/10 rounded-xl mr-3">
                  <MaterialIcons name="language" size={20} color="#34D399" />
                </View>
                <Text className="text-slate-200 text-base font-semibold">
                  {t("changeLangBtn")}
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#475569" />
            </TouchableOpacity>
            {/* 3. password change */}
            <TouchableOpacity
              className="flex-row justify-between items-center bg-slate-800/20  p-5 rounded-2xl mt-4"
              onPress={() => setCurrentView("pass")}
            >
              <View className="flex-row items-center">
                <View className="p-2 bg-amber-500/10 rounded-xl mr-3">
                  <MaterialIcons name="lock" size={20} color="#F59E0B" />
                </View>
                <Text className="text-slate-200 text-base font-semibold">
                  {t("changePassword")}
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#475569" />
            </TouchableOpacity>
          </View>
        )}
        {/* Language Selection */}
        {currentView === "lang" && (
          <View className="w-full">
            <TouchableOpacity
              className={`flex-row justify-between items-center p-5 rounded-2xl border ${
                selectedLang === "en"
                  ? "bg-sky-500/10 border-sky-500"
                  : "bg-slate-800/20 border-slate-800/40"
              }`}
              onPress={() => changeLanguage("en")}
            >
              <Text
                className={`text-base font-semibold ${selectedLang === "en" ? "text-sky-400" : "text-slate-400"}`}
              >
                {t("english")}
              </Text>
              {selectedLang === "en" && (
                <MaterialIcons name="check-circle" size={20} color="#38BDF8" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-row justify-between items-center p-5 rounded-2xl border mt-4 ${
                selectedLang === "ne"
                  ? "bg-sky-500/10 border-sky-500"
                  : "bg-slate-800/20 border-slate-800/40"
              }`}
              onPress={() => changeLanguage("ne")}
            >
              <Text
                className={`text-base font-semibold ${selectedLang === "ne" ? "text-sky-400" : "text-slate-400"}`}
              >
                {t("nepali")}
              </Text>
              {selectedLang === "ne" && (
                <MaterialIcons name="check-circle" size={20} color="#38BDF8" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-sky-500 p-4 rounded-2xl items-center mt-8 shadow-lg shadow-sky-500/20 active:opacity-90"
              onPress={() => setCurrentView("menu")}
            >
              <Text className="text-white text-base font-bold tracking-wide">
                {t("saveLang")}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {/* password change view*/}
        {currentView === "pass" && (
          <View className="w-full">
            <View>
              <Text className="text-slate-400 text-sm font-semibold mb-2 pl-1">
                {t("currentPassword")}
              </Text>
              <TextInput
                secureTextEntry
                placeholder={t("enterCurrentPass")}
                placeholderTextColor="#475569"
                value={oldPassword}
                onChangeText={setOldPassword}
                className="bg-slate-950 text-slate-200 p-4 rounded-2xl text-base font-medium"
              />
            </View>
            <View className="mt-5">
              <Text className="text-slate-400 text-sm font-semibold mb-2 pl-1">
                {t("newPassword")}
              </Text>
              <TextInput
                secureTextEntry
                placeholder={t("enterNewPass")}
                placeholderTextColor="#475569"
                value={newPassword}
                onChangeText={setNewPassword}
                className="bg-slate-950 text-slate-200 p-4 rounded-2xl text-base font-medium"
              />
            </View>
            <TouchableOpacity
              className="bg-rose-500 p-4 rounded-2xl items-center mt-8 shadow-lg shadow-rose-500/20 active:opacity-90"
              onPress={() => setCurrentView("menu")}
            >
              <Text className="text-white text-base font-bold tracking-wide">
                {t("updatePass")}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};
export default SettingsModal;

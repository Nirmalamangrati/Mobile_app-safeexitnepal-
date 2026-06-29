import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as Location from "expo-location";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
export default function ReportIncident(): React.JSX.Element {
  // Section 1 States: Incident Details
  const [incidentType, setIncidentType] = useState<string>("");
  const [incidentDate, setIncidentDate] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  // Section 2 States: Suspect Information
  const [suspectName, setSuspectName] = useState<string>("");
  const [suspectAge, setSuspectAge] = useState<string>("");
  const [suspectGender, setSuspectGender] = useState<string>("");
  const [suspectContact, setSuspectContact] = useState<string>("");

  // Section 3 States: Reporter Details
  const [reporterName, setReporterName] = useState<string>("");
  const [reporterContact, setReporterContact] = useState<string>("");
  const [hideReporterIdentity, setHideReporterIdentity] =
    useState<boolean>(false);

  // Location and Category States
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [incidentCategory, setIncidentCategory] = useState("");
  const [locLoading, setLocLoading] = useState<boolean>(false);

  // Section 5 States: Attached Files
  const [attachedFile, setAttachedFile] =
    useState<DocumentPicker.DocumentPickerAsset | null>(null);
  // Section 6 States: Terms and Declaration
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  useEffect(() => {
    async function getLiveLocation() {
      setLocLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "GPS coordinates are required to report an incident.",
        );
        setLocLoading(false);
        return;
      }
      let currentLoc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLatitude(currentLoc.coords.latitude);
      setLongitude(currentLoc.coords.longitude);
      setLocLoading(false);
    }
    getLiveLocation();
  }, []);

  //  Gallery kholera Multi-format files pick garne function:
  const handlePickFile = async (): Promise<void> => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert("Permission required");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 1,
      });

      if (!result.canceled) {
        const file = result.assets[0];

        setAttachedFile({
          uri: file.uri,
          name: file.fileName || "upload.jpg",
          mimeType: file.mimeType || "image/jpeg",
          size: file.fileSize || 0,
        } as any);
      }
    } catch (error) {
      Alert.alert("Error", "Could not open gallery");
    }
  };
  //  Form Text Inputs + Multipart File Attachment
  const handleSubmit = async (): Promise<void> => {
    if (
      !incidentCategory ||
      !incidentType ||
      !incidentDate ||
      !location ||
      !description ||
      !reporterName ||
      !reporterContact
    ) {
      Alert.alert(
        "Mandatory Fields",
        "Please fill all mandatory fields marked with (*)",
      );
      return;
    }

    if (!latitude || !longitude) {
      Alert.alert(
        "Location Error",
        "GPS Location not linked yet. Please wait for coordinates to load.",
      );
      return;
    }
    if (!agreeTerms) {
      Alert.alert(
        "Declaration Statement",
        "You must agree to the declaration statement before submitting.",
      );
      return;
    }
    setSubmitting(true);
    const formData = new FormData();
    // Text details append parameters map:
    formData.append("incidentCategory", incidentCategory);
    formData.append("incidentType", incidentType);
    formData.append("incidentDate", incidentDate);
    formData.append("locationName", location);
    formData.append("latitude", latitude.toString());
    formData.append("longitude", longitude.toString());
    formData.append("description", description);
    formData.append(
      "suspectInfo",
      JSON.stringify({
        name: suspectName,
        age: suspectAge,
        gender: suspectGender,
        contact: suspectContact,
      }),
    );
    formData.append(
      "reporterInfo",
      JSON.stringify({
        yourName: reporterName,
        contact: reporterContact,
        isAnonymous: hideReporterIdentity,
      }),
    );

    //  File append processing
    if (attachedFile) {
      formData.append("file", {
        uri: attachedFile.uri,
        name: attachedFile.name,
        type: attachedFile.mimeType || "application/octet-stream",
      } as any);
    }
    try {
      console.log("➔ [FRONTEND DISPATCH] Submitting Form with File data...");
      const response = await fetch("http://192.168.43.132:8000/api/incidents", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const result = await response.json();
      if (response.ok) {
        Alert.alert(
          "Success",
          "Incident Report Sent to Server! Admin will review it shortly.",
        );
        // Clear subfields states parameters configuration loop:
        setIncidentCategory("");
        setIncidentType("");
        setIncidentDate("");
        setLocation("");
        setDescription("");
        setSuspectName("");
        setSuspectAge("");
        setSuspectGender("");
        setSuspectContact("");
        setAttachedFile(null);
        setAgreeTerms(false);
      } else {
        Alert.alert(
          "Submission Failed",
          result.error || "Server error occurred.",
        );
      }
    } catch (error) {
      console.error("Form Post Error:", error);
      Alert.alert(
        "Network Error",
        "Cannot connect to the backend server. Make sure your server is running.",
      );
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* HEADER SECTION */}
      <View style={styles.header}>
        <View>
          <Text style={styles.logoText}>SafeExit Nepal</Text>
          <Text style={styles.tagline}>सुरक्षित यात्रा, सुरक्षित भविष्य</Text>
        </View>
        <View style={styles.helpBox}>
          <Text style={styles.helpText}>Need Help?</Text>
          <Text style={styles.helpSub}>Helpline: 9825716885</Text>
          <Text style={styles.helpSub}>Email: info@safeexitnepal.org</Text>
        </View>
      </View>
      <Text style={styles.pageTitle}>Report Incident</Text>
      {/* CONFIDENTIALITY NOTICE */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          ℹ️ Your information is confidential and used solely for safety
          improvements.
        </Text>
      </View>
      {locLoading && (
        <View className="flex-row items-center justify-center p-3 bg-red-950/30 border border-red-500/20 rounded-xl mb-4">
          <ActivityIndicator size="small" color="#b91c1c" />
          <Text className="text-gray-300 text-xs font-medium ml-2">
            Fetching live GPS coordinates... Please wait.
          </Text>
        </View>
      )}
      {/* SECTION 1: Incident Details */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}> 1. Incident Details</Text>
        </View>
        <Text style={styles.label}>Incident Category *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={incidentCategory}
            onValueChange={(itemValue: string) =>
              setIncidentCategory(itemValue)
            }
          >
            <Picker.Item label="Select Category" value="" />
            <Picker.Item
              label="🔴 Critical (Immediate Danger)"
              value="critical"
            />
            <Picker.Item label="🟠 High (Severe Threat)" value="high" />
            <Picker.Item label="🟡 Medium (Moderate Risk)" value="medium" />
            <Picker.Item label="🟢 Low (Minor Incident)" value="low" />
          </Picker>
        </View>

        <Text style={styles.label}>Incident Type *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={incidentType}
            onValueChange={(itemValue: string) => setIncidentType(itemValue)}
          >
            <Picker.Item label="Select Option" value="" />
            <Picker.Item label="Fire" value="fire" />
            <Picker.Item label="Landslide" value="landslide" />
            <Picker.Item label="Flood" value="flood" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>
        <Text style={styles.label}>Date & Time of Incident *</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD HH:MM"
          value={incidentDate}
          onChangeText={setIncidentDate}
        />
        <Text style={styles.label}>Location of Incident *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter location detail"
          value={location}
          onChangeText={setLocation}
        />
        <Text style={styles.label}>Detailed Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe the incident in detail..."
          multiline={true}
          numberOfLines={4}
          maxLength={1000}
          value={description}
          onChangeText={setDescription}
        />
        <Text style={styles.charCount}>{description.length}/1000</Text>
      </View>

      {/* SECTION 2: Suspect Details */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>👤 2. Suspect Information</Text>
        </View>
        <Text style={styles.label}>Name (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter suspect name"
          value={suspectName}
          onChangeText={setSuspectName}
        />
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.label}>Estimated Age</Text>
            <TextInput
              style={styles.input}
              placeholder="Age"
              keyboardType="numeric"
              value={suspectAge}
              onChangeText={setSuspectAge}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={suspectGender}
                onValueChange={(v: string) => setSuspectGender(v)}
              >
                <Picker.Item label="Select" value="" />
                <Picker.Item label="Female" value="female" />
                <Picker.Item label="Male" value="male" />
              </Picker>
            </View>
          </View>
        </View>

        <Text style={styles.label}>Contact Number (If known)</Text>
        <TextInput
          style={styles.input}
          placeholder="98xxxxxxxx"
          keyboardType="phone-pad"
          value={suspectContact}
          onChangeText={setSuspectContact}
        />
      </View>

      {/* SECTION 3: Reporter Details */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>👤 3. Reporter Information</Text>
        </View>

        <Text style={styles.label}>Your Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          value={reporterName}
          onChangeText={setReporterName}
        />

        <Text style={styles.label}>Contact Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="98xxxxxxxx"
          keyboardType="phone-pad"
          value={reporterContact}
          onChangeText={setReporterContact}
        />

        <View style={styles.toggleRow}>
          <Text style={styles.label}>Keep my identity anonymous</Text>
          <Switch
            value={hideReporterIdentity}
            onValueChange={setHideReporterIdentity}
          />
        </View>
      </View>

      {/* SECTION 5: File Attachment Box */}
      <View className="p-4 bg-slate-800 rounded-xl mb-4 w-full">
        <View className="mb-3">
          <Text className="text-white text-base font-bold">
            Attached Files (Optional)
          </Text>
        </View>
        {/* ONPRESS HANDLER TRIGGER STRICKLY BINDED OUTSIDE NESTED OVERRIDES FOR SAFE HARDWARE CONTROL CLICK EVENT */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handlePickFile}
          className="border border-dashed border-blue-500 rounded-xl p-6 items-center bg-slate-900 mt-2 w-full justify-center"
        >
          <Text className="text-3xl mb-2">📤</Text>
          <Text className="text-blue-500 font-semibold text-center text-sm">
            {attachedFile ? attachedFile.name : "Choose file or drag here"}
          </Text>
          <Text
            className={`text-xs mt-1 text-center ${attachedFile ? "text-green-500" : "text-gray-400"}`}
          >
            {attachedFile
              ? `Selected Size: ${(attachedFile.size! / (1024 * 1024)).toFixed(2)} MB (Click to swap)`
              : "(JPG, PNG, MP4, PDF | Max Size 10MB)"}
          </Text>
        </TouchableOpacity>
        {/* VISUAL LAYOUT PREVIEW STRINGS BLOCK INTERFACE RUN DISPLAY SECTION CHECK */}
        {attachedFile && attachedFile.mimeType?.startsWith("image/") && (
          <View className="items-center mt-3 w-full justify-center">
            <Image
              source={{ uri: attachedFile.uri }}
              className="w-28 h-28 rounded-xl"
            />
          </View>
        )}
      </View>
      {/* SECTION 6: Declaration Box */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🛡️ 6. Declaration</Text>
        </View>
        <View style={styles.toggleRow}>
          <Text style={styles.declarationText}>
            I hereby declare that the information provided above is true and
            accurate to the best of my knowledge.
          </Text>
          <Switch value={agreeTerms} onValueChange={setAgreeTerms} />
        </View>
      </View>

      {/* ACTION BUTTONS */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}> Submit Report</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => alert("Cancelled")}
      >
        <Text style={styles.cancelButtonText}>❌ Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
// STYLESHEET DESIGN
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6f9", padding: 15 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 5,
    borderLeftColor: "#0052cc",
  },
  logoText: { fontSize: 20, fontWeight: "bold", color: "#0052cc" },
  tagline: { fontSize: 12, color: "#555" },
  helpBox: {
    backgroundColor: "#002d72",
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  helpText: { color: "#fff", fontSize: 11, fontWeight: "bold" },
  helpSub: { color: "#fff", fontSize: 10 },
  pageTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  infoBox: {
    backgroundColor: "#e3f2fd",
    padding: 12,
    borderRadius: 6,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#90caf9",
  },
  infoText: { color: "#0d47a1", fontSize: 13 },
  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeader: {
    backgroundColor: "#002d72",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    marginTop: -15,
    marginLeft: -15,
    marginRight: -15,
  },
  sectionTitle: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    color: "#333",
  },
  textArea: { height: 80, textAlignVertical: "top" },
  charCount: { textAlign: "right", fontSize: 11, color: "#777", marginTop: 2 },
  pickerContainer: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    overflow: "hidden",
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },
  declarationText: { flex: 1, fontSize: 13, color: "#555", marginRight: 10 },
  uploadBox: {
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: "#0052cc",
    borderRadius: 8,
    backgroundColor: "#f0f4ff",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  uploadIcon: { fontSize: 30, marginBottom: 5 },
  uploadText: { fontSize: 14, fontWeight: "bold", color: "#0052cc" },
  uploadSub: { fontSize: 11, color: "#666", marginTop: 3 },
  submitButton: {
    backgroundColor: "#22c55e",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  cancelButton: {
    backgroundColor: "#ef4444",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

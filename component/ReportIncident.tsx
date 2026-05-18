import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function ReportIncident(): React.JSX.Element {
  // Section 1 States: Incident Details
  const [incidentType, setIncidentType] = useState<string>("");
  const [incidentDate, setIncidentDate] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  // Section 2 States: Suspect / Person of Interest Information
  const [suspectName, setSuspectName] = useState<string>("");
  const [suspectAge, setSuspectAge] = useState<string>("");
  const [suspectGender, setSuspectGender] = useState<string>("");
  const [suspectContact, setSuspectContact] = useState<string>("");

  // Section 3 States: Reporter Details
  const [reporterName, setReporterName] = useState<string>("");
  const [reporterContact, setReporterContact] = useState<string>("");
  const [hideReporterIdentity, setHideReporterIdentity] =
    useState<boolean>(false);

  // Section 6 States: Terms and Declaration
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);

  // Form submission handler
  const handleSubmit = (): void => {
    if (
      !incidentType ||
      !incidentDate ||
      !location ||
      !description ||
      !reporterName ||
      !reporterContact
    ) {
      alert("Please fill all mandatory fields marked with (*)");
      return;
    }
    if (!agreeTerms) {
      alert("You must agree to the declaration statement before submitting.");
      return;
    }

    // Process form data package
    const formData = {
      incidentType,
      incidentDate,
      location,
      description,
      suspect: {
        name: suspectName,
        age: suspectAge,
        gender: suspectGender,
        contact: suspectContact,
      },
      reporter: {
        name: reporterName,
        contact: reporterContact,
        isAnonymous: hideReporterIdentity,
      },
    };

    console.log("Submitting Form Data: ", formData);
    alert("Incident Report Submitted Successfully!");
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

      {/* SECTION 1: Incident Details */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>📄 1. Incident Details</Text>
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
        </View>
      </View>

      {/* SECTION 5: File Attachment Box */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            📁 5. Attached Files (Optional)
          </Text>
        </View>
        <TouchableOpacity style={styles.uploadBox}>
          <Text style={styles.uploadIcon}>📤</Text>
          <Text style={styles.uploadText}>Choose file or drag here</Text>
          <Text style={styles.uploadSub}>
            (JPG, PNG, MP4, PDF | Max Size 10MB)
          </Text>
        </TouchableOpacity>
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

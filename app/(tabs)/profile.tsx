import React, { useState } from "react";
import { View } from "react-native";
import LoginForm from "./login";
import SignupForm from "./signupForm";

export default function Profile() {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <View className="flex-1">
      {showSignup ? (
        <SignupForm onToggle={() => setShowSignup(false)} />
      ) : (
        <LoginForm onToggleSignup={() => setShowSignup(true)} />
      )}
    </View>
  );
}

import { Redirect } from "expo-router";
import React from "react";

const EntryPoint = () => {
  const isUserLoggedIn = false;

  if (isUserLoggedIn) {
    return <Redirect href={"/home" as any} />;
  } else {
    return <Redirect href={"/(auth)/login" as any} />;
  }
};

export default EntryPoint;

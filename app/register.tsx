import Button from "@/components/ui/button";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { Text, View } from "react-native";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import Toast from "react-native-toast-message";
import { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "@/config";
import {
  initialize,
  requestPermission,
  readRecords,
  aggregateRecord,
} from "react-native-health-connect";

export default function Index() {
  const registerOrSignWithGoogle = async (
    firebaseRes: FirebaseAuthTypes.UserCredential,
  ) => {
    try {
      const deviceId = await SecureStore.getItemAsync("device_id");
      console.log(deviceId, "deviceId");
      const postData = {
        firstName: firebaseRes?.additionalUserInfo?.profile?.given_name,
        lastName: firebaseRes?.additionalUserInfo?.profile?.family_name,
        email: firebaseRes.user.email,
        firebaseId: firebaseRes.user.uid,
        deviceId: deviceId,
      };

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Assuming you're sending JSON data
        },
        body: JSON.stringify(postData),
      };

      const res = await fetch(`${API_URL}/user`, requestOptions);

      if (!res.ok) {
        throw new Error("Failed to send request");
      }
      const data = await res.json();
      await SecureStore.setItemAsync("user_id", data?._id);
    } catch (e) {
      console.log(e);
    }
  };

  async function onGoogleButtonPress() {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      // Get the users ID token
      const { idToken } = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      const res: FirebaseAuthTypes.UserCredential =
        await auth().signInWithCredential(googleCredential);

      await registerOrSignWithGoogle(res);

      Toast.show({
        type: "success",
        text1: "Login Successful!",
        text2: "You're now logged in. Enjoy your session!.",
      });

      router.push("personal-details");
    } catch (e) {
      console.log(e);
      // Check if your device supports Google Play
      Toast.show({
        type: "error",
        text1: "Something went wrong",
        text2: "check if your device supports Google Play!",
      });
    }
  }

  const configGoogleSignIn = () => {
    GoogleSignin.configure({
      webClientId:
        "695891057484-e60c8i746asp0k2ajsutffjbk6qeqc7r.apps.googleusercontent.com",
    });
  };
  useEffect(() => {
    configGoogleSignIn(); // will execute everytime the component mounts
  }, []);

  return (
    <View
      style={{
        flex: 1,

        backgroundColor: "#000000",
        paddingTop: 100,
        alignItems: "center",
        paddingHorizontal: 16,
      }}
    >
      <Text
        style={{
          fontSize: 20,
          color: "#FFFFFF",
          fontFamily: "Poppins-Medium",
          marginBottom: 20,
        }}
      >
        Sign in to Safe Travel{" "}
      </Text>

      <Button
        onPress={() => {
          onGoogleButtonPress();
          // router.push("personal-details");
        }}
      >
        Continue with Google
      </Button>

      <Text
        style={{
          color: "#CCCCCC",
          fontSize: 14,
          fontFamily: "Poppins-Regular",
          marginTop: 20,
        }}
      >
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </Text>
    </View>
  );
}

import React, { useContext, useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
// import TitleHeader from "~/components/title-header";
// import Button from "~/components/ui/button";
// // import GoogleSignIcon from "../../assets/images/google-sgn.svg";
// import { router } from "expo-router";
// import { Colors } from "~/constants/Colors";
// import { NumberInputField } from "~/components/ui/input-field";
// import { z } from "zod";
// import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
// import Toast from "react-native-toast-message";
// import ConfirmFunctionContext from "~/lib/confirm-function-context";
// import { GoogleSignin } from "@react-native-google-signin/google-signin";
// import { API_URL } from "~/config";
// import * as SecureStore from "expo-secure-store";

export default function Register() {
  //   const [phoneNumber, setPhoneNumber] = useState("");
  //   const [invalidPhone, setInvalidPhone] = useState(false);
  //   const [loading, setLoading] = useState(false);

  //   const registerOrSignWithGoogle = async (
  //     firebaseRes: FirebaseAuthTypes.UserCredential
  //   ) => {
  //     try {
  //       const postData = {
  //         firstName: firebaseRes.additionalUserInfo.profile.given_name,
  //         lastName: firebaseRes.additionalUserInfo.profile.family_name,
  //         email: firebaseRes.user.email,
  //         firebaseId: firebaseRes.user.uid,
  //       };

  //       const requestOptions = {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json", // Assuming you're sending JSON data
  //         },
  //         body: JSON.stringify(postData),
  //       };

  //       const res = await fetch(`${API_URL}/user`, requestOptions);
  //       const data = await res.json();
  //       await SecureStore.setItemAsync("user_id", data?._id);
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   };

  //   const { updateConfirmFunction } = useContext(ConfirmFunctionContext);

  //   const phoneNumberSchema = z.string().regex(/^\+?[0-9]{10,}$/);
  //   const validatePhoneNumber = (phoneNumber) => {
  //     try {
  //       phoneNumberSchema.parse(phoneNumber);
  //       return true; // Phone number is valid
  //     } catch (error) {
  //       return false; // Phone number is invalid
  //     }
  //   };

  //   async function onGoogleButtonPress() {
  //     try {
  //       await GoogleSignin.hasPlayServices({
  //         showPlayServicesUpdateDialog: true,
  //       });
  //       // Get the users ID token
  //       const { idToken } = await GoogleSignin.signIn();

  //       // Create a Google credential with the token
  //       const googleCredential = auth.GoogleAuthProvider.credential(idToken);

  //       // Sign-in the user with the credential
  //       const res: FirebaseAuthTypes.UserCredential =
  //         await auth().signInWithCredential(googleCredential);

  //       console.log(res, "res");

  //       await registerOrSignWithGoogle(res);

  //       Toast.show({
  //         type: "success",
  //         text1: "Login Successful!",
  //         text2: "You're now logged in. Enjoy your session!.",
  //       });
  //     } catch (e) {
  //       // Check if your device supports Google Play
  //       Toast.show({
  //         type: "error",
  //         text1: "Something went wrong",
  //         text2: "check if your device supports Google Play!",
  //       });
  //     }
  //   }

  //   // Handle the button press
  //   async function signInWithPhoneNumber() {
  //     setLoading(true);
  //     const isValidPhoneNumber = validatePhoneNumber(phoneNumber);
  //     if (!isValidPhoneNumber) {
  //       setLoading(false);
  //       return setInvalidPhone(true);
  //     }
  //     setInvalidPhone(false);

  //     //TODO -  change country code later
  //     try {
  //       const confirmation = await auth().signInWithPhoneNumber(
  //         `+91${phoneNumber}`
  //       );
  //       updateConfirmFunction(confirmation);
  //       Toast.show({
  //         type: "success",
  //         text1: "OTP sent to your mobile!",
  //         text2: "Check your messages for the verification code.",
  //       });
  //       setLoading(false);
  //       router.push({
  //         pathname: "/auth/verify",
  //         params: {
  //           phoneNumber: phoneNumber,
  //         },
  //       });
  //     } catch (e) {
  //       Toast.show({
  //         type: "error",
  //         text1: "Something went wrong!",
  //         text2: "Please try again later.",
  //       });
  //       setLoading(false);
  //     }
  //   }

  //   const configGoogleSignIn = () => {
  //     GoogleSignin.configure({
  //       webClientId:
  //         "695891057484-e60c8i746asp0k2ajsutffjbk6qeqc7r.apps.googleusercontent.com",
  //     });
  //   };
  //   useEffect(() => {
  //     configGoogleSignIn(); // will execute everytime the component mounts
  //   }, []);

  return <View style={styles.container}></View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 75,
    paddingHorizontal: 20,
    backgroundColor: "red",
    // alignItems: "center",
  },
});

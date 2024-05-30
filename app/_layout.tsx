import "react-native-gesture-handler";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import Toast from "react-native-toast-message";
import auth from "@react-native-firebase/auth";
import * as SecureStore from "expo-secure-store";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    vibrationPattern: [0, 30000],
  }),
});

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.HIGH,
      lightColor: "#FF231F7C",
      sound: "alarm.wav",
      vibrationPattern: [0, 30000],
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = await Notifications.getExpoPushTokenAsync({
      //project id related issue
      projectId: Constants?.expoConfig?.extra?.eas.projectId,
    });
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token && token.data;
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    "Sansation-Bold": require("../assets/fonts/Sansation-Bold.ttf"),
    "Sansation-Light": require("../assets/fonts/Sansation-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
  });

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState<string>();

  const [expoPushToken, setExpoPushToken] = useState("");
  const notificationListener = useRef<Notifications.Subscription | undefined>();
  const responseListener = useRef<Notifications.Subscription | undefined>();

  // Handle user state changes
  async function onAuthStateChanged(user) {
    setUser(user);
    const userId = await SecureStore.getItemAsync("user_id");
    setUserId(userId ?? "");
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then(async (token) => {
      if (token) {
        console.log(token, "token");
        setExpoPushToken(token);
        await SecureStore.setItemAsync("device_id", token);
      }
    });
  }, []);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (user && !initializing && loaded && userId) {
      router.push("home");
    }
  }, [user, initializing, loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="register"
      >
        <Stack.Screen name="index" />

        <Stack.Screen name="register" />
        <Stack.Screen name="personal-details" />
        <Stack.Screen name="home" />

        <Stack.Screen name="notifications" />

        <Stack.Screen name="notification-detail" />
      </Stack>
      <Toast />
    </>
  );
}

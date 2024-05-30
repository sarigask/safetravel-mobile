import Button from "@/components/ui/button";
import InputQuery from "@/components/ui/input-field";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import TrackCard from "@/components/ui/track-card";
import Toast from "react-native-toast-message";
import { API_URL } from "@/config";
import * as SecureStore from "expo-secure-store";
import auth from "@react-native-firebase/auth";
import { useSlot } from "expo-router/build/views/Navigator";

export default function Index() {
  const { width, height } = useWindowDimensions();
  const [notifications, setNotifications] = useState([]);
  function metersToMiles(distanceInMeters) {
    const metersPerMile = 1609.34;
    const distanceInMiles = distanceInMeters / metersPerMile;

    if (distanceInMiles >= 1) {
      return `${distanceInMiles.toFixed(2)} miles`;
    } else {
      return `${distanceInMeters.toFixed(4)} meters`;
    }
  }
  const fetchNotifications = async () => {
    try {
      const idTokenResult = await auth()?.currentUser?.getIdTokenResult();
      const userId = await SecureStore.getItemAsync("user_id");
      const response = await fetch(
        `${API_URL}/tracking/help-requests/${userId}`,
        {
          headers: {
            "Content-Type": "application/json", // Assuming you're sending JSON data
            Authorization: `Bearer ${idTokenResult?.token}`, // Include access token in request headers
          },
        },
      );
      console.log(idTokenResult?.token);

      console.log(response, "response");

      // if (!response.ok) {
      //   throw new Error("Network response was not ok");
      // }
      const data = await response.json();
      setNotifications(data);
      console.log(data, "data");
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Something went wrong",
        text2: "check your network connection",
      });
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#000000",
        alignItems: "center",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          height: 80,
          justifyContent: "space-between",
          alignItems: "center", // Added alignItems here
          paddingHorizontal: 25,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
          style={{ alignItems: "flex-start" }}
        >
          <Ionicons name="arrow-back-outline" size={24} color="white" />
          {/* Item at the end */}
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: "center" }}>
          {/* Centered item */}
          <Text
            style={{
              fontSize: 20,
              color: "#FFFFFF",
              fontFamily: "Poppins-SemiBold",
            }}
          >
            Notifications
          </Text>
        </View>
      </View>
      <ScrollView
        style={{
          // flex: 1,
          flex: 1,

          backgroundColor: "#000000",
          // alignItems: "center",
        }}
        contentContainerStyle={{
          paddingBottom: 200,
          paddingHorizontal: 20,
          paddingTop: 40,
        }}
      >
        {notifications &&
          notifications.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                router.push({
                  pathname: "notification-detail",
                  params: { id: item?._id },
                });
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 13,
                  fontFamily: "Poppins-Regular",
                  marginBottom: 20,
                }}
              >
                {metersToMiles(item?.distance)} away from you, a user reported
                suspicious activity.
              </Text>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  description: {
    color: "#FFFFFF",
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    marginTop: 6,
    marginBottom: 65,
  },
  smallDescription: {
    fontSize: 11,
    marginBottom: 10,
  },

  cardContainer: {
    width: "100%",
    height: 130,
    borderRadius: 20,
    // marginTop: 65,
    backgroundColor: "#000000",
    borderWidth: 1,
    borderColor: "#FFFFFFFF",
    justifyContent: "center",
    alignItems: "center",

    marginBottom: 50,
  },
  card: {
    width: 56,
    height: 56,
    borderRadius: 56,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333333",
  },
  btnStyle: {
    width: "auto",
    height: 50,
    marginTop: 32,
    paddingHorizontal: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});

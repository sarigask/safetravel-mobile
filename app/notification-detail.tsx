import { router, useLocalSearchParams } from "expo-router";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Linking,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import TrackCard from "@/components/ui/track-card";
import { API_URL } from "@/config";
import * as SecureStore from "expo-secure-store";
import auth from "@react-native-firebase/auth";

export default function Index() {
  const params = useLocalSearchParams();
  console.log(params.id, "params");

  const trackUser = async () => {
    try {
      const idTokenResult = await auth()?.currentUser?.getIdTokenResult();
      const postData = {
        id: params.id,
      };
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Assuming you're sending JSON data
          Authorization: `Bearer ${idTokenResult?.token}`, // Include access token in request headers
        },
        body: JSON.stringify(postData),
      };

      const userId = await SecureStore.getItemAsync("user_id");
      const res = await fetch(
        `${API_URL}/tracking/track-help-request/${userId}`,
        requestOptions
      );

      console.log(res);
      const data = await res.json();
      console.log(data, "data");

      const scheme = Platform.select({
        ios: "maps://0,0?q=",
        android: "geo:0,0?q=",
      });
      const latLng = `${data?.lat},${data?.lng}`;
      const label = "Custom Label";
      const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`,
      });

      Linking.openURL(url);
      // console.log(data, "data");
    } catch (e) {
      console.log(e);
    }
  };

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

      <TrackCard onPress={trackUser} />
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

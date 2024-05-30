import Button from "@/components/ui/button";
import { router } from "expo-router";
import {
  TouchableOpacity,
  Image,
  Text,
  View,
  useWindowDimensions,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { API_URL } from "@/config";
import * as SecureStore from "expo-secure-store";
import auth from "@react-native-firebase/auth";
import Toast from "react-native-toast-message";
import RNShake from "react-native-shake";
import { Accelerometer } from "expo-sensors";
import {
  aggregateRecord,
  initialize,
  readRecords,
  requestPermission,
} from "react-native-health-connect";
import SwitchToggle from "react-native-switch-toggle";

export default function Index() {
  const { height } = useWindowDimensions();
  const [location, setLocation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<any>(null);
  const [syncOn, setSyncOn] = useState(false);
  const [result, setResult] = useState<any>();

  useEffect(() => {
    const fetchSecureValue = async () => {
      try {
        const value = await SecureStore.getItemAsync("syncOn");
        if (value == "true") {
          setSyncOn(true);
        } else {
          setSyncOn(false);
        }
      } catch (error) {
        console.log("Error fetching secure value:", error);
      }
    };

    fetchSecureValue();
  }, []);

  const readHealthData = async () => {
    await SecureStore.setItemAsync("syncOn", "true");
    try {
      // initialize the client
      const isInitialized = await initialize();

      // request permissions
      const grantedPermissions = await requestPermission([
        { accessType: "read", recordType: "BloodPressure" },
      ]);

      console.log(grantedPermissions, "grant persmisison");

      // check if granted
      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      console.log(yesterday, now);

      // const result = await readRecords("BloodPressure", {
      //   timeRangeFilter: {
      //     operator: "between",
      //     startTime: yesterday.toISOString(),
      //     endTime: "2024-05-29T06:23:11.141Z",
      //   },
      // });

      const aggregateSampleData = () => {
        aggregateRecord({
          recordType: "BloodPressure",
          timeRangeFilter: {
            operator: "between",
            startTime: yesterday.toISOString(),
            endTime: now.toISOString(),
          },
        }).then((result) => {
          console.log("Aggregated record: ", { result }); // Aggregated record:  {"result": {"dataOrigins": ["com.healthconnectexample"], "inCalories": 15000000, "inJoules": 62760000.00989097, "inKilocalories": 15000, "inKilojoules": 62760.00000989097}}
          setResult(result);
          const systolic = result.SYSTOLIC_AVG.inMillimetersOfMercury;
          const diastolic = result.DIASTOLIC_AVG.inMillimetersOfMercury;
          // console.log(systolic, diastolic, "lic");

          // Check if the blood pressure exceeds the threshold
          if (systolic > 130 || diastolic > 80) {
            console.log("send alert >>>>");
            // sendAlert(systolic, diastolic);
            sendHelpRequest();
          }
        });
      };

      aggregateSampleData();
    } catch (e) {
      console.log(e);
    }
  };

  const updateLocation = async () => {
    let locationNow = await Location.getCurrentPositionAsync({});
    try {
      const postData = {
        lat: locationNow?.coords?.latitude,
        lng: locationNow?.coords?.longitude,
      };

      const idTokenResult = await auth()?.currentUser?.getIdTokenResult();
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
        `${API_URL}/tracking/update-location/${userId}`,
        requestOptions
      );
      const data = await res.json();
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location?.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      updateLocation();
    })();
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  const sendHelpRequest = async () => {
    try {
      const postData = {
        lat: location?.coords?.latitude,
        lng: location?.coords?.longitude,
      };

      const idTokenResult = await auth()?.currentUser?.getIdTokenResult();
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Assuming you're sending JSON data
          Authorization: `Bearer ${idTokenResult?.token}`, // Include access token in request headers
        },
        body: JSON.stringify(postData),
      };

      const userId = await SecureStore.getItemAsync("user_id");
      console.log(userId, "user id");

      const res = await fetch(
        `${API_URL}/tracking/help-request/${userId}`,
        requestOptions
      );

      if (!res.ok) {
        throw new Error("Failed to send request");
      }

      console.log(res);

      const data = await res.json();

      Toast.show({
        type: "success",
        text1: "Sent Help Request Successfully.",
        text2: "You will get notification when one responds.",
      });
    } catch (e) {
      console.log(e);
      // Toast.show({
      //   type: "error",
      //   text1: "Failed to Submit Request",
      //   text2: "Please try again.",
      // });
    }
  };

  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscription, setSubscription] = useState(null);

  const SHAKE_THRESHOLD = 1.5; // Define a shake threshold based on your needs

  const _slow = () => Accelerometer.setUpdateInterval(1000);
  const _fast = () => Accelerometer.setUpdateInterval(16);

  const _subscribe = () => {
    setSubscription(
      Accelerometer.addListener((accelerometerData) => {
        setData(accelerometerData);
        handleShake(accelerometerData);
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  const handleShake = ({ x, y, z }) => {
    const totalAcceleration = Math.sqrt(x * x + y * y + z * z);

    if (totalAcceleration > SHAKE_THRESHOLD) {
      // Trigger the desired function when shake is detected
      onShake();
    }
  };

  const onShake = () => {
    console.log("Shake detected!");
    sendHelpRequest();
    // Add your shake handling logic here
  };

  useEffect(() => {
    // Call the function immediately
    readHealthData();

    // Set up an interval to call the function every 2 minutes (120000 milliseconds)
    const intervalId = setInterval(readHealthData, 120000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
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
          marginTop: 30,
        }}
      >
        <View style={{ flex: 1, alignItems: "center" }}>
          {/* Centered item */}
          <Text
            style={{
              fontSize: 20,
              color: "#FFFFFF",
              fontFamily: "Poppins-SemiBold",
            }}
          >
            Safe Travel
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            router.push("notifications");
          }}
          style={{ alignItems: "flex-end", marginTop: -5 }}
        >
          {/* Item at the end */}
          <Ionicons name="notifications-outline" size={26} color="white" />
        </TouchableOpacity>
      </View>

      <Image
        source={require("../assets/images/night.png")} // Path to your local image
        resizeMode="stretch"
        style={{
          width: "100%",
          height: height * 0.2,
        }}
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 30,
        }}
      >
        <Image
          source={require("../assets/images/google-fit.png")} // Path to your local image
          resizeMode="stretch"
          style={{
            width: 30,
            height: 27,
          }}
        />
        <Text
          style={{
            marginLeft: 25,
            color: "#F7F7F8",
            fontFamily: "Poppins-SemiBold",
          }}
        >
          Sync with Google Fit
        </Text>
      </View>

      <SwitchToggle
        switchOn={syncOn}
        onPress={async () => {
          if (!syncOn) {
            readHealthData();

            setSyncOn(!syncOn);
          } else {
            setSyncOn(!syncOn);

            await SecureStore.setItemAsync("syncOn", "true");
          }
        }}
        circleColorOff="black"
        circleColorOn="black"
        backgroundColorOn="white"
        backgroundColorOff="#C4C4C4"
      />
      {/* </ImageBackground> */}

      <Text
        style={{
          fontSize: 20,
          color: "#FFFFFF",
          fontFamily: "Poppins-SemiBold",
          marginTop: 40,
        }}
      >
        Send a help request
      </Text>

      <Text
        style={{
          fontSize: 16,
          marginHorizontal: 20,
          color: "#FFFFFF",
          fontFamily: "Poppins-Regular",
          marginTop: 40,
        }}
      >
        Your location will be shared with your community. We'll send a message
        to the nearest members of your community.
      </Text>

      <View
        style={{
          flex: 1,
          width: "100%",
          marginHorizontal: 10,
          paddingHorizontal: 15,
          marginTop: 20,
        }}
      >
        <Button
          onPress={() => {
            // console.log("hello");
            // handleSubmit(onSubmit)();
            // router.push("home");
            sendHelpRequest();
          }}
        >
          Send Help Request
        </Button>
      </View>
    </View>
  );
}

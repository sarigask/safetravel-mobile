import Button from "@/components/ui/button";
import InputQuery from "@/components/ui/input-field";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { API_URL } from "@/config";
import * as SecureStore from "expo-secure-store";
import auth from "@react-native-firebase/auth";
import { ColorSpace } from "react-native-reanimated";
import Toast from "react-native-toast-message";
import { loadAsync } from "expo-font";

export default function Index() {
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [eidFile, setEidFile] = useState<any>();
  const [loading, setLoading] = useState(false);

  const handleDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || date;
    console.log(currentDate, "curr date");
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [16, 13],
      quality: 1,
    });
    console.log(result);
    setEidFile(result?.assets as any);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: "",
      addressLine1: "",
      addressLine2: "",
      phoneNumber: "",
      zipCode: "",
    },
  });
  const onSubmit = async (data: any) => {
    setLoading(true);
    // console.log(data, "data");
    console.log("Form Data:", data); // Debugging: log the form data
    try {
      let fileName;
      let url;
      if (eidFile) {
        const formData = new FormData();

        formData.append("files", {
          uri: eidFile[0]?.uri,
          type: eidFile[0]?.mimeType,
          name: eidFile[0]?.fileName,
        } as any);

        const uploadResponse = await fetch(`${API_URL}/s3/upload-images`, {
          method: "POST",
          body: formData, // Send filesArray as the body
        });

        const uploadResponseData: any = await uploadResponse.json();
        fileName = uploadResponseData?.uploads?.filenames[0];
        url = uploadResponseData?.uploads?.urls[0];
      }

      const idTokenResult = await auth()?.currentUser?.getIdTokenResult();

      const userId = await SecureStore.getItemAsync("user_id");

      const deviceId = await SecureStore.getItemAsync("device_id");
      console.log(deviceId, "deviceId");

      const updateUserParams = {
        fullName: data?.fullName,
        phone: data?.phoneNumber,
        addressLine1: data?.addressLine1,
        addressLine2: data?.addressLine2,
        zipcode: data?.zipCode,
        kyc: {
          fileName: fileName,
          url: url,
        },
        deviceId: deviceId,
      };

      console.log(updateUserParams);

      console.log(updateUserParams, "update user params");
      console.log(userId, "user id");

      const resUpdateUser = await fetch(`${API_URL}/user/${userId}`, {
        method: "PATCH",
        body: JSON.stringify(updateUserParams), // Send filesArray as the body
        headers: {
          Authorization: `Bearer ${idTokenResult?.token}`,
          "Content-Type": "application/json", // Assuming you're sending JSON data
        },
      });

      console.log(await resUpdateUser.json(), "update user");

      Toast.show({
        type: "success",
        text1: "Updated profile successfully!",
        text2: " Enjoy your session!.",
      });
      setLoading(false);

      router.push("home");
    } catch (e) {
      setLoading(false);
      Toast.show({
        type: "error",
        text1: "Something went wrong",
        text2: "Please try again",
      });
    }
  };

  return (
    <ScrollView
      style={{
        // flex: 1,

        backgroundColor: "#000000",
        paddingTop: 100,
        // alignItems: "center",
        paddingHorizontal: 16,
      }}
      contentContainerStyle={{
        paddingBottom: 200,
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
        To ensure the safety of our community, we need to verify your identity.
      </Text>

      <Text
        style={{
          color: "#CCCCCC",
          fontSize: 14,
          fontFamily: "Poppins-Regular",
          marginTop: 20,
        }}
      >
        Please upload a photo of your government-issued ID and provide your full
        name, address, and contact information.
      </Text>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <InputQuery
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            label="Full Name"
          />
        )}
        name="fullName"
      />

      {errors.fullName && (
        <Text
          style={{
            color: "red",
          }}
        >
          This is required.
        </Text>
      )}

      <TouchableOpacity
        onPress={() => {
          setShowDatePicker(true);
        }}
      >
        <InputQuery
          disabled={true}
          value={date?.toString()}
          label="Date of Birth"
        />
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="spinner"
          onChange={handleDateChange}
          maximumDate={new Date()} // Set maximum date to current date
        />
      )}

      <Controller
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <InputQuery
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            label="Address Line 1"
          />
        )}
        name="addressLine1"
      />
      {errors.addressLine1 && (
        <Text style={{ color: "red" }}>This is required.</Text>
      )}

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <InputQuery
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            label="Address Line 2"
          />
        )}
        name="addressLine2"
      />

      {errors.addressLine2 && (
        <Text style={{ color: "red" }}>This is required.</Text>
      )}

      <Controller
        control={control}
        rules={{
          required: true,
          pattern: {
            value: /^[0-9]{10,15}$/, // Adjust this regex according to your needs
            message: "Phone Number must be between 10 and 15 digits",
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <InputQuery
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            label="Phone Number"
          />
        )}
        name="phoneNumber"
      />
      {errors.phoneNumber && (
        <Text style={{ color: "red" }}>This is required.</Text>
      )}

      <Controller
        control={control}
        rules={{
          required: true,
          pattern: {
            value: /^[0-9]{5,9}$/, // Adjust this regex according to your needs
            message: "ZIP Code must be between 5 and 9 digits",
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <InputQuery
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            label="ZIP Code"
          />
        )}
        name="zipCode"
      />
      {errors.zipCode && (
        <Text style={{ color: "red" }}>This is required.</Text>
      )}

      <TouchableOpacity
        style={styles.cardContainer}
        onPress={() => {
          pickImage();
        }}
      >
        <View style={styles.card}>
          {eidFile ? (
            <AntDesign name="checkcircleo" size={24} color="white" />
          ) : (
            <MaterialIcons name="cameraswitch" size={27} color={"#FFFFFF"} />
          )}
        </View>
        <Text style={[styles.description, styles.smallDescription]}>
          {eidFile ? "Uploaded Eid successfully" : "Upload your emirates ID"}
        </Text>
      </TouchableOpacity>

      <Button
        loading={loading}
        onPress={() => {
          // console.log("hello");
          handleSubmit(onSubmit)();
          // router.push("home");
        }}
      >
        Continue
      </Button>
    </ScrollView>
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
    marginTop: 40,
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

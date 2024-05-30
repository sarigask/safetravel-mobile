import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const PreviewId = ({ onPress }: { onPress: () => void }) => {
  return (
    <Pressable style={styles.container}>
      <View
        style={{
          width: 50,
          height: 50,
          backgroundColor: "#333333",
          borderRadius: 14,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 15,
        }}
      >
        <Ionicons name="location" size={27} color="white" />
      </View>

      <View>
        <Text style={styles.description}>Track your responder</Text>

        <Text
          style={[
            styles.description,
            styles.smallDescription,
            {
              width: 200,
              color: "#FFFFFF",
            },
          ]}
        >
          Your responder is on the way. Follow their arrival.
        </Text>
      </View>
      <Pressable
        style={{
          width: 70,
          height: 25,
          backgroundColor: "#333333",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 14,
        }}
        onPress={() => {
          console.log("helo");
          onPress();
          //   onPreviewClick();
        }}
      >
        <Text style={[styles.description, { color: "#ffffff" }]}>Track</Text>
      </Pressable>
    </Pressable>
  );
};

export default PreviewId;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    height: 90,
    // backgroundColor: "#F6F7F9",
    borderRadius: 18,
    alignItems: "center",
    paddingHorizontal: 14,
    justifyContent: "space-between",
  },
  circle: {
    width: 45,
    height: 45,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  description: {
    fontSize: 12,
    fontFamily: "Poppins-Medium",

    color: "#FFFFFF",
  },
  smallDescription: {
    color: "#667091",
    fontSize: 11,
    fontFamily: "Poppins-Regular",
  },
  underLinedText: {
    textDecorationLine: "underline",
    color: "red",
  },
});

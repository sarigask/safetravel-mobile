import React from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";

type ButtonVariant = "primary" | "secondary" | "inactive" | "report";

interface ButtonProps {
  variant?: ButtonVariant;
  onPress: () => void;
  children: React.ReactNode;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  onPress,
  children,
  loading,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.btnStyle,
        {
          backgroundColor: "#FFFFFF",
        },
      ]}
      onPress={onPress}
      disabled={variant == "inactive" ? true : loading ? true : false}
    >
      {loading ? (
        <ActivityIndicator size={23} color="black" />
      ) : (
        <Text style={styles.buttonText}>{children}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btnStyle: {
    width: "100%",
    height: 50,
    marginTop: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  inactive: {
    backgroundColor: "#FFFFFF",
  },
  primary: {
    backgroundColor: "#FFFFFF",
  },
  report: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
  },
  secondary: {
    backgroundColor: "#979797",
  },
  buttonText: {
    fontSize: 16,
    // fontWeight: "bold",
    fontFamily: "Poppins-SemiBold",
    color: "#000000",
  },
});

export default Button;

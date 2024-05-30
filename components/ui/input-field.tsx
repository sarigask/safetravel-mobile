import { View, Text, StyleSheet, TextInput } from "react-native";
import React, { useMemo, useState } from "react";

const InputQuery = ({
  value,
  onChange,
  label,
  onBlur,
  disabled = false,
}: {
  value: string;
  label: string;
  onChange?: (text: string) => void;
  onBlur?: any;
  disabled?: boolean;
}) => {
  const formatDateString = (date: string) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <View style={{ flex: 1, marginVertical: 20 }}>
      <Text style={styles.description}>{label}</Text>
      <View
        style={
          {
            //   alignSelf: "flex-start",
          }
        }
      >
        <TextInput
          editable={!disabled}
          style={[styles.profileInput]}
          value={disabled ? formatDateString(value) : value}
          placeholder={label}
          onChangeText={(text) => {
            onChange && onChange(text);
          }}
          onBlur={onBlur}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  description: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    marginTop: 6,
    marginBottom: 10,
  },
  profileInput: {
    width: "100%",
    height: 46,
    // marginTop: 8,
    paddingHorizontal: 20,
    flexDirection: "row",
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    backgroundColor: "#F2F2F2",
    borderWidth: 0.5,
    borderColor: "#0EB295",
    borderRadius: 8,
  },

  container: {
    backgroundColor: "white",
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: "#0EB295",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    fontFamily: "Poppins-Medium",
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
  placeholderStyle: {
    marginLeft: 14,
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
  itemContainerStyle: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
  itemTextStyle: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
  selectedTextStyle: {
    fontSize: 14,
    marginLeft: 14,
    fontFamily: "Poppins-Medium",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

export default InputQuery;

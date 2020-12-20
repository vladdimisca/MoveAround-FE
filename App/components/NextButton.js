import React from "react";
import { StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";

// constants
import colors from "../constants/colors";

const screen = Dimensions.get("window");
const styles = StyleSheet.create({
  buttonContainer: {
    alignSelf: "flex-end",
  },
  nextButton: {
    borderRadius: (screen.width * 0.16) / 2,
    width: screen.width * 0.16,
    height: screen.width * 0.16,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 20,
  },
});

export const NextButton = ({ onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.buttonContainer}
      activeOpacity={0.7}
    >
      <LinearGradient
        style={styles.nextButton}
        colors={[colors.lightBlue, colors.midBlue, colors.darkBlue]}
      >
        <AntDesign
          resizeMode="contain"
          name="arrowright"
          size={40}
          color={colors.white}
        />
      </LinearGradient>
    </TouchableOpacity>
  );
};

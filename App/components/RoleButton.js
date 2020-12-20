import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

// constants
import colors from "../constants/colors";

const screen = Dimensions.get("window");
const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: (screen.width * 0.65) / 2,
    backgroundColor: colors.white,
    elevation: 30,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: screen.width * 0.65,
    height: screen.width * 0.65,
    borderRadius: (screen.width * 0.65) / 2,
    elevation: 30,
  },
  image: {
    width: screen.width * 0.4,
    height: screen.width * 0.4,
  },
  text: {
    fontSize: 28,
    color: colors.white,
    fontWeight: "bold",
    fontStyle: "italic",
  },
});

export const RoleButton = ({
  text,
  imageSource,
  buttonContainerStyle,
  onPress,
}) => {
  let buttonContainer = styles.buttonContainer;

  if (buttonContainerStyle) {
    buttonContainer = buttonContainerStyle;
  }

  return (
    <TouchableOpacity
      style={buttonContainer}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <LinearGradient
        style={styles.imageContainer}
        colors={[colors.lightBlue, colors.midBlue, colors.darkBlue]}
      >
        <Image source={imageSource} style={styles.image} resizeMode="contain" />
        <Text style={styles.text}>{text}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

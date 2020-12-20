import React from "react";
import { StyleSheet, Text, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { CommonActions, useFocusEffect } from "@react-navigation/native";

// constants
import colors from "../constants/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 30,
    color: colors.white,
    fontStyle: "italic",
    fontWeight: "bold",
  },
});

export default ({ navigation }) => {
  useFocusEffect(() => {
    const timeout = setTimeout(() => {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{ name: "UserRolesOptions" }],
        })
      );
    }, 1000);

    return () => clearTimeout(timeout);
  });

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.midBlue} />
      <LinearGradient
        style={styles.container}
        colors={[colors.midBlue, colors.darkBlue]}
      >
        <Text style={styles.text}> MoveAround </Text>
      </LinearGradient>
    </>
  );
};

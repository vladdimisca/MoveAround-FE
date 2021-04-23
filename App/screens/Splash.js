import React from "react";
import { StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { CommonActions, useFocusEffect } from "@react-navigation/native";

// constants
import colors from "../constants/colors";

// components
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";

// storage
import { UserStorage } from "../util/storage/UserStorage";

// util
import { Util } from "../util/Util";

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
    const fetchData = async () => {
      const user = await Util.getCurrentUser();

      if (user !== null) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: "App",
                state: {
                  routes: [{ name: "Profile" }],
                },
              },
            ],
          })
        );
        return;
      }

      // clear the storage
      await UserStorage.clearStorage();
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Login" }],
        })
      );
    };

    fetchData();
  });

  return (
    <>
      <FocusAwareStatusBar
        barStyle="light-content"
        backgroundColor={colors.midBlue}
      />
      <LinearGradient
        style={styles.container}
        colors={[colors.midBlue, colors.darkBlue]}
      >
        <Text style={styles.text}> MoveAround </Text>
      </LinearGradient>
    </>
  );
};

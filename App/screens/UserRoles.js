import React from "react";
import { StyleSheet, View, StatusBar, SafeAreaView } from "react-native";

// error handler
import { ErrorHandler } from "../util/ErrorHandler";

// constants
import colors from "../constants/colors";

// custom components
import { RoleButton } from "../components/RoleButton";

// storage
import { AuthenticationStorage } from "../util/storage/AuthenticationStorage";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  safeAreaContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
  },
});

export default ({ navigation }) => {
  const PASSENGER = "PASSENGER";
  const DRIVER = "DRIVER";

  const onPress = async (userRole) => {
    await AuthenticationStorage.saveUserRole(userRole)
      .then(() => navigation.push("Login"))
      .catch((error) => {
        // this should not happen
        console.log(error);
        ErrorHandler.alert(
          "Could not process your choice",
          "Try again",
          navigation,
          "UserRoles"
        );
      });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <SafeAreaView style={styles.safeAreaContainer}>
        <RoleButton
          onPress={() => onPress(PASSENGER)}
          text="Passenger"
          imageSource={require("../assets/images/passenger.png")}
        />
        <RoleButton
          onPress={() => onPress(DRIVER)}
          buttonContainerStyle={{ elevation: 0 }}
          text="Driver"
          imageSource={require("../assets/images/driver.png")}
        />
      </SafeAreaView>
    </View>
  );
};

import React from "react";
import { StyleSheet, View, StatusBar, SafeAreaView } from "react-native";

// constants
import colors from "../constants/colors";

// custom components
import { RoleButton } from "../components/RoleButton";

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
  const onPress = () => {
    navigation.push("PhoneNumber");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <SafeAreaView style={styles.safeAreaContainer}>
        <RoleButton
          onPress={onPress}
          text="Passenger"
          imageSource={require("../assets/images/passenger.png")}
        />
        <RoleButton
          onPress={onPress}
          buttonContainerStyle={{ elevation: 0 }}
          text="Driver"
          imageSource={require("../assets/images/driver.png")}
        />
      </SafeAreaView>
    </View>
  );
};

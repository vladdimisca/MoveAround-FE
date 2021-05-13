import React from "react";
import { StyleSheet, View, SafeAreaView } from "react-native";

// constants
import colors from "../constants/colors";

// custom components
import { TravelOption } from "../components/TravelOption";
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";

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
  return (
    <View style={styles.container}>
      <FocusAwareStatusBar
        barStyle="dark-content"
        backgroundColor={colors.white}
      />
      <SafeAreaView style={styles.safeAreaContainer}>
        <TravelOption
          imageSource={require("../assets/images/driver.png")}
          onPress={() =>
            navigation.push("ProvideRoute", { nextRoute: "CompleteRoute" })
          }
          text="Driver"
        />
        <TravelOption
          imageSource={require("../assets/images/passenger.png")}
          onPress={() =>
            navigation.push("ProvideRoute", { nextRoute: "RouteDateFilter" })
          }
          buttonContainerStyle={{ elevation: 0 }}
          text="Passenger"
        />
      </SafeAreaView>
    </View>
  );
};

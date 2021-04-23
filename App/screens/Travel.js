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
        <TravelOption onPress={() => navigation.push("Offer")} text="Offer" />
        <TravelOption
          onPress={() => console.log("2")}
          buttonContainerStyle={{ elevation: 0 }}
          text="Search"
        />
      </SafeAreaView>
    </View>
  );
};

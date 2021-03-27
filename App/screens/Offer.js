import React from "react";
import MapView from "react-native-maps";
import { View, StyleSheet, Dimensions, StatusBar } from "react-native";

const screen = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: screen.width,
    height: screen.height,
  },
});

export default () => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="transparent" />
      <MapView style={styles.map} />
    </View>
  );
};

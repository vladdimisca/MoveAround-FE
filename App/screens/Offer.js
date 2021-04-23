import React from "react";
import MapView from "react-native-maps";
import { View, StyleSheet, SafeAreaView } from "react-native";

// google autocomplete
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

// components
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  map: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
});

export default () => {
  return (
    <View style={styles.container}>
      <FocusAwareStatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <MapView style={styles.map} />
      <SafeAreaView>
        <GooglePlacesAutocomplete
          placeholder="From"
          onPress={(data, details = null) => {
            console.log(data, details);
          }}
          query={{
            key: "AIzaSyCNEB7mPzNKjxHe98IZXeFO7UptYcoiJJ0",
            language: "en",
          }}
        />
      </SafeAreaView>
    </View>
  );
};

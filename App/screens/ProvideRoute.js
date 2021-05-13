import React, { useEffect, useState, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import { View, StyleSheet, SafeAreaView, Alert } from "react-native";
import * as Location from "expo-location";

// google autocomplete
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

// directions
import PolylineDirection from "@react-native-maps/polyline-direction";

// geocoder
import Geocoder from "react-native-geocoding";

// config
import config from "../../config";

// constants
import colors from "../constants/colors";

// components
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";
import { NextButton } from "../components/NextButton";

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: colors.lightWhite,
  },
  safeArea: {
    height: "100%",
  },
  map: {
    zIndex: 1,
    top: 138,
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  firstInputContainer: {
    zIndex: 3,
    position: "absolute",
    top: 15,
    left: 15,
    right: 15,
  },
  secondInputContainer: {
    zIndex: 2,
    position: "absolute",
    top: 75,
    left: 15,
    right: 15,
  },
  textInput: {
    padding: 15,
    height: 50,
    borderRadius: 15,
    fontSize: 18,
    backgroundColor: colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  nextButton: {
    bottom: 5,
    position: "absolute",
    zIndex: 2,
  },
});

export default ({ navigation, route }) => {
  // initialize the geocoder
  Geocoder.init(config.API_KEY, { language: "en" });

  // refs
  const mapRef = useRef(null);
  const startRef = useRef(null);
  const stopRef = useRef(null);

  // states
  const [startLocation, setStartLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [stopLocation, setStopLocation] = useState(null);

  const fitToMarkers = () => {
    setTimeout(() => {
      mapRef.current?.fitToSuppliedMarkers(["start_marker", "stop_marker"], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }, 200);
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync({});
      setStartLocation({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
      });

      Geocoder.from({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
      }).then((json) => {
        startRef.current?.setAddressText(json.results[0].formatted_address);
      });

      fitToMarkers();
    })();
  }, []);

  const doActionIfRouteExists = async (
    startLat,
    startLng,
    stopLat,
    stopLng,
    callback
  ) => {
    const urlToFetchDistance = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${startLat},${startLng}&destinations=${stopLat}%2C${stopLng}&key=${config.API_KEY}`;
    const result = await fetch(urlToFetchDistance).then((response) =>
      response.json()
    );

    if (result.rows[0].elements[0].status !== "ZERO_RESULTS") {
      callback();
    } else {
      Alert.alert("Error", "Could not find any route!", [
        { text: "Ok", style: "cancel" },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <FocusAwareStatusBar
        barStyle="dark-content"
        backgroundColor={colors.white}
      />
      <SafeAreaView style={styles.safeArea}>
        <GooglePlacesAutocomplete
          enablePoweredByContainer={false}
          ref={startRef}
          placeholder="From"
          fetchDetails
          currentLocation
          onPress={async (_, details = null) => {
            if (stopLocation) {
              doActionIfRouteExists(
                details.geometry.location.lat,
                details.geometry.location.lng,
                stopLocation.latitude,
                stopLocation.longitude,
                () =>
                  setStartLocation({
                    latitude: details.geometry.location.lat,
                    longitude: details.geometry.location.lng,
                  })
              );
            } else {
              setStartLocation({
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
              });
            }
          }}
          query={{
            key: config.API_KEY,
            language: "en",
          }}
          styles={{
            container: styles.firstInputContainer,
            textInput: styles.textInput,
          }}
        />

        <GooglePlacesAutocomplete
          enablePoweredByContainer={false}
          ref={stopRef}
          placeholder="To"
          fetchDetails
          currentLocation
          onPress={async (_, details = null) => {
            doActionIfRouteExists(
              startLocation.latitude,
              startLocation.longitude,
              details.geometry.location.lat,
              details.geometry.location.lng,
              () =>
                setStopLocation({
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                })
            );
          }}
          query={{
            key: config.API_KEY,
            language: "en",
          }}
          styles={{
            container: styles.secondInputContainer,
            textInput: styles.textInput,
          }}
        />

        <MapView
          maxZoomLevel={19}
          onLayout={fitToMarkers}
          loadingEnabled
          provider={MapView.PROVIDER_GOOGLE}
          ref={mapRef}
          style={styles.map}
        >
          <Marker
            identifier="start_marker"
            draggable
            coordinate={startLocation}
            title="Start"
            description="Starting point"
            onDragEnd={async (event) => {
              const latitude = event.nativeEvent.coordinate.latitude;
              const longitude = event.nativeEvent.coordinate.longitude;

              if (stopLocation) {
                doActionIfRouteExists(
                  latitude,
                  longitude,
                  stopLocation.latitude,
                  stopLocation.longitude,
                  () => {
                    setStartLocation({ latitude, longitude });
                    Geocoder.from({ latitude, longitude }).then((json) => {
                      startRef.current?.setAddressText(
                        json.results[0].formatted_address
                      );
                    });
                  }
                );
              } else {
                setStartLocation({ latitude, longitude });
                Geocoder.from({ latitude, longitude }).then((json) => {
                  startRef.current?.setAddressText(
                    json.results[0].formatted_address
                  );
                });
              }
            }}
          />

          {stopLocation && (
            <Marker
              identifier="stop_marker"
              draggable
              coordinate={stopLocation}
              title="Stop"
              description="Destination point"
              onDragEnd={async (event) => {
                const latitude = event.nativeEvent.coordinate.latitude;
                const longitude = event.nativeEvent.coordinate.longitude;

                doActionIfRouteExists(
                  startLocation.latitude,
                  startLocation.longitude,
                  latitude,
                  longitude,
                  () => {
                    setStopLocation({ latitude, longitude });
                    Geocoder.from({ latitude, longitude }).then((json) => {
                      stopRef.current?.setAddressText(
                        json.results[0].formatted_address
                      );
                    });
                  }
                );
              }}
            />
          )}

          {stopLocation && (
            <PolylineDirection
              onReady={fitToMarkers}
              origin={{
                latitude: startLocation.latitude,
                longitude: startLocation.longitude,
              }}
              destination={{
                latitude: stopLocation.latitude,
                longitude: stopLocation.longitude,
              }}
              apiKey={config.API_KEY}
              strokeWidth={8}
              strokeColor={colors.darkBlue}
            />
          )}
        </MapView>

        <NextButton
          active={stopLocation !== null}
          onPress={() => {
            if (!stopLocation) {
              return;
            }
            navigation.push(route.params.nextRoute, {
              startLocation,
              stopLocation,
            });
          }}
          customStyle={styles.nextButton}
        />
      </SafeAreaView>
    </View>
  );
};

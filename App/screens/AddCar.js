import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  ScrollView,
  LogBox,
} from "react-native";
import { Input } from "react-native-elements";
import { CommonActions } from "@react-navigation/native";
import { DotIndicator } from "react-native-indicators";
import Spinner from "react-native-loading-spinner-overlay";
import NativeColorPicker from "native-color-picker";

// constants
import colors from "../constants/colors";

// components
import { GeneralButton } from "../components/GeneralButton";
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";

// services
import { CarService } from "../services/CarService";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  safeAreaContainer: {
    flex: 1,
    marginTop: 25,
  },
  labelStyle: {
    color: colors.text,
    marginHorizontal: 15,
  },
  inputContainerStyle: {
    marginHorizontal: 15,
    paddingHorizontal: 10,
  },
  errorText: {
    marginHorizontal: 25,
    color: "red",
    fontSize: 14,
    alignSelf: "center",
  },
  selectColorText: {
    marginBottom: 15,
    marginHorizontal: 25,
    fontSize: 17,
    fontWeight: "bold",
  },
});

// ignore warning logs from NativeColorPicker dependency
LogBox.ignoreLogs([
  "VirtualizedLists should never be nested inside plain ScrollViews",
  "Animated: `useNativeDriver` was not specified",
]);

export default ({ navigation, route }) => {
  const carColors = [
    "black",
    "white",
    "grey",
    "red",
    "blue",
    "green",
    "brown",
    "beige",
    "orange",
    "yellow",
    "pink",
    "darkblue",
  ];
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fetchingCar, setFetchingCar] = useState(true);
  const [car, setCar] = useState({
    id: null,
    licensePlate: "",
    make: "",
    model: "",
    color: "black",
    year: "",
  });

  useEffect(() => {
    const fetchCar = async () => {
      if (route.params && route.params.carId) {
        setFetchingCar(true);
        navigation.setOptions({ title: "Update your car" });

        CarService.getCarById(route.params.carId)
          .then((c) => setCar({ ...c, year: c.year.toString() }))
          .finally(() => setFetchingCar(false));
      } else {
        setFetchingCar(false);
      }
    };

    fetchCar();
  }, [route, navigation]);

  return (
    <View style={styles.container}>
      <Spinner
        overlayColor={colors.white}
        customIndicator={
          <DotIndicator color={colors.midBlue} count={3} size={12} />
        }
        visible={fetchingCar}
      />

      <Spinner
        customIndicator={
          <DotIndicator color={colors.midBlue} count={3} size={12} />
        }
        visible={isLoading}
      />

      <FocusAwareStatusBar
        barStyle="dark-content"
        backgroundColor={colors.white}
      />
      <SafeAreaView style={styles.safeAreaContainer}>
        <ScrollView>
          <Input
            placeholder="Enter the license plate..."
            autoCapitalize="none"
            label="License Plate"
            labelStyle={styles.labelStyle}
            inputContainerStyle={styles.inputContainerStyle}
            value={car.licensePlate}
            onChangeText={(licensePlate) =>
              setCar((value) => {
                return { ...value, licensePlate };
              })
            }
          />

          <Input
            placeholder="Enter the make..."
            label="Make"
            labelStyle={styles.labelStyle}
            inputContainerStyle={styles.inputContainerStyle}
            value={car.make}
            onChangeText={(make) =>
              setCar((value) => {
                return { ...value, make };
              })
            }
          />

          <Input
            placeholder="Enter the model..."
            label="Model"
            labelStyle={styles.labelStyle}
            inputContainerStyle={styles.inputContainerStyle}
            value={car.model}
            onChangeText={(model) =>
              setCar((value) => {
                return { ...value, model };
              })
            }
          />

          <Input
            keyboardType="numeric"
            label="Year"
            placeholder="Enter the year..."
            labelStyle={styles.labelStyle}
            inputContainerStyle={styles.inputContainerStyle}
            value={car.year}
            onChangeText={(year) =>
              setCar((value) => {
                return { ...value, year };
              })
            }
          />

          <Text style={styles.selectColorText}>
            Select the color of your car
          </Text>

          <NativeColorPicker
            style={{ alignSelf: "center", marginBottom: 15 }}
            itemSize={34}
            columns={6}
            shadow
            sort
            colors={carColors}
            selectedColor={car.color}
            onSelect={(color) =>
              setCar((value) => {
                return { ...value, color };
              })
            }
          />

          {isLoading === false && error !== "" && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          <GeneralButton
            text={car.id === null ? "Add car" : "Update car"}
            onPress={async () => {
              if (isLoading === true) {
                return;
              }
              setError("");
              setIsLoading(true);

              const payload = { ...car, year: parseInt(car.year, 10) };
              const response =
                car.id === null
                  ? delete payload.id && CarService.createCar(payload)
                  : CarService.updateCarById(car.id, payload);

              response
                .then(() => {
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      key: null,
                      routes: [
                        {
                          name: "App",
                          state: {
                            routes: [{ name: "Cars" }],
                          },
                        },
                      ],
                    })
                  );
                })
                .catch((err) => {
                  if (
                    err &&
                    err.response &&
                    err.response.request &&
                    err.response.request._response
                  ) {
                    setError(
                      `${
                        JSON.parse(err.response.request._response).errorMessage
                      }`
                    );
                  } else {
                    setError("Oops, something went wrong!");
                  }
                })
                .finally(() => setIsLoading(false));
            }}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { DotIndicator } from "react-native-indicators";
import Spinner from "react-native-loading-spinner-overlay";
import { Dropdown } from "sharingan-rn-modal-dropdown";
import { Input } from "react-native-elements";
import DateTimePicker from "@react-native-community/datetimepicker";
import { CommonActions } from "@react-navigation/native";
import moment from "moment";
import { FontAwesome } from "react-native-vector-icons";

// constants
import colors from "../constants/colors";

// config
import config from "../../config";

// services
import { CarService } from "../services/CarService";
import { RouteService } from "../services/RouteService";

// storage
import { UserStorage } from "../util/storage/UserStorage";

// components
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";
import { ProfileItem, ItemSeparator } from "../components/ProfileItem";
import { GeneralButton } from "../components/GeneralButton";

const styles = StyleSheet.create({
  addressText: {
    fontSize: 18,
    fontWeight: "bold",
    fontStyle: "italic",
  },
  dropdown: {
    marginTop: -12,
    marginHorizontal: 25,
    marginBottom: 20,
  },
  labelStyle: {
    color: colors.text,
    marginHorizontal: 15,
  },
  inputContainerStyle: {
    marginHorizontal: 15,
    paddingHorizontal: 10,
  },
  line: {
    height: 2 * StyleSheet.hairlineWidth,
    backgroundColor: colors.darkBorder,
  },
  choose: {
    marginLeft: 10,
    marginBottom: 12,
    fontSize: 16,
    color: colors.lightText,
  },
  dateContainer: {
    marginHorizontal: 25,
    marginVertical: 22,
  },
  dateTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  errorText: {
    marginHorizontal: 25,
    color: "red",
    fontSize: 14,
    alignSelf: "center",
  },
});

export default ({ route, navigation }) => {
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReqLoading, setIsReqLoading] = useState(false);
  const [error, setError] = useState("");

  const [startAddress, setStartAddress] = useState("");
  const [stopAddress, setStopAddress] = useState("");
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [car, setCar] = useState({ id: null });
  const [availableSeats, setAvailableSeats] = useState(null);
  const [price, setPrice] = useState(null);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const urlToFetchDistance = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${route.params.startLocation.latitude},${route.params.startLocation.longitude}&destinations=${route.params.stopLocation.latitude}%2C${route.params.stopLocation.longitude}&key=${config.API_KEY}`;

      fetch(urlToFetchDistance)
        .then((response) => response.json())
        .then((json) => {
          setStartAddress(json.origin_addresses[0]);
          setStopAddress(json.destination_addresses[0]);
          setDistance(json.rows[0].elements[0].distance.text);
          setDuration(json.rows[0].elements[0].duration.text);
        });

      const { userId } = await UserStorage.retrieveUserIdAndToken();

      CarService.getAllCarsByUserId(userId)
        .then((cs) =>
          setCars(
            cs.map((c) => {
              return { value: c.id, label: c.licensePlate };
            })
          )
        )
        .finally(() => setIsLoading(false));
    })();
  }, [route]);

  const formatDate = (format) => {
    return moment(
      new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        time.getHours(),
        time.getMinutes(),
        time.getSeconds(),
        time.getMilliseconds()
      )
    ).format(format);
  };

  return (
    <View>
      <Spinner
        overlayColor={colors.white}
        customIndicator={
          <DotIndicator color={colors.midBlue} count={3} size={12} />
        }
        visible={isLoading}
      />
      <Spinner
        customIndicator={
          <DotIndicator color={colors.midBlue} count={3} size={12} />
        }
        visible={isReqLoading}
      />
      <FocusAwareStatusBar
        barStyle="dark-content"
        backgroundColor={colors.white}
      />
      <SafeAreaView style={{ paddingBottom: 15 }}>
        <ScrollView>
          <ProfileItem
            leftIcon={<Text style={styles.addressText}>From:</Text>}
            text={startAddress}
          />

          <ItemSeparator />

          <ProfileItem
            leftIcon={<Text style={styles.addressText}>To:</Text>}
            text={stopAddress}
          />

          <ItemSeparator />

          <ProfileItem
            leftIcon={<Text style={styles.addressText}>Distance:</Text>}
            text={distance}
          />

          <ItemSeparator />

          <ProfileItem
            leftIcon={<Text style={styles.addressText}>Duration:</Text>}
            text={duration}
          />

          <ItemSeparator />

          <View style={styles.dateContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setShow(true);
                setMode("date");
              }}
            >
              <View style={styles.dateTextContainer}>
                <Text style={styles.choose}>{formatDate("llll")}</Text>
                <FontAwesome
                  style={{ marginRight: 15 }}
                  name="calendar"
                  size={22}
                  color={colors.lightText}
                />
              </View>
              <View style={styles.line} />
            </TouchableOpacity>
          </View>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              minimumDate={new Date()}
              value={date}
              mode={mode}
              display="default"
              onChange={(_, selectedValue) => {
                setShow(false);
                if (mode === "date") {
                  const currentDate = selectedValue || new Date();
                  setDate(currentDate);
                  setMode("time");
                  setShow(true);
                } else {
                  const selectedTime = selectedValue || new Date();
                  setTime(selectedTime);
                  setShow(false);
                  setMode("date");
                }
              }}
            />
          )}

          <View style={styles.dropdown}>
            <Dropdown
              label="Select a car..."
              data={cars}
              value={car.id}
              onChange={(id) => setCar({ id })}
            />
          </View>

          <Input
            keyboardType="numeric"
            placeholder="Enter the price..."
            label="Price (USD)"
            labelStyle={styles.labelStyle}
            inputContainerStyle={styles.inputContainerStyle}
            value={price}
            onChangeText={(value) => setPrice(value)}
          />

          <Input
            keyboardType="numeric"
            placeholder="Enter the number of seats..."
            label="Available seats"
            labelStyle={styles.labelStyle}
            inputContainerStyle={styles.inputContainerStyle}
            value={availableSeats}
            onChangeText={(value) => setAvailableSeats(value)}
          />

          {isReqLoading === false && error !== "" && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          <GeneralButton
            text="Add route"
            onPress={async () => {
              if (isReqLoading === true) {
                return;
              }
              setError("");
              setIsReqLoading(true);

              const payload = {
                startLatitude: route.params.startLocation.latitude,
                startLongitude: route.params.startLocation.longitude,
                stopLatitude: route.params.stopLocation.latitude,
                stopLongitude: route.params.stopLocation.longitude,
                price: price || 0,
                availableSeats: availableSeats || 0,
                car: car.id ? car : { id: 0 },
                startDate: formatDate("YYYY-MM-DD HH:mm"),
              };

              RouteService.createRoute(payload)
                .then(() => {
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      key: null,
                      routes: [
                        {
                          name: "App",
                          state: {
                            routes: [{ name: "Routes" }],
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
                .finally(() => setIsReqLoading(false));
            }}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

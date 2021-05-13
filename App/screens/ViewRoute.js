import React, { useEffect, useState } from "react";
import { View, SafeAreaView, Text, StyleSheet, ScrollView } from "react-native";
import { DotIndicator } from "react-native-indicators";
import Spinner from "react-native-loading-spinner-overlay";
import moment from "moment";

// constants
import colors from "../constants/colors";

// config
import config from "../../config";

// services
import { RouteService } from "../services/RouteService";

// storage
import { UserStorage } from "../util/storage/UserStorage";

// components
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";
import { ProfileItem, ItemSeparator } from "../components/ProfileItem";

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
    fontSize: 16,
    alignSelf: "center",
  },
});

export default ({ route }) => {
  const [isLoading, setIsLoading] = useState(true);

  const [startAddress, setStartAddress] = useState("");
  const [stopAddress, setStopAddress] = useState("");
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [currentRoute, setCurrentRoute] = useState({});

  const getDateFromString = (strDate) => {
    const date = new Date(strDate);
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  };

  useEffect(() => {
    (async () => {
      setCurrentRoute(route.params.route);
      setIsLoading(true);
      const urlToFetchDistance = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${route.params.route.startLatitude},${route.params.route.startLongitude}&destinations=${route.params.route.stopLatitude}%2C${route.params.route.stopLongitude}&key=${config.API_KEY}`;

      fetch(urlToFetchDistance)
        .then((response) => response.json())
        .then((json) => {
          setStartAddress(json.origin_addresses[0]);
          setStopAddress(json.destination_addresses[0]);
          setDistance(json.rows[0].elements[0].distance.text);
          setDuration(json.rows[0].elements[0].duration.text);
        })
        .finally(() => setIsLoading(false));
    })();
  }, [route]);

  return (
    <View>
      <Spinner
        overlayColor={colors.white}
        customIndicator={
          <DotIndicator color={colors.midBlue} count={3} size={12} />
        }
        visible={isLoading}
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

          <ProfileItem
            leftIcon={<Text style={styles.addressText}>Date:</Text>}
            text={`${moment(getDateFromString(currentRoute?.startDate)).format(
              "llll"
            )}`}
          />

          <ItemSeparator />

          <ProfileItem
            leftIcon={<Text style={styles.addressText}>Car:</Text>}
            text={currentRoute?.licensePlate}
          />

          <ItemSeparator />

          <ProfileItem
            leftIcon={<Text style={styles.addressText}>Price:</Text>}
            text={currentRoute?.price}
          />

          <ItemSeparator />

          <ProfileItem
            leftIcon={<Text style={styles.addressText}>No. of seats:</Text>}
            text={currentRoute?.availableSeats}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

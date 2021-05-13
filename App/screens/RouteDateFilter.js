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
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import { FontAwesome } from "react-native-vector-icons";

// constants
import colors from "../constants/colors";

// config
import config from "../../config";

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
});

export default ({ route, navigation }) => {
  const [isLoading, setIsLoading] = useState(true);

  const [startAddress, setStartAddress] = useState("");
  const [stopAddress, setStopAddress] = useState("");
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
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
        })
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

          <GeneralButton
            text="Find matching routes"
            onPress={() =>
              navigation.push("FilteredRoutes", {
                ...route.params,
                dateTime: formatDate("YYYY-MM-DD HH:mm"),
              })
            }
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

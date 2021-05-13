import React from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import { Avatar } from "react-native-elements";
import moment from "moment";

// constants
import colors from "../constants/colors";

const screen = Dimensions.get("window");
const styles = StyleSheet.create({
  card: {
    marginHorizontal: 15,
    marginTop: 17,
    backgroundColor: colors.offWhite,
    borderRadius: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    fontSize: 16,
    fontStyle: "italic",
    fontWeight: "bold",
    color: colors.lightText,
    alignSelf: "center",
    marginTop: 6,
  },
  innerText: {
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "italic",
  },
  detailContainer: {
    flexDirection: "row",
    flex: 1,
  },
  detailText: {
    fontSize: 14,
  },
  rightColumn: {
    marginHorizontal: 10,
    flexDirection: "column",
    flex: 1,
  },
});

export const RouteCard = ({ route, onImagePress, onRoutePress }) => {
  const getDateFromString = (strDate) => {
    const date = new Date(strDate);
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity activeOpacity={0.7} onPress={onImagePress}>
        <Avatar
          activeOpacity={0.7}
          size={screen.width * 0.2}
          rounded
          source={
            route.user.profilePictureURL
              ? {
                  uri: route.user.profilePictureURL,
                }
              : require("../assets/images/profile-placeholder.png")
          }
        />
        <Text style={styles.text}>{route.user.firstName}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.rightColumn}
        activeOpacity={0.7}
        onPress={onRoutePress}
      >
        <View style={styles.detailContainer}>
          <Text style={styles.innerText}>From: </Text>
          <Text style={styles.detailText}>{`${route.startAddress}`}</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.innerText}>To: </Text>
          <Text style={styles.detailText}>{`${route.stopAddress}`}</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.innerText}>Date: </Text>
          <Text style={styles.detailText}>
            {`${moment(getDateFromString(route.startDate)).format("llll")}`}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

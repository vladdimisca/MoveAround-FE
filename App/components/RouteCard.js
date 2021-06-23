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
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { Entypo } from "react-native-vector-icons";

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
    maxWidth: "100%",
    flexDirection: "row",
    flex: 1,
  },
  detailText: {
    flex: 1,
    maxWidth: "100%",
    flexWrap: "wrap",
    fontSize: 14,
  },
  rightColumn: {
    marginHorizontal: 10,
    flexDirection: "column",
    flex: 1,
  },
  menuText: {
    color: "#e60000",
    alignSelf: "center",
    fontSize: 14,
    padding: 5,
  },
});

export const RouteCard = ({
  route,
  onImagePress,
  onRoutePress,
  onSelect,
  isRequest,
  currentUser,
}) => {
  const getDateFromString = (strDate) => {
    const date = new Date(strDate);
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  };

  const showDelete =
    !isRequest &&
    (currentUser.id === route.user.id ||
      (route.parentRoute && currentUser.id === route.parentRoute.user.id));
  const showRequest = isRequest && currentUser.id !== route.user.id;
  const showMenu = isRequest || showDelete;

  return (
    <View style={styles.card}>
      <View>
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

        {showMenu && (
          <Menu>
            <MenuTrigger>
              <Entypo
                size={32}
                name="menu"
                color={colors.border}
                style={{ alignSelf: "center" }}
              />
            </MenuTrigger>
            <MenuOptions>
              <TouchableOpacity activeOpacity={0.7}>
                <MenuOption onSelect={onSelect}>
                  {showRequest && (
                    <Text
                      style={{
                        ...styles.menuText,
                        color: colors.lightBlue,
                      }}
                    >
                      Send request
                    </Text>
                  )}
                  {showDelete && <Text style={styles.menuText}>Delete</Text>}
                </MenuOption>
              </TouchableOpacity>
            </MenuOptions>
          </Menu>
        )}
      </View>

      <TouchableOpacity
        style={styles.rightColumn}
        activeOpacity={route.parentRoute ? 1 : 0.7}
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
          <Text style={styles.innerText}>
            {`${route.parentRoute ? "Price: " : "Date: "}`}
          </Text>
          <Text style={styles.detailText}>
            {`${
              route.parentRoute
                ? `${route.price} $`
                : moment(getDateFromString(route.startDate)).format("llll")
            }`}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

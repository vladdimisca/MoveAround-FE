import React from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import { Avatar } from "react-native-elements";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { Entypo } from "react-native-vector-icons";

// constants
import colors from "../constants/colors";

// components
import { ItemSeparator } from "./ProfileItem";

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

export const RequestCard = ({
  request,
  onImagePress,
  onRoutePress,
  currentUser,
  onDelete,
  onAccept,
  onReject,
}) => {
  const showDelete = currentUser.id === request.user.id;
  const showOptions = currentUser.id === request.route.user.id;
  const showMenu = showDelete || showOptions;

  return (
    <View style={styles.card}>
      <View>
        <TouchableOpacity activeOpacity={0.7} onPress={onImagePress}>
          <Avatar
            activeOpacity={0.7}
            size={screen.width * 0.2}
            rounded
            source={
              request.user.profilePictureURL
                ? {
                    uri: request.user.profilePictureURL,
                  }
                : require("../assets/images/profile-placeholder.png")
            }
          />

          <Text style={styles.text}>{request.user.firstName}</Text>
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
                {showDelete && (
                  <MenuOption onSelect={onDelete}>
                    <Text style={styles.menuText}>Delete</Text>
                  </MenuOption>
                )}
              </TouchableOpacity>

              {showOptions && (
                <>
                  <TouchableOpacity activeOpacity={0.7}>
                    <MenuOption onSelect={onAccept}>
                      <Text
                        style={{
                          ...styles.menuText,
                          color: colors.lightBlue,
                        }}
                      >
                        Accept
                      </Text>
                    </MenuOption>
                  </TouchableOpacity>

                  <ItemSeparator />

                  <TouchableOpacity activeOpacity={0.7}>
                    <MenuOption onSelect={onReject}>
                      <Text style={styles.menuText}>Reject</Text>
                    </MenuOption>
                  </TouchableOpacity>
                </>
              )}
            </MenuOptions>
          </Menu>
        )}
      </View>

      <TouchableOpacity
        style={styles.rightColumn}
        activeOpacity={0.7}
        onPress={onRoutePress}
      >
        <View style={styles.detailContainer}>
          <Text style={styles.innerText}>From: </Text>
          <Text style={styles.detailText}>{`${request.startAddress}`}</Text>
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.innerText}>To: </Text>
          <Text style={styles.detailText}>{`${request.stopAddress}`}</Text>
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.innerText}>Distance: </Text>
          <Text style={styles.detailText}>{`${request.distance}`}</Text>
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.innerText}>Status: </Text>
          <Text style={styles.detailText}>
            {`${
              request.status.charAt(0) + request.status.slice(1).toLowerCase()
            }`}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

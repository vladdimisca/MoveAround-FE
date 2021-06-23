import React from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import { Avatar, Input } from "react-native-elements";
import moment from "moment";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { Entypo, FontAwesome } from "react-native-vector-icons";

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
  labelStyle: {
    color: colors.text,
    fontStyle: "italic",
    fontSize: 14,
    marginBottom: 5,
    marginLeft: -10,
  },
  inputContainerStyle: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 2 * StyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderRadius: 10,
    marginBottom: -15,
    marginLeft: -10,
  },
});

export const ReviewCard = ({
  review,
  onImagePress,
  onDelete,
  onUpdate,
  currentUser,
}) => {
  const getDateFromString = (strDate) => {
    const date = new Date(strDate);
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  };

  const showOptionsMenu = currentUser.id === review.sender.id;

  return (
    <View style={styles.card}>
      <View>
        <TouchableOpacity activeOpacity={0.7} onPress={onImagePress}>
          <Avatar
            activeOpacity={0.7}
            size={screen.width * 0.2}
            rounded
            source={
              review.sender.profilePictureURL
                ? {
                    uri: review.sender.profilePictureURL,
                  }
                : require("../assets/images/profile-placeholder.png")
            }
          />
          <Text style={styles.text}>{review.sender.firstName}</Text>
        </TouchableOpacity>

        {showOptionsMenu && (
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
                <MenuOption onSelect={onUpdate}>
                  <Text style={{ ...styles.menuText, color: colors.lightBlue }}>
                    Update
                  </Text>
                </MenuOption>

                <ItemSeparator />

                <MenuOption onSelect={onDelete}>
                  <Text style={styles.menuText}>Delete</Text>
                </MenuOption>
              </TouchableOpacity>
            </MenuOptions>
          </Menu>
        )}
      </View>

      <View style={styles.rightColumn}>
        <View style={styles.detailContainer}>
          <Text style={styles.innerText}>Date: </Text>
          <Text style={styles.detailText}>
            {`${moment(getDateFromString(review.dateTime)).format("llll")}`}
          </Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.innerText}>Rating: </Text>
          <Text style={styles.detailText}>
            {`${review.rating} `}
            <FontAwesome name="star" size={13} color={colors.lightText} />
          </Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.innerText}>Traveled as: </Text>
          <Text style={styles.detailText}>
            {`${
              review.travelRole.charAt(0) +
              review.travelRole.slice(1).toLowerCase()
            }`}
          </Text>
        </View>

        <Input
          multiline
          disabled
          label="Comment:"
          labelStyle={styles.labelStyle}
          inputContainerStyle={styles.inputContainerStyle}
          inputStyle={{ fontSize: 14 }}
          value={review.text}
        />
      </View>
    </View>
  );
};

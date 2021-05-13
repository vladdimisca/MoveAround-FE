import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Dimensions,
  Text,
  Linking,
} from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { DotIndicator } from "react-native-indicators";
import { Avatar } from "react-native-elements";
import {
  FontAwesome,
  Fontisto,
  Feather,
  Ionicons,
} from "react-native-vector-icons";
import { CommonActions } from "@react-navigation/routers";
import moment from "moment";

// constants
import colors from "../constants/colors";

// components
import { GeneralButton } from "../components/GeneralButton";
import { ProfileItem, ItemSeparator } from "../components/ProfileItem";
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";

// util
import { Util } from "../util/Util";

// storage
import { UserStorage } from "../util/storage/UserStorage";

// services
import { UserService } from "../services/UserService";

const screen = Dimensions.get("window");
const styles = StyleSheet.create({
  dotIndicatorContainer: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    backgroundColor: colors.offWhite,
    flexDirection: "row",
    paddingVertical: 25,
    paddingHorizontal: 25,
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  avatarContainer: {
    elevation: 5,
    backgroundColor: colors.offWhite,
    marginRight: 28,
  },
  headerTextContainer: {
    maxWidth: screen.width * 0.4,
    marginTop: 15,
    flexDirection: "column",
  },
  headerText: {
    fontSize: 24,
    color: colors.text,
    fontWeight: "bold",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingValue: {
    fontSize: 20,
    color: colors.lightText,
  },
  ratingStar: {
    marginTop: 3,
  },
  verifyText: {
    fontSize: 14,
    color: colors.lightBlue,
  },
  textItem: {
    fontSize: 16,
    fontWeight: "bold",
    fontStyle: "italic",
    color: colors.darkBorder,
  },
});

export default ({ navigation, route }) => {
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  // user management
  const [currentUser, setCurrentUser] = useState(null);
  const [displayedUser, setDisplayedUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const user = await Util.getCurrentUser();
      if (user !== null) {
        setCurrentUser(user);

        if (route.params && route.params.userId) {
          const { token } = await UserStorage.retrieveUserIdAndToken();
          setDisplayedUser(
            await UserService.getUserById(route.params.userId, token)
          );
        } else {
          setDisplayedUser(user);
        }

        setIsProfileLoading(false);
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            key: null,
            routes: [
              {
                name: "Authentication",
                state: {
                  routes: [{ name: "Login" }],
                },
              },
            ],
          })
        );
      }
    };

    fetchData();
  }, [navigation, route]);

  const getDateFromString = (strDate) => {
    const date = new Date(strDate);
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  };

  return (
    <View style={{ flex: 1 }}>
      <FocusAwareStatusBar
        barStyle="dark-content"
        backgroundColor={colors.offWhite}
      />
      {isProfileLoading ? (
        <View style={styles.dotIndicatorContainer}>
          <DotIndicator color={colors.midBlue} count={3} />
        </View>
      ) : (
        <SafeAreaView style={styles.container}>
          <ScrollView>
            <View style={styles.header}>
              <Avatar
                size={screen.width * 0.3}
                rounded
                source={
                  displayedUser.profilePictureURL
                    ? {
                        uri: displayedUser.profilePictureURL,
                      }
                    : require("../assets/images/profile-placeholder.png")
                }
                containerStyle={styles.avatarContainer}
              />

              <View style={styles.headerTextContainer}>
                <Text style={styles.headerText}>
                  {`${displayedUser.firstName} ${displayedUser.lastName}`}
                </Text>
                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingValue}>{"5 "}</Text>
                  <FontAwesome
                    name="star"
                    size={16}
                    color={colors.lightText}
                    style={styles.ratingStar}
                  />
                </View>
              </View>
            </View>

            <ProfileItem
              leftIcon={<Text style={styles.textItem}>Join date:</Text>}
              text={`${moment(
                getDateFromString(displayedUser.createdAt.replace("Z[UTC]", ""))
              ).format("llll")}`}
            />

            <ItemSeparator />

            <ProfileItem
              leftIcon={
                // eslint-disable-next-line react/jsx-wrap-multilines
                <Feather
                  name="message-circle"
                  size={32}
                  color={colors.darkBorder}
                />
              }
              text={displayedUser.description}
            />

            <ItemSeparator />

            <ProfileItem
              active={displayedUser.id !== currentUser.id}
              onPress={() => {
                if (displayedUser.id === currentUser.id) {
                  return;
                }

                Linking.openURL(`mailto:${displayedUser.email}`);
              }}
              leftIcon={
                <Fontisto name="email" size={32} color={colors.darkBorder} />
              }
              rightIcon={
                // eslint-disable-next-line react/jsx-wrap-multilines
                displayedUser.emailEnabled ? (
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={25}
                    color={colors.darkBorder}
                  />
                ) : (
                  displayedUser.id === currentUser.id && (
                    <TouchableOpacity activeOpacity={0.6}>
                      <Text
                        onPress={() =>
                          navigation.push("Confirmation", {
                            email: displayedUser.email,
                          })
                        }
                        style={styles.verifyText}
                      >
                        Verify
                      </Text>
                    </TouchableOpacity>
                  )
                )
              }
              text={displayedUser.email}
            />

            <ItemSeparator />

            <ProfileItem
              active={displayedUser.id !== currentUser.id}
              onPress={() => {
                if (displayedUser.id === currentUser.id) {
                  return;
                }

                Linking.openURL(
                  `tel:+${displayedUser.callingCode} ${displayedUser.phoneNumber}`
                );
              }}
              leftIcon={
                <Feather name="phone" size={32} color={colors.darkBorder} />
              }
              rightIcon={
                displayedUser.phoneEnabled ? (
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={25}
                    color={colors.darkBorder}
                  />
                ) : (
                  displayedUser.id === currentUser.id && (
                    <TouchableOpacity activeOpacity={0.6}>
                      <Text style={styles.verifyText}>Verify</Text>
                    </TouchableOpacity>
                  )
                )
              }
              text={`+${displayedUser.callingCode} ${displayedUser.phoneNumber}`}
            />

            {currentUser.id === displayedUser.id && (
              <GeneralButton
                onPress={() => navigation.push("Settings")}
                text="Settings"
              />
            )}
          </ScrollView>
        </SafeAreaView>
      )}
    </View>
  );
};

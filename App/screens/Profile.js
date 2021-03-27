import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  StatusBar,
  SafeAreaView,
  Dimensions,
  Text,
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

// constants
import colors from "../constants/colors";

// components
import { GeneralButton } from "../components/GeneralButton";
import { ProfileItem, ItemSeparator } from "../components/ProfileItem";

// util
import { Util } from "../util/Util";

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
});

export default ({ navigation }) => {
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  // user management
  const [currentUser, setCurrentUser] = useState(null);
  const [displayedUser, setDisplayedUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const user = await Util.getCurrentUser();
      if (user !== null) {
        setCurrentUser(user);
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
  }, [navigation]);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.offWhite} />
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
                  currentUser.profilePictureURL
                    ? {
                        uri: currentUser.profilePictureURL,
                      }
                    : require("../assets/images/profile-placeholder.png")
                }
                containerStyle={styles.avatarContainer}
              />

              <View style={styles.headerTextContainer}>
                <Text style={styles.headerText}>
                  {`${currentUser.firstName} ${currentUser.lastName}`}
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
              leftIcon={
                // eslint-disable-next-line react/jsx-wrap-multilines
                <Feather
                  name="message-circle"
                  size={32}
                  color={colors.darkBorder}
                />
              }
              text={currentUser.description}
            />

            <ItemSeparator />

            <ProfileItem
              leftIcon={
                <Fontisto name="email" size={32} color={colors.darkBorder} />
              }
              rightIcon={
                // eslint-disable-next-line react/jsx-wrap-multilines
                currentUser.emailEnabled ? (
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={25}
                    color={colors.darkBorder}
                  />
                ) : (
                  <Text
                    onPress={() =>
                      navigation.push("Confirmation", {
                        email: currentUser.email,
                      })
                    }
                    style={styles.verifyText}
                  >
                    Verify
                  </Text>
                )
              }
              text={currentUser.email}
            />

            <ItemSeparator />

            <ProfileItem
              leftIcon={
                <Feather name="phone" size={32} color={colors.darkBorder} />
              }
              rightIcon={
                // eslint-disable-next-line react/jsx-wrap-multilines
                <TouchableOpacity activeOpacity={0.6}>
                  {currentUser.phoneEnabled ? (
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={25}
                      color={colors.darkBorder}
                    />
                  ) : (
                    <Text style={styles.verifyText}>Verify</Text>
                  )}
                </TouchableOpacity>
              }
              text={`+${currentUser.callingCode} ${currentUser.phoneNumber}`}
            />

            <GeneralButton
              onPress={() => navigation.push("Settings")}
              text="Settings"
            />
          </ScrollView>
        </SafeAreaView>
      )}
    </View>
  );
};

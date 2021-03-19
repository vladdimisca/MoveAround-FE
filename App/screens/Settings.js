import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  View,
  Dimensions,
  Text,
  Alert,
} from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Avatar, Input } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { Fontisto, Feather } from "react-native-vector-icons";
import CountryPicker, {
  getAllCountries,
} from "react-native-country-picker-modal";
import { DotIndicator } from "react-native-indicators";
import Spinner from "react-native-loading-spinner-overlay";
import * as ImagePicker from "expo-image-picker";
import { CommonActions } from "@react-navigation/routers";

// constants
import colors from "../constants/colors";

// components
import { GeneralButton } from "../components/GeneralButton";
import { ItemSeparator } from "../components/ProfileItem";

// util
import { Util } from "../util/Util";

// services
import { UserService } from "../services/UserService";

// storage
import { UserStorage } from "../util/storage/UserStorage";

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
  avatarContainer: {
    paddingVertical: 20,
    paddingHorizontal: 25,
    alignItems: "center",
  },
  labelStyle: {
    color: colors.text,
    marginHorizontal: 5,
  },
  inputContainerStyle: {
    marginHorizontal: 5,
  },
  leftIconContainerStyle: {
    marginLeft: 5,
    marginRight: 12,
  },
  errorText: {
    marginHorizontal: 25,
    color: "red",
    fontSize: 16,
    alignSelf: "center",
  },
  actionText: {
    alignSelf: "center",
    fontSize: 20,
    color: colors.lightBlue,
    marginVertical: 15,
  },
});

export default ({ navigation }) => {
  const [isScreenLoading, setIsScreenLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [countryCode, setCountryCode] = useState("RO");
  const [profileUpdateError, setProfileUpdateError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const currentUser = await Util.getCurrentUser();
      if (currentUser !== null) {
        setUser(currentUser);

        await getAllCountries()
          .then(
            (countries) =>
              countries.find(
                (c) =>
                  c.callingCode.includes(currentUser.callingCode.substring(1)) // remove the "+" from the calling code
              ).cca2
          )
          .then((cca2) => setCountryCode(cca2));
        setIsScreenLoading(false);
      } else {
        console.log("Mgg");
      }
    };

    fetchData();
  }, []);

  const updateProfilePicture = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      aspect: [1, 1],
      quality: 1,
    });
    const { token, userId } = await UserStorage.retrieveUserIdAndToken();
    await UserService.updateProfilePictureById(userId, token, result.base64)
      .then((response) =>
        setUser((value) => {
          return { ...value, profilePictureURL: response.profilePictureURL };
        })
      )
      .catch((err) => console.log(err.response.request._response));
  };

  const updateUser = async () => {
    setIsLoading(true);

    const { token, userId } = await UserStorage.retrieveUserIdAndToken();
    UserService.updateUserById(userId, token, user)
      .then((updatedUser) => {
        setUser(updatedUser);
      })
      .catch((err) => {
        if (
          err &&
          err.response &&
          err.response.request &&
          err.response.request._response
        ) {
          setProfileUpdateError(
            `${JSON.parse(err.response.request._response).errorMessage}`
          );
        } else {
          setProfileUpdateError("Oops, something went wrong!");
        }
      })
      .finally(() => setIsLoading(false));
  };

  const signOut = async () => {
    UserStorage.clearStorage().then(() => {
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
    });
  };

  const deleteAccount = async () => {
    Alert.alert("Do you want to delete your account?", null, [
      {
        text: "Yes",
        onPress: async () => {
          UserService.deleteAccount().then(() => signOut());
        },
      },
      {
        text: "No",
        style: "cancel",
      },
    ]);
  };

  return (
    <View style={{ flex: 1 }}>
      <Spinner
        customIndicator={
          <DotIndicator color={colors.midBlue} count={3} size={12} />
        }
        visible={isLoading}
      />
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      {isScreenLoading ? (
        <View style={styles.dotIndicatorContainer}>
          <DotIndicator color={colors.midBlue} count={3} />
        </View>
      ) : (
        <SafeAreaView style={styles.container}>
          <ScrollView>
            <View style={styles.avatarContainer}>
              <Avatar
                size={screen.width * 0.35}
                rounded
                source={
                  user.profilePictureURL
                    ? {
                        uri: user.profilePictureURL,
                      }
                    : require("../assets/images/profile-placeholder.png")
                }
              >
                <Avatar.Accessory
                  size={34}
                  style={{ backgroundColor: colors.border }}
                  onPress={() => updateProfilePicture()}
                  activeOpacity={0.7}
                />
              </Avatar>
            </View>

            <Input
              autoCapitalize="none"
              leftIcon={
                <Icon name="user" size={24} color={colors.darkBorder} />
              }
              label="First Name"
              labelStyle={styles.labelStyle}
              inputContainerStyle={styles.inputContainerStyle}
              leftIconContainerStyle={styles.leftIconContainerStyle}
              value={user.firstName}
              onChangeText={(fName) =>
                setUser((value) => {
                  return { ...value, firstName: fName };
                })
              }
            />
            <Input
              autoCapitalize="none"
              leftIcon={
                <Icon name="user" size={24} color={colors.darkBorder} />
              }
              label="Last Name"
              labelStyle={styles.labelStyle}
              inputContainerStyle={styles.inputContainerStyle}
              leftIconContainerStyle={styles.leftIconContainerStyle}
              value={user.lastName}
              onChangeText={(lName) =>
                setUser((value) => {
                  return { ...value, lastName: lName };
                })
              }
            />
            <Input
              leftIcon={
                // eslint-disable-next-line react/jsx-wrap-multilines
                <Feather
                  name="message-circle"
                  size={24}
                  color={colors.darkBorder}
                />
              }
              label="Description"
              labelStyle={styles.labelStyle}
              inputContainerStyle={styles.inputContainerStyle}
              leftIconContainerStyle={styles.leftIconContainerStyle}
              value={user.description}
              onChangeText={(desc) =>
                setUser((value) => {
                  return { ...value, description: desc };
                })
              }
            />
            <Input
              autoCapitalize="none"
              leftIcon={
                <Fontisto name="email" size={24} color={colors.darkBorder} />
              }
              label="Email"
              labelStyle={styles.labelStyle}
              inputContainerStyle={styles.inputContainerStyle}
              leftIconContainerStyle={styles.leftIconContainerStyle}
              value={user.email}
              onChangeText={(em) =>
                setUser((value) => {
                  return { ...value, email: em };
                })
              }
            />
            <Input
              autoCapitalize="none"
              leftIcon={
                // eslint-disable-next-line react/jsx-wrap-multilines
                <CountryPicker
                  countryCode={countryCode}
                  withFilter
                  withFlag
                  withFlagButton
                  withCallingCode
                  withCallingCodeButton
                  withAlphaFilter
                  onSelect={(newCountry) => {
                    setCountryCode(newCountry.cca2);
                    setUser((value) => {
                      return {
                        ...value,
                        callingCode: newCountry.callingCode.indexOf(0),
                      };
                    });
                  }}
                />
              }
              label="Phone Number"
              labelStyle={styles.labelStyle}
              inputContainerStyle={styles.inputContainerStyle}
              leftIconContainerStyle={styles.leftIconContainerStyle}
              value={user.phoneNumber}
              onChangeText={(phone) =>
                setUser((value) => {
                  return { ...value, phoneNumber: phone };
                })
              }
            />
            {isLoading === false && profileUpdateError !== "" && (
              <Text style={styles.errorText}>{profileUpdateError}</Text>
            )}
            <GeneralButton
              text="Save profile information"
              onPress={() => updateUser()}
            />

            <View style={{ marginTop: 10, marginBottom: 20 }}>
              <ItemSeparator />

              <TouchableOpacity onPress={() => signOut()} activeOpacity={0.6}>
                <Text style={styles.actionText}>Sign out</Text>
              </TouchableOpacity>

              <ItemSeparator />

              <TouchableOpacity activeOpacity={0.6}>
                <Text activeOpacity={0.6} style={styles.actionText}>
                  Change password
                </Text>
              </TouchableOpacity>

              <ItemSeparator />

              <TouchableOpacity
                onPress={() => deleteAccount()}
                activeOpacity={0.6}
              >
                <Text style={styles.actionText}>Delete account</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      )}
    </View>
  );
};

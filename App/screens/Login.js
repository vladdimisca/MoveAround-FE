import React, { useState } from "react";
import { StyleSheet, SafeAreaView, View, Text, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CountryPicker from "react-native-country-picker-modal";
import { TouchableOpacity } from "react-native-gesture-handler";
import { CommonActions } from "@react-navigation/native";
import { DotIndicator } from "react-native-indicators";
import Spinner from "react-native-loading-spinner-overlay";

// constants
import colors from "../constants/colors";

// custom components
import { CustomInput } from "../components/CustomInput";
import { NextButton } from "../components/NextButton";
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";

// services
import { UserService } from "../services/UserService";

// storage
import { UserStorage } from "../util/storage/UserStorage";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: "space-between",
  },
  text: {
    fontSize: 28,
    marginHorizontal: 20,
    marginBottom: 20,
    color: colors.text,
  },
  bottomText: {
    fontSize: 18,
    marginTop: 20,
    color: colors.text,
  },
  bottomLinkText: {
    fontSize: 18,
    color: colors.darkBlue,
  },
  signUpLinkContainer: {
    marginTop: 20,
    marginLeft: 5,
  },
  forgotPassLinkContainer: {
    marginTop: 8,
    marginBottom: 25,
  },
  bottomTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  errorText: {
    marginHorizontal: 25,
    color: "red",
    fontSize: 14,
    alignSelf: "center",
  },
});

export default ({ navigation }) => {
  // request states
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // input fields
  const [callingCode, setCallingCode] = useState("40");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [countryCode, setCountryCode] = useState("RO");

  const login = async () => {
    if (isLoading === true) {
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      const { user, token } = await UserService.login(
        phoneNumber,
        callingCode,
        password
      );

      await UserStorage.saveUserIdAndToken(token, user.id).then(() => {
        setIsLoading(false);

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            key: null,
            routes: [
              {
                name: user.role === "ADMIN" ? "Admin" : "App",
                state: {
                  routes: [{ name: "Profile" }],
                },
              },
            ],
          })
        );
      });
    } catch (err) {
      if (
        err &&
        err.response &&
        err.response.request &&
        err.response.request._response
      ) {
        setError(`${JSON.parse(err.response.request._response).errorMessage}`);
      } else {
        setError("Oops, something went wrong!");
      }

      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Spinner
        customIndicator={
          <DotIndicator color={colors.midBlue} count={3} size={12} />
        }
        visible={isLoading}
      />

      <FocusAwareStatusBar
        barStyle="dark-content"
        backgroundColor={colors.white}
      />

      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Sign in to your account</Text>
        <ScrollView>
          <View>
            <CustomInput
              keyboardType="numeric"
              placeholder="Phone number..."
              onTextChange={setPhoneNumber}
              icon={
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
                    setCallingCode(newCountry.callingCode);
                  }}
                />
              }
            />

            <CustomInput
              autoCapitalize="none"
              secureTextEntry
              placeholder="Password..."
              onTextChange={setPassword}
              icon={
                // eslint-disable-next-line react/jsx-wrap-multilines
                <MaterialCommunityIcons
                  name="key-outline"
                  size={28}
                  color={colors.text}
                />
              }
            />

            <View style={styles.bottomTextContainer}>
              <Text style={styles.bottomText}>Don&apos;t have an account?</Text>
              <TouchableOpacity
                style={styles.signUpLinkContainer}
                onPress={() => navigation.push("Register")}
              >
                <Text style={styles.bottomLinkText}>Sign up</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.bottomTextContainer}>
              <TouchableOpacity
                style={styles.forgotPassLinkContainer}
                onPress={() => navigation.push("ForgotPassword")}
              >
                <Text style={styles.bottomLinkText}>Forgot your password?</Text>
              </TouchableOpacity>
            </View>
          </View>

          {isLoading === false && error !== "" && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          <NextButton onPress={login} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

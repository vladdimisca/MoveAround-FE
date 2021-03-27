import React, { useState } from "react";
import { StyleSheet, SafeAreaView, StatusBar, View, Text } from "react-native";
import {
  FontAwesome,
  Fontisto,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import CountryPicker from "react-native-country-picker-modal";
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import { CommonActions } from "@react-navigation/native";
import { DotIndicator } from "react-native-indicators";
import Spinner from "react-native-loading-spinner-overlay";

// constants
import colors from "../constants/colors";

// custom components
import { CustomInput } from "../components/CustomInput";
import { NextButton } from "../components/NextButton";

// services
import { UserService } from "../services/UserService";

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
    marginVertical: 20,
    color: colors.text,
  },
  bottomLinkText: {
    fontSize: 18,
    color: colors.darkBlue,
  },
  bottomLinkContainer: {
    marginVertical: 20,
    marginLeft: 5,
  },
  bottomTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  errorText: {
    marginHorizontal: 25,
    color: "red",
    fontSize: 16,
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
  const [repeatPass, setRepeatPass] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [countryCode, setCountryCode] = useState("RO");

  const signUp = async () => {
    if (isLoading === true) {
      return;
    }
    if (password !== repeatPass) {
      setError("Passwords not matching!");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      await UserService.register({
        phoneNumber,
        callingCode,
        email,
        firstName,
        lastName,
        password,
      });
      // redirect to login screen
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Login" }],
        })
      );
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
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Create an account</Text>
        <ScrollView>
          <View>
            <CustomInput
              onTextChange={(phone) => setPhoneNumber(phone)}
              placeholder="Phone number..."
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
                    setCallingCode(newCountry.callingCode.indexOf(0));
                  }}
                />
              }
            />
            <CustomInput
              onTextChange={(fName) => setFirstName(fName)}
              placeholder="First Name..."
              icon={<FontAwesome name="user-o" size={28} color={colors.text} />}
            />
            <CustomInput
              onTextChange={(lName) => setLastName(lName)}
              placeholder="Last Name..."
              icon={<FontAwesome name="user-o" size={28} color={colors.text} />}
            />
            <CustomInput
              onTextChange={(em) => setEmail(em)}
              placeholder="Email..."
              icon={<Fontisto name="email" size={28} color={colors.text} />}
            />
            <CustomInput
              secureTextEntry
              onTextChange={(pass) => setPassword(pass)}
              placeholder="Password..."
              icon={
                // eslint-disable-next-line react/jsx-wrap-multilines
                <MaterialCommunityIcons
                  name="key-outline"
                  size={28}
                  color={colors.text}
                />
              }
            />
            <CustomInput
              secureTextEntry
              onTextChange={(pass) => setRepeatPass(pass)}
              placeholder="Repeat Password..."
              icon={
                // eslint-disable-next-line react/jsx-wrap-multilines
                <MaterialCommunityIcons
                  name="key-outline"
                  size={28}
                  color={colors.text}
                />
              }
            />
          </View>
          <View style={styles.bottomTextContainer}>
            <Text style={styles.bottomText}>Already have an account?</Text>
            <TouchableOpacity
              style={styles.bottomLinkContainer}
              onPress={() => navigation.push("Login")}
            >
              <Text style={styles.bottomLinkText}>Sign in</Text>
            </TouchableOpacity>
          </View>
          {isLoading === false && error !== "" && (
            <Text style={styles.errorText}>{error}</Text>
          )}
          <NextButton onPress={() => signUp()} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

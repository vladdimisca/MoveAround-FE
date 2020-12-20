import React, { useState } from "react";
import { StyleSheet, SafeAreaView, StatusBar, View, Text } from "react-native";
import CountryPicker from "react-native-country-picker-modal";

// constants
import colors from "../../constants/colors";

// custom components
import { CustomInput } from "../../components/CustomInput";
import { NextButton } from "../../components/NextButton";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: "space-between",
  },
  text: {
    fontSize: 22,
    marginHorizontal: 20,
    marginBottom: 20,
    color: colors.text,
  },
});

export default ({ navigation }) => {
  const withFilter = true;
  const withFlag = true;
  const withFlagButton = true;
  const withAlphaFilter = true;
  const withCallingCode = true;
  const withCallingCodeButton = true;
  const [countryCode, setCountryCode] = useState("RO");

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <SafeAreaView style={styles.container}>
        <View>
          <Text style={styles.text}>Enter your phone number</Text>
          <CustomInput
            placeholder="Phone number..."
            icon={
              // eslint-disable-next-line react/jsx-wrap-multilines
              <CountryPicker
                {...{
                  countryCode,
                  withFilter,
                  withFlag,
                  withFlagButton,
                  withCallingCode,
                  withCallingCodeButton,
                  withAlphaFilter,
                  onSelect(newCountry) {
                    setCountryCode(newCountry.cca2);
                  },
                }}
              />
            }
          />
        </View>

        <NextButton onPress={() => navigation.push("Register")} />
      </SafeAreaView>
    </View>
  );
};

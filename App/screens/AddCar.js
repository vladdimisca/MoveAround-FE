import React, { useState, useEffect } from "react";
import { View, StyleSheet, StatusBar, SafeAreaView } from "react-native";
import { Input } from "react-native-elements";
import RNPickerSelect from "react-native-picker-select";
// import MonthPicker from "react-native-month-year-picker";

// constants
import colors from "../constants/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  safeAreaContainer: {
    flex: 1,
  },
  labelStyle: {
    color: colors.text,
    marginHorizontal: 15,
  },
  inputContainerStyle: {
    marginHorizontal: 15,
    paddingHorizontal: 10,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    fontSize: 18,
    marginHorizontal: 25,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.text,
    color: colors.text,
    paddingRight: 30,
  },
});

export default () => {
  // input fields
  const [licensePlate, setLicensePlate] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [year, setYear] = useState(new Date());

  useEffect(() => {});

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.offWhite} />
      <SafeAreaView style={styles.safeAreaContainer}>
        <Input
          autoCapitalize="none"
          label="License Plate"
          labelStyle={styles.labelStyle}
          inputContainerStyle={styles.inputContainerStyle}
          value={licensePlate}
          onChangeText={(licPlate) => setLicensePlate(licPlate)}
        />

        <Input
          label="Make"
          labelStyle={styles.labelStyle}
          inputContainerStyle={styles.inputContainerStyle}
          value={make}
          onChangeText={(mk) => setMake(mk)}
        />

        <Input
          label="Model"
          labelStyle={styles.labelStyle}
          inputContainerStyle={styles.inputContainerStyle}
          value={model}
          onChangeText={(md) => setModel(md)}
        />

        <RNPickerSelect
          style={{ ...pickerSelectStyles }}
          onValueChange={(value) => setColor(value)}
          useNativeAndroidPickerStyle={false}
          placeholder={{
            label: "Select the color of your car...",
            value: null,
          }}
          items={[
            { label: "black", value: "black" },
            { label: "blue", value: "blue" },
            { label: "red", value: "red" },
          ]}
        />
        {/* <MonthPicker
          onChange={(_, yr) => setYear(yr)}
          value={year}
          minimumDate={new Date(1995, 1)}
          maximumDate={new Date()}
          locale="ko"
        /> */}
      </SafeAreaView>
    </View>
  );
};

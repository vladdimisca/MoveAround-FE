import React from "react";
import { StyleSheet, SafeAreaView, StatusBar, View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
    fontSize: 28,
    marginHorizontal: 20,
    marginBottom: 20,
    color: colors.text,
  },
});

export default () => {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <SafeAreaView style={styles.container}>
        <View>
          <Text style={styles.text}>Provide your password</Text>
          <CustomInput
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
        </View>

        <NextButton />
      </SafeAreaView>
    </View>
  );
};

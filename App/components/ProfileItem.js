import React from "react";
import { StyleSheet, View, Dimensions, Text } from "react-native";

import colors from "../constants/colors";

const screen = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  textStyle: {
    fontSize: 18,
    marginHorizontal: 20,
    color: colors.text,
  },
  separator: {
    backgroundColor: colors.border,
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 20,
  },
});

export const ProfileItem = ({ leftIcon, rightIcon, text }) => {
  return (
    <View style={styles.container}>
      {leftIcon}
      <Text
        style={{
          ...styles.textStyle,
          width: rightIcon ? screen.width * 0.6 : screen.width * 0.75,
        }}
      >
        {text}
      </Text>
      {rightIcon}
    </View>
  );
};

export const ItemSeparator = () => {
  return <View style={styles.separator} />;
};

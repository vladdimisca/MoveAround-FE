import React, { useState } from "react";
import { StyleSheet, SafeAreaView, StatusBar, View, Text } from "react-native";

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";

// constants
import colors from "../../constants/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  text: {
    fontSize: 18,
    marginHorizontal: 30,
    marginBottom: 20,
    color: colors.text,
  },
  input: {
    marginHorizontal: 20,
    marginVertical: 10,
    fontSize: 30,
  },
  root: { padding: 20, minHeight: 300 },
  title: { textAlign: "center", fontSize: 30 },
  codeFieldRoot: {
    marginTop: 20,
    width: 280,
    marginLeft: "auto",
    marginRight: "auto",
  },
  cellRoot: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  cellText: {
    color: "#000",
    fontSize: 36,
    textAlign: "center",
  },
  focusCell: {
    borderBottomColor: colors.midBlue,
    borderBottomWidth: 2,
  },
});

const CELL_COUNT = 4;

export default () => {
  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Enter the code sent to 0769 481 003</Text>
        <CodeField
          ref={ref}
          {...props}
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({ index, symbol, isFocused }) => (
            <View
              onLayout={getCellOnLayoutHandler(index)}
              key={index}
              style={[styles.cellRoot, isFocused && styles.focusCell]}
            >
              <Text style={styles.cellText}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            </View>
          )}
        />
      </SafeAreaView>
    </View>
  );
};

import React, { useEffect, useState } from "react";
import { StyleSheet, View, StatusBar, SafeAreaView, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

// constants
import colors from "../constants/colors";

// services
import { CarService } from "../services/CarService";

// storage
import { UserStorage } from "../util/storage/UserStorage";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  safeAreaContainer: {
    flex: 1,
    marginBottom: 25,
    marginTop: 10,
  },
});

export default () => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchCars = async () => {
      const { userId, token } = await UserStorage.retrieveUserIdAndToken();

      CarService.getAllCarsByUserId(userId, token).then((userCars) =>
        setCars(userCars)
      );
    };

    fetchCars();
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <SafeAreaView style={styles.safeAreaContainer}>
        <ScrollView>
          {cars.map((car) => {
            return (
              <View
                style={{
                  marginHorizontal: 20,
                  marginTop: 15,
                  backgroundColor: colors.offWhite,
                  borderRadius: 15,
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: colors.border,
                  padding: 15,
                }}
                key={car.id}
              >
                <Text style={{ fontSize: 14, flexDirection: "row" }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "bold",
                      fontStyle: "italic",
                    }}
                  >
                    License plate:
                  </Text>
                  {` ${car.licensePlate}`}
                </Text>

                <Text style={{ fontSize: 14, flexDirection: "row" }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "bold",
                      fontStyle: "italic",
                    }}
                  >
                    Make:
                  </Text>
                  {` ${car.make}`}
                </Text>

                <Text style={{ fontSize: 14, flexDirection: "row" }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "bold",
                      fontStyle: "italic",
                    }}
                  >
                    Model:
                  </Text>
                  {` ${car.model}`}
                </Text>

                <Text style={{ fontSize: 14, flexDirection: "row" }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "bold",
                      fontStyle: "italic",
                    }}
                  >
                    Color:
                  </Text>
                  {` ${car.color}`}
                </Text>

                <Text style={{ fontSize: 14, flexDirection: "row" }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "bold",
                      fontStyle: "italic",
                    }}
                  >
                    Year:
                  </Text>
                  {` ${car.year}`}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

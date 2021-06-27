import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  Alert,
  ScrollView,
  RefreshControl,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Spinner from "react-native-loading-spinner-overlay";
import { DotIndicator } from "react-native-indicators";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { Entypo } from "react-native-vector-icons";

// constants
import colors from "../constants/colors";

// components
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";

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
  card: {
    marginHorizontal: 20,
    marginTop: 15,
    backgroundColor: colors.offWhite,
    borderRadius: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    fontSize: 15,
    flexDirection: "row",
  },
  innerText: {
    fontSize: 15,
    fontWeight: "bold",
    fontStyle: "italic",
  },
  menuText: {
    color: "#e60000",
    alignSelf: "center",
    fontSize: 15,
    padding: 5,
  },
});

export default ({ navigation }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cars, setCars] = useState([]);

  const fetchCars = useCallback(async () => {
    setIsLoading(true);
    const { userId } = await UserStorage.retrieveUserIdAndToken();

    CarService.getAllCarsByUserId(userId)
      .then(setCars)
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  return (
    <View style={styles.container}>
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

      <SafeAreaView style={styles.safeAreaContainer}>
        <ScrollView
          refreshControl={
            // eslint-disable-next-line react/jsx-wrap-multilines
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => {
                setIsRefreshing(true);
                fetchCars().finally(() => setIsRefreshing(false));
              }}
            />
          }
        >
          {cars.map((car) => {
            return (
              <View style={styles.card} key={car.id}>
                <View>
                  <Text style={styles.text}>
                    <Text style={styles.innerText}>License plate:</Text>
                    {` ${car.licensePlate}`}
                  </Text>

                  <Text style={styles.text}>
                    <Text style={styles.innerText}>Make:</Text>
                    {` ${car.make}`}
                  </Text>

                  <Text style={styles.text}>
                    <Text style={styles.innerText}>Model:</Text>
                    {` ${car.model}`}
                  </Text>

                  <Text style={styles.text}>
                    <Text style={styles.innerText}>Color:</Text>
                    {` ${car.color}`}
                  </Text>

                  <Text style={styles.text}>
                    <Text style={styles.innerText}>Year:</Text>
                    {` ${car.year}`}
                  </Text>
                </View>

                <Menu>
                  <MenuTrigger>
                    <Entypo size={32} name="menu" color={colors.border} />
                  </MenuTrigger>
                  <MenuOptions>
                    <TouchableOpacity activeOpacity={0.7}>
                      <MenuOption
                        onSelect={() =>
                          navigation.push("AddCar", { carId: car.id })
                        }
                      >
                        <Text
                          style={{
                            ...styles.menuText,
                            color: colors.lightBlue,
                          }}
                        >
                          Edit
                        </Text>
                      </MenuOption>
                    </TouchableOpacity>

                    <View
                      style={{
                        backgroundColor: colors.border,
                        height: StyleSheet.hairlineWidth,
                      }}
                    />

                    <TouchableOpacity activeOpacity={0.7}>
                      <MenuOption
                        onSelect={() => {
                          Alert.alert(
                            "Do you really want to delete this car?",
                            "This action is not reversible!",
                            [
                              {
                                text: "Delete",
                                onPress: async () => {
                                  CarService.deleteCarById(car.id).then(() => {
                                    setCars(cars.filter((c) => c !== car));
                                  });
                                },
                              },
                              {
                                text: "Cancel",
                                style: "cancel",
                              },
                            ]
                          );
                        }}
                      >
                        <Text style={styles.menuText}>Delete</Text>
                      </MenuOption>
                    </TouchableOpacity>
                  </MenuOptions>
                </Menu>
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

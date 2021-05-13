import React, { useState, useEffect } from "react";
import { View, SafeAreaView, ScrollView, StyleSheet, Text } from "react-native";
import { DotIndicator } from "react-native-indicators";
import Spinner from "react-native-loading-spinner-overlay";

// geocoder
import Geocoder from "react-native-geocoding";

// constants
import colors from "../constants/colors";

// config
import config from "../../config";

// storage
import { UserStorage } from "../util/storage/UserStorage";

// services
import { RouteService } from "../services/RouteService";

// components
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";
import { RouteCard } from "../components/RouteCard";
import { GeneralButton } from "../components/GeneralButton";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  emptyListText: {
    fontSize: 18,
    alignSelf: "center",
    marginTop: 25,
  },
});

export default ({ navigation }) => {
  // initialize the geocoder
  Geocoder.init(config.API_KEY, { language: "en" });

  const [isDriver, setIsDriver] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [routes, setRoutes] = useState([]);

  const getRoutesAsDriver = async () => {
    setIsLoading(true);
    const { userId, token } = await UserStorage.retrieveUserIdAndToken();

    RouteService.getAllRoutesByUserId(userId, token)
      .then((fetchedRoutes) => {
        return Promise.all(
          fetchedRoutes.map(async (route) => {
            const start = await Geocoder.from({
              latitude: route.startLatitude,
              longitude: route.startLongitude,
            });

            const stop = await Geocoder.from({
              latitude: route.stopLatitude,
              longitude: route.stopLongitude,
            });
            return {
              ...route,
              startAddress: start.results[0].formatted_address,
              stopAddress: stop.results[0].formatted_address,
            };
          })
        );
      })
      .then((fetchedRoutes) => setRoutes(fetchedRoutes))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    (async () => {
      getRoutesAsDriver();
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Spinner
        overlayColor={colors.white}
        customIndicator={
          <DotIndicator color={colors.midBlue} count={3} size={12} />
        }
        visible={isLoading}
      />
      <FocusAwareStatusBar
        barStyle="dark-content"
        backgroundColor={colors.white}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            marginTop: 5,
            paddingBottom: 4,
            position: "absolute",
            backgroundColor: colors.white,
            borderBottomColor: colors.darkBorder,
            borderBottomWidth: StyleSheet.hairlineWidth,
            zIndex: 2,
          }}
        >
          <View style={{ flex: 1, marginRight: -12 }}>
            <GeneralButton
              isActive={isDriver}
              onPress={async () => {
                if (isDriver) {
                  return;
                }

                setIsDriver(true);
                getRoutesAsDriver();
              }}
              text="As driver"
            />
          </View>

          <View style={{ flex: 1, marginLeft: -12 }}>
            <GeneralButton
              isActive={!isDriver}
              onPress={() => setIsDriver(false)}
              text="As passenger"
            />
          </View>
        </View>

        <ScrollView style={{ marginTop: 75 }}>
          {routes.map((route) => {
            return (
              <RouteCard
                key={route.id}
                route={route}
                onImagePress={() =>
                  navigation.push("Profile", { userId: route.user.id })
                }
                onRoutePress={() => navigation.push("ViewRoute", { route })}
              />
            );
          })}
          {routes.length === 0 && (
            <Text style={styles.emptyListText}>
              You don&apos;t have any routes yet!
            </Text>
          )}

          <View style={{ paddingBottom: 15 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

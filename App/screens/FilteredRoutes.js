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

export default ({ route, navigation }) => {
  // initialize the geocoder
  Geocoder.init(config.API_KEY, { language: "en" });

  const [isLoading, setIsLoading] = useState(true);
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const { token } = await UserStorage.retrieveUserIdAndToken();

      const payload = {
        startLatitude: route.params.startLocation.latitude,
        startLongitude: route.params.startLocation.longitude,
        stopLatitude: route.params.stopLocation.latitude,
        stopLongitude: route.params.stopLocation.longitude,
        startDate: route.params.dateTime,
      };

      RouteService.getPossibleRoutes(payload, token)
        .then((fetchedRoutes) => {
          return Promise.all(
            fetchedRoutes.map(async (fetchedRoute) => {
              const start = await Geocoder.from({
                latitude: fetchedRoute.startLatitude,
                longitude: fetchedRoute.startLongitude,
              });

              const stop = await Geocoder.from({
                latitude: fetchedRoute.stopLatitude,
                longitude: fetchedRoute.stopLongitude,
              });
              return {
                ...fetchedRoute,
                startAddress: start.results[0].formatted_address,
                stopAddress: stop.results[0].formatted_address,
              };
            })
          );
        })
        .then((fetchedRoutes) => setRoutes(fetchedRoutes))
        .finally(() => setIsLoading(false));
    })();
  }, [route]);

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
        <ScrollView>
          {routes.map((currentRoute) => {
            return (
              <RouteCard
                key={currentRoute.id}
                route={currentRoute}
                onImagePress={() =>
                  navigation.push("Profile", { userId: currentRoute.user.id })
                }
                onRoutePress={() => console.log("Works too!")}
              />
            );
          })}
          {routes.length === 0 && (
            <Text style={styles.emptyListText}>
              There isn&apos;t any matching route!
            </Text>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

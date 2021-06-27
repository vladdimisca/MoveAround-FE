import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  Alert,
  RefreshControl,
} from "react-native";
import { DotIndicator } from "react-native-indicators";
import Spinner from "react-native-loading-spinner-overlay";
import { CommonActions } from "@react-navigation/routers";
import { decode } from "@mapbox/polyline";

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
import { UserService } from "../services/UserService";
import { RequestService } from "../services/RequestService";

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

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [routes, setRoutes] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [waypoint, setWaypoint] = useState(null);

  const getMatchingRoutes = useCallback(
    async (overlay = true) => {
      const computeRoadDistance = async (from, to) => {
        const urlToFetchDistance = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${from}&destinations=${to}&key=${config.API_KEY}`;

        return fetch(urlToFetchDistance)
          .then((response) => response.json())
          .then((json) => json.rows[0].elements[0].duration.value);
      };

      const areCoordsValid = async (wpStart, wpStop, routeStart, routeStop) => {
        const startStart = await computeRoadDistance(wpStart, routeStart);
        const stopStart = await computeRoadDistance(wpStop, routeStart);
        if (startStart >= stopStart) {
          return false;
        }

        const startStop = await computeRoadDistance(wpStart, routeStop);
        const stopStop = await computeRoadDistance(wpStop, routeStop);
        if (stopStop >= startStop) {
          return false;
        }

        return true;
      };

      const toRadians = (value) => {
        return (value * Math.PI) / 180;
      };

      const computeDistance = (origin, destination) => {
        const R = 6371; // radius of the earth

        const latDistance = toRadians(destination[0] - origin[0]);
        const lonDistance = toRadians(destination[1] - origin[1]);
        const a =
          Math.sin(latDistance / 2) * Math.sin(latDistance / 2) +
          Math.cos(toRadians(origin[0])) *
            Math.cos(toRadians(destination[0])) *
            Math.sin(lonDistance / 2) *
            Math.sin(lonDistance / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return distance;
      };

      const isLocationCloseToPath = (location, poly, tolerance) => {
        for (let i = 0; i < poly.length - 1; i += 1) {
          const distanceACB =
            computeDistance(poly[i], location) +
            computeDistance(poly[i + 1], location);
          const distanceAB = computeDistance(poly[i], poly[i + 1]);

          if (distanceACB - distanceAB < tolerance) {
            return true;
          }
        }

        return false;
      };

      if (overlay) {
        setIsLoading(true);
      }

      const { userId } = await UserStorage.retrieveUserIdAndToken();

      await UserService.getUserById(userId).then(setCurrentUser);

      const subRoute = {
        startLatitude: route.params.startLocation.latitude,
        startLongitude: route.params.startLocation.longitude,
        stopLatitude: route.params.stopLocation.latitude,
        stopLongitude: route.params.stopLocation.longitude,
      };
      setWaypoint(subRoute);

      const origin = [subRoute.startLatitude, subRoute.startLongitude];
      const destination = [subRoute.stopLatitude, subRoute.stopLongitude];

      RouteService.getPossibleRoutes(route.params.dateTime).then(
        async (fetchedRoutes) => {
          Promise.all(
            fetchedRoutes.map(async (fetchedRoute) => {
              const startLocation = `${fetchedRoute.startLatitude},${fetchedRoute.startLongitude}`;
              const stopLocation = `${fetchedRoute.stopLatitude},${fetchedRoute.stopLongitude}`;

              const valid = await areCoordsValid(
                `${origin[0]},${origin[1]}`,
                `${destination[0]},${destination[1]}`,
                startLocation,
                stopLocation
              );
              if (!valid) {
                return false;
              }

              const urlToFetchDirections = `https://maps.googleapis.com/maps/api/directions/json?origin=${startLocation}&destination=${stopLocation}&key=${config.API_KEY}`;
              const poly = await fetch(urlToFetchDirections)
                .then((resp) => resp.json())
                .then((json) =>
                  decode(json.routes[0].overview_polyline.points)
                );

              const checkStartPoint = isLocationCloseToPath(origin, poly, 5);
              const checkStopPoint = isLocationCloseToPath(
                destination,
                poly,
                5
              );

              return checkStartPoint && checkStopPoint;
            })
          )
            .then(async (booleanValues) => {
              const filteredRoutes = fetchedRoutes.filter(
                (_r, index) => booleanValues[index]
              );

              return Promise.all(
                filteredRoutes.map(async (filteredRoute) => {
                  const start = await Geocoder.from({
                    latitude: filteredRoute.startLatitude,
                    longitude: filteredRoute.startLongitude,
                  });

                  const stop = await Geocoder.from({
                    latitude: filteredRoute.stopLatitude,
                    longitude: filteredRoute.stopLongitude,
                  });
                  return {
                    ...filteredRoute,
                    startAddress: start.results[0].formatted_address,
                    stopAddress: stop.results[0].formatted_address,
                  };
                })
              );
            })
            .then(setRoutes)
            .finally(() => setIsLoading(false));
        }
      );
    },
    [route]
  );

  useEffect(() => {
    getMatchingRoutes();
  }, [getMatchingRoutes]);

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
        <ScrollView
          refreshControl={
            // eslint-disable-next-line react/jsx-wrap-multilines
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => {
                setIsRefreshing(true);
                getMatchingRoutes(false).finally(() => setIsRefreshing(false));
              }}
            />
          }
        >
          {routes.map((currentRoute) => {
            return (
              <RouteCard
                isRequest
                key={currentRoute.id}
                route={currentRoute}
                currentUser={currentUser}
                onImagePress={() =>
                  navigation.push("Profile", { userId: currentRoute.user.id })
                }
                onRoutePress={() =>
                  navigation.push("ViewRoute", { route: currentRoute })
                }
                onSelect={async () => {
                  setIsLoading(true);

                  RequestService.createRequest({
                    ...waypoint,
                    route: { id: currentRoute.id },
                  })
                    .then(() => {
                      navigation.dispatch(
                        CommonActions.reset({
                          index: 0,
                          key: null,
                          routes: [
                            {
                              name: "App",
                              state: {
                                routes: [{ name: "Requests" }],
                              },
                            },
                          ],
                        })
                      );
                    })
                    .catch((err) => {
                      let alertMessage = "Oops, something went wrong!";
                      if (
                        err &&
                        err.response &&
                        err.response.request &&
                        err.response.request._response
                      ) {
                        alertMessage = `${
                          JSON.parse(err.response.request._response)
                            .errorMessage
                        }`;
                      }

                      Alert.alert(
                        "The request was not registered!",
                        alertMessage,
                        [
                          {
                            text: "Ok",
                            style: "cancel",
                          },
                        ]
                      );
                    })
                    .finally(() => setIsLoading(false));
                }}
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

import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  Alert,
} from "react-native";
import { DotIndicator } from "react-native-indicators";
import Spinner from "react-native-loading-spinner-overlay";
import { CommonActions } from "@react-navigation/routers";

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

  const [isLoading, setIsLoading] = useState(true);
  const [routes, setRoutes] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [waypoint, setWaypoint] = useState(null);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const { userId, token } = await UserStorage.retrieveUserIdAndToken();

      await UserService.getUserById(userId, token).then((user) =>
        setCurrentUser(user)
      );

      const payload = {
        startLatitude: route.params.startLocation.latitude,
        startLongitude: route.params.startLocation.longitude,
        stopLatitude: route.params.stopLocation.latitude,
        stopLongitude: route.params.stopLocation.longitude,
      };
      setWaypoint(payload);

      RouteService.getPossibleRoutes(
        { ...payload, startDate: route.params.dateTime },
        token
      )
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
                  const { token } = await UserStorage.retrieveUserIdAndToken();

                  RequestService.createRequest(
                    { ...waypoint, route: { id: currentRoute.id } },
                    token
                  )
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

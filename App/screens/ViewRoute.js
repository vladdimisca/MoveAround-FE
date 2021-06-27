import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { DotIndicator } from "react-native-indicators";
import Spinner from "react-native-loading-spinner-overlay";
import { CommonActions } from "@react-navigation/routers";
import moment from "moment";

// geocoder
import Geocoder from "react-native-geocoding";

// constants
import colors from "../constants/colors";

// config
import config from "../../config";

// services
import { RouteService } from "../services/RouteService";
import { UserService } from "../services/UserService";

// storage
import { UserStorage } from "../util/storage/UserStorage";

// components
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";
import { ProfileItem, ItemSeparator } from "../components/ProfileItem";
import { RouteCard } from "../components/RouteCard";

const styles = StyleSheet.create({
  addressText: {
    fontSize: 18,
    fontWeight: "bold",
    fontStyle: "italic",
  },
  dropdown: {
    marginTop: -12,
    marginHorizontal: 25,
    marginBottom: 20,
  },
  labelStyle: {
    color: colors.text,
    marginHorizontal: 15,
  },
  inputContainerStyle: {
    marginHorizontal: 15,
    paddingHorizontal: 10,
  },
  line: {
    height: 2 * StyleSheet.hairlineWidth,
    backgroundColor: colors.darkBorder,
  },
  choose: {
    marginLeft: 10,
    marginBottom: 12,
    fontSize: 16,
    color: colors.lightText,
  },
  dateContainer: {
    marginHorizontal: 25,
    marginVertical: 22,
  },
  dateTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  waypointsTitle: {
    marginTop: 12,
    fontSize: 22,
    fontStyle: "italic",
    alignSelf: "center",
  },
  emptyListText: {
    fontSize: 15,
    alignSelf: "center",
    marginTop: 7,
  },
});

export default ({ route, navigation }) => {
  // initialize the geocoder
  Geocoder.init(config.API_KEY, { language: "en" });

  const [isLoading, setIsLoading] = useState(true);

  const [startAddress, setStartAddress] = useState("");
  const [stopAddress, setStopAddress] = useState("");
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [currentRoute, setCurrentRoute] = useState({});
  const [waypoints, setWaypoints] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const getDateFromString = (strDate) => {
    const date = new Date(strDate);
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  };

  useEffect(() => {
    (async () => {
      setCurrentRoute(route.params.route);
      setIsLoading(true);

      const urlToFetchDistance = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${route.params.route.startLatitude},${route.params.route.startLongitude}&destinations=${route.params.route.stopLatitude}%2C${route.params.route.stopLongitude}&key=${config.API_KEY}`;

      fetch(urlToFetchDistance)
        .then((response) => response.json())
        .then((json) => {
          setStartAddress(json.origin_addresses[0]);
          setStopAddress(json.destination_addresses[0]);
          setDistance(json.rows[0].elements[0].distance.text);
          setDuration(json.rows[0].elements[0].duration.text);
        })
        .then(async () => {
          const { userId } = await UserStorage.retrieveUserIdAndToken();

          await UserService.getUserById(userId).then((user) =>
            setCurrentUser(user)
          );

          RouteService.getWaypoints(route.params.route.id)
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
            .then(setWaypoints)
            .finally(() => setIsLoading(false));
        });
    })();
  }, [route]);

  return (
    <View>
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
      <SafeAreaView style={{ paddingBottom: 15 }}>
        <ScrollView>
          <ProfileItem
            leftIcon={<Text style={styles.addressText}>From:</Text>}
            text={startAddress}
          />

          <ItemSeparator />

          <ProfileItem
            leftIcon={<Text style={styles.addressText}>To:</Text>}
            text={stopAddress}
          />

          <ItemSeparator />

          <ProfileItem
            leftIcon={<Text style={styles.addressText}>Distance:</Text>}
            text={distance}
          />

          <ItemSeparator />

          <ProfileItem
            leftIcon={<Text style={styles.addressText}>Duration:</Text>}
            text={duration}
          />

          <ItemSeparator />

          <ProfileItem
            leftIcon={<Text style={styles.addressText}>Date:</Text>}
            text={`${moment(getDateFromString(currentRoute?.startDate)).format(
              "llll"
            )}`}
          />

          <ItemSeparator />

          <ProfileItem
            leftIcon={<Text style={styles.addressText}>Car:</Text>}
            text={currentRoute?.car?.licensePlate}
          />

          <ItemSeparator />

          <ProfileItem
            leftIcon={<Text style={styles.addressText}>Price:</Text>}
            text={`${currentRoute?.price} $`}
          />

          <ItemSeparator />

          <ProfileItem
            leftIcon={<Text style={styles.addressText}>No. of seats:</Text>}
            text={currentRoute?.availableSeats}
          />

          <ItemSeparator />

          <Text style={styles.waypointsTitle}>Waypoints</Text>

          {waypoints.length === 0 && (
            <Text style={styles.emptyListText}>
              This route doesn&apos;t have any waypoints yet!
            </Text>
          )}

          {waypoints.map((waypoint) => {
            return (
              <RouteCard
                key={waypoint.id}
                route={waypoint}
                currentUser={currentUser}
                onImagePress={() =>
                  navigation.push("Profile", { userId: waypoint.user.id })
                }
                onSelect={() => {
                  Alert.alert(
                    "Do you really want to remove this waypoint?",
                    "This action is not reversible!",
                    [
                      {
                        text: "Delete",
                        onPress: async () => {
                          setIsLoading(true);

                          RouteService.deleteRouteById(waypoint.id)
                            .then(() => {
                              setWaypoints(
                                waypoints.filter((w) => w !== waypoint)
                              );
                              navigation.dispatch(
                                CommonActions.reset({
                                  index: 0,
                                  key: null,
                                  routes: [
                                    {
                                      name: "App",
                                      state: {
                                        routes: [{ name: "Routes" }],
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
                                "Could not delete this waypoint!",
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
                        },
                      },
                      {
                        text: "Cancel",
                        style: "cancel",
                      },
                    ]
                  );
                }}
              />
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

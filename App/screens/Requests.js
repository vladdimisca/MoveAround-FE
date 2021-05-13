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
import { RequestService } from "../services/RequestService";

// components
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";
import { RequestCard } from "../components/RequestCard";
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
  const [requests, setRequests] = useState([]);

  const getRequests = async (action) => {
    setIsLoading(true);
    const { token } = await UserStorage.retrieveUserIdAndToken();

    action(token)
      .then((fetchedRequests) => {
        return Promise.all(
          fetchedRequests.map(async (request) => {
            const start = await Geocoder.from({
              latitude: request.startLatitude,
              longitude: request.startLongitude,
            });

            const stop = await Geocoder.from({
              latitude: request.stopLatitude,
              longitude: request.stopLongitude,
            });
            return {
              ...request,
              startAddress: start.results[0].formatted_address,
              stopAddress: stop.results[0].formatted_address,
            };
          })
        );
      })
      .then((fetchedRequests) => setRequests(fetchedRequests))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    (async () => {
      getRequests(RequestService.getReceivedRequests);
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
                getRequests(RequestService.getReceivedRequests);
              }}
              text="Received"
            />
          </View>

          <View style={{ flex: 1, marginLeft: -12 }}>
            <GeneralButton
              isActive={!isDriver}
              onPress={() => {
                if (!isDriver) {
                  return;
                }

                setIsDriver(false);
                getRequests(RequestService.getSentRequests);
              }}
              text="Sent"
            />
          </View>
        </View>

        <ScrollView style={{ marginTop: 75 }}>
          {requests.map((request) => {
            return (
              <RequestCard
                key={request.id}
                request={request}
                onImagePress={() =>
                  navigation.push("Profile", { userId: request.user.id })
                }
                onRoutePress={() =>
                  navigation.push("ViewRoute", { route: request.route })
                }
              />
            );
          })}
          {requests.length === 0 && (
            <Text style={styles.emptyListText}>
              You don&apos;t have any requests yet!
            </Text>
          )}

          <View style={{ paddingBottom: 15 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

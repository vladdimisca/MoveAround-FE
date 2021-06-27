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

// constants
import colors from "../constants/colors";

// config
import config from "../../config";

// storage
import { UserStorage } from "../util/storage/UserStorage";

// services
import { RequestService } from "../services/RequestService";
import { UserService } from "../services/UserService";

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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDriver, setIsDriver] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const getRequests = useCallback(async (action, overlay = true) => {
    if (overlay) {
      setIsLoading(true);
    }

    const { userId } = await UserStorage.retrieveUserIdAndToken();

    await UserService.getUserById(userId).then(setCurrentUser);

    action()
      .then((fetchedRequests) => {
        return Promise.all(
          fetchedRequests.map(async (request) => {
            const urlToFetchDistance = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${request.startLatitude},${request.startLongitude}&destinations=${request.stopLatitude}%2C${request.stopLongitude}&key=${config.API_KEY}`;

            const result = await fetch(urlToFetchDistance).then((response) =>
              response.json()
            );

            return {
              ...request,
              startAddress: result.origin_addresses[0],
              stopAddress: result.destination_addresses[0],
              distance: result.rows[0].elements[0].distance.text,
            };
          })
        );
      })
      .then(setRequests)
      .finally(() => setIsLoading(false));
  }, []);

  const handleRequest = async (requestId, action) => {
    setIsLoading(true);

    action(requestId)
      .then(() => {
        setRequests(requests.filter((req) => req.id !== requestId));
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
            JSON.parse(err.response.request._response).errorMessage
          }`;
        }

        Alert.alert("Could not perform this action!", alertMessage, [
          {
            text: "Ok",
            style: "cancel",
          },
        ]);
        if (isDriver) {
          getRequests(RequestService.getReceivedRequests);
        } else {
          getRequests(RequestService.getSentRequests);
        }
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    getRequests(RequestService.getReceivedRequests);
  }, [getRequests]);

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

        <ScrollView
          refreshControl={
            // eslint-disable-next-line react/jsx-wrap-multilines
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => {
                setIsRefreshing(true);

                const actionType = isDriver
                  ? RequestService.getReceivedRequests
                  : RequestService.getSentRequests;

                getRequests(actionType, false).finally(() =>
                  setIsRefreshing(false)
                );
              }}
            />
          }
          style={{ marginTop: 75 }}
        >
          {requests.map((request) => {
            return (
              <RequestCard
                key={request.id}
                request={request}
                currentUser={currentUser}
                onImagePress={() =>
                  navigation.push("Profile", { userId: request.user.id })
                }
                onRoutePress={() =>
                  navigation.push("ViewRoute", { route: request.route })
                }
                onDelete={
                  request.user.id === currentUser.id
                    ? async () => {
                        handleRequest(request.id, RequestService.deleteRequest);
                      }
                    : () => null
                }
                onAccept={
                  request.route.user.id === currentUser.id
                    ? async () => {
                        handleRequest(request.id, RequestService.acceptRequest);
                      }
                    : () => null
                }
                onReject={
                  request.route.user.id === currentUser.id
                    ? async () => {
                        handleRequest(request.id, RequestService.rejectRequest);
                      }
                    : () => null
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

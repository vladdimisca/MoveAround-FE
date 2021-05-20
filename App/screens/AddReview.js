import React, { useState, useEffect } from "react";
import { View, StyleSheet, SafeAreaView, Text, ScrollView } from "react-native";
import { CommonActions } from "@react-navigation/native";
import { DotIndicator } from "react-native-indicators";
import Spinner from "react-native-loading-spinner-overlay";

// constants
import colors from "../constants/colors";

// components
import { GeneralButton } from "../components/GeneralButton";
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";

// services
import { ReviewService } from "../services/ReviewService";

// storage
import { UserStorage } from "../util/storage/UserStorage";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  safeAreaContainer: {
    flex: 1,
    marginTop: 25,
  },
  labelStyle: {
    color: colors.text,
    marginHorizontal: 15,
  },
  inputContainerStyle: {
    marginHorizontal: 15,
    paddingHorizontal: 10,
  },
  errorText: {
    marginHorizontal: 25,
    color: "red",
    fontSize: 16,
    alignSelf: "center",
  },
});

export default ({ navigation, route }) => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fetchingReview, setFetchingReview] = useState(true);
  const [review, setReview] = useState({
    id: null,
    rating: "",
    travelRole: "",
  });

  useEffect(() => {
    const fetchCar = async () => {
      if (route.params && route.params.reviewId) {
        setFetchingReview(true);
        navigation.setOptions({ title: "Update your review" });

        const { token } = await UserStorage.retrieveUserIdAndToken();
        ReviewService.getReviewById(route.params.reviewId, token)
          .then(setReview)
          .finally(() => setFetchingReview(false));
      } else {
        setFetchingReview(false);
      }
    };

    fetchCar();
  }, [route, navigation]);

  return (
    <View style={styles.container}>
      <Spinner
        overlayColor={colors.white}
        customIndicator={
          <DotIndicator color={colors.midBlue} count={3} size={12} />
        }
        visible={fetchingReview}
      />
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
        <ScrollView>
          {isLoading === false && error !== "" && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          <GeneralButton
            text={review.id === null ? "Add review" : "Update review"}
            onPress={async () => {
              if (isLoading === true) {
                return;
              }
              setError("");
              setIsLoading(true);

              const { token } = await UserStorage.retrieveUserIdAndToken();

              const response =
                review.id === null
                  ? delete review.id &&
                    ReviewService.createReview(review, token)
                  : ReviewService.updateReviewById(review.id, review, token);

              response
                .then(() => {
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      key: null,
                      routes: [
                        {
                          name: "App",
                          state: {
                            routes: [{ name: "Cars" }],
                          },
                        },
                      ],
                    })
                  );
                })
                .catch((err) => {
                  if (
                    err &&
                    err.response &&
                    err.response.request &&
                    err.response.request._response
                  ) {
                    setError(
                      `${
                        JSON.parse(err.response.request._response).errorMessage
                      }`
                    );
                  } else {
                    setError("Oops, something went wrong!");
                  }
                })
                .finally(() => setIsLoading(false));
            }}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

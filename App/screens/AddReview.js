import React, { useState, useEffect } from "react";
import { View, StyleSheet, SafeAreaView, Text, ScrollView } from "react-native";
import { DotIndicator } from "react-native-indicators";
import Spinner from "react-native-loading-spinner-overlay";
import { Dropdown } from "sharingan-rn-modal-dropdown";
import { Input } from "react-native-elements";

// constants
import colors from "../constants/colors";

// components
import { GeneralButton } from "../components/GeneralButton";
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";

// services
import { ReviewService } from "../services/ReviewService";

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
    color: colors.lightText,
    marginBottom: 5,
    marginHorizontal: 15,
  },
  inputContainerStyle: {
    marginHorizontal: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 2 * StyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderRadius: 10,
  },
  errorText: {
    marginHorizontal: 25,
    color: "red",
    fontSize: 14,
    alignSelf: "center",
  },
  dropdown: {
    marginTop: -10,
    marginHorizontal: 25,
    marginBottom: 20,
  },
  detailText: {
    flex: 1,
    fontSize: 15,
  },
});

export default ({ navigation, route }) => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fetchingReview, setFetchingReview] = useState(true);
  const travelRoles = [
    { value: "PASSENGER", label: "Passenger" },
    { value: "DRIVER", label: "Driver" },
  ];
  const ratings = [
    {
      value: 1,
      label: "1 ★",
    },
    {
      value: 2,
      label: "2 ★",
    },
    {
      value: 3,
      label: "3 ★",
    },
    {
      value: 4,
      label: "4 ★",
    },
    {
      value: 5,
      label: "5 ★",
    },
  ];
  const [review, setReview] = useState({
    id: null,
    rating: null,
    travelRole: null,
    text: "",
    receiver: {
      id: null,
    },
  });

  useEffect(() => {
    const fetchReview = async () => {
      if (route.params && route.params.userId) {
        setReview((value) => {
          return { ...value, receiver: { id: route.params.userId } };
        });
      }

      if (route.params && route.params.reviewId) {
        setFetchingReview(true);
        navigation.setOptions({ title: "Update your review" });

        ReviewService.getReviewById(route.params.reviewId)
          .then(setReview)
          .finally(() => setFetchingReview(false));
      } else {
        setFetchingReview(false);
      }
    };

    fetchReview();
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
          <View style={styles.dropdown}>
            <Dropdown
              label="Rating..."
              data={ratings}
              value={review.rating}
              onChange={(rating) => setReview({ ...review, rating })}
            />
          </View>

          <View style={styles.dropdown}>
            <Dropdown
              label="Traveled as..."
              data={travelRoles}
              value={review.travelRole}
              onChange={(travelRole) => setReview({ ...review, travelRole })}
            />
          </View>

          <Input
            multiline
            maxLength={200}
            label="Comment"
            placeholder="Leave a comment..."
            labelStyle={styles.labelStyle}
            inputContainerStyle={styles.inputContainerStyle}
            value={review.text}
            onChangeText={(text) =>
              setReview((value) => {
                return { ...value, text };
              })
            }
          />

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

              const payload = { ...review };

              const response =
                review.id === null
                  ? delete payload.id && ReviewService.createReview(payload)
                  : ReviewService.updateReviewById(payload.id, payload);

              response
                .then(() => {
                  // go back to receiver profile
                  navigation.pop(2);
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

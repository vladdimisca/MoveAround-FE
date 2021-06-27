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

// storage
import { UserStorage } from "../util/storage/UserStorage";

// services
import { UserService } from "../services/UserService";
import { ReviewService } from "../services/ReviewService";

// components
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";
import { GeneralButton } from "../components/GeneralButton";
import { ReviewCard } from "../components/ReviewCard";

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
  reviewButton: {
    position: "absolute",
    marginBottom: 8,
    zIndex: 2,
  },
});

export default ({ route, navigation }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchReviews = useCallback(
    async (overlay = true) => {
      if (overlay) {
        setIsLoading(true);
      }

      const { userId } = await UserStorage.retrieveUserIdAndToken();

      await UserService.getUserById(userId).then(setCurrentUser);

      ReviewService.getReviewsByUserId(route.params.userId)
        .then(setReviews)
        .finally(() => setIsLoading(false));
    },
    [route]
  );

  useEffect(() => {
    fetchReviews();
  }, [route, fetchReviews]);

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
                fetchReviews(false).finally(() => setIsRefreshing(false));
              }}
            />
          }
        >
          {reviews.map((review) => {
            return (
              <ReviewCard
                key={review.id}
                review={review}
                currentUser={currentUser}
                onImagePress={() =>
                  navigation.push("Profile", {
                    userId: review.sender.id,
                  })
                }
                onUpdate={() =>
                  navigation.push("AddReview", {
                    reviewId: review.id,
                  })
                }
                onDelete={async () => {
                  Alert.alert(
                    "Do you really want to remove this review?",
                    "This action is not reversible!",
                    [
                      {
                        text: "Delete",
                        onPress: async () => {
                          setIsLoading(true);

                          ReviewService.deleteReviewById(review.id)
                            .then(() => {
                              setReviews(reviews.filter((r) => r !== review));
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
                                "Could not delete this review!",
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

          {reviews.length === 0 && (
            <Text style={styles.emptyListText}>There is no review yet!</Text>
          )}

          <View style={{ paddingBottom: 15 }} />
        </ScrollView>

        {currentUser?.role !== "ADMIN" &&
          currentUser?.id !== route.params.userId && (
            <GeneralButton
              style={styles.reviewButton}
              text="Leave a review"
              onPress={() =>
                navigation.push("AddReview", { userId: route.params.userId })
              }
            />
          )}
      </SafeAreaView>
    </View>
  );
};

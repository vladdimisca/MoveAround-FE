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
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const { userId, token } = await UserStorage.retrieveUserIdAndToken();

      await UserService.getUserById(userId, token).then(setCurrentUser);

      ReviewService.getReviewsByUserId(route.params.userId, token)
        .then(setReviews)
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
                          const {
                            token,
                          } = await UserStorage.retrieveUserIdAndToken();

                          ReviewService.deleteReviewById(review.id, token)
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

        {currentUser?.id !== route.params.userId && (
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

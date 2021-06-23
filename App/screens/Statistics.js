import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  SafeAreaView,
  Dimensions,
  Text,
  StyleSheet,
  RefreshControl,
  ScrollView,
} from "react-native";
import { DotIndicator } from "react-native-indicators";
import Spinner from "react-native-loading-spinner-overlay";
import { PieChart, LineChart } from "react-native-chart-kit";

// constants
import colors from "../constants/colors";

// components
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";

// service
import { UserService } from "../services/UserService";
import { RouteService } from "../services/RouteService";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 15,
    color: colors.text,
    marginVertical: 10,
    fontWeight: "bold",
  },
  text1: {
    fontSize: 16,
    marginHorizontal: 15,
    color: colors.text,
    marginTop: 6,
    marginBottom: 15,
    fontWeight: "bold",
  },
  text2: {
    fontSize: 16,
    marginHorizontal: 15,
    color: colors.text,
    marginVertical: 10,
    fontWeight: "bold",
  },
});

export default () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [noOfRoutes, setNoOfRoutes] = useState(null);
  const [users, setUsers] = useState([]);
  const [joinStats, setJoinStats] = useState(null);

  const fetchStatistics = useCallback(async (overlay = true) => {
    if (overlay) {
      setIsLoading(true);
    }

    await UserService.getAllUsers().then(setUsers);
    await UserService.getJoinStatistics().then(setJoinStats);
    await RouteService.getNumberOfRoutes()
      .then(setNoOfRoutes)
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  return (
    <View style={{ flex: 1 }}>
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
      <SafeAreaView style={styles.container}>
        <ScrollView
          refreshControl={
            // eslint-disable-next-line react/jsx-wrap-multilines
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => {
                setIsRefreshing(true);
                fetchStatistics(false).finally(() => setIsRefreshing(false));
              }}
            />
          }
        >
          <Text style={styles.title}>
            {`Total number of registered users: ${users?.length}`}
          </Text>

          <Text style={styles.text1}>
            Users that joined in the current year
          </Text>

          <LineChart
            style={{
              marginRight: 10,
            }}
            data={{
              labels: joinStats ? joinStats.labels : ["January"],
              datasets: [
                {
                  data: joinStats ? joinStats.data : [0],
                  color: () => colors.midBlue,
                  strokeWidth: 2,
                },
              ],
            }}
            fromZero
            width={Dimensions.get("window").width}
            height={250}
            chartConfig={{
              backgroundColor: colors.white,
              backgroundGradientFrom: colors.white,
              backgroundGradientTo: colors.white,
              color: () => colors.text,
              barPercentage: 0.5,
              useShadowColorFromDataset: false,
            }}
          />

          <Text style={styles.text2}>Number of routes added by users</Text>

          <PieChart
            data={[
              {
                name: "As driver",
                count: noOfRoutes ? noOfRoutes.DRIVER : 0,
                color: colors.midBlue,
                legendFontColor: colors.lightText,
                legendFontSize: 15,
              },
              {
                name: "As passenger",
                count: noOfRoutes ? noOfRoutes.PASSENGER : 0,
                color: "red",
                legendFontColor: colors.lightText,
                legendFontSize: 15,
              },
            ]}
            chartConfig={{
              color: () => colors.lightText,
              barPercentage: 0.5,
              useShadowColorFromDataset: false, // optional
            }}
            width={Dimensions.get("window").width}
            height={230}
            accessor="count"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

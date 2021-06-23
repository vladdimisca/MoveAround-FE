import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  MaterialIcons,
  FontAwesome5,
  Octicons,
} from "react-native-vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

// constants
import colors from "../constants/colors";

// root navigation
import { navigationRef } from "../util/RootNavigation";

// screens
import Splash from "../screens/Splash";
import Register from "../screens/Register";
import Login from "../screens/Login";
import Confirmation from "../screens/Confirmation";
import Profile from "../screens/Profile";
import Settings from "../screens/Settings";
import Cars from "../screens/Cars";
import ForgotPassword from "../screens/ForgotPassword";
import ChangePassword from "../screens/ChangePassword";
import Travel from "../screens/Travel";
import ProvideRoute from "../screens/ProvideRoute";
import AddCar from "../screens/AddCar";
import CompleteRoute from "../screens/CompleteRoute";
import Routes from "../screens/Routes";
import RouteDateFilter from "../screens/RouteDateFilter";
import FilteredRoutes from "../screens/FilteredRoutes";
import ViewRoute from "../screens/ViewRoute";
import Requests from "../screens/Requests";
import Reviews from "../screens/Reviews";
import AddReview from "../screens/AddReview";
import DeleteAccount from "../screens/DeleteAccount";
import Statistics from "../screens/Statistics";
import Users from "../screens/Users";

const emptyHeaderOptions = {
  title: null,
  headerStyle: {
    backgroundColor: colors.white,
    elevation: 0,
  },
};

const headerOptions = {
  headerStyle: { backgroundColor: colors.white },
  headerTitleAlign: "center",
};

const tabBarOptions = {
  activeTintColor: colors.lightBlue,
  style: {
    backgroundColor: colors.offWhite,
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
};

const AuthenticationStack = createStackNavigator();
const AuthenticationStackScreen = () => (
  <AuthenticationStack.Navigator initialRouteName="Splash">
    <AuthenticationStack.Screen
      name="Splash"
      component={Splash}
      options={{ headerShown: false }}
    />
    <AuthenticationStack.Screen
      name="Register"
      component={Register}
      options={emptyHeaderOptions}
    />
    <AuthenticationStack.Screen
      name="ForgotPassword"
      component={ForgotPassword}
      options={emptyHeaderOptions}
    />
    <AuthenticationStack.Screen
      name="Login"
      component={Login}
      options={emptyHeaderOptions}
    />
  </AuthenticationStack.Navigator>
);

const ProfileStack = createStackNavigator();
const ProfileStackScreen = () => (
  <ProfileStack.Navigator initialRouteName="Profile">
    <ProfileStack.Screen
      name="Profile"
      component={Profile}
      options={{ headerShown: false }}
    />
    <ProfileStack.Screen
      name="Settings"
      component={Settings}
      options={headerOptions}
    />
    <ProfileStack.Screen
      name="Confirmation"
      component={Confirmation}
      options={emptyHeaderOptions}
    />
    <ProfileStack.Screen
      name="ChangePassword"
      component={ChangePassword}
      options={emptyHeaderOptions}
    />
    <ProfileStack.Screen
      name="DeleteAccount"
      component={DeleteAccount}
      options={emptyHeaderOptions}
    />
    <ProfileStack.Screen
      name="Reviews"
      component={Reviews}
      options={{ ...headerOptions, title: "Reviews" }}
    />
    <ProfileStack.Screen
      name="AddReview"
      component={AddReview}
      options={{ ...headerOptions, title: "Leave a review" }}
    />
  </ProfileStack.Navigator>
);

const CarsStack = createStackNavigator();
const CarsStackScreen = () => (
  <CarsStack.Navigator initialRouteName="Cars">
    <CarsStack.Screen
      name="Cars"
      component={Cars}
      options={({ navigation }) => ({
        ...headerOptions,
        headerRight: () => (
          <TouchableOpacity
            style={{ paddingHorizontal: 12 }}
            activeOpacity={0.7}
            onPress={() => navigation.push("AddCar")}
          >
            <FontAwesome5
              name="plus-circle"
              size={32}
              color={colors.lightBlue}
              style={{ alignSelf: "center" }}
            />
          </TouchableOpacity>
        ),
      })}
    />
    <CarsStack.Screen
      name="AddCar"
      component={AddCar}
      options={{ ...headerOptions, title: "Add a new car" }}
    />
  </CarsStack.Navigator>
);

const RoutesStack = createStackNavigator();
const RoutesStackScreen = () => (
  <RoutesStack.Navigator initialRouteName="Routes">
    <RoutesStack.Screen
      name="Routes"
      component={Routes}
      options={{ ...headerOptions, title: "Routes" }}
    />
    <RoutesStack.Screen
      name="Profile"
      component={Profile}
      options={{ headerShown: false }}
    />
    <RoutesStack.Screen
      name="Settings"
      component={Settings}
      options={headerOptions}
    />
    <RoutesStack.Screen
      name="Confirmation"
      component={Confirmation}
      options={emptyHeaderOptions}
    />
    <RoutesStack.Screen
      name="ChangePassword"
      component={ChangePassword}
      options={emptyHeaderOptions}
    />
    <RoutesStack.Screen
      name="DeleteAccount"
      component={DeleteAccount}
      options={emptyHeaderOptions}
    />
    <RoutesStack.Screen
      name="Reviews"
      component={Reviews}
      options={{ ...headerOptions, title: "Reviews" }}
    />
    <RoutesStack.Screen
      name="AddReview"
      component={AddReview}
      options={{ ...headerOptions, title: "Leave a review" }}
    />
    <RoutesStack.Screen
      name="ViewRoute"
      component={ViewRoute}
      options={{ ...headerOptions, title: "View route details" }}
    />
  </RoutesStack.Navigator>
);

const RequestsStack = createStackNavigator();
const RequestsStackScreen = () => (
  <RequestsStack.Navigator initialRouteName="Requests">
    <RequestsStack.Screen
      name="Requests"
      component={Requests}
      options={{ ...headerOptions, title: "Requests" }}
    />
    <RequestsStack.Screen
      name="Profile"
      component={Profile}
      options={{ headerShown: false }}
    />
    <RequestsStack.Screen
      name="Settings"
      component={Settings}
      options={headerOptions}
    />
    <RequestsStack.Screen
      name="Confirmation"
      component={Confirmation}
      options={emptyHeaderOptions}
    />
    <RequestsStack.Screen
      name="ChangePassword"
      component={ChangePassword}
      options={emptyHeaderOptions}
    />
    <RequestsStack.Screen
      name="DeleteAccount"
      component={DeleteAccount}
      options={emptyHeaderOptions}
    />
    <RequestsStack.Screen
      name="Reviews"
      component={Reviews}
      options={{ ...headerOptions, title: "Reviews" }}
    />
    <RequestsStack.Screen
      name="AddReview"
      component={AddReview}
      options={{ ...headerOptions, title: "Leave a review" }}
    />
    <RequestsStack.Screen
      name="ViewRoute"
      component={ViewRoute}
      options={{ ...headerOptions, title: "View route details" }}
    />
  </RequestsStack.Navigator>
);

const TravelStack = createStackNavigator();
const TravelStackScreen = () => (
  <TravelStack.Navigator initialRouteName="Travel">
    <TravelStack.Screen
      name="Travel"
      component={Travel}
      options={{ headerShown: false }}
    />
    <TravelStack.Screen
      name="ProvideRoute"
      component={ProvideRoute}
      options={{ ...headerOptions, title: "Provide a route" }}
    />
    <TravelStack.Screen
      name="CompleteRoute"
      component={CompleteRoute}
      options={{ ...headerOptions, title: "Complete route details" }}
    />
    <TravelStack.Screen
      name="RouteDateFilter"
      component={RouteDateFilter}
      options={{ ...headerOptions, title: "Complete route details" }}
    />
    <TravelStack.Screen
      name="FilteredRoutes"
      component={FilteredRoutes}
      options={{ ...headerOptions, title: "Matching routes" }}
    />
    <TravelStack.Screen
      name="Profile"
      component={Profile}
      options={{ headerShown: false }}
    />
    <TravelStack.Screen
      name="Reviews"
      component={Reviews}
      options={{ ...headerOptions, title: "Reviews" }}
    />
    <TravelStack.Screen
      name="AddReview"
      component={AddReview}
      options={{ ...headerOptions, title: "Leave a review" }}
    />
    <TravelStack.Screen
      name="ViewRoute"
      component={ViewRoute}
      options={{ ...headerOptions, title: "Route details" }}
    />
  </TravelStack.Navigator>
);

const Tabs = createBottomTabNavigator();
const TabsScreen = () => {
  return (
    <Tabs.Navigator tabBarOptions={tabBarOptions}>
      <Tabs.Screen
        name="Requests"
        component={RequestsStackScreen}
        options={{
          tabBarIcon: (props) => (
            <Octicons
              name="request-changes"
              size={props.size}
              color={props.color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Routes"
        component={RoutesStackScreen}
        options={{
          tabBarIcon: (props) => (
            <FontAwesome5 name="route" size={props.size} color={props.color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Travel"
        component={TravelStackScreen}
        options={{
          tabBarIcon: (props) => (
            <MaterialIcons
              name="wallet-travel"
              size={props.size}
              color={props.color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Cars"
        component={CarsStackScreen}
        options={{
          tabBarIcon: (props) => (
            <Ionicons name="car-sport" size={props.size} color={props.color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        component={ProfileStackScreen}
        options={{
          tabBarIcon: (props) => (
            <Ionicons name="md-person" size={props.size} color={props.color} />
          ),
        }}
      />
    </Tabs.Navigator>
  );
};

const AdminProfileStack = createStackNavigator();
const AdminProfileStackScreen = () => (
  <AdminProfileStack.Navigator initialRouteName="Profile">
    <AdminProfileStack.Screen
      name="Profile"
      component={Profile}
      options={{ headerShown: false }}
    />
    <AdminProfileStack.Screen
      name="ChangePassword"
      component={ChangePassword}
      options={emptyHeaderOptions}
    />
  </AdminProfileStack.Navigator>
);

const StatisticsStack = createStackNavigator();
const StatisticsStackScreen = () => (
  <StatisticsStack.Navigator initialRouteName="Statistics">
    <StatisticsStack.Screen
      name="Statistics"
      component={Statistics}
      options={{ ...headerOptions, title: "Statistics" }}
    />
  </StatisticsStack.Navigator>
);

const UsersStack = createStackNavigator();
const UsersStackScreen = () => (
  <UsersStack.Navigator initialRouteName="Statistics">
    <UsersStack.Screen
      name="Users"
      component={Users}
      options={{ ...headerOptions, title: "Users" }}
    />
    <UsersStack.Screen
      name="DeleteAccount"
      component={DeleteAccount}
      options={emptyHeaderOptions}
    />
  </UsersStack.Navigator>
);

const AdminTabs = createBottomTabNavigator();
const AdminTabsScreen = () => {
  return (
    <AdminTabs.Navigator tabBarOptions={tabBarOptions}>
      <AdminTabs.Screen
        name="Users"
        component={UsersStackScreen}
        options={{
          tabBarIcon: (props) => (
            <FontAwesome5 name="users" size={props.size} color={props.color} />
          ),
        }}
      />
      <AdminTabs.Screen
        name="Statistics"
        component={StatisticsStackScreen}
        options={{
          tabBarIcon: (props) => (
            <Ionicons
              name="stats-chart"
              size={props.size}
              color={props.color}
            />
          ),
        }}
      />
      <AdminTabs.Screen
        name="Profile"
        component={AdminProfileStackScreen}
        options={{
          tabBarIcon: (props) => (
            <Ionicons name="md-person" size={props.size} color={props.color} />
          ),
        }}
      />
    </AdminTabs.Navigator>
  );
};

const MainStack = createStackNavigator();
const MainStackScreen = () => (
  <MainStack.Navigator initialRouteName="Authentication">
    <MainStack.Screen
      name="Authentication"
      component={AuthenticationStackScreen}
      options={{ headerShown: false }}
    />
    <MainStack.Screen
      name="App"
      component={TabsScreen}
      options={{ headerShown: false }}
    />
    <MainStack.Screen
      name="Admin"
      component={AdminTabsScreen}
      options={{ headerShown: false }}
    />
  </MainStack.Navigator>
);

export default () => (
  <NavigationContainer ref={navigationRef}>
    <MainStackScreen />
  </NavigationContainer>
);

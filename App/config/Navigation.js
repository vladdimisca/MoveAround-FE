import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

// constants
import colors from "../constants/colors";

// screens
import Splash from "../screens/Splash";
import Register from "../screens/Register";
import Login from "../screens/Login";
import Confirmation from "../screens/Confirmation";
import Profile from "../screens/Profile";
import Settings from "../screens/Settings";
import Cars from "../screens/Cars";
import ForgotPassword from "../screens/ForgotPassword";

const emptyHeaderOptions = {
  title: null,
  headerStyle: { backgroundColor: colors.white, elevation: 0 },
};

const headerOptions = {
  title: "Settings",
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
  </ProfileStack.Navigator>
);

const CarsStack = createStackNavigator();
const CarsStackScreen = () => (
  <CarsStack.Navigator initialRouteName="Cars">
    <ProfileStack.Screen
      name="Cars"
      component={Cars}
      options={{ headerShown: false }}
    />
  </CarsStack.Navigator>
);

const Tabs = createBottomTabNavigator();
const TabsScreen = () => {
  return (
    <Tabs.Navigator tabBarOptions={tabBarOptions}>
      <Tabs.Screen
        name="Profile"
        component={ProfileStackScreen}
        options={{
          tabBarIcon: (props) => (
            <Ionicons name="md-person" size={props.size} color={props.color} />
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
    </Tabs.Navigator>
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
  </MainStack.Navigator>
);

export default () => (
  <NavigationContainer>
    <MainStackScreen />
  </NavigationContainer>
);

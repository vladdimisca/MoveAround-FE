import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { MaterialIcons, FontAwesome5 } from "react-native-vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

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
import ChangePassword from "../screens/ChangePassword";
import Travel from "../screens/Travel";
import Offer from "../screens/Offer";
import AddCar from "../screens/AddCar";

const emptyHeaderOptions = {
  title: null,
  headerStyle: {
    backgroundColor: colors.white,
    elevation: 0,
  },
};

const transparentHeaderOptions = {
  title: null,
  headerTransparent: true,
  headerStyle: {
    backgroundColor: "transparent",
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
      options={emptyHeaderOptions}
    />
  </CarsStack.Navigator>
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
      name="Offer"
      component={Offer}
      options={transparentHeaderOptions}
    />
  </TravelStack.Navigator>
);

const Tabs = createBottomTabNavigator();
const TabsScreen = () => {
  return (
    <Tabs.Navigator tabBarOptions={tabBarOptions}>
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

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// constants
import colors from "../constants/colors";

// screens
import UserRolesOptions from "../screens/UserRolesOptions";
import SplashScreen from "../screens/Splash";
import Register from "../screens/authentication/Register";
import Login from "../screens/authentication/Login";
import Confirmation from "../screens/authentication/Confirmation";

// authentication screens
import PhoneNumber from "../screens/authentication/PhoneNumber";

const headerOptions = {
  title: null,
  headerStyle: { backgroundColor: colors.white, elevation: 0 },
};

const MainStack = createStackNavigator();
const MainStackScreen = () => (
  <MainStack.Navigator initialRouteName="Starter">
    <MainStack.Screen
      name="Starter"
      component={SplashScreen}
      options={{ headerShown: false }}
    />
    <MainStack.Screen
      name="UserRolesOptions"
      component={UserRolesOptions}
      options={{ headerShown: false }}
    />
    <MainStack.Screen
      name="PhoneNumber"
      component={PhoneNumber}
      options={headerOptions}
    />
    <MainStack.Screen
      name="Confirmation"
      component={Confirmation}
      options={headerOptions}
    />
    <MainStack.Screen
      name="Register"
      component={Register}
      options={headerOptions}
    />
    <MainStack.Screen name="Login" component={Login} options={headerOptions} />
  </MainStack.Navigator>
);

export default () => (
  <NavigationContainer>
    <MainStackScreen />
  </NavigationContainer>
);

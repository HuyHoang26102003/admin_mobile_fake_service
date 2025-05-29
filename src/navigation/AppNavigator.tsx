import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Customer from "@/screens/Customer";
import Restaurant from "@/screens/Restaurant";
import CustomerCare from "@/screens/CustomerCare";
import Driver from "@/screens/Driver";
import CustomerCareInquiry from "@/screens/CustomerCareInquiry";
import Order from "@/screens/Order";
import Home from "@/screens/Home";

export type RootStackParamList = {
  MainStack: undefined;
};

export type MainStackParamList = {
  Home: undefined;
  Customer: undefined;
  Restaurant: undefined;
  Driver: undefined;
  CustomerCare: undefined;
  CustomerCareInquiry: undefined;
  Order: undefined;
};

const RootStack = createStackNavigator<RootStackParamList>();
const MainStack = createStackNavigator<MainStackParamList>();

// MainStackScreen
const MainStackScreen = () => {
  return (
    <MainStack.Navigator initialRouteName="Home">
      <MainStack.Screen
        options={{ headerShown: false }}
        name="Home"
        component={Home}
      />
      <MainStack.Screen
        options={{ headerShown: false }}
        name="Customer"
        component={Customer}
      />
      <MainStack.Screen
        options={{ headerShown: false }}
        name="Driver"
        component={Driver}
      />
      <MainStack.Screen
        options={{ headerShown: false }}
        name="Restaurant"
        component={Restaurant}
      />
      <MainStack.Screen
        options={{ headerShown: false }}
        name="CustomerCare"
        component={CustomerCare}
      />
      <MainStack.Screen
        options={{ headerShown: false }}
        name="CustomerCareInquiry"
        component={CustomerCareInquiry}
      />
      <MainStack.Screen
        options={{ headerShown: false }}
        name="Order"
        component={Order}
      />
    </MainStack.Navigator>
  );
};

// Props cho BottomTabs

const AppNavigator = () => {
  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name="MainStack"
        options={{ headerShown: false }}
        component={MainStackScreen}
      />
    </RootStack.Navigator>
  );
};

export default AppNavigator;

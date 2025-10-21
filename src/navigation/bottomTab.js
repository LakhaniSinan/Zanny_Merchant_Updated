import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from "react-native-vector-icons/Ionicons"
import { colors } from '../constants';
import OrderStack from './orderStack';
import FoodStack from './foodStack';
import Dashboard from './../containers/app/dashboard/index';
import ProfileStack from './profileStack';
import Foundation from 'react-native-vector-icons/Foundation';

const Tab = createMaterialBottomTabNavigator();

const AppStack = () => {
  return (
    <Tab.Navigator
    activeColor="#fff"
    inactiveColor="#3e2465"
    barStyle={{backgroundColor: colors.yellow}}>
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="view-dashboard"
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Orders History"
        component={OrderStack}
        options={{
          tabBarLabel: 'Orders History',
          tabBarIcon: ({ color }) => (
            <Foundation name="clipboard-notes" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Food"
        component={FoodStack}
        options={{
          tabBarLabel: 'Food',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="food" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppStack;

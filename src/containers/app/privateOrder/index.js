import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Header from '../../../components/header';
import {colors} from '../../../constants/index';
import CurrentOrders from './currentOrders';
import {width} from 'react-native-dimension';
import {SafeAreaView} from 'react-native';
import PastOrders from './pastOrders';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

function PrivateOrders() {
  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
        <Header text="Private Hire" drawer={true} />
        <Tab.Navigator
          initialRouteName="currentOrders"
          screenOptions={{
            headerShown: false,
            tabBarPosition: 'top',
            tabBarHideOnKeyboard: true,
            tabBarActiveTintColor: colors.yellow,
            tabBarInactiveTintColor: colors.black,
            tabBarStyle: {
              backgroundColor: colors.white,
              // paddingBottom: width(2),
              paddingTop: width(1.5),
              height: width(17),
            },
            tabBarLabelStyle: {
              fontSize: 14,
            },
          }}
          style={{marginTop: width(2)}}>
          <Tab.Screen
            name="currentOrders"
            component={CurrentOrders}
            options={{
              tabBarLabel: 'Current',
              tabBarIcon: ({color, focused}) => {
                return (
                  <Ionicons
                    name="today"
                    color={focused ? colors.yellow : colors.black}
                    size={20}
                  />
                );
              },
            }}
          />
          <Tab.Screen
            name="pastOrders"
            component={PastOrders}
            options={{
              tabBarLabel: 'Past',
              tabBarIcon: ({color, focused}) => {
                return (
                  <MaterialCommunityIcons
                    name="page-previous"
                    color={focused ? colors.yellow : colors.black}
                    size={20}
                  />
                );
              },
            }}
          />
        </Tab.Navigator>
      </SafeAreaView>
    </>
  );
}
export default PrivateOrders;

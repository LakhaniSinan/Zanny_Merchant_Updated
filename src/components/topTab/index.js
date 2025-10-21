import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import Orders from './../../containers/app/orders/index';
import PastOrders from '../../containers/app/orders/pastOrders';
import CurrentOrders from '../../containers/app/orders/currentOrders';
import {colors} from './../../constants/index';
import {SafeAreaView} from 'react-native';
import Header from './../header/index';
import {width} from 'react-native-dimension';

const Tab = createBottomTabNavigator();

const TopTab = ({route}) => {
  const {type} = route?.params;
  console.log(type, 'typetypetypetype');

  return (
    <SafeAreaView style={{flex: 1}}>
      <Header
        text={type == 'pickup' ? 'Pickup Orders' : 'Delivery Orders'}
        drawer={true}
      />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarPosition: 'top',
          tabBarHideOnKeyboard: true,
          tabBarActiveTintColor: colors.yellow,
          tabBarInactiveTintColor: colors.black,
          tabBarStyle: {
            backgroundColor: colors.white,
            paddingTop: width(1.5),
            height: width(17),
          },
          tabBarLabelStyle: {
            fontSize: 14,
          },
        }}>
        <Tab.Screen
          name="Ongoing"
          component={CurrentOrders}
          initialParams={{type: 'pending', orderType: type}}
          options={{
            tabBarLabel: 'Ongoing',
            tabBarIcon: ({color, focused}) => {
              return (
                <MaterialCommunityIcons
                  name="clipboard-clock-outline"
                  color={color}
                  size={22}
                />
              );
            },
          }}
        />
        <Tab.Screen
          name="Completed"
          component={PastOrders}
          initialParams={{type: 'Completed', orderType: type}}
          options={{
            tabBarLabel: 'Completed',
            tabBarIcon: ({color, focused}) => {
              return (
                <MaterialCommunityIcons
                  name="clipboard-check-outline"
                  color={color}
                  size={22}
                />
              );
            },
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default TopTab;

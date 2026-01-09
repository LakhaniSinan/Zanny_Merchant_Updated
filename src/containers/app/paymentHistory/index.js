import AsyncStorage from '@react-native-async-storage/async-storage';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native';
import Header from '../../../components/header';
import {colors} from '../../../constants';
import {getMerchantPaymentHistory} from '../../../services/profile';
import OrderPaymentHistory from './orderPayment';
import PrivateOrderPaymentHistory from './PrivateOrderPayment';
import {width} from 'react-native-dimension';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// import Loader from "../../../components/"

const PaymentHistory = () => {
  const [paymentHistory, setPaymentHistory] = useState([]);

  useEffect(() => {
    handlegetMerchnatPaymentHistory();
  }, []);

  const handlegetMerchnatPaymentHistory = async () => {
    let data = await AsyncStorage.getItem('user');
    data = JSON.parse(data);
    // setIsLoading(true)
    getMerchantPaymentHistory(data?._id)
      .then(res => {
        console.log(res?.data, 'datatttat');
        if (res?.data?.status == 'ok') {
          // setIsLoading(false)
          setPaymentHistory(res?.data?.data);
        } else {
          // setIsLoading(false)
        }
      })
      .catch(error => {
        console.log(error, 'errorerrorerrorerror');
        // setIsLoading(false)
      });
  };

  const Tab = createBottomTabNavigator();
  // console.log(paymentHistory, 'lkdkllklklkklkkl');

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <Header text="Payment History" drawer={true} />
      <Tab.Navigator
        screenOptions={{
          // tabBarActiveTintColor: 'black',
          // tabBarLabelStyle: {fontSize: 14},
          // tabBarIndicatorStyle: {backgroundColor: 'black'},
          headerShown: false,
          tabBarPosition: 'top',
          tabBarHideOnKeyboard: true,
          tabBarActiveTintColor: colors.redish,
          tabBarInactiveTintColor: colors.gray4,
          tabBarStyle: {
            backgroundColor: colors.white,
            // paddingBottom: width(2),
            paddingTop: width(1.5),
            height: width(17),
          },
          tabBarLabelStyle: {
            fontSize: 14,
          },
        }}>
        <Tab.Screen
          name="Orders"
          options={{
            headerShown: false,
            tabBarIcon: ({color, focused}) => {
              return (
                <Ionicons
                  name="fast-food"
                  color={focused ? colors.redish : colors.gray4}
                  size={20}
                />
              );
            },
          }}
          component={OrderPaymentHistory}
        />
        <Tab.Screen
          name="Private Hire"
          options={{
            headerShown: false,
            tabBarIcon: ({color, focused}) => {
              return (
                <MaterialCommunityIcons
                  name="food-croissant"
                  color={focused ? colors.redish : colors.gray4}
                  size={20}
                />
              );
            },
          }}
          component={PrivateOrderPaymentHistory}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default PaymentHistory;

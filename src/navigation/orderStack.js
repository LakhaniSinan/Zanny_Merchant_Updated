import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import OrderDetail from './../containers/app/orderdetail/index';
import TopTab from './../components/topTab/index';
import ChatScreen from './../containers/app/chat';

const Stack = createStackNavigator();

function OrderStack({route}) {
  const orderType = route?.params;
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="Orders"
        component={TopTab}
        initialParams={orderType}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="OrderDetail"
        component={OrderDetail}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="Chat"
        component={ChatScreen}
      />
    </Stack.Navigator>
  );
}

export default OrderStack;

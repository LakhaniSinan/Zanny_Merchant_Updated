import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import PrivateOrderDetail from './../containers/app/privateOrderDetail';
import PrivateOrders from '../containers/app/privateOrder';
import ChatScreen from './../containers/app/chat';
const Stack = createStackNavigator();

function PrivateOrderStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="PrivateOrders"
        component={PrivateOrders}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="PrivateOrderDetail"
        component={PrivateOrderDetail}
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

export default PrivateOrderStack;

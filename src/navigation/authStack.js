import {createStackNavigator} from '@react-navigation/stack';
import Login from '../containers/auth/Login';
import React from 'react';
import SignUp from '../containers/auth/SignUp';
import CodeVerification from '../containers/auth/codeVerfication';
import License from '../containers/auth/license';
import ResetPassword from '../containers/auth/resetPassword';
import ForgotPassword from '../containers/auth/forgotPassword';
import Documentation from '../containers/auth/Documentation';
const Stack = createStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator>
      
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="Login"
        component={Login}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="SignUp"
        component={SignUp}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="Documentation"
        component={Documentation}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="License"
        component={License}
      />
    <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="CodeVerification"
        component={CodeVerification}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="ResetPassword"
        component={ResetPassword}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="ForgotPassword"
        component={ForgotPassword}
      />
    </Stack.Navigator>
  );
}

export default AuthStack;

import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ChangePassword from '../containers/app/profile/chnagePassword';
import PersonalInfo from '../containers/app/profile/personalInfo';
import Profile from '../containers/app/profile';
import SafetyCertificate from '../containers/app/profile/safetyCertificate';
import Categories from '../containers/app/categories';
import AccountInformation from '../containers/app/profile/accountInformation';
import ConnectAccount from '../containers/app/profile/connectAccount';
import Support from '../containers/app/support';
import AddSupportMsg from '../containers/app/support/addSupportMsg';
const Stack = createStackNavigator();

function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="Profile"
        component={Profile}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="PersonalInfo"
        component={PersonalInfo}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="AccountInformation"
        component={AccountInformation}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="SafetyCertificate"
        component={SafetyCertificate}
      />
       <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="ChangePassword"
        component={ChangePassword}
      />
       <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="Categories"
        component={Categories}
      />
       <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="Support"
        component={Support}
      />
       <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="AddSupportMsg"
        component={AddSupportMsg}
      />
       <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="ConnectAccount"
        component={ConnectAccount}
      />
    </Stack.Navigator>
  );
}

export default ProfileStack;

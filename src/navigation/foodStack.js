import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import PostFood from '../containers/app/postFood/index';
import AddEditFood from '../containers/app/postFood/addEditFood';
import AllergyCategory from '../containers/app/allergies/allergyCategory';
import Allergies from '../containers/app/allergies';
import Categories from '../containers/app/categories';

const Stack = createStackNavigator();

function FoodStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PostFood"
        component={PostFood}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="AddEditFood"
        component={AddEditFood}
        options={{
          headerShown: false,
        }}
      />
       <Stack.Screen
        name="Allergies"
        component={Allergies}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AllergyCategory"
        component={AllergyCategory}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Food Categories"
        component={Categories}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default FoodStack;

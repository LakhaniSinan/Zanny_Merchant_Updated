import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Allergies from "../containers/app/allergies/index"

const Stack = createStackNavigator();

function AllergyStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Allergies"
                component={Allergies}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
}

export default AllergyStack;

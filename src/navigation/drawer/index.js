import {createDrawerNavigator} from '@react-navigation/drawer';
import Dashboard from '../../containers/app/dashboard';
import React from 'react';
import {useWindowDimensions} from 'react-native';
import DrawerContent from './merchantContent';
import OrderStack from '../orderStack';
import ProfileStack from '../profileStack';
import FoodStack from '../foodStack';
import Categories from '../../containers/app/categories';
import Faq from '../../containers/app/faq';
import PrivateOrderStack from '../privateOrderStack';
import PaymentHistory from '../../containers/app/paymentHistory';
import AddSupportMsg from '../../containers/app/support/addSupportMsg';
const Drawer = createDrawerNavigator();

function DrawerNavigation(props) {
  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 768;

  return (
    <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          headerShown: false,
        }}
        key="dashboard"
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          headerShown: false,
        }}
        key="profile"
      />
      <Drawer.Screen
        name="Food"
        component={FoodStack}
        options={{
          headerShown: false,
        }}
        key="food"
      />
      <Drawer.Screen
        name="Pickup Orders"
        component={OrderStack}
        options={{
          headerShown: false,
        }}
        key="Orders"
        initialParams={{type: 'delivery'}}
      />
      <Drawer.Screen
        name="Delivery Orders"
        component={OrderStack}
        options={{
          headerShown: false,
        }}
        key="Orders"
        initialParams={{type: 'delivery'}}
      />
      <Drawer.Screen
        name="Food Categories"
        component={Categories}
        options={{
          headerShown: false,
        }}
        key="foodCategories"
      />
      <Drawer.Screen
        name="Private Hire"
        component={PrivateOrderStack}
        options={{
          headerShown: false,
        }}
        key="privateHire"
      />
      <Drawer.Screen
        name="Payment History"
        component={PaymentHistory}
        options={{
          headerShown: false,
        }}
        key="paymentHistory"
      />

      <Drawer.Screen
        name="FAQs"
        component={Faq}
        options={{
          headerShown: false,
        }}
        key="faqs"
      />
      <Drawer.Screen
        name="Support"
        component={AddSupportMsg}
        options={{
          headerShown: false,
        }}
        key="support"
      />
    </Drawer.Navigator>
  );
}

export default DrawerNavigation;

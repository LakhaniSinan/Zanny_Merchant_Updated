import {createDrawerNavigator} from '@react-navigation/drawer';
import Dashboard from '../../containers/app/dashboard';
import React, {useEffect, useRef} from 'react';
import {Platform, useWindowDimensions} from 'react-native';
import DrawerContent from './merchantContent';
import OrderStack from '../orderStack';
import ProfileStack from '../profileStack';
import FoodStack from '../foodStack';
import Categories from '../../containers/app/categories';
import Faq from '../../containers/app/faq';
import PrivateOrderStack from '../privateOrderStack';
import PaymentHistory from '../../containers/app/paymentHistory';
import AddSupportMsg from '../../containers/app/support/addSupportMsg';
import UpdatePopUp from '../../components/updatePopup';
import {getSettings} from '../../services/settings';
import DeviceInfo from 'react-native-device-info';

const Drawer = createDrawerNavigator();
function DrawerNavigation(props) {
  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 768;
  const updateVar = useRef(null);

  useEffect(() => {
    callAppVersion();
  }, []);

  const callAppVersion = async () => {
    try {
      console.log('CALLDDED');

      const response = await getSettings();
      // console.log(response, 'responseresponseresponse');

      let apiRess = response?.data?.data;
      console.log(apiRess, 'apiRessapiRessapiRess');

      if (response.status === 200 || response.status === 201) {
        let result = DeviceInfo.getBuildNumber();
        console.log(result, 'resultresultresult');

        if (Platform.OS === 'android') {
          if (
            Number(result) !== Number(apiRess.androidMerchantVersion) &&
            apiRess.isAndroidMerchantPopUpShow
          ) {
            setTimeout(() => {
              updateVar.current.isVisible();
            }, 5000);
          } else {
            updateVar.current.backdropPress();
          }
        } else {
          console.log(result, apiRess, 'dasdasdas');

          if (
            Number(result) !== Number(apiRess.iosMerchantVersion) &&
            apiRess.isIosMerchantPopUpShow
          ) {
            setTimeout(() => {
              updateVar.current.isVisible();
            }, 5000);
          } else {
            updateVar.current.backdropPress();
          }
        }
      } else {
        console.error('Failed to fetch data: Invalid status', response.status);
      }
    } catch (error) {
      console.error('Error fetching tips:', error);
    }
  };

  return (
    <>
      <UpdatePopUp ref={updateVar} />

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
    </>
  );
}

export default DrawerNavigation;

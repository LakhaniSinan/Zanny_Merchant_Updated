import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTermsData, setUserData } from '../redux/slices/Login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthStack from './authStack';
import DrawerNavigation from './drawer';
import { ActivityIndicator, View } from 'react-native';
import { colors } from '../constants';
import { getSettings } from '../services/settings';
import DeviceInfo from 'react-native-device-info';
import UpdatePopUp from '../components/updatePopup';

const Navigation = () => {
  const state = useSelector(state => state.LoginSlice.user);
  const [isloading, setIsLoading] = useState(true);
  const disptach = useDispatch();

  useEffect(() => {
    getUserData();
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const getUserData = async () => {
    let data = await AsyncStorage.getItem('user');
    data = JSON.parse(data);
    disptach(setUserData(data));
  };

  if (isloading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={'large'} color={colors.yellow} />
      </View>
    );
  }

  return (
    <>
      <NavigationContainer>
        {state == null ? <AuthStack /> : <DrawerNavigation />}
      </NavigationContainer>
    </>

  );
};

export default Navigation;

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  View,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import NotificationPopup from 'react-native-push-notification-popup';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';

import ConfirmationModal from './src/components/confirmationModal';
import {colors, constants} from './src/constants';
import {notification} from './src/constants/variables';
import TermsAndConditions from './src/containers/auth/termsAndConditions';
import AppProvider from './src/context';
import Navigation from './src/navigation';
import store from './src/redux';

const AppContent = () => {
  const [termsAccepted, setTermsAccepted] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const init = async () => {
      await getTerms();
      setTimeout(() => {
        setShowSplash(false);
      }, 2000);
    };
    init();
  }, []);

  const getTerms = async () => {
    const data = await AsyncStorage.getItem('termsAccepted');
    if (data) {
      setTermsAccepted(JSON.parse(data));
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleAccepted = async () => {
    setTermsAccepted(true);
    await AsyncStorage.setItem('termsAccepted', JSON.stringify(true));
  };

  if (isLoading && !termsAccepted) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color={colors.yellow} />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
      />
      <AppProvider>
        {showSplash ? (
          <SafeAreaView style={{flex: 1}}>
            <Image
              source={require('./src/assets/launch_screen.png')}
              style={{height: '100%', width: '100%'}}
              resizeMode="cover"
            />
          </SafeAreaView>
        ) : termsAccepted ? (
          <Navigation />
        ) : (
          <TermsAndConditions handleAccepted={handleAccepted} />
        )}

        <ConfirmationModal
          ref={ref => {
            constants.confirmationModal = ref;
          }}
        />
        <NotificationPopup ref={ref => (notification.popup = ref)} />
      </AppProvider>
    </SafeAreaView>
  );
};

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <SafeAreaProvider>
          <AppContent />
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;

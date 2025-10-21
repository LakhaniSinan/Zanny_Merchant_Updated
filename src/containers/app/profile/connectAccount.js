import React, { useEffect, useRef } from 'react';
import { Platform, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';

const ConnectAccount = ({ navigation, route }) => {
    const webviewRef = useRef(null);

    const handleWebViewNavigationStateChange = (newNavState) => {
      if (newNavState && newNavState.url) {
        const { url, loading } = newNavState;
        console.log(newNavState,"navState=========>");
        if (Platform.OS === 'android') {

          if (url.includes('success=true') && !loading) {
            handleConnectSuccess();
          }
          if (url.includes('success=false')) {
            handleConnectFailure();
          }
        } else {
          if (url.includes('success=true') && loading) {
            handleConnectSuccess();
          }
          if (url.includes('success=false')) {
            handleConnectFailure();
          }
        }
      }
    };
  
    const handleConnectSuccess = () => {
        console.log("Successss=============>");
        return
      navigation.goBack();
    //   route.params.onConnectSuccess();
    };
  
    const handleConnectFailure = () => {
      navigation.goBack();
      alert('Stripe Connect failed');
    };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WebView
        ref={webviewRef}
        source={{ uri: route.params.url }}
        onNavigationStateChange={handleWebViewNavigationStateChange}
      />
    </SafeAreaView>
  );
};

export default ConnectAccount;

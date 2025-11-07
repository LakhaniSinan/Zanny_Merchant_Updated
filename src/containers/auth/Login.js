import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Linking,
} from 'react-native';
import {width} from 'react-native-dimension';
import {useDispatch} from 'react-redux';
import Button from '../../components/button';
import Header from '../../components/header';
import {colors} from '../../constants';
import {setUserData} from '../../redux/slices/Login';
import {loginMerchant} from '../../services/auth';
import messaging from '@react-native-firebase/messaging';
import Feather from 'react-native-vector-icons/Feather';
import {
  checkNotifications,
  requestNotifications,
} from 'react-native-permissions';

const Login = ({navigation}) => {
  const disptach = useDispatch();

  const [inputValue, setInputValue] = useState({
    email: '',
    password: '',
    fcm: '',
  });

  const requestNotificationPermissions = () => {
    checkNotifications()
      .then(({status}) => {
        if (status !== 'granted') {
          requestNotifications(['alert', 'sound']).then(
            ({status: statusssss, settings}) => {
              if (Platform.OS == 'ios') {
                requestUserPermission();
              } else {
                checkPermission();
              }
            },
          );
        } else {
          if (Platform.OS == 'ios') {
            requestUserPermission();
          } else {
            checkPermission();
          }
        }
      })
      .catch(errorrrr => {
        console.log(errorrrr, 'NOTIFICATION_ERRORRRRR');
      });
  };

  const requestUserPermission = async () => {
    try {
      const authStatus = await messaging().requestPermission();
      checkPermission();
    } catch (error) {
      console.log(error, 'erorroorororoorororororo');
    }
  };

  const checkPermission = async () => {
    try {
      let enabled = await messaging().hasPermission();
      if (enabled) {
        let token = await messaging().getToken();
        setInputValue({...inputValue, fcm: token});
      } else {
        requestUserPermission();
      }
    } catch (error) {
      console.log(error, 'immmmmmmmmmmmmmmmmmmmm');
    }
  };

  useEffect(() => {
    setTimeout(() => {
      requestNotificationPermissions();
    }, 1000);
  }, []);

  const handleChangeText = (name, value) => {
    setInputValue({...inputValue, [name]: value});
  };

  const [isLoading, setIsLoading] = useState(false);
  const [isSecure, setIsSecure] = useState(true);

  const onPress = () => {
    const {email, password, fcm} = inputValue;
    if (email == '') {
      alert('Email is required');
    } else if (password == '') {
      alert('Password is required');
    } else {
      let payload = {
        email,
        password,
        fcm,
      };
      setIsLoading(true);
      loginMerchant(payload)
        .then(response => {
          if (response?.data?.status == 'ok') {
            console.log(response?.data?.data?.userDetails,"esponse?.data?.data?.userDetails?");
            
            if (response?.data?.data?.userDetails?.isApprove == true) {
              setInputValue({
                email: '',
                password: '',
              });
              let newObj = {
                ...response?.data?.data?.userDetails,
              };
              AsyncStorage.setItem('user_token', response.data.data.token);
              AsyncStorage.setItem('user', JSON.stringify(newObj));
              disptach(setUserData(newObj));
              setIsLoading(false);
            } else {
              alert('You are not approved please conatct admin');
              setIsLoading(false);
            }
          } else {
            alert(response?.data?.message);
            setIsLoading(false);
          }
        })
        .catch(error => {
          console.log(error, 'error');
          setIsLoading(false);
        });
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <Header text={'Sign In'} />
      <View style={{alignItems: 'center', marginTop: width(3)}}>
        <Text style={{fontSize: 24, fontWeight: '600', color: colors.gray4}}>
          Zanny Merchant
        </Text>
      </View>
      <View style={{marginTop: width(5)}}>
        <Text
          style={{
            marginTop: width(2),
            paddingHorizontal: width(2),
            color: colors.gray4,
          }}>
          Email
        </Text>
        <View
          style={{
            borderBottomWidth: 0.5,
            borderColor: colors.grey,
          }}>
          <TextInput
            style={{margin: width(2), color: colors.black}}
            placeholder="Enter your email"
            value={inputValue.email}
            onChangeText={newText => handleChangeText('email', newText)}
            placeholderTextColor={colors.gray4}
          />
        </View>
        <Text
          style={{
            marginTop: width(5),
            paddingHorizontal: width(2),
            color: colors.gray4,
          }}>
          Password
        </Text>
        <View
          style={{
            borderBottomWidth: 0.5,
            borderColor: colors.grey,
            marginTop: width(2),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingRight: width(4),
          }}>
          <View style={{width: '90%'}}>
            <TextInput
              style={{margin: width(2), color: colors.black}}
              placeholder="Enter your password"
              secureTextEntry={isSecure}
              value={inputValue.password}
              onChangeText={newText => handleChangeText('password', newText)}
              placeholderTextColor={colors.gray4}
            />
          </View>
          <Feather
            name={isSecure ? 'eye-off' : 'eye'}
            size={width(5)}
            color={colors.gray4}
            onPress={() => setIsSecure(!isSecure)}
          />
        </View>
      </View>
      <View
        style={{
          marginTop: width(5),
          marginHorizontal: width(2),
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Text style={{color: colors.gray4}}>Dont't have Account?</Text>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL('https://zannysfood.com/admin/#/merchant-register');
          }}>
          <Text
            style={{
              marginLeft: width(2),
              fontSize: 16,
              textDecorationLine: 'underline',
              fontWeight: '600',
              color: colors.gray4,
            }}>
            Register Here
          </Text>
        </TouchableOpacity>
      </View>
      <View></View>
      <View
        style={{justifyContent: 'flex-end', flex: 1, marginBottom: width(1)}}>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text
            style={{
              alignSelf: 'flex-end',
              marginRight: width(5),
              marginBottom: width(5),
              fontSize: 16,
              textDecorationLine: 'underline',
              fontWeight: '600',
              color: colors.gray4,
            }}>
            Forgot Password
          </Text>
        </TouchableOpacity>
        {isLoading ? (
          <ActivityIndicator size={'large'} color={colors.yellow} />
        ) : (
          <Button heading={'Sign In'} onPress={onPress} />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Login;

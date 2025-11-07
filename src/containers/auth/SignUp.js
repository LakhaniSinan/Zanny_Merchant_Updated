import messaging from '@react-native-firebase/messaging';
import {Picker} from '@react-native-picker/picker';
import React, {useEffect, useRef, useState} from 'react';
import {
  Linking,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Switch,
} from 'react-native';
import {height, width} from 'react-native-dimension';
import Geolocation from 'react-native-geolocation-service';
import {ScrollView} from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';
import {useDispatch} from 'react-redux';
import Button from '../../components/button';
import Header from '../../components/header';
import ImagePicker from '../../components/imagepicker';
import {colors, constants} from '../../constants';
import {helper} from '../../helper';
import {getCertificationLink} from '../../services/auth';
import CommonModal from './../../components/modal/index';

const SignUp = ({navigation}) => {
  const disptach = useDispatch();
  const ref = useRef();
  const [imagePath, setImagePath] = useState(null);
  const [licenseImage, setLicenseImage] = useState(null);
  const [merchantType, setMerchnatType] = useState('');
  const [isSecure, setIsSecure] = useState(true);
  const [isSecureConfirm, setIsSecureConfirm] = useState(true);
  const [inputValue, setInputValue] = useState({
    name: '',
    email: '',
    phoneNum: '',
    address: '',
    password: '',
    fcm: '',
    merchantImage: null,
    licenseImage: null,
    safetyCertificate: null,
    longitude: 0,
    latitude: 0,
    confirmPassword: '',
    isPickUp: false,
    pickupTimmings: '',
  });

  const [link, setLink] = useState('');

  useEffect(() => {
    getLink();
  }, []);

  useEffect(() => {
    if (Platform.OS == 'ios') {
      requestUserPermission();
    } else {
      checkPermission();
    }
  }, []);

  const requestUserPermission = async () => {
    try {
      const authStatus = await messaging().requestPermission();
      checkPermission();
    } catch (error) {}
  };

  const checkPermission = async () => {
    try {
      let enabled = await messaging().hasPermission();
      if (enabled) {
        getToken();
      } else {
        requestUserPermission();
      }
    } catch (error) {}
  };

  const getToken = async () => {
    let token = await messaging().getToken();
    setInputValue({...inputValue, fcm: token});
  };

  const handleChangeText = (name, value) => {
    setInputValue({...inputValue, [name]: value});
  };

  const getImage = (image, type) => {
    // console.log('called');
    setInputValue({
      ...inputValue,
      [type]: image,
    });
  };

  const handelSendCode = () => {
    const {
      name,
      email,
      phoneNum,
      password,
      address,
      merchantImage,
      longitude,
      latitude,
      confirmPassword,
      fcm,
      isPickUp,
      pickupTimmings,
    } = inputValue;
    if (name == '') {
      alert('Name is required');
    } else if (email == '') {
      alert('Email is required');
    } else if (phoneNum == '') {
      alert('Phone number is required');
    } else if (password == '') {
      alert('Password is required');
    } else if (address == '') {
      alert('Address is required');
    } else if (merchantType == '') {
      alert('Merchant type is required');
    } else if (merchantImage == null) {
      alert('Profile picture is required');
    } else if (password != confirmPassword) {
      alert('Password does not match');
    } else if (isPickUp && pickupTimmings == '') {
      alert('Pickup time is required');
    } else {
      let payload = {
        fcm,
        name,
        email,
        address,
        password,
        merchantImage,
        isPickUp,
        latitude: latitude,
        type: merchantType,
        longitude: longitude,
        phoneNumber: phoneNum,
        pickupTimmings,
      };
      navigation.navigate('License', {
        data: payload,
      });
    }
  };

  const handlePressCheck = type => {
    if (type == 'Yes') {
      ref.current.hide();
    } else {
      if (link !== '') {
        Linking.openURL(link);
      } else {
        alert(
          'safety certificate is required fpr registration please contact admin',
        );
      }
    }
  };

  const getLink = () => {
    getCertificationLink()
      .then(response => {
        if (response?.data?.status == 'ok') {
          setLink(response?.data?.data?.link);
        }
      })
      .catch(error => {
        console.log(error, 'error');
      });
  };

  useEffect(() => {
    checkCurrentLocation();
  }, []);

  const checkCurrentLocation = async () => {
    let data = await helper.checkLocation();
    if (data == 'granted') {
      Geolocation.getCurrentPosition(
        //Will give you the current location
        async position => {
          // console.log(position,"responseresponseresponseresponseresponse");
          let latitude = position?.coords.latitude;
          let longitude = position?.coords.longitude;
          let formatedAddress = await helper.getLocationAddress(
            latitude,
            longitude,
          );
          // console.log(latitude,"latitudelatitudelatitude");
          // console.log(longitude,"longitudelongitudelongitude");
          // console.log(formatedAddress,"formatedAddressformatedAddress");
          setInputValue({
            ...inputValue,
            longitude: longitude,
            latitude: latitude,
            address: formatedAddress?.results[0]?.formatted_address,
          });
        },
      );
      ref.current.isVisible({});
    } else if (data == 'blocked') {
      console.log('in else if');
      await helper.checkLocation();
    } else {
      await helper.checkLocation();
    }
  };

  // console.log(inputValue,"inputValueinputValue");

  const getUserLocation = async () => {
    let location = await helper.checkLocation();
    if (location == 'granted') {
      checkCurrentLocation();
    } else if (location == 'denied') {
      getUserLocation();
    } else if (location == 'blocked') {
      constants?.confirmationModal.isVisible({
        message:
          'Please turn On your Location from settings in order to get Resturants Near You',
        NegText: 'Later',
        PosText: 'Open Settings',
        PosPress: () => Linking.openSettings(),
      });
    }
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <Header text={'Sign Up'} goBack={true} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{marginBottom: width(5)}}>
        <View style={{alignItems: 'center', marginTop: width(3)}}>
          <Text style={{fontSize: 24, fontWeight: '600', color: colors.gray4}}>
            Zanny Merchant
          </Text>
        </View>
        <ImagePicker
          viewStyle={{
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: width(10),
            borderRadius: 50,
            borderWidth: 0.3,
            borderColor: colors.gray4,
            height: 100,
            width: 100,
          }}
          subtext="Upload Profile Image"
          getImage={getImage}
          type="merchantImage"
          image={inputValue.merchantImage}
          imageStyle={{
            width: width(30),
            height: height(15),
            borderRadius: 100,
          }}
        />
        <View style={{marginTop: width(5)}}>
          <Text style={{paddingHorizontal: width(2), color: colors.gray4}}>
            Name
          </Text>
          <View
            style={{
              borderBottomWidth: 0.5,
              borderColor: colors.grey,
            }}>
            <TextInput
              style={{margin: width(2), color: colors.black}}
              placeholder="Enter your name"
              value={inputValue.name}
              onChangeText={newText => handleChangeText('name', newText)}
              placeholderTextColor={colors.gray4}
            />
          </View>
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
              marginTop: width(2),
              paddingHorizontal: width(2),
              color: colors.gray4,
            }}>
            Phone Number
          </Text>
          <View
            style={{
              borderBottomWidth: 0.5,
              borderColor: colors.grey,
            }}>
            <TextInput
              style={{margin: width(2), color: colors.black}}
              placeholder="Enter your phone number"
              keyboardType="numeric"
              value={inputValue.phoneNum}
              onChangeText={newText => handleChangeText('phoneNum', newText)}
              placeholderTextColor={colors.gray4}
            />
          </View>
          <Text
            style={{
              marginTop: width(2),
              paddingHorizontal: width(2),
              color: colors.gray4,
            }}>
            Address
          </Text>
          <View
            style={{
              borderBottomWidth: 0.5,
              borderColor: colors.grey,
            }}>
            <TextInput
              style={{margin: width(2), color: colors.black}}
              placeholder="Enter your address"
              multiline
              value={inputValue.address}
              onChangeText={newText => handleChangeText('address', newText)}
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
          <Text
            style={{
              marginTop: width(5),
              paddingHorizontal: width(2),
              color: colors.gray4,
            }}>
            Confirm Password
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
                placeholder="Re-Enter your password"
                secureTextEntry={isSecureConfirm}
                value={inputValue.confirmPassword}
                onChangeText={newText =>
                  handleChangeText('confirmPassword', newText)
                }
                placeholderTextColor={colors.gray4}
              />
            </View>
            <Feather
              name={isSecureConfirm ? 'eye-off' : 'eye'}
              size={width(5)}
              color={colors.gray4}
              onPress={() => setIsSecureConfirm(!isSecureConfirm)}
            />
          </View>

          <Text
            style={{
              marginTop: width(5),
              paddingHorizontal: width(2),
              color: colors.gray4,
            }}>
            Type
          </Text>
          <View
            style={{
              borderBottomWidth: 0.5,
              borderColor: colors.grey,
              marginTop: width(2),
            }}>
            <Picker
              dropdownIconColor={'black'}
              style={{width: '100%', fontSize: 13}}
              itemStyle={{backgroundColor: 'white', fontSize: 13}}
              selectedValue={merchantType}
              onValueChange={(itemValue, itemIndex) =>
                setMerchnatType(itemValue)
              }>
              <Picker.Item
                label="Please select type"
                value={''}
                color="black"
              />
              <Picker.Item label="Cafe" value={'Cafe'} color="black" />
              <Picker.Item
                label="Home Chef"
                value={'Home Chef'}
                color="black"
              />
              <Picker.Item
                label="Restaurant"
                value={'Restaurant'}
                color="black"
              />
            </Picker>
          </View>

          <View style={{marginTop: width(5), paddingHorizontal: width(2)}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={{color: colors.gray4}}>
                Is your restaurant available for pickup?
              </Text>
              <Switch
                value={inputValue.isPickUp}
                onValueChange={value => handleChangeText('isPickUp', value)}
                trackColor={{false: colors.grey, true: colors.primary}}
              />
            </View>

            {inputValue.isPickUp && (
              <View
                style={{
                  borderBottomWidth: 0.5,
                  borderColor: colors.grey,
                  marginTop: width(4),
                }}>
                <TextInput
                  style={{margin: width(2), color: colors.black}}
                  placeholder="Enter standard pickup time (e.g. 15-20 mins)"
                  value={inputValue.pickupTimmings}
                  keyboardType="numeric"
                  onChangeText={value =>
                    handleChangeText('pickupTimmings', value)
                  }
                  placeholderTextColor={colors.gray4}
                />
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <View style={{marginBottom: width(5)}}>
        <View
          style={{
            marginTop: width(5),
            marginBottom: width(3),
            marginHorizontal: width(4),
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text style={{color: colors.gray4}}>Already have an Account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text
              style={{
                marginLeft: width(2),
                fontSize: 16,
                textDecorationLine: 'underline',
                fontWeight: '600',
                color: colors.gray4,
              }}>
              Login Here
            </Text>
          </TouchableOpacity>
        </View>
        <Button heading={'Next'} onPress={handelSendCode} />
      </View>
      <CommonModal ref={ref}>
        <View style={{backgroundColor: colors.white, borderRadius: 10}}>
          <Text
            style={{
              flexWrap: 'wrap',
              margin: width(5),
              fontWeight: '500',
              fontSize: 15,
              textAlign: 'center',
              color: colors.black,
            }}>
            Do you have License To Cook & Health And Safety Certified?
          </Text>
          <View style={{flexDirection: 'row'}}>
            <View style={{width: '50%'}}>
              <Button heading={'Yes'} onPress={() => handlePressCheck('Yes')} />
            </View>
            <View style={{width: '50%'}}>
              <Button
                heading={'No'}
                onPress={() => {
                  ref.current.hide();
                  navigation.navigate('Documentation');
                }}
              />
            </View>
          </View>
        </View>
      </CommonModal>
    </SafeAreaView>
  );
};

export default SignUp;

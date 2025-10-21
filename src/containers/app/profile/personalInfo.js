import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {width} from 'react-native-dimension';
import Feather from 'react-native-vector-icons/Feather';
import {useDispatch} from 'react-redux';
import Button from '../../../components/button';
import Header from '../../../components/header';
import OverLayLoader from '../../../components/loader';
import {colors} from '../../../constants';
import {setUserData} from '../../../redux/slices/Login';
import {
  getMerchantProfile,
  updateMerchantProfile,
} from '../../../services/profile';
import styles from './style';

const PersonalInfo = ({navigation}) => {
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    merchantImage: null,
    licenseImage: null,
    safetyCertificate: null,
    isPickUp: false,
    pickupTimmings: '',
    isApprove: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getProfile();
  }, []);

  const onChangeHandler = (type, value) => {
    setInputs(prev => ({...prev, [type]: value}));
  };

  // ✅ Updated: Open Gallery with Crop Picker
  const openGallery = async type => {
    try {
      const image = await ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
        compressImageQuality: 0.8,
        mediaType: 'photo',
      });

      if (image && image.path) {
        setInputs(prev => ({...prev, [type]: image.path}));
      }
    } catch (error) {
      if (error.message !== 'User cancelled image selection') {
        console.log('Image picker error:', error);
      }
    }
  };

  const getProfile = async () => {
    let data = await AsyncStorage.getItem('user');
    data = JSON.parse(data);
    setIsLoading(true);
    getMerchantProfile(data._id)
      .then(async res => {
        const data = res?.data?.data;
        setIsLoading(false);
        setInputs({
          ...inputs,
          ...data,
          pickupTimmings: data?.pickupTimmings?.toString() || '',
        });
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const handleUpdateProfile = async () => {
    let data = await AsyncStorage.getItem('user');
    data = JSON.parse(data);

    const payload = {
      name: inputs.name,
      email: inputs.email,
      phoneNumber: inputs.phoneNumber,
      address: inputs.address,
      merchantImage: inputs.merchantImage,
      licenseImage: inputs.licenseImage,
      safetyCertificate: inputs.safetyCertificate,
      isPickUp: inputs.isPickUp,
      pickupTimmings: Number(inputs.pickupTimmings) || 0,
      isApprove: inputs.isApprove,
    };

    if (!inputs.name) return alert('Name is required');
    if (!inputs.email) return alert('Email is required');
    if (!inputs.phoneNumber) return alert('Phone number is required');
    if (!inputs.address) return alert('Address is required');
    if (!inputs.merchantImage) return alert('Merchant image is required');
    if (inputs.isPickUp && !inputs.pickupTimmings)
      return alert('Pickup time is required');

    setIsLoading(true);
    updateMerchantProfile(data?._id, payload)
      .then(response => {
        setIsLoading(false);
        if (response?.data?.status === 'ok') {
          let newUser = response?.data?.data;
          AsyncStorage.setItem('user', JSON.stringify(newUser));
          dispatch(setUserData(newUser));
          alert('Profile updated successfully');
        } else {
          alert('Something went wrong!');
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const showAlert = () => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to delete this account?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'OK', onPress: () => deleteAccount()},
      ],
    );
  };

  const deleteAccount = async () => {
    let data = await AsyncStorage.getItem('user');
    data = JSON.parse(data);
    let payload = {isActive: 'Deleted'};
    setIsLoading(true);
    updateMerchantProfile(data?._id, payload)
      .then(res => {
        setIsLoading(false);
        if (res.data.status === 'error') {
          alert(res?.data.message);
        } else {
          alert('Account deleted successfully');
          AsyncStorage.removeItem('user');
          dispatch(setUserData(null));
        }
      })
      .catch(err => setIsLoading(false));
  };

  const renderTextInput = (label, type, keyboardType = 'default') => (
    <View style={styles.mainacard}>
      <Text style={styles.textstyle}>{label}</Text>
      <KeyboardAvoidingView>
        <TextInput
          style={styles.textstyledynamic}
          placeholder={label}
          placeholderTextColor="gray"
          keyboardType={keyboardType}
          value={inputs[type]?.toString() || ''}
          onChangeText={text => onChangeHandler(type, text)}
          multiline
        />
      </KeyboardAvoidingView>
    </View>
  );

  // ✅ Reusable Image Component
  const ImageWithCamera = ({type, image, circle}) => (
    <View style={{alignItems: 'center', marginVertical: width(3)}}>
      <View>
        <Image
          source={{
            uri: image || 'https://amberstore.pk/uploads/placeholder.jpg',
          }}
          style={{
            width: circle ? width(25) : width(90),
            height: circle ? width(25) : width(50),
            borderRadius: circle ? 100 : 10,
            resizeMode: 'cover',
          }}
        />
        <TouchableOpacity
          onPress={() => openGallery(type)}
          style={{
            position: 'absolute',
            bottom: 5,
            right: 10,
            backgroundColor: colors.white,
            borderRadius: 20,
            padding: 5,
            elevation: 3,
          }}>
          <Feather name="camera" size={22} color={colors.black} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <OverLayLoader isloading={isLoading} />
      <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
        <Header text="Personal Information" goBack={true} />
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Merchant Image */}
          <ImageWithCamera
            type="merchantImage"
            image={
              inputs.merchantImage ||
              'https://amberstore.pk/uploads/101593792-images.jpeg'
            }
            circle
          />

          {renderTextInput('Merchant Name', 'name')}
          {renderTextInput('Email', 'email')}
          {renderTextInput('Phone Number', 'phoneNumber', 'phone-pad')}
          {renderTextInput('Address', 'address')}

          {/* License Image */}
          <Text style={[styles.textstyle, {marginLeft: width(5)}]}>
            License Image
          </Text>
          <ImageWithCamera type="licenseImage" image={inputs.licenseImage} />

          {/* Safety Certificate */}
          <Text
            style={[styles.textstyle, {marginLeft: width(5), marginTop: 10}]}>
            Safety Certificate
          </Text>
          <ImageWithCamera
            type="safetyCertificate"
            image={inputs.safetyCertificate}
          />

          <View style={styles.mainacard}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={styles.textstyle}>Pickup Available</Text>
              <Switch
                value={inputs.isPickUp}
                onValueChange={val => onChangeHandler('isPickUp', val)}
              />
            </View>
            {inputs.isPickUp &&
              renderTextInput(
                'Pickup Time (minutes)',
                'pickupTimmings',
                'numeric',
              )}
          </View>

          <View style={{marginVertical: width(5)}}>
            <Button heading="Update Profile" onPress={handleUpdateProfile} />
            <Button heading="Delete Account" onPress={showAlert} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default PersonalInfo;

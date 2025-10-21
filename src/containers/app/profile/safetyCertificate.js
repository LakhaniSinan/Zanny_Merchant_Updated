import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import Header from '../../../components/header';
import styles from './style';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getMerchantProfile,
  updateMerchantProfile,
} from '../../../services/profile';
import Button from '../../../components/button';
import ImagePicker from '../../../components/imagepicker';
import {width, height} from 'react-native-dimension';
import {colors} from '../../../constants';
import {setUserData} from '../../../redux/slices/Login';
import {useDispatch} from 'react-redux';
import OverLayLoader from '../../../components/loader';

const SafetyCertificate = ({navigation}) => {
  const [isloading, setIsLoading] = useState(false);
  const disptach = useDispatch();
  useEffect(() => {
    getProfile();
  }, []);
  const [inputs, setInputs] = useState({
    safetyCertificate: null,
    licenseImage: null,
  });

  const getImage = (image, type) => {
    setInputs({
      ...inputs,
      [type]: image,
    });
  };

  const getProfile = async () => {
    let data = await AsyncStorage.getItem('user');
    data = JSON.parse(data);
    setIsLoading(true);
    getMerchantProfile(data._id)
      .then(response => {
        setIsLoading(false);
        console.log(response?.data?.data, 'dodjdkjjdkj');
        setInputs({
          licenseImage: response?.data?.data?.licenseImage,
          safetyCertificate: response?.data?.data?.safetyCertificate,
        });
      })
      .catch(error => {
        setIsLoading(false);
        console.log(error, 'errorerrorerror');
      });
  };

  const handleUpdateProfile = async () => {
    let data = await AsyncStorage.getItem('user');
    data = JSON.parse(data);
    const {licenseImage, safetyCertificate} = inputs;
    const payload = {
      licenseImage,
      safetyCertificate,
    };
    if (licenseImage == null) {
      alert('License image is required');
    } else if (safetyCertificate == null) {
      alert('Safety certificate is required');
    } else {
      setIsLoading(true);
      updateMerchantProfile(data?._id, payload)
        .then(response => {
          if (response?.data?.status == 'ok') {
            setIsLoading(false);
            let newObj = {
              ...response?.data?.data,
            };
            AsyncStorage.setItem('user', JSON.stringify(newObj));
            disptach(setUserData(newObj));
            alert(response?.data?.message);
          } else {
            setIsLoading(false);
            console.log(response?.data, 'negative response');
          }
        })
        .catch(error => {
          setIsLoading(false);
          console.log(error, 'ioeoioieioei');
        });
    }
  };
  return (
    <>
      <OverLayLoader isloading={isloading} />
      <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
        <Header text="Safety Certificate & License" goBack={true} />
        <ScrollView>
          <View>
            <View style={{marginTop: width(5)}}>
              <ImagePicker
                subtext={'Upload Your License Image'}
                viewStyle={{
                  borderColor: colors.gray4,
                  width: width(90),
                  height: height(30),
                  borderRadius: width(2),
                  marginTop: height(3),
                  marginHorizontal: width(4),
                  borderWidth: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                getImage={getImage}
                type="licenseImage"
                image={inputs.licenseImage}
                imageStyle={{
                  width: width(90),
                  height: height(30),
                  borderRadius: 10,
                  marginVertical: height(3),
                  marginHorizontal: width(4),
                }}
              />
              <ImagePicker
                subtext={'Upload safety certificate Image'}
                viewStyle={{
                  borderColor: colors.gray4,
                  width: width(90),
                  height: height(30),
                  borderRadius: width(2),
                  marginTop: height(3),
                  marginHorizontal: width(4),
                  borderWidth: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                getImage={getImage}
                type="safetyCertificate"
                image={inputs.safetyCertificate}
                imageStyle={{
                  width: width(90),
                  height: height(30),
                  borderRadius: 10,
                  marginVertical: height(3),
                  marginHorizontal: width(4),
                }}
              />
            </View>
          </View>
          <Button heading="Update Profile" onPress={handleUpdateProfile} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default SafetyCertificate;

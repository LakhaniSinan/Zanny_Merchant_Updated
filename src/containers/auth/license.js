import React, {useState} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {height, width} from 'react-native-dimension';
import {ScrollView} from 'react-native-gesture-handler';
import Button from '../../components/button';
import Header from '../../components/header';
import {colors} from '../../constants';
import {sendCode} from '../../services/auth';
import ImagePicker from '../../components/imagepicker';

const License = ({navigation, route}) => {
  const [inputValue, setInputValue] = useState({
    licenseImage: null,
    safetyCertificate: null,
  });
  const [isloading, setIsLoading] = useState(false);

  let data = route?.params?.data;

  const getImage = (image, type) => {
    setInputValue({
      ...inputValue,
      [type]: image,
    });
  };

  const handelSendCode = () => {
    const {licenseImage, safetyCertificate} = inputValue;
    if (licenseImage == null) {
      alert('License image is required');
    } else if (safetyCertificate == null) {
      alert('Safety Certificate  is required');
    } else {
      let payload = {
        ...data,
        licenseImage,
        safetyCertificate,
      };
      let params = {email: data?.email};
      console.log(params, 'kdldklkdlkdlkdldl');
      setIsLoading(true);
      sendCode(params)
        .then(response => {
          setIsLoading(false);
          console.log(response.data, 'reposne');
          if (response?.data?.status == 'success') {
            alert(response?.data?.message);
            navigation.navigate('CodeVerification', {
              data: payload,
            });
          } else {
            alert(response?.data?.message),
              console.log(response?.data, 'jeijkdjkjkdf');
          }
        })
        .catch(error => {
          setIsLoading(false);
          console.log(error, 'error');
        });
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <Header text={'Sign Up'} goBack={true} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{marginBottom: width(5)}}>
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
          image={inputValue.licenseImage}
          imageStyle={{
            width: width(90),
            height: height(30),
            borderRadius: 10,
            marginVertical: height(3),
            marginHorizontal: width(4),
          }}
        />

        <ImagePicker
          subtext={'Upload Safety Certificate Image'}
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
          image={inputValue.safetyCertificate}
          imageStyle={{
            width: width(90),
            height: height(30),
            borderRadius: 10,
            marginVertical: height(3),
            marginHorizontal: width(4),
          }}
        />
      </ScrollView>
      <TouchableOpacity
        style={{marginBottom: width(5)}}
        onPress={() => navigation.navigate('Documentation')}>
        <Text
          style={{
            color: colors.yellow,
            textAlign: 'right',
            marginRight: width(2),
            textDecorationLine: 'underline',
            fontWeight: '500',
          }}>
          Don't have ? Click here
        </Text>
      </TouchableOpacity>
      <View style={{marginBottom: width(5)}}>
        {isloading ? (
          <ActivityIndicator size={'large'} color={colors.yellow} />
        ) : (
          <Button heading={'Next'} onPress={handelSendCode} />
        )}
      </View>
    </SafeAreaView>
  );
};

export default License;

import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {width} from 'react-native-dimension';
import Button from '../../components/button';
import Header from '../../components/header';
import {colors} from '../../constants';
import {sendCode, sendResetCodeMerchant} from '../../services/auth';

const ForgotPassword = ({navigation}) => {
  const [inputValues, setInputValues] = useState({
    email: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const handleChangeInputs = (name, value) => {
    setInputValues({...inputValues, [name]: value});
  };

  const handleOnPressNext = () => {
    const {email} = inputValues;
    if (email == '') {
      alert('Email is required');
    } else {
      let params = {
        email,
      };
      setIsLoading(true);
      sendResetCodeMerchant(params)
        .then(res => {
          if (res.data.status == 'error') {
            setIsLoading(false);
            alert(res.data.message);
          } else {
            setIsLoading(false);
            alert(res.data.message);
            navigation.navigate('ResetPassword', {email: email});
          }
        })
        .catch(err => {
          setIsLoading(false);
          console.log(err, 'error');
        });
    }
  };
  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
        <Header text={'Forgot Password'} goBack={true} />
        <View style={{padding: width(3)}}>
          <Text
            style={{
              paddingHorizontal: width(2),
              color: colors.redish,
              marginBottom: width(3),
            }}>
            Enter Your Email
          </Text>
          <View
            style={{
              borderWidth: 0.5,
              borderColor: colors.grey,
              borderRadius: width(100),
              paddingVertical: width(2),
              paddingHorizontal: width(3),
            }}>
            <TextInput
              style={{flex: 1, color: colors.redish}}
              placeholder="Enter your email"
              value={inputValues.email}
              onChangeText={value => handleChangeInputs('email', value)}
              placeholderTextColor={colors.gray4}
            />
          </View>
        </View>
        <View
          style={{justifyContent: 'flex-end', flex: 1, marginBottom: width(1)}}>
          {isLoading ? (
            <ActivityIndicator size={'large'} color={colors.yellow} />
          ) : (
            <Button heading={'Next'} onPress={handleOnPressNext} />
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

export default ForgotPassword;

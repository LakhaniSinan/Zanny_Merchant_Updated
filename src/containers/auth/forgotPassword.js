import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
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
    const { email } = inputValues;
      if (email == '') {
      alert('Email is required');
    }  else {
      let params = {
        email,
      };
      setIsLoading(true)
      sendResetCodeMerchant(params)
        .then(res => {
          if (res.data.status == 'error') {
            setIsLoading(false)
            alert(res.data.message);
          } else {
            setIsLoading(false)
            alert(res.data.message);
            navigation.navigate('ResetPassword', {email:email});
          }
        })
        .catch(err => {
          setIsLoading(false)
          console.log(err,"error");
        });
    }
  };
  return (
    <>
    <SafeAreaView style={{flex: 1,backgroundColor:colors.white}}>
        <Header text={'Forgot Password'} goBack={true}/>
        <View style={{marginTop: width(5)}}>
          <Text style={{paddingHorizontal: width(2),color:colors.gray4}}>Email</Text>
          <View
            style={{
              borderBottomWidth: 0.5,
              borderColor: colors.grey,
            }}>
            <TextInput
              style={{margin: width(2),color:colors.black}}
              placeholder="Enter your email"
              value={inputValues.email}
              onChangeText={value => handleChangeInputs('email', value)}
              placeholderTextColor={colors.gray4}
            />
          </View>
        </View>
        <View
          style={{justifyContent: 'flex-end', flex: 1, marginBottom: width(1)}}>
            {isLoading ? <ActivityIndicator size={'large'} color={colors.yellow} /> 
            :
          <Button heading={'Next'} onPress={handleOnPressNext} />
        }
        </View>
      </SafeAreaView>
    </>
  );
};

export default ForgotPassword;

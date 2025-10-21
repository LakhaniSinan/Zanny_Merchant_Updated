import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {width} from 'react-native-dimension';
import Button from '../../components/button';
import Header from '../../components/header';
import {colors} from '../../constants';
import {resetPasswordMerchant} from '../../services/auth';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import Feather from 'react-native-vector-icons/Feather'

const styles = StyleSheet.create({
  codeFieldRoot: {marginTop: 10, justifyContent: 'space-evenly'},
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 2,
    borderColor: colors.gray4,
    textAlign: 'center',
    color:colors.black
  },
  focusCell: {
    borderColor: colors.yellow,
  },
});

const CELL_COUNT = 4;

const ResetPassword = ({navigation, route}) => {
  const {email} = route?.params;
  const [inputValues, setInputValues] = useState({
    otp: '',
    password: '',
  });
  const [value, setValue] = useState('');
  const refrence = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [isLoading, setIsLoading] = useState(false);
  const handleChangeInputs = (name, value) => {
    setInputValues({...inputValues, [name]: value});
  };
  const [isSecure,setIsSecure]=useState(true)


  const handleOnPressReset = () => {
    const {otp, password} = inputValues;
    if (otp == '') {
      alert('Verification code  is required');
    } else if (password == '') {
      alert('Password is required');
    } else {
      let params = {
        email,
        otp,
        password,
      };
      setIsLoading(true);
      resetPasswordMerchant(params)
        .then(res => {
          if (res.data.status == 'error') {
            setIsLoading(false);
            alert(res.data.message);
          } else {
            setInputValues({
              password: '',
              otp: '',
            });
            setIsLoading(false);
            alert(res.data.message);
            navigation.navigate('Login');
          }
        })
        .catch(err => {
          setIsLoading(false);
          console.log(err, 'errorrrr');
        });
    }
  };

  return (
    <>
    <SafeAreaView style={{flex: 1,backgroundColor:colors.white}}>
        <Header text={'Reset Password'} goBack={true} />
        <View style={{marginTop: width(5)}}>
          <Text
            style={{
              color: colors.gray4,
              fontSize: 18,
              fontWeight: '600',
              alignSelf: 'center',
            }}>
            Verification Code
          </Text>
          <CodeField
            ref={refrence}
            {...props}
            value={inputValues.otp}
            onChangeText={text => handleChangeInputs('otp', text)}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({index, symbol, isFocused}) => (
              <Text
                key={index}
                style={[styles.cell, isFocused && styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
          />
          <Text
            style={{
              paddingHorizontal: width(2),
              color: colors.gray4,
              paddingTop: width(10),
            }}>
            Password
          </Text>
          <View
            style={{
              borderBottomWidth: 0.5,
              borderColor: colors.grey,
              flexDirection:"row",
            alignItems:"center",
            justifyContent:"space-between",
            paddingRight:width(4)
            }}>
            <View style={{width:"90%"}}>
            <TextInput
              style={{margin: width(2), color: colors.black}}
              placeholder="Enter new password"
              secureTextEntry={isSecure}
              value={inputValues.password}
              onChangeText={value => handleChangeInputs('password', value)}
              placeholderTextColor={colors.gray4}
            />
          </View>
          <Feather
            name={isSecure ? 'eye-off':'eye'}
            size={width(5)}
            color={colors.gray4}
            onPress={()=>setIsSecure(!isSecure)}
            />
          </View>
            
          
        </View>
        <View
          style={{justifyContent: 'flex-end', flex: 1, marginBottom: width(1)}}>
          {isLoading ? (
            <ActivityIndicator size={'large'} color={colors.yellow} />
          ) : (
            <Button heading={'Reset Password'} onPress={handleOnPressReset} />
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

export default ResetPassword;

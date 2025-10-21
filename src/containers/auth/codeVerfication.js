import React, {useState, useRef, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {width} from 'react-native-dimension';
import {ScrollView} from 'react-native-gesture-handler';
import Button from '../../components/button';
import Header from '../../components/header';
import {colors} from '../../constants';
import CommonModal from './../../components/modal/index';
import {registerMerchant} from '../../services/auth';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

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
    color: colors.black,
  },
  focusCell: {
    borderColor: colors.yellow,
  },
});

const CELL_COUNT = 4;

const CodeVerification = ({navigation, route}) => {
  const ref = useRef();
  const [code, setCode] = useState('');
  const [value, setValue] = useState('');
  const refrence = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  let data = route?.params?.data;
  const [isLoading, setIsLoading] = useState(false);

  const handlePressSignup = () => {
    let payload = {
      ...data,
      code,
    };
    console.log(payload, 'payload');
    if (code == '') {
      alert('Verification code is required');
    } else {
      setIsLoading(true);
      registerMerchant(payload)
        .then(response => {
          if (response?.data?.status == 'ok') {
            setIsLoading(false);
            alert(response?.data?.message);
            navigation.navigate('Login');
          } else {
            setIsLoading(false);
            alert(response?.data?.message);
            navigation.goBack();
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
      <Header text={'Code Verification'} goBack={true} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{marginBottom: width(5)}}>
        <View style={{marginTop: width(5)}}>
          <CodeField
            ref={refrence}
            {...props}
            value={code}
            onChangeText={setCode}
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
        </View>
      </ScrollView>
      <View style={{marginBottom: width(5)}}>
        {isLoading ? (
          <ActivityIndicator size={'large'} color={colors.yellow} />
        ) : (
          <Button heading={'Sign Up'} onPress={handlePressSignup} />
        )}
      </View>
    </SafeAreaView>
  );
};

export default CodeVerification;

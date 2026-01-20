import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState} from 'react';
import {useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TurboModuleRegistry,
  Linking,
} from 'react-native';
import {width} from 'react-native-dimension';
import {useDispatch} from 'react-redux';
import Button from '../../../components/button';
import Header from '../../../components/header';
import {colors} from '../../../constants';
import {setUserData} from '../../../redux/slices/Login';
import OverLayLoader from '../../../components/loader';
import {changePasswordMerchant} from '../../../services/profile';
import {
  addMerchantAccountDetails,
  connectAccount,
  getMerchantAccountDetails,
  updateMerchantAccountDetails,
} from '../../../services/accountDetails';
const AccountInformation = ({navigation}) => {
  const disptach = useDispatch();

  const [isloading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState({
    accountHolderName: '',
    accountNumber: '',
    accountType: '',
    swiftCode: '',
    accountId: '',
  });

  const [isDataAvailable, setIsDataAvailable] = useState(false);
  const handleChangeText = (name, value) => {
    setInputValue({...inputValue, [name]: value});
  };

  useEffect(() => {
    handleGetMerchantAccountDetails();
  }, [isDataAvailable]);

  const onPressAddUpadteAcccount = async () => {
    const {accountType, swiftCode, accountNumber, accountHolderName} =
      inputValue;
    if (accountHolderName == '') {
      alert('Bank accont title is required');
    } else if (accountNumber == '') {
      alert('Account number type is required');
    } else if (swiftCode == '') {
      alert('Sort Code is required');
    } else {
      if (isDataAvailable) {
        let data = await AsyncStorage.getItem('user');
        data = JSON.parse(data);
        let payload = {
          merchantId: data?._id,
          accountType,
          accountHolderName,
          accountNumber,
          swiftCode,
        };
        setIsLoading(true);
        updateMerchantAccountDetails(inputValue?.accountId, payload)
          .then(response => {
            if (response?.data?.status == 'ok') {
              handleGetMerchantAccountDetails();
              setIsLoading(false);
              alert(response?.data?.message);
            } else {
              setIsLoading(false);
              alert(response?.data?.message);
            }
          })
          .catch(error => {
            setIsLoading(false);
            console.log(error, 'error');
          });
      } else {
        let data = await AsyncStorage.getItem('user');
        data = JSON.parse(data);
        let payload = {
          merchantId: data?._id,
          accountType,
          accountHolderName,
          accountNumber,
          swiftCode,
        };
        setIsLoading(true);
        addMerchantAccountDetails(payload)
          .then(response => {
            if (response?.data?.status == 'ok') {
              handleGetMerchantAccountDetails();
              setIsLoading(false);
              alert(response?.data?.message);
            } else {
              setIsLoading(false);
              alert(response?.data?.message);
            }
          })
          .catch(error => {
            setIsLoading(false);
            console.log(error, 'error');
          });
      }
    }
  };

  const handleGetMerchantAccountDetails = async () => {
    let data = await AsyncStorage.getItem('user');
    data = JSON.parse(data);
    setIsLoading(true);
    getMerchantAccountDetails(data?._id)
      .then(response => {
        setIsLoading(false);
        // console.log(response?.data?.data,"responseeeeeeeeee");
        if (response?.data?.data !== null) {
          let values = response?.data?.data;
          // console.log(values,"valuesss");
          setIsDataAvailable(true);
          setInputValue({
            accountHolderName: values?.accountHolderName,
            accountNumber: values?.accountNumber,
            accountType: values?.accountType,
            swiftCode: values?.swiftCode,
            accountId: values?._id,
          });
        }
      })
      .catch(error => {
        setIsLoading(false);
        console.log(error, 'errorrrrrrrrr');
      });
  };

  const handleConnectAccount = async () => {
    let data = await AsyncStorage.getItem('user');
    data = JSON.parse(data);
    let payload = {
      merchantId: data._id,
    };
    setIsLoading(true);
    connectAccount(payload)
      .then(async res => {
        setIsLoading(false);
        if (res.status == 200) {
          await navigation.navigate('ConnectAccount', {
            url: res.data.data,
          });
        } else {
          alert(res.data.message);
        }
      })
      .catch(error => {
        setIsLoading(false);
        console.log(error, 'error link accout');
      });
  };
  return (
    <>
      <OverLayLoader isloading={isloading} />
      <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
        <Header text={'Bank Account Details'} goBack={true} />

        <View style={{marginTop: width(5)}}>
          {/* <Text style={{ marginTop: width(2), paddingHorizontal: width(2),color:colors.gray4 }}>
            Account Type
          </Text>
          <View
            style={{
              borderBottomWidth: 0.5,
              borderColor: colors.grey,
            }}>
            <TextInput
              style={{ margin: width(2),color:colors.gray4 }}
              placeholder="Enter your bank account type"
              value={inputValue.accountType}
              onChangeText={newText => handleChangeText('accountType', newText)}
              placeholderTextColor={colors.gray4}
            />
          </View> */}
          <Text
            style={{
              marginTop: width(2),
              paddingHorizontal: width(2),
              color: colors.gray4,
            }}>
            Bank Name *
          </Text>
          <View
            style={{
              borderBottomWidth: 0.5,
              borderColor: colors.grey,
              marginTop: width(2),
            }}>
            <TextInput
              style={{margin: width(2), color: colors.gray4}}
              placeholder="Enter your bank name"
              value={inputValue.accountHolderName}
              onChangeText={newText =>
                handleChangeText('accountHolderName', newText)
              }
              placeholderTextColor={colors.gray4}
            />
          </View>
          <Text
            style={{
              marginTop: width(5),
              paddingHorizontal: width(2),
              color: colors.gray4,
            }}>
            Account Number *
          </Text>
          <View
            style={{
              borderBottomWidth: 0.5,
              borderColor: colors.grey,
              marginTop: width(2),
            }}>
            <TextInput
              style={{margin: width(2), color: colors.gray4}}
              placeholder="Enter your bank account no"
              value={inputValue.accountNumber}
              onChangeText={newText =>
                handleChangeText('accountNumber', newText)
              }
              placeholderTextColor={colors.gray4}
            />
          </View>
          <Text
            style={{
              marginTop: width(5),
              paddingHorizontal: width(2),
              color: colors.gray4,
            }}>
            Sort Code *
          </Text>
          <View
            style={{
              borderBottomWidth: 0.5,
              borderColor: colors.grey,
              marginTop: width(2),
            }}>
            <TextInput
              style={{margin: width(2), color: colors.gray4}}
              placeholder="Enter your acount Sort Code"
              value={inputValue.swiftCode}
              onChangeText={newText => handleChangeText('swiftCode', newText)}
              placeholderTextColor={colors.gray4}
            />
          </View>
        </View>
        <View
          style={{justifyContent: 'flex-end', flex: 1, marginBottom: width(1)}}>
          <Button
            heading={
              isDataAvailable ? 'Update Account Details' : 'Add Account Details'
            }
            onPress={onPressAddUpadteAcccount}
          />
          {isDataAvailable && (
            <Button
              heading={'Connect Account With Stripe'}
              onPress={handleConnectAccount}
            />
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

export default AccountInformation;

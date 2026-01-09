import React, {use, useCallback, useEffect} from 'react';
import {View, Text, SafeAreaView} from 'react-native';
import {width} from 'react-native-dimension';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Header from '../../../components/header';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {colors} from '../../../constants';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = () => {
  const [userData, setUserData] = React.useState(null);

  useFocusEffect(
    useCallback(() => {
      getUserData();
    }, []),
  );

  const getUserData = async () => {
    let data = await AsyncStorage.getItem('user');
    data = JSON.parse(data);
    setUserData(data);
    console.log(data, 'datadata');
  };

  const navigation = useNavigation();
  const data = [
    {
      name: 'Personal Information',
      screenName: 'PersonalInfo',
    },
    {
      name: 'Safety Certificate & License',
      screenName: 'SafetyCertificate',
    },
    {
      name: 'Change Password',
      screenName: 'ChangePassword',
    },
    {
      name: 'Account Information',
      screenName: 'AccountInformation',
    },
    {
      name: 'Support',
      screenName: 'Support',
    },
    // {
    //   name: "Delivery Time",
    //   screenName: 'deliveryTime',
    // },
    {
      name: 'Merchant Timmigs',
      screenName: 'merchantTimmings',
    },
  ];

  console.log(userData, 'USADASSAD');

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <Header text={'Profile'} drawer={true} />
      <View style={{marginTop: width(4)}}>
        {data.map((item, index) => {
          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(item.screenName, {data: userData})
              }
              style={{
                backgroundColor: 'white',
                marginVertical: width(2),
                paddingVertical: width(6),
                marginHorizontal: width(1),
                borderRadius: 5,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: width(3),
                elevation: 5,
              }}>
              <Text
                style={{fontWeight: 'bold', fontSize: 15, color: colors.gray4}}>
                {item.name}
              </Text>
              <View
                style={{
                  height: 30,
                  width: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: colors.yellow,
                  borderRadius: 200,
                }}>
                <AntDesign size={18} color={'white'} name="arrowright" />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default Profile;

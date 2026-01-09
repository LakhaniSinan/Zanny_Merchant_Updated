import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {width} from 'react-native-dimension';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Foundation from 'react-native-vector-icons/Foundation';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {
  default as Icon,
  default as MaterialCommunityIcons,
} from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch} from 'react-redux';
import {colors} from '../../constants';
import {setUserData} from '../../redux/slices/Login';

const DrawerItem = props => {
  const {title, focused, iconName, user, translatedTitle, navigation} = props;

  const dispatch = useDispatch();

  const handleLogout = async () => {
    setTimeout(async () => {
      await AsyncStorage.removeItem('user');
      dispatch(setUserData(null));
    }, 1000);
  };
  const renderIcon = () => {
    switch (iconName) {
      case 'Dashboard':
        return (
          <AntDesign
            style={{marginRight: 10, marginLeft: 10}}
            name="dashboard"
            color={colors.redish}
            size={22}
          />
        );

      case 'Food':
        return (
          <Icon
            style={{marginRight: 10, marginLeft: 10}}
            name="food"
            color={colors.redish}
            size={22}
          />
        );
      case 'Pickup Orders':
        return (
          <Foundation
            name="clipboard-notes"
            style={{marginRight: 10, marginLeft: 10}}
            color={colors.redish}
            size={22}
          />
        );
      case 'Delivery Orders':
        return (
          <Foundation
            name="clipboard-notes"
            style={{marginRight: 10, marginLeft: 10}}
            color={colors.redish}
            size={22}
          />
        );

      case 'Payment History':
        return (
          <Foundation
            name="clipboard-notes"
            style={{marginRight: 10, marginLeft: 10}}
            color={colors.redish}
            size={22}
          />
        );
      case 'Private Hire':
        return (
          <Foundation
            name="clipboard-notes"
            style={{marginRight: 10, marginLeft: 10}}
            color={colors.redish}
            size={22}
          />
        );
      case 'Food Categories':
        return (
          <MaterialIcons
            style={{marginRight: 10, marginLeft: width(3)}}
            name="category"
            color={colors.redish}
            size={22}
          />
        );
      case 'FAQs':
        return (
          <MaterialIcons
            style={{marginRight: 10, marginLeft: width(3)}}
            name="category"
            color={colors.redish}
            size={22}
          />
        );
      case 'Profile':
        return (
          <IonIcons
            style={{marginRight: 10, marginLeft: width(3)}}
            name="people"
            color={colors.redish}
            size={22}
          />
        );
      case 'Support':
        return (
          <AntDesign
            style={{marginRight: 10, marginLeft: width(3)}}
            name="customerservice"
            color={colors.redish}
            size={22}
          />
        );
      case 'Log out':
        return (
          <MaterialCommunityIcons
            style={{marginRight: 10, marginLeft: width(4)}}
            name="logout"
            color={colors.redish}
            size={22}
          />
        );
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity
      style={{height: 50}}
      onPress={() =>
        iconName == 'Log out'
          ? handleLogout()
          : iconName == 'Pickup Orders'
          ? navigation.navigate('Pickup Orders', {type: 'pickup'})
          : iconName == 'Delivery Orders'
          ? navigation.navigate('Delivery Orders', {type: 'delivery'})
          : navigation.navigate(iconName)
      }>
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          alignItems: 'center',
        }}>
        <View style={{width: '20%'}}>{renderIcon()}</View>
        <Text style={{color: 'black', fontWeight: '600', color: colors.redish}}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default DrawerItem;

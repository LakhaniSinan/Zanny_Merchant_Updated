import React, {useDebugValue} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {colors} from '../../constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import {useNavigation} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {width} from 'react-native-dimension';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {setUserData} from '../../redux/slices/Login';
import ToggleSwitch from 'toggle-switch-react-native';

const Header = ({
  text,
  goBack,
  cart,
  logout,
  handlePress,
  drawer,
  status,
  handleChangeStatus,
  online,
  showProduct,
  isShow,
  handleChangeProductStatus,
  rightIconName,
  onPressRightIcon,
  rightIconBadgeCount = 0,
}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const logoutUser = async () => {
    // console.log('RAN1');
    await AsyncStorage.removeItem('user');
    dispatch(setUserData(null));
  };

  return (
    <View
      style={{
        height: 60,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: width(3),
        backgroundColor: colors.softgray,
      }}>
      <View style={{flex: 1, alignItems: 'center'}}>
        <Text
          style={{
            color: colors.redish,
            fontSize: 14,
            fontWeight: 'bold',
          }}>
          {text}
        </Text>
      </View>
      {drawer && (
        <TouchableOpacity
          onPress={() => navigation.toggleDrawer()}
          style={{position: 'absolute', left: width(4)}}>
          <Octicons name="three-bars" size={22} color={colors.redish} />
        </TouchableOpacity>
      )}
      {cart && (
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <FontAwesome name="shopping-cart" size={22} color="white" />
        </TouchableOpacity>
      )}

      {goBack && (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{position: 'absolute', left: width(4)}}>
          <AntDesign name="arrowleft" size={20} color={colors.redish} />
        </TouchableOpacity>
      )}
      {rightIconName && (
        <TouchableOpacity
          onPress={onPressRightIcon}
          style={{
            marginRight: width(3),
            position: 'absolute',
            right: status || showProduct ? 70 : 12,
          }}>
          <Ionicons name={rightIconName} size={22} color={colors.redish} />
          {rightIconBadgeCount > 0 && (
            <View
              style={{
                position: 'absolute',
                top: -6,
                right: -6,
                backgroundColor: colors.redish,
                borderRadius: 9,
                minWidth: 18,
                height: 18,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 4,
              }}>
              <Text
                style={{color: colors.white, fontSize: 10, fontWeight: '700'}}>
                {rightIconBadgeCount > 99 ? '99+' : rightIconBadgeCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      )}
      {status && (
        <View style={{marginRight: width(3)}}>
          <ToggleSwitch
            isOn={online}
            onColor={colors.green}
            offColor="red"
            size="medium"
            onToggle={handleChangeStatus}
          />
        </View>
      )}
      {showProduct && (
        <View style={{marginRight: width(3)}}>
          <ToggleSwitch
            isOn={isShow}
            onColor={colors.green}
            offColor="red"
            size="medium"
            onToggle={handleChangeProductStatus}
          />
        </View>
      )}
      {logout && (
        <TouchableOpacity
          onPress={logoutUser}
          style={{position: 'absolute', right: 10}}>
          <MaterialIcons
            onPress={handlePress}
            color={colors.white}
            name="logout"
            size={24}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;

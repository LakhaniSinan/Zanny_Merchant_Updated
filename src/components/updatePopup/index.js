import {exitApp} from '@logicwind/react-native-exit-app';
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {Image, Linking, Platform, Text, View} from 'react-native';
import {width} from 'react-native-dimension';
// import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';
import {icons} from '../../assets';
import Button from '../button';

let propsData = {};

const UpdatePopUp = React.forwardRef((props, ref) => {
  console.log(ref, 'refrefrefrefrefref');

  const {handleButton} = props;
  const [isVisible, ModalVisibility] = useState(false);
  const navigation = useNavigation();

  React.useImperativeHandle(ref, () => ({
    isVisible(params) {
      console.log(params, 'paramsparamsparams');

      propsData = params;
      ModalVisibility(true);
    },
    backdropPress() {
      ModalVisibility(false);
    },
  }));

  let androidURL =
    'https://play.google.com/store/apps/details?id=com.zanny_merchant&hl=en_US&pli=1';
  let iosURL = 'https://apps.apple.com/be/app/zannys-merchant/id1671109483';

  console.log(propsData, 'propsDatapropsDatapropsData');

  return (
    <Modal
      style={{alignSelf: 'center', alignItems: 'center'}}
      isVisible={isVisible}
      animationIn="slideInLeft"
      animationOut="slideOutRight"
      backdropOpacity={0.5}
      useNativeDriver={true}
      hideModalContentWhileAnimating={true}>
      <View
        style={{
          width: width(86),
          backgroundColor: 'white',
          borderRadius: width(2),
          padding: width(8),
        }}>
        <View style={{alignSelf: 'center'}}>
          <Image
            source={icons.zannyLogo}
            resizeMode="contain"
            style={{
              height: width(25),
              width: width(25),
            }}
          />
        </View>
        <Text
          style={{
            fontSize: width(4),
            color: 'black',
            textAlign: 'center',
          }}>
          New Features Available!
        </Text>
        <Text
          style={{
            fontSize: width(2.5),
            color: 'black',
            textAlign: 'center',
            marginTop: width(5),
          }}>
          A new version brings performance boosts and exciting features. Please
          update to continue.
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: width(5),
          }}>
          <View style={{width: '50%'}}>
            <Button
              onPress={() => {
                ModalVisibility(false);
                setTimeout(() => {
                  exitApp();
                }, 1000);
              }}
              heading="Cancel"
            />
          </View>
          <View style={{width: '50%'}}>
            <Button
              heading="Update"
              onPress={() => {
                Platform.OS == 'android'
                  ? Linking.openURL(androidURL)
                  : Linking.openURL(iosURL);
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
});

export default UpdatePopUp;

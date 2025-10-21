import {DrawerContentScrollView} from '@react-navigation/drawer';
import React from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import {height, width} from 'react-native-dimension';
import Octicons from 'react-native-vector-icons/Octicons';
import {useSelector} from 'react-redux';
import {colors} from '../../constants';
import DrawerItems from './drawerItems';

function DrawerContent(props) {
  const mainNav = [
    'Dashboard',
    'Food',
    'Profile',
    'Pickup Orders',
    'Delivery Orders',
    'Food Categories',
    'Private Hire',
    'Payment History',
    'FAQs',
    'Support',
  ];
  const user = useSelector(state => state.LoginSlice.user);

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView
        style={{
          backgroundColor: 'white',
          flex: 1,
          paddingTop: 0,
          paddingTop: 0,
          paddingLeft: 0,
          paddingRight: 0,
        }}
        {...props}>
        <View style={styles.drawerContent}>
          <View
            style={{
              backgroundColor: colors.yellow,
              padding: 10,
              height: height(25),
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}>
            <TouchableOpacity
              style={{position: 'absolute', top: 10, left: 10}}
              onPress={() => props.navigation.toggleDrawer()}>
              <Octicons name="three-bars" size={22} color="white" />
            </TouchableOpacity>

            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 400 / 2,
                marginBottom: width(2),
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}>
              <Image
                source={{
                  uri: user?.merchantImage
                    ? user?.merchantImage
                    : 'https://amberstore.pk/uploads/101593792-images.jpeg',
                }}
                style={{width: '100%', height: '100%'}}
                resizeMode="cover"
              />
            </View>
            <View style={{justifyContent: 'flex-end', alignItems: 'center'}}>
              <Text style={{fontSize: 20, color: 'white', fontWeight: 'bold'}}>
                {user?.name}
              </Text>
            </View>
          </View>

          <View style={{marginTop: 10}}>
            {mainNav.map((item, index) => {
              return (
                <>
                  <DrawerItems
                    iconName={item}
                    title={item}
                    key={index}
                    navigation={props.navigation}
                    focused={props.state.index === index ? true : false}
                    props={props}
                  />
                </>
              );
            })}

            <View style={{borderWidth: 0.3, borderColor: '#d3d3d3'}} />
          </View>
        </View>
        <View>
          <DrawerItems
            iconName="Log out"
            title={'Log out'}
            navigation={props.navigation}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  underline: {
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: 'white',
  },
  userInfoScreen: {
    alignItems: 'center',
    marginTop: 10,
  },
});

export default DrawerContent;

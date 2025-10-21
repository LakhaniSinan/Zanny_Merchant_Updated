import React, {useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// import {getAllOrdersByUserId} from '../../../services/orders';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {width} from 'react-native-dimension';
import OverLayLoader from '../../../components/loader';
import {colors} from '../../../constants';
import {getOrderByMerchant} from '../../../services/orders.js/index.js';
import OrderImages from './orderImages';
import styles from './style';

const PastOrders = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [allOrders, setAllOrders] = useState('');
  const orderStatus = route?.params?.type;
  const orderType = route?.params?.orderType;
  console.log(orderType, 'orderTypeorderTypeorderType');

  const getOrders = async () => {
    let user = await AsyncStorage.getItem('user');
    user = JSON.parse(user);
    setIsLoading(true);
    getOrderByMerchant(user._id)
      .then(res => {
        setIsLoading(false);
        if (res?.data?.status == 'ok') {
          let tempArr = [];
          let data = res?.data?.data;
          data.map((item, index) => {
            console.log(orderType, 'orderType = item?.orderType');

            if (orderType == item?.orderType) {
              if (item?.status == 'Completed' || item?.status == 'Rejected') {
                tempArr.push(item);
              } else {
                setAllOrders([]);
              }
            }
          });
          setAllOrders(tempArr.reverse());
        } else {
          console.log(res?.data, 'else ressssss');
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err, 'errrrrrr');
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      getOrders();
    }, [orderStatus]),
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <OverLayLoader isloading={isLoading} />

      <FlatList
        data={allOrders}
        contentContainerStyle={{flexGrow: 1, paddingTop: width(2)}}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('OrderDetail', {
                  detail: item,
                })
              }
              style={styles.cardview}>
              <View style={styles.innerview}>
                <OrderImages imageUrl={item?.merchantDetails?.merchantImage} />
                <View style={styles.txtview}>
                  {/* <Text style={styles.txtdate}>Order No: {item?.orderNo}</Text> */}
                  <Text style={styles.txtdate}>Status: {item.status}</Text>
                  <Text style={styles.txtdate}>
                    Total Bill: £.{item.totalBill}
                  </Text>
                  <Text style={styles.txtdate}>Date: {item.date}</Text>
                </View>
              </View>
              <View
                style={{
                  padding: width(1),
                  paddingHorizontal: width(4),
                  borderRadius: 100,
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: colors.green,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '500',
                    color: colors.white,
                  }}>
                  {item?.orderType == 'pickup' ? 'Pickup' : 'Delivery'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              backgroundColor: colors.white,
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 16,
                marginBottom: width(2),
                color: 'black',
                textAlign: 'center',
              }}>
              No orders right now
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default PastOrders;

import React, {useEffect, useState} from 'react';
import {
  FlatList,
  RefreshControl,
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
import {getOrderByMerchant} from '../../../services/orders.js';
import OrderImages from './orderImages';
import styles from './style';

const CurrentOrders = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [allOrders, setAllOrders] = useState('');
  const orderStatus = route?.params?.type;
  const orderType = route?.params?.orderType;
  console.log(orderType, 'orderTypeorderTypeorderType');

  const [refreshing, setRefreshing] = useState(false);
  const [remainingTimes, setRemainingTimes] = useState({});
  const updateRemainingTime = (orderId, pickupMinutes, orderDate) => {
    // Convert order date string to Date object
    const orderTime = new Date(orderDate);
    const pickupTime = new Date(orderTime.getTime() + pickupMinutes * 60000);

    const interval = setInterval(() => {
      const now = new Date();
      const diff = pickupTime - now;

      if (diff <= 0) {
        clearInterval(interval);
        setRemainingTimes(prev => ({...prev, [orderId]: '00:00'}));
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setRemainingTimes(prev => ({
          ...prev,
          [orderId]: `${minutes.toString().padStart(2, '0')}:${seconds
            .toString()
            .padStart(2, '0')}`,
        }));
      }
    }, 1000);

    return interval; // Return interval ID for cleanup
  };

  useEffect(() => {
    const intervals = {};

    if (allOrders.length > 0) {
      allOrders.forEach(order => {
        if (order.pickupTimmings) {
          // Clear existing interval if any
          if (intervals[order._id]) {
            clearInterval(intervals[order._id]);
          }

          intervals[order._id] = updateRemainingTime(
            order._id,
            order.pickupTimmings,
            order.createdAt,
          );
        }
      });
    }

    return () => {
      Object.values(intervals).forEach(intervalId => clearInterval(intervalId));
    };
  }, [allOrders]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getOrders().then(() => {
      setRefreshing(false);
    });
  }, []);

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
          data?.map((item, index) => {
            if (orderType == item?.orderType) {
              if (
                item?.status == 'Pending' ||
                item?.status == 'Accepted' ||
                item?.status == 'ReadyForPickup'
              ) {
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
        keyExtractor={item => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
                  <Text style={styles.txtdate}>
                    Status:{' '}
                    {item.status == 'ReadyForPickup'
                      ? 'Ready For Pickup'
                      : item?.status}
                  </Text>
                  <Text style={styles.txtdate}>
                    Total Bill: £.{item.totalBill}
                  </Text>
                  {orderType !== 'pickup' && (
                    <Text style={styles.txtdate}>
                      Payment Type:{' '}
                      {item.paymentType ? item.paymentType : 'Card'}
                    </Text>
                  )}
                  <Text style={styles.txtdate}>Date: {item.date}</Text>
                  {item.pickupTimmings && item.orderType == 'pickup' && (
                    <Text style={[styles.txtdate, {color: colors.green}]}>
                      Expected Pickup Time :{' '}
                      {remainingTimes[item._id] || 'Loading...'}
                    </Text>
                  )}
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

export default CurrentOrders;

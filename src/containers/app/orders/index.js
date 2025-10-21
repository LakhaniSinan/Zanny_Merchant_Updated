import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
// import {getAllOrdersByUserId} from '../../../services/orders';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {width} from 'react-native-dimension';
import styles from './style';
import OrderImages from './orderImages';
import {getOrderByMerchant} from '../../../services/orders.js';
import OverLayLoader from '../../../components/loader';

const Orders = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [allOrders, setAllOrders] = useState('');

  const orderStatus = route?.params?.type;

  console.log(orderStatus, 'orderStatus');
  const getOrders = async () => {
    let user = await AsyncStorage.getItem('user');
    user = JSON.parse(user);
    setIsLoading(true);
    getOrderByMerchant(user._id)
      .then(res => {
        setIsLoading(false);
        if (res?.data?.status == 'ok') {
          let tempArr = [];
          if (orderStatus == 'pending') {
            let data = res?.data?.data;
            data.map((item, index) => {
              if (item?.status == 'Pending' || item?.status == 'Accepted') {
                tempArr.push(item);
                setAllOrders(tempArr);
              } else {
                setAllOrders([]);
              }
            });
          } else {
            let data = res?.data?.data;
            console.log(data.length, 'COMPLETEEEEEEEEE');
            data.map((item, index) => {
              console.log(item.status, 'STATUSSS');
              if (
                item?.status == 'ReadyForPickup' ||
                item?.status == 'Rejected'
              ) {
                tempArr.push(item);
              } else {
              }
            });
            setAllOrders(tempArr);
          }
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
    <>
      <OverLayLoader isloading={isLoading} />
      <FlatList
        data={allOrders}
        style={{marginTop: width(2)}}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={({item, index}) => (
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
                <Text style={styles.txtdate}>Status: {item.status}</Text>
                <Text style={styles.txtdate}>
                  Total Bill: £.{item.totalBill}
                </Text>
                <Text style={styles.txtdate}>Date: {item.date}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
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
    </>
  );
};

export default Orders;

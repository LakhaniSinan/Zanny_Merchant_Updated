import React, {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import {width} from 'react-native-dimension';
import Button from '../../../components/button';
import Header from '../../../components/header';
import {updateOrderStatus} from '../../../services/orders.js';
import {colors} from './../../../constants/index';
import styles from './style';

const OrderDetail = ({navigation, route}) => {
  const data = route.params.detail;
  console.log(data, 'datadatadatadata');

  const [subTotal, setSubTotal] = useState(0);
  const [prepareTime, setPrepareTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

    // Enable countdown timer for current order
    if (data.pickupTimmings) {
      intervals[data._id] = updateRemainingTime(
        data._id,
        data.pickupTimmings,
        data.createdAt,
      );
    }

    return () => {
      Object.values(intervals).forEach(intervalId => clearInterval(intervalId));
    };
  }, [data]);

  useEffect(() => {
    let total = 0;
    data.order.map(item => {
      // console.log(item, 'sadlkajsdlk');
      total += item.selectedQty * item.price;
    });
    setSubTotal(total);
    setPrepareTime(data?.preparationTime);
  }, []);

  const handleOrderStatus = type => {
    console.log('callled');
    console.log(type, 'type');
    if (type == 'reject') {
      Alert.alert('Delete', 'Are you sure want to reject order', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            let payload = {
              Id: data?._id,
              userId: data?.userId,
              status: 'Rejected',
              userId: data.userId,
            };
            setIsLoading(true);
            updateOrderStatus(payload)
              .then(response => {
                setIsLoading(false);
                if (response?.data?.status == 'ok') {
                  alert(response?.data?.message);
                  navigation.goBack();
                } else {
                  alert(response?.data?.message);
                }
              })
              .catch(error => {
                console.log(error, 'error');
                setIsLoading(false);
              });
          },
        },
      ]);
    } else if (type == 'accept') {
      console.log('innnnnnnn');
      let payload = {
        Id: data?._id,
        status: 'Accepted',
        userId: data?.userId,
        preparationTime: prepareTime,
      };

      // Check if preparation time is required based on order type
      if (data.orderType !== 'pickup' && prepareTime == '') {
        alert('Please enter preparation time');
        return;
      }

      setIsLoading(true);
      updateOrderStatus(payload)
        .then(response => {
          setIsLoading(false);
          if (response?.data?.status == 'ok') {
            alert(response?.data?.message);
            navigation.goBack();
            setPrepareTime('');
          } else {
            alert(response?.data?.message);
          }
        })
        .catch(error => {
          setIsLoading(false);
          console.log(error, 'error');
        });
    }
    if (type == 'Completed') {
      let payload = {
        Id: data?._id,
        status: 'Completed',
        userId: data?.userId,
        preparationTime: prepareTime,
        userId: data.userId,
      };
      setIsLoading(true);
      updateOrderStatus(payload)
        .then(response => {
          setIsLoading(false);
          if (response?.data?.status == 'ok') {
            alert(response?.data?.message);
            navigation.goBack();
            setPrepareTime('');
          } else {
            alert(response?.data?.message);
          }
        })
        .catch(error => {
          setIsLoading(false);
          console.log(error, 'error');
        });
    } else {
      console.log('nothing');
    }
    if (type == 'ReadyForPickup') {
      let payload = {
        Id: data?._id,
        status: 'ReadyForPickup',
        userId: data?.userId,
        preparationTime: prepareTime,
        userId: data.userId,
      };
      setIsLoading(true);
      updateOrderStatus(payload)
        .then(response => {
          setIsLoading(false);
          if (response?.data?.status == 'ok') {
            alert(response?.data?.message);
            navigation.goBack();
            setPrepareTime('');
          } else {
            alert(response?.data?.message);
          }
        })
        .catch(error => {
          setIsLoading(false);
          console.log(error, 'error');
        });
    } else {
      console.log('nothing');
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Header text="Order Details" goBack={true} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={{
            uri: data?.merchantDetails?.merchantImage,
          }}
          style={styles.imageStyle}
          resizeMode="cover"
        />
        <View
          style={{
            borderBottomWidth: 0.5,
            marginHorizontal: 10,
            marginVertical: 10,
          }}>
          <Text style={styles.orderheading}>Order Details</Text>
        </View>
        <View style={styles.borderstyle}>
          <View style={styles.ordertxtview}>
            <Text style={styles.subheading}>Order number</Text>
            <View style={{width: '100%', borderRadius: 20}}>
              <Text style={styles.oredernotxt}>{data.orderId}</Text>
            </View>
          </View>
          <View style={styles.ordertxtview}>
            <Text style={styles.subheading}>Order Status</Text>
            <Text style={styles.oredernotxt}>{data.status}</Text>
          </View>
          <View style={styles.ordertxtview}>
            <Text style={styles.subheading}>Order Type</Text>
            <Text style={styles.oredernotxt}>
              {data.orderType == 'pickup' ? 'Pickup' : 'Delivery'}
            </Text>
          </View>
          <View style={styles.ordertxtview}>
            <Text style={styles.subheading}>Payment Type</Text>
            <Text style={styles.oredernotxt}>
              {data?.paymentType ? data?.paymentType : 'Card'}
            </Text>
          </View>
          {data.pickupTimmings && data.orderType == 'pickup' && (
            <View style={styles.ordertxtview}>
              <Text style={{color: colors.black}}>Expected Time :</Text>
              <Text style={styles.oredernotxt}>
                {remainingTimes[data?._id] || 'Loading...'}
              </Text>
            </View>
          )}
          {data?.status == 'ReadyForPickup' ? (
            <View style={styles.ordertxtview}>
              <Text style={styles.subheading}>Delivery Status</Text>
              <Text style={styles.oredernotxt}>{'Ready For Pickup'}</Text>
            </View>
          ) : null}

          <View style={styles.ordertxtview}>
            <Text style={styles.subheading}>Delivery address:</Text>
            <Text style={styles.deliverytxt}>{data.address}</Text>
          </View>
          {data?.deliveryStatus == 'Collected' ? (
            <>
              <Text style={styles.orderheading}>Driver Details</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: width(2),
                }}>
                <Text style={{color: colors.black, left: width(4)}}>Name</Text>
                <Text style={{color: colors.black, right: width(4)}}>
                  {data?.driverDetails?.name}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: width(2),
                }}>
                <Text style={{color: colors.black, left: width(4)}}>Email</Text>
                <Text style={{color: colors.black, right: width(4)}}>
                  {data?.driverDetails?.email}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: width(2),
                }}>
                <Text style={{color: colors.black, left: width(4)}}>
                  Phone No.
                </Text>
                <Text style={{color: colors.black, right: width(4)}}>
                  {data?.driverDetails?.phoneNumber}
                </Text>
              </View>
            </>
          ) : null}
        </View>
        <View style={styles.borderstyle}>
          {data.order.map((item, ind) => {
            return (
              <View key={ind} style={styles.ordertxtview}>
                <Text style={styles.subheading}>
                  {item.selectedQty}x {item.name}
                </Text>
                <Text style={styles.pricetxt}>
                  £ {item.discount > 0 ? item.discount : item.price}
                </Text>
              </View>
            );
          })}
        </View>
        <View style={styles.borderstyle}>
          <View style={styles.ordertxtview}>
            <Text style={styles.subheading}>Delivery Fees</Text>
            <Text style={styles.pricetxt}>£ {data.deliveryCharges}</Text>
          </View>

          {/* <View style={styles.ordertxtview}>
            <Text style={styles.subheading}>Discount</Text>
            <Text style={styles.pricetxt}>£ {data.discount}</Text>
          </View> */}
          {data?.status == 'Pending' && data.orderType !== 'pickup' ? (
            <>
              <Text
                style={{
                  paddingHorizontal: width(2),
                  marginVertical: 10,
                  color: colors.black,
                }}>
                Preparation Time
              </Text>
              <View
                style={{
                  borderWidth: 0.5,
                  marginHorizontal: 10,
                  marginVertical: 10,
                  paddingVertical: 1,
                  borderColor: colors.grey,
                }}>
                <TextInput
                  style={{margin: width(2), color: colors.black}}
                  placeholder="Enter preparation time"
                  value={prepareTime}
                  onChangeText={newText => setPrepareTime(newText)}
                  placeholderTextColor={colors.black}
                />
              </View>
            </>
          ) : null}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginVertical: width(2),
            }}>
            <Text
              style={{
                color: colors.black,
                left: width(2),
                fontWeight: 'bold',
                fontSize: 18,
              }}>
              Total
            </Text>
            <Text
              style={{
                color: 'grey',
                right: width(1),
                fontWeight: '600',
                fontSize: 16,
              }}>
              £{data?.totalBill}
            </Text>
          </View>
        </View>
      </ScrollView>
      <View style={{marginBottom: width(1)}}>
        {data.status == 'Pending' ? (
          <Button
            // onPress={() }
            heading={'Cancel Order'}
            color={colors.pinkColor}
            onPress={() => handleOrderStatus('reject')}
          />
        ) : null}
      </View>
      <View style={{marginBottom: width(1)}}>
        {data.status == 'Pending' ? (
          <Button
            onPress={() => handleOrderStatus('accept')}
            heading={'Accept Order'}
            color={colors.pinkColor}
          />
        ) : null}
      </View>
      <View style={{marginBottom: width(1)}}>
        {data.status == 'Accepted' ? (
          <Button
            onPress={() =>
              handleOrderStatus(
                data?.orderType == 'pickup' ? 'ReadyForPickup' : 'Completed',
              )
            }
            heading={
              data?.orderType == 'pickup' ? 'Ready For Pickup' : 'Completed'
            }
            color={colors.pinkColor}
          />
        ) : null}
      </View>
      <View style={{marginBottom: width(1)}}>
        {data.status == 'ReadyForPickup' ? (
          <Button
            onPress={() => handleOrderStatus('Completed')}
            heading={'Completed'}
            color={colors.pinkColor}
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
};

export default OrderDetail;

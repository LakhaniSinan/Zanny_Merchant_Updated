import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  ScrollView,
} from 'react-native';
import Header from '../../../components/header';
import Button from '../../../components/button';
import {colors} from './../../../constants/index';
import styles from './style';
import {width} from 'react-native-dimension';
import OverLayLoader from '../../../components/loader';
import {updatePrivateOrderStatus} from '../../../services/privateOrder';

const OrderDetail = ({navigation, route}) => {
  const data = route.params.detail;
  const [subTotal, setSubTotal] = useState(0);
  const [prepareTime, setPrepareTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    if (type == 'reject') {
      let payload = {
        Id: data?._id,
        status: 'Rejected',
      };
      setIsLoading(true);
      updatePrivateOrderStatus(payload)
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
    } else if (type == 'complete') {
      let payload = {
        Id: data?._id,
        status: data?.orderType == 'pickup' ? 'ReadyForPickup' : 'Completed',
      };
      setIsLoading(true);
      updatePrivateOrderStatus(payload)
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
    } else {
      let payload = {
        Id: data?._id,
        status: 'Accepted',
        preparationTime: prepareTime,
      };
      if (prepareTime == '') {
        alert('Please enter preparation time');
      } else {
        setIsLoading(true);
        updatePrivateOrderStatus(payload)
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
            console.log(error, 'error');
            setIsLoading(false);
          });
      }
    }
  };

  return (
    <>
      <OverLayLoader isloading={isLoading} />
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
          <Text style={styles.orderheading}>Order Details</Text>
          <View style={styles.borderstyle}>
            <View style={styles.ordertxtview}>
              <Text style={styles.subheading}>Order number</Text>
              <Text style={styles.oredernotxt}>{data.orderId}</Text>
            </View>
            <View style={styles.ordertxtview}>
              <Text style={styles.subheading}>Order Status</Text>
              <Text style={styles.oredernotxt}>{data.status}</Text>
            </View>
            {/* {data?.status == "ReadyForPickup"? 
          <View style={styles.ordertxtview}>
            <Text style={styles.subheading}>Delivery Status</Text>
            <Text style={styles.orderfromtxt}>{data.deliveryStatus}</Text>
          </View>
          :
          null 
        } */}
            <View style={styles.ordertxtview}>
              <Text style={styles.subheading}>Delivery address:</Text>
              <Text style={styles.deliverytxt}>{data.address}</Text>
            </View>
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
            {data?.selectedDates.map((item, index) => {
              return (
                <View style={styles.ordertxtview}>
                  <Text style={styles.subheading}>Date & Time</Text>
                  <Text style={styles.pricetxt}>{item?.time}</Text>
                </View>
              );
            })}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  color: colors.black,
                  left: width(4),
                  fontWeight: 'bold',
                }}>
                Total
              </Text>
              <Text style={{color: 'grey', right: width(4), fontWeight: '600'}}>
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
          {data.status == 'Accepted' ? (
            <Button
              // onPress={() }
              heading={'Complete Order'}
              color={colors.pinkColor}
              onPress={() => handleOrderStatus('complete')}
            />
          ) : null}
        </View>
        <View style={{marginBottom: width(1)}}>
          {data.status == 'Pending' ? (
            <Button
              onPress={() => handleOrderStatus()}
              heading={'Accept Order'}
              color={colors.pinkColor}
            />
          ) : null}
        </View>
      </SafeAreaView>
    </>
  );
};

export default OrderDetail;

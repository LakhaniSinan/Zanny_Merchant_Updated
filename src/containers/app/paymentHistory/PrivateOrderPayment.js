import React from 'react';
import { View, SafeAreaView, Text, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMerchantPaymentHistory } from '../../../services/profile';
import { useState, useEffect } from 'react';
import Header from '../../../components/header';
import { width } from 'react-native-dimension';
import Fontisto from 'react-native-vector-icons/Fontisto';
import OverLayLoader from '../../../components/loader';
import { color } from 'react-native-reanimated';
import { colors } from '../../../constants';

const PrivateOrderPaymentHistory = () => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    handlegetMerchantPaymentHistory();
  }, []);

  const handlegetMerchantPaymentHistory = async () => {
    let data = await AsyncStorage.getItem('user');
    data = JSON.parse(data);
    setIsLoading(true)
    getMerchantPaymentHistory(data?._id)
      .then(res => {
        let temp = []
        console.log(res?.data, 'datatttat');
        if (res?.data?.status == 'ok') {
          setIsLoading(false)
          let data = res?.data?.data
          data?.map((item, ind) => {
            if (item?.type == "privateOrder") {
              temp.push(item)
            }
          })
          setPaymentHistory(temp);
        } else {
          setIsLoading(false)
        }
      })
      .catch(error => {
        console.log(error, 'errorerrorerrorerror');
        setIsLoading(false)
      });
  };

  // console.log(paymentHistory, 'lkdkllklklkklkkl');

  return (
    <>
      <OverLayLoader isloading={isLoading} />
      <SafeAreaView style={{ flex: 1, backgroundColor:colors.white }}>
          {paymentHistory?.length > 0 ?
        <View style={{flex:1}}>
          <FlatList
            data={paymentHistory}
            renderItem={({ item, index }) => (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: width(2),
                    backgroundColor: "white",
                    marginHorizontal: width(2),
                    borderRadius: 8,
                    elevation: 5,
                    marginVertical: width(2)
                    //   borderBottomWidth: 0.5,
                    //   borderColor: 'grey',
                  }}>
                  <View style={{ marginLeft: width(2) }}>
                    <Fontisto name="arrow-down" color="green" size={20} />
                  </View>
                  <View style={{ marginLeft: width(2) }}>
                    <Text
                      style={{ color: 'black', fontSize: 16, fontWeight: '500' }}>
                      Amount : £{item?.amount}
                    </Text>
                    <Text
                      style={{ color: 'black', fontSize: 16, fontWeight: '500' }}>
                      Date : {item?.date}
                    </Text>
                    <Text
                      style={{ color: 'black', fontSize: 16, fontWeight: '500' }}>
                      Week : {item?.weekDate}
                    </Text>
                    <Text
                      style={{ color: 'black', fontSize: 16, fontWeight: '500' }}>
                      Order Ids : {item?.orderId.toString()}
                    </Text>
                  </View>
                </View>
              </>
            )}
            />
        </View>
          :
          <View
          style={{flex: 1, alignItems: 'center', justifyContent: 'center',backgroundColor:colors.white}}>
          <Text
            style={{fontSize: 20, fontWeight: '500', color: colors.black}}>
            No Data Found
          </Text>
        </View>
          }
      </SafeAreaView>
    </>
  );
};

export default PrivateOrderPaymentHistory;

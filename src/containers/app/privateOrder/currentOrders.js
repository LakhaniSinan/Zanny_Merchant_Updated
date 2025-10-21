import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {getPrivateOrderByMerchant} from '../../../services/privateOrder';
import {useFocusEffect} from '@react-navigation/native';
import {width} from 'react-native-dimension';
import styles from './style';
import {useSelector} from 'react-redux';
import OrderImages from './orderImages';
import OverLayLoader from '../../../components/loader';
import {colors} from '../../../constants';

const PrivateCurrentOrders = ({navigation, route}) => {
  let user = useSelector(state => state.LoginSlice.user);
  const [isLoading, setIsLoading] = useState(false);
  const [allOrders, setAllOrders] = useState([]);

  console.log(route?.name, 'maneeeeee');
  const getOrders = async () => {
    setIsLoading(true);
    getPrivateOrderByMerchant(user._id)
      .then(res => {
        setIsLoading(false);
        if (res?.data?.status == 'ok') {
          let tempArr = [];
          let data = res?.data?.data;
          data.map((item, index) => {
            if (item?.status == 'Pending' || item?.status == 'Accepted') {
              tempArr.push(item);
              console.log(tempArr, 'arrya=====');
            }
          });
          setAllOrders(tempArr);
        } else {
          setIsLoading(false);
          console.log(res?.data, 'else ressssss');
        }
      })
      .catch(err => {
        setIsLoading(false);
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      getOrders();
    }, []),
  );
  console.log(allOrders.length, 'lennnnn');

  return (
    <>
      <OverLayLoader isloading={isLoading} />
      <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
        {allOrders?.length > 0 ? (
          <FlatList
            data={allOrders}
            refreshing={isLoading}
            onRefresh={getOrders}
            style={{marginTop: width(2), marginBottom: width(15)}}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.id}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('PrivateOrderDetail', {
                      detail: item,
                    })
                  }
                  style={styles.cardview}>
                  <View style={styles.innerview}>
                    <OrderImages
                      imageUrl={item?.merchantDetails?.merchantImage}
                    />
                    <View style={styles.txtview}>
                      <Text style={styles.txtdate}>Status: {item.status}</Text>
                      <Text style={styles.txtdate}>
                        Total Bill: £ {item.totalBill}
                      </Text>
                      <Text style={styles.txtdate}>Date: {item.date}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        ) : (
          <View style={{flex: 1, justifyContent: 'center'}}>
            <Text
              style={{
                fontWeight: 'bold',
                color: 'black',
                textAlign: 'center',
              }}>
              No private orders found right now
            </Text>
          </View>
        )}
      </SafeAreaView>
    </>
  );
};

export default PrivateCurrentOrders;

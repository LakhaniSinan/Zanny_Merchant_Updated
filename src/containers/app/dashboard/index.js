import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {width} from 'react-native-dimension';
import {ScrollView} from 'react-native-gesture-handler';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import OverLayLoader from '../../../components/loader';
import {helper} from '../../../helper';
import {merchantDashboard} from '../../../services/dashboard';
import {
  getMerchantProfile,
  updateMerchantProfile,
} from '../../../services/profile';
import Header from './../../../components/header/index';
import {colors} from './../../../constants/index';
import styles from './style';

const dummyData = {
  labels: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'July',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
  datasets: [
    {
      data: [20, 30, 40, 4, 10, 48, 29, 93, 82, 58, 29, 74],
    },
  ],
};

const Dashboard = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [online, setIsOnline] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [showPickerStart, setShowPickerStart] = useState(false);
  const [showPickerEnd, setShowPickerEnd] = useState(false);
  const [dashboardData, setDashboardData] = useState([]);
  console.log(dashboardData, 'dashboardDatadashboardData');

  const [startdateOpen, setStartdateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [startdate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [chartData, setChartData] = useState({
    labels: dummyData.labels,
    datasets: [
      {
        data: [],
      },
    ],
  });
  // useFocusEffect(
  //   React.useCallback(() => {
  //     getOrders();
  //   }, []),
  // );

  const handleConfirm = (date, name) => {
    setShowPickerStart(false);
    setShowPickerEnd(false);
    setDateRange({
      ...dateRange,
      [name]: date,
    });
  };

  useEffect(() => {
    let params = {};
    getData(params);
    getProfile();
  }, []);

  useEffect(() => {
    handleGetNotification();
  }, []);

  const getProfile = async () => {
    let data = await AsyncStorage.getItem('user');
    data = JSON.parse(data);
    setIsLoading(true);
    getMerchantProfile(data._id)
      .then(response => {
        setIsLoading(false);
        // console.log(response?.data?.data, 'dodjdkjjdkj');
        let data = response?.data?.data;
        setIsOnline(data?.isOnline);
        // console.log(data,"datatttttt");
      })
      .catch(error => {
        setIsLoading(false);
        console.log(error, 'errorerrorerror');
      });
  };

  const getData = async params => {
    let user = await AsyncStorage.getItem('user');
    user = JSON.parse(user);
    merchantDashboard(user._id, params)
      .then(res => {
        let response = res.data.data;
        setDashboardData(response);
        // console.log(response?.TotalEarning,"respppppppp");

        let tempArr = [];
        response?.chartData?.map((val, ind) => {
          tempArr.push({
            numberofbookings: val.numberofbookings,
            id: val._id.charAt(1),
          });
        });

        const sortedProducts = tempArr.sort((res1, res2) => res1.id - res2.id);
        let data = [];
        let labelData = [];

        sortedProducts.map((item, index) => {
          labelData.push(dummyData.labels[item.id - 1]);
          data.push(item.numberofbookings);
        });
      })
      .catch(err => {
        console.log(err, 'resresresresresres');
      });
  };

  const resetDate = () => {
    setStartDate(new Date());
    setEndDate(new Date());
    let params = {};
    console.log(params, 'PARAMSSS');
    getData(params);
  };

  const submitData = () => {
    let params = {
      ...(endDate && {endDate}),
      ...(startdate && {startdate}),
    };
    if (endDate == null || startdate == null) {
      alert('Both dates are required');
    } else {
      getData(params);
    }
  };

  const handleChangeStatus = async () => {
    let user = await AsyncStorage.getItem('user');
    user = JSON.parse(user);
    setIsLoading(true);
    let payload = {
      isOnline: !online,
    };
    setIsLoading(true);
    updateMerchantProfile(user?._id, payload)
      .then(res => {
        console.log(res?.data, 'resppppppp=====>');
        setIsLoading(false);
        if (res?.data?.status == 'ok') {
          console.log(res?.data?.data?.isOnline, 'dkdjjdkjdkjjdkj');
          alert('Your online status changed successfully');
          setIsOnline(res?.data?.data?.isOnline);
        } else {
          setIsLoading(false);
          alert(res?.data?.message);
        }
      })
      .catch(error => {
        setIsLoading(false);
        console.log(error, 'jkdjkjdkjjdks');
      });
  };

  useEffect(() => {
    messaging().onMessage(async data => {
      if (data?.data?.type == 'NewOrder') {
        console.log(data, 'remoteMessageremoteMessageremoteMessage_accept');
        helper.notificationCall(
          data?.notification?.title,
          data?.notification?.body,
        );
        helper.playSound();
      } else {
        helper.notificationCall(
          data?.notification?.title,
          data?.notification?.body,
        );
      }
    });
  }, []);

  const handleGetNotification = async () => {
    let user = await AsyncStorage.getItem('user');
    user = JSON.parse(user);
    if (user != null) {
      messaging()
        .getInitialNotification()
        .then(res => {
          console.log(res, 'response=========>');
        })
        .catch(error => {
          console.log(error, 'errror======>');
        });
    }
  };
  return (
    <>
      <OverLayLoader isloading={isLoading} />
      <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
        <Header
          text="Dashboard"
          drawer={true}
          online={online}
          status
          handleChangeStatus={handleChangeStatus}
        />
        <DatePicker
          mode="date"
          modal
          open={showPickerStart}
          title="Select Start Date"
          date={startdate}
          onConfirm={date => {
            setShowPickerStart(false);
            setStartDate(date);
          }}
          onCancel={() => {
            setShowPickerStart(false);
          }}
        />
        <DatePicker
          mode="date"
          modal
          open={showPickerEnd}
          date={endDate}
          // minimumDate={new Date()}
          title="Select End Date"
          onConfirm={date => {
            setShowPickerEnd(false);
            setEndDate(date);
          }}
          onCancel={() => {
            setShowPickerEnd(false);
          }}
        />

        <View style={styles.dateRangeStyle}>
          <TouchableOpacity onPress={() => setShowPickerStart(true)}>
            <Text style={styles.dateDisplay}>
              Start Date: {moment(startdate).format('DD-MM-YYYY')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowPickerEnd(true)}
            style={styles.dateRangeStyle}>
            <Text style={styles.dateDisplay}>
              End Date: {moment(endDate).format('DD-MM-YYYY')}
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            margin: width(3),
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            onPress={submitData}
            style={{...styles.submitBtn, marginLeft: width(2)}}>
            <Text style={{color: 'white', textAlign: 'center'}}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={resetDate}
            style={{...styles.submitBtn, marginLeft: width(3)}}>
            <Text style={{color: 'white', textAlign: 'center'}}>Reset</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{flex: 1, paddingHorizontal: width(4)}}>
          {/* <Chart chartData={chartData} /> */}

          {!isLoading ? (
            <>
              <TouchableOpacity
                style={styles.cardContainer}
                onPress={() =>
                  navigation.navigate('Pickup Orders', {
                    type: 'pickup',
                  })
                }>
                <Text style={styles.cardTitle}>Total Pickup Orders</Text>
                <View style={styles.countContainer}>
                  <FontAwesome5
                    name="calendar"
                    color={colors.white}
                    size={30}
                  />
                  <Text style={styles.cardCount}>
                    {dashboardData?.pickupOrders
                      ? dashboardData?.pickupOrders
                      : 0}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cardContainer}
                onPress={() =>
                  navigation.navigate('Delivery Orders', {
                    type: 'delivery',
                  })
                }>
                <Text style={styles.cardTitle}>Total Delivery Orders</Text>
                <View style={styles.countContainer}>
                  <FontAwesome5
                    name="calendar"
                    color={colors.white}
                    size={30}
                  />
                  <Text style={styles.cardCount}>
                    {dashboardData?.deliveryOrders
                      ? dashboardData?.deliveryOrders
                      : 0}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cardContainer}
                onPress={() => navigation.navigate('Food')}>
                <Text style={styles.cardTitle}>Total Products</Text>
                <View style={styles.countContainer}>
                  <FontAwesome5 name="poll" color={colors.white} size={30} />
                  <Text style={styles.cardCount}>
                    {dashboardData?.totalProducts
                      ? dashboardData?.totalProducts
                      : 0}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cardContainer}
                onPress={() => navigation.navigate('Payment History')}>
                <Text style={styles.cardTitle}>Total Earnings</Text>
                <View style={styles.countContainer}>
                  <MaterialCommunityIcons
                    name="cash"
                    color={colors.white}
                    size={30}
                  />
                  <Text style={styles.cardCount}>
                    {dashboardData?.TotalEarning
                      ? dashboardData?.TotalEarning
                      : 0}
                  </Text>
                </View>
              </TouchableOpacity>
            </>
          ) : (
            <View style={{flex: 1, justifyContent: 'center'}}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 16,
                  marginBottom: width(2),
                  color: 'black',
                  textAlign: 'center',
                }}>
                Please wait, while we're fetching data
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Dashboard;
const asdasd = [
  {
    collapseKey: 'com.zanny_merchant',
    data: {type: 'NewOrder'},
    from: '929084652852',
    messageId: '0:1736252013470634NaN8892142d8892142',
    notification: {
      android: {},
      body: 'Order Number 302341',
      title: 'New order arrived',
    },
    sentTime: 1736252013463,
    ttl: 2419200,
  },
];

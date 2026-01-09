import React, {useEffect, useState} from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import {colors} from '../../../constants/index';
import {width} from 'react-native-dimension';
import {getAllFAQs} from '../../../services/allergies';
import Header from '../../../components/header';
import {FlatList} from 'react-native-gesture-handler';
import OverLayLoader from '../../../components/loader';

const Faq = route => {
  console.log(route.route, 'ROUTEEE');
  const [allFaq, setAllFaq] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    handleGetFaqs();
  }, []);
  const handleGetFaqs = () => {
    setIsLoading(true);
    getAllFAQs()
      .then(response => {
        setIsLoading(false);
        if (response?.data?.status == 'ok') {
          console.log(response?.data, 'responseresponse ok');
          let data = response?.data?.data;
          setAllFaq(data);
        } else {
          console.log(response?.data, 'errror');
        }
      })
      .catch(error => {
        setIsLoading(false);
        console.log(error, 'error');
      });
  };

  return (
    <>
      <OverLayLoader isloading={isLoading} />
      <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
        <Header text="FAQ's" drawer={true} />
        {allFaq.length > 0 ? (
          <View style={{flex: 1}}>
            <FlatList
              data={allFaq}
              renderItem={({item}) => (
                <View
                  style={{
                    backgroundColor: colors.softgray,
                    marginHorizontal: width(2),
                    marginVertical: width(3),
                    borderRadius: 8,
                    elevation: 5,
                  }}>
                  <View
                    style={{
                      paddingHorizontal: width(3),
                      paddingVertical: width(3),
                    }}>
                    <Text
                      style={{
                        color: colors.redish,
                        fontWeight: '500',
                        fontSize: 16,
                      }}>
                      {item?.question}
                    </Text>
                    <Text style={{color: colors.gray4, fontSize: 14}}>
                      {item?.answer}
                    </Text>
                  </View>
                </View>
              )}
            />
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.white,
            }}>
            <Text
              style={{fontSize: 20, fontWeight: '500', color: colors.black}}>
              No Data Found
            </Text>
          </View>
        )}
      </SafeAreaView>
    </>
  );
};
export default Faq;

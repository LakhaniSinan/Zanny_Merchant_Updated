import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Header from '../../../components/header';
import {
  getFoodCategoriesById,
  createFoodCategory,
  updateFoodCategory,
  deleteFoodCategory,
} from '../../../services/foodCategories';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {colors} from '../../../constants';
import {width} from 'react-native-dimension';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CommonModal from '../../../components/modal/index';
import Button from '../../../components/button';
import {useState} from 'react';
import {Alert} from 'react-native';
import OverLayLoader from '../../../components/loader';

const Categories = ({route}) => {
  const ref = useRef();

  const [category, setCategory] = useState('');
  const [allCategories, setAllCategories] = useState([]);
  const [productDetail, setProductDetail] = useState('');
  const [type, setType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    handlegetCategories();
  }, []);
  const handlegetCategories = async () => {
    let data = await AsyncStorage.getItem('user');
    data = JSON.parse(data);
    setIsLoading(true);
    getFoodCategoriesById(data?._id)
      .then(response => {
        setIsLoading(false);
        if (response?.data?.status == 'ok') {
          console.log(response?.data, 'respppppp');
          let data = response?.data?.data;
          setAllCategories(data);
        } else {
          console.log(response?.data, 'resppppp error');
        }
      })
      .catch(error => {
        setIsLoading(false);
        console.log(error, 'error===>');
      });
  };
  console.log(category, 'categoryyyyy==>');
  const handleAddEditCategory = async () => {
    ref.current.isVisible({});
    let data = await AsyncStorage.getItem('user');
    data = JSON.parse(data);
    let payload = {
      merchantId: data?._id,
      name: category,
    };
    if (category == '' || category == undefined) {
      alert('Category is required');
    } else {
      if (type == 'add') {
        setIsLoading(true);
        createFoodCategory(payload)
          .then(response => {
            setIsLoading(false);
            if (response?.data?.status == 'ok') {
              console.log(response?.data, 'responseeeee');
              ref.current.hide();
              setCategory('');
              alert(response?.data?.message);
              handlegetCategories();
            } else {
              console.log(response?.data, 'response error');
              alert(response?.data?.message);
            }
          })
          .catch(error => {
            setIsLoading(false);
            console.log(error, 'error====>');
          });
      } else {
        setIsLoading(true);
        updateFoodCategory(productDetail, payload)
          .then(response => {
            setIsLoading(false);
            if (response?.data?.status == 'ok') {
              console.log(response?.data, 'responseeeee');
              ref.current.hide();
              setCategory('');
              alert(response?.data?.message);
              handlegetCategories();
            } else {
              console.log(response?.data, 'response error');
              alert(response?.data?.message);
            }
          })
          .catch(error => {
            setIsLoading(false);
            console.log(error, 'error====>');
          });
      }
    }
  };

  const handelModal = (type, val) => {
    ref.current.isVisible({});
    setType(type);
    setCategory(val?.name);
    setProductDetail(val?._id);
  };

  const handleDelete = id => {
    Alert.alert('Delete', 'Are you sure want to delete', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () =>
          deleteFoodCategory(id)
            .then(response => {
              if (response?.data?.status == 'ok') {
                console.log(response?.data, 'res');
                alert(response?.data?.message);
                handlegetCategories();
              } else {
                alert(response?.data?.message);
                console.log(response?.data, 'res ddd');
              }
            })
            .catch(error => {
              console.log(error, 'errorr=====>');
            }),
      },
    ]);
  };

  console.log(type, 'typeeeeeeee');
  return (
    <>
      <OverLayLoader isloading={isLoading} />
      <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
        <Header
          text={'Categories'}
          drawer={route?.params?.type == 'postFood' ? false : true}
          goBack={route?.params?.type !== 'postFood' ? false : true}
        />
        {allCategories.length > 0 ? (
          allCategories.map((item, ind) => {
            return (
              <View
                style={{
                  backgroundColor: colors.white,
                  borderRadius: 8,
                  marginHorizontal: width(3),
                  elevation: 5,
                  marginTop: width(4),
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    color: colors.black,
                    padding: width(3),
                    fontWeight: '600',
                    flexWrap: 'wrap',
                  }}>
                  {item?.name}
                </Text>
                <View style={{flexDirection: 'row', marginRight: width(3)}}>
                  <AntDesign
                    name="delete"
                    size={25}
                    color={colors.yellow}
                    style={{marginRight: width(4)}}
                    onPress={() => handleDelete(item._id)}
                  />
                  <AntDesign
                    name="edit"
                    size={25}
                    color={colors.yellow}
                    onPress={() => handelModal('edit', item)}
                  />
                </View>
              </View>
            );
          })
        ) : (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text
              style={{fontSize: 20, fontWeight: '500', color: colors.black}}>
              No Categories Found
            </Text>
          </View>
        )}
        <View
          style={{
            position: 'absolute',
            bottom: width(10),
            right: width(5),
            marginHorizontal: width(2),
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: colors.yellow,
              borderRadius: 30,
              padding: width(3),
              alignItems: 'center',
            }}
            onPress={() => handelModal('add')}>
            <AntDesign name="plus" size={25} color={'#ffff'} />
          </TouchableOpacity>
        </View>
        <CommonModal ref={ref}>
          <View style={{backgroundColor: colors.white, borderRadius: 10}}>
            <MaterialIcons
              name="cancel"
              size={25}
              color={colors.yellow}
              style={{alignSelf: 'flex-end', right: width(3), top: width(3)}}
              onPress={() => ref.current.hide()}
            />
            <TextInput
              style={{
                margin: width(5),
                color: colors.black,
                alignSelf: 'center',
                borderRadius: 8,
                borderWidth: 0.5,
                width: width(80),
                borderColor: colors.yellow,
                paddingVertical: width(3),
                paddingLeft: width(1),
              }}
              placeholder="Enter food categories"
              value={category}
              onChangeText={text => setCategory(text)}
              placeholderTextColor={colors.gray4}
            />
            <Button
              heading={type == 'add' ? 'Create' : 'Update'}
              onPress={() => handleAddEditCategory()}
            />
          </View>
        </CommonModal>
      </SafeAreaView>
    </>
  );
};

export default Categories;

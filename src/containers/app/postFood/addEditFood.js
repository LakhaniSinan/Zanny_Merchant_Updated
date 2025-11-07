import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { height, width } from 'react-native-dimension';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import AllergyModal from '../../../components/allergyModal';
import ImagePicker from '../../../components/imagepicker';
import OverLayLoader from '../../../components/loader';
import { handelGetProducts } from '../../../redux/slices/Products';
import { getAllAllergies } from '../../../services/allergies';
import { getAllFoodCategories, getFoodCategoriesById } from '../../../services/foodCategories';
import {
  addProduct,
  deleteProduct,
  updateProduct,
} from '../../../services/product';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Button from './../../../components/button/index';
import Header from './../../../components/header/index';
import { colors } from './../../../constants/index';
import { getAllNutritions } from '../../../services/nutritions';

const AddEditFood = ({ route }) => {
  const ref = useRef();

  const dispatch = useDispatch();
  const [online, setIsOnline] = useState(true);
  const { type, data, allergiesData } = route.params;
  const [userDetails, setUserDetails] = useState({});
  const [isloading, setIsLoading] = useState(false);
  const [allAllergies, setAllAllergies] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allNutritions, setAllNutritions] = useState([]);
  const [selectedNutritions, setSelectedNutritions] = useState([]);
  const [selectedNutrition, setSelectedNutrition] = useState(null);
  const [nutritionAmount, setNutritionAmount] = useState("");
  const [availibilityType, setAvailibilityType] = useState('pickup');
  const [inputValue, setInputValue] = useState({
    name: '',
    price: 0,
    discount: 0,
    description: '',
    category: '',
    image: null,
  });

  const navgation = useNavigation();

  console.log(data, "datadatadatadata");

  useEffect(() => {
    getUserDetails();
    if (type == 'edit') {
      setInputValue({
        name: data?.name,
        price: data?.price,
        discount: data?.discount ? data?.discount : 0,
        category: data?.category,
        description: data?.description,
        image: data?.image,
      });
      setSelectedNutritions(data?.nutritions || []);
      setIsOnline(data?.isShow);
    }
  }, []);

  useEffect(() => {
    handleGetAllergies();
    getAllNutritions().then(res => {
      console.log(res, "resresres=>>>nutritions");
      setAllNutritions(res.data.data); // make sure API returns [{id,name}] format
    });
  }, []);

  useEffect(() => {
    getAllFoodCategories().then((res) => {
      // console.log(res, "RESSSSS");
      setAllCategories(res?.data?.data);
    }).catch(err => {
      console.log(err, "errerrerr");
    })
  }, []);


  const handleGetAllergies = () => {
    setIsLoading(true);
    getAllAllergies()
      .then(response => {
        setIsLoading(false);
        let tempArr = [];
        let data = response?.data?.data;
        if (type == 'edit') {
          {
            data.map(item => {
              tempArr.push({
                ...item,
                isSelected: false,
              });
            });
          }
          data.map((tItem, index) => {
            route.params.data.allergiesData.map(bItem => {
              if (tItem.name == bItem.name) {
                tempArr[index]['isSelected'] = true;
              }
            });
          });
          setAllAllergies(tempArr);
          console.log(data, 'DATAA_ADATAAA');
        } else {
          {
            data.map(item => {
              tempArr.push({
                ...item,
                isSelected: false,
              });
            });
          }
          setAllAllergies(tempArr);
        }
      })
      .catch(error => {
        setIsLoading(false);
      });
  };

  const getUserDetails = async () => {
    let data = await AsyncStorage.getItem('user');
    let parsed = JSON.parse(data);
    setUserDetails(parsed);
  };

  const handleChangeText = (name, value) => {
    setInputValue({ ...inputValue, [name]: value });
  };

  const handlegetCategories = async () => {
    let data = await AsyncStorage.getItem('user');
    data = JSON.parse(data);
    setIsLoading(true);
    getFoodCategoriesById(data?._id)
      .then(response => {
        setIsLoading(false);
        if (response?.data?.status == 'ok') {
          let data = response?.data?.data;
          setAllCategories(data);
        } else {
        }
      })
      .catch(error => { });
  };

  const handleChangeStatus = async () => {
    let payload = {
      isShow: !data?.isShow,
    };
    setIsLoading(true);
    updateProduct(data._id, payload)
      .then(response => {
        setIsLoading(false);
        if (response?.data?.status == 'ok') {
          dispatch(handelGetProducts('ADD_FOOD'));
          alert(response?.data?.message);
          navgation.goBack();
        } else {
          alert(response?.data?.message);
        }
      })
      .catch(error => {
        setIsLoading(false);
        console.log(error, 'error');
      });
  };

  const showDeleteAlert = () => {
    Alert.alert('Confirmation', 'Are you sure you want to delete item?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'OK', onPress: () => handleDeleteProduct() },
    ]);
  };
  const handleAddEditProduct = () => {
    let temp = [];
    allAllergies.map(item => {
      if (item.isSelected) {
        temp.push(item);
      }
    });
    const { name, price, discount, description, category, image } = inputValue;

    let catId = allCategories.find(cat => cat.name === category)?._id || null

    console.log(inputValue, catId, "INNNNN");


    let payload = {
      name,
      price,
      discount,
      description,
      image,
      category,
      merchantId: userDetails._id,
      allergiesData: temp,
      categoryId: catId,
      nutritions: selectedNutritions,
      foodType: availibilityType
    };
    console.log(payload, '{AYLOADD');
    if (type == 'edit') {
      if (name == '') {
        alert('Name is required');
      } else if (price == 0) {
        alert('Price is required');
      } else if (description == '') {
        alert('Description is required');
      } else if (image == null) {
        alert('Image is required');
      } else if (category == '') {
        alert('Category is required');
      } else {
        setIsLoading(true);
        updateProduct(data._id, payload)
          .then(response => {
            setIsLoading(false);
            if (response?.data?.status == 'ok') {
              dispatch(handelGetProducts('ADD_FOOD'));
              alert(response?.data?.message);
              navgation.goBack();
            } else {
              alert(response?.data?.message);
            }
          })
          .catch(error => {
            setIsLoading(false);
            console.log(error, 'error');
          });
      }
    } else {
      if (name == '') {
        alert('Name is required');
      } else if (price == 0) {
        alert('Price is required');
      } else if (category == '') {
        alert('Category is required');
      } else if (description == '') {
        alert('Description is required');
      } else if (image == null) {
        alert('Image is required');
      } else {
        setIsLoading(true);
        addProduct(payload)
          .then(response => {
            setIsLoading(false);
            if (response?.data?.status == 'ok') {
              alert(response?.data?.message);
              setInputValue({
                name: '',
                price: 0,
                description: '',
                category: '',
                discount: 0,
                image: null,
              });
              dispatch(handelGetProducts());
              navgation.goBack();
            } else {
              alert(response?.data?.message);
            }
          })
          .catch(error => {
            setIsLoading(false);
          });
      }
    }
  };

  console.log();
  const getImage = (image, type) => {
    setInputValue({
      ...inputValue,
      image,
    });
  };

  console.log(inputValue, 'INPUTTT');

  const handleDeleteProduct = () => {
    deleteProduct(data._id)
      .then(response => {
        if (response?.data?.status == 'ok') {
          alert(response?.data?.message);
          dispatch(handelGetProducts());
          navgation.goBack();
        } else {
          alert(response?.data?.message);
        }
      })
      .catch(error => { });
  };

  const onPressOut = item => {
    setAllAllergies(item);
  };

  console.log(selectedNutritions, "SS");


  return (
    <>
      <OverLayLoader isloading={isloading} />
      <AllergyModal ref={ref} />
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
        <ScrollView
          automaticallyAdjustKeyboardInsets
          style={{ backgroundColor: 'white' }}
          resetScrollToCoords={{ x: 0, y: 0 }}
          contentContainerStyle={{ flex: 1 }}
          scrollEnabled={false}>
          {type == 'add' ? (
            <Header goBack text="Post Food" />
          ) : (
            <Header
              goBack
              text="Update Food"
              handleChangeProductStatus={handleChangeStatus}
              showProduct
              isShow={data?.isShow}
            />
          )}
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ marginBottom: width(5), marginHorizontal: width(3) }}>
            <ImagePicker
              subtext={'Upload Product Image'}
              viewStyle={{
                borderColor: colors.gray4,
                width: width(90),
                height: height(20),
                borderRadius: width(2),
                marginTop: height(3),
                marginHorizontal: width(4),
                borderWidth: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              getImage={getImage}
              type="image"
              image={inputValue.image}
              imageStyle={{
                width: width(100),
                height: height(20),
                borderRadius: 10,
                marginVertical: height(3),
                marginHorizontal: width(4),
              }}
            />
            <View style={{}}>
              <Text style={{ paddingHorizontal: width(2), color: colors.black }}>
                Name
              </Text>
              <View
                style={{
                  borderBottomWidth: 0.8,
                  borderColor: colors.grey,
                }}>
                <TextInput
                  style={{ margin: width(2), color: colors.black }}
                  placeholder="Food Name"
                  value={inputValue.name}
                  onChangeText={newText => handleChangeText('name', newText)}
                  placeholderTextColor={colors.gray4}
                />
              </View>
              {/* <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  marginTop: width(2),
                }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.orangeColor,
                    paddingVertical: width(2),
                  }}
                  onPress={() =>
                    navgation.navigate('Food Categories', { type: 'postFood' })
                  }>
                  <Text
                    style={{ paddingHorizontal: width(2), color: colors.white }}>
                    Add New Category
                  </Text>
                </TouchableOpacity>
              </View> */}
              <View
                style={{
                  borderBottomWidth: 0.8,
                  borderColor: colors.grey,
                  marginTop: width(2),
                }}>
                <Picker
                  dropdownIconColor={'black'}
                  style={{ width: '100%', fontSize: 13 }}
                  itemStyle={{ backgroundColor: 'white', fontSize: 13 }}
                  selectedValue={inputValue?.category}
                  onValueChange={newText =>
                    handleChangeText('category', newText)
                  }>
                  <Picker.Item
                    label="Please select category"
                    value={''}
                    color="black"
                  />
                  {allCategories.map((item, ind) => {
                    return (
                      <Picker.Item
                        label={item?.name}
                        value={item?.name}
                        color="black"
                      />
                    );
                  })}
                </Picker>
              </View>

              <View style={{ marginHorizontal: 15, marginTop: 10 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: 'black' }}>
                  Add Nutrition
                </Text>

                {/* Dropdown / Picker */}
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: colors.gray4,
                    marginTop: 8,
                    borderRadius: 6,
                    padding: 10
                  }}>
                  <Picker
                    selectedValue={selectedNutrition?.name}
                    onValueChange={(value) => {
                      const selected = allNutritions.find(n => n.name === value);
                      setSelectedNutrition(selected);
                    }}
                  >
                    <Picker.Item label="Select nutrition" value={null} />
                    {allNutritions.map((item, index) => (
                      <Picker.Item label={item.name} value={item.name} key={index} />
                    ))}
                  </Picker>
                </View>
                {/* Input amount */}
                <TextInput
                  placeholder="Enter amount (ex: 45)"
                  value={nutritionAmount}
                  onChangeText={setNutritionAmount}
                  keyboardType="numeric"
                  style={{
                    borderWidth: 1,
                    borderColor: colors.gray4,
                    borderRadius: 6,
                    padding: 10,
                    marginTop: 10,
                    color: "black"
                  }}
                />

                <TouchableOpacity
                  style={{
                    marginTop: 10,
                    backgroundColor: colors.yellow,
                    padding: 10,
                    borderRadius: 6,
                    alignItems: 'center'
                  }}
                  onPress={() => {
                    if (!selectedNutrition || !nutritionAmount) return;
                    setSelectedNutritions(prev => [...prev, {
                      name: selectedNutrition.name,
                      amount: Number(nutritionAmount)
                    }]);
                    setSelectedNutrition(null);
                    setNutritionAmount("");
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "600" }}>Add Nutrition</Text>
                </TouchableOpacity>
              </View>

              <View style={{ marginTop: 15, marginHorizontal: 15 }}>
                {selectedNutritions.map((nutri, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingVertical: 6,
                      borderBottomWidth: 0.5,
                    }}
                  >
                    <Text style={{ color: 'black' }}>{nutri.name}</Text>

                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Text style={{ color: 'black', marginRight: 10 }}>{nutri.amount} g</Text>

                      {/* Delete Button */}
                      <TouchableOpacity
                        onPress={() => {
                          const updated = selectedNutritions.filter((_, i) => i !== index);
                          setSelectedNutritions(updated);
                        }}
                      >
                        <AntDesign name="delete" size={18} color="red" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>


              <Text
                style={{
                  marginTop: 10,
                  paddingHorizontal: width(2),
                  color: colors.black,
                }}>
                Description
              </Text>
              <View
                style={{
                  marginTop: 10,
                  borderBottomWidth: 0.8,
                  borderColor: colors.grey,
                }}>
                <TextInput
                  style={{
                    margin: width(2),
                    color: colors.black,
                    marginVertical: width(2),
                  }}
                  placeholder="Write description here"
                  value={inputValue.description}
                  onChangeText={newText =>
                    handleChangeText('description', newText)
                  }
                  placeholderTextColor={colors.gray4}
                />
              </View>
              <Text
                style={{
                  marginTop: width(2),
                  paddingHorizontal: width(2),
                  color: colors.black,
                }}>
                Price
              </Text>
              <View
                style={{
                  borderBottomWidth: 0.8,
                  borderColor: colors.grey,
                }}>
                <TextInput
                  style={{
                    marginHorizontal: width(2),
                    color: colors.black,
                    marginVertical: width(2),
                  }}
                  placeholder="Price"
                  value={`${inputValue.price}`}
                  keyboardType="numeric"
                  onChangeText={newText => handleChangeText('price', newText)}
                  placeholderTextColor={colors.gray4}
                />
              </View>
              <Text
                style={{
                  marginTop: width(2),
                  paddingHorizontal: width(2),
                  color: colors.black,
                }}>
                Discount
              </Text>
              <View
                style={{
                  borderBottomWidth: 0.8,
                  borderColor: colors.grey,
                }}>
                <TextInput
                  style={{
                    marginHorizontal: width(2),
                    color: colors.black,
                    marginVertical: width(2),
                  }}
                  placeholder="Discount"
                  value={`${inputValue.discount}`}
                  keyboardType="numeric"
                  onChangeText={newText =>
                    handleChangeText('discount', newText)
                  }
                  placeholderTextColor={colors.gray4}
                />
              </View>
            </View>

            <View style={{ marginVertical: width(4) }}>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>Food Availability </Text>
            </View>

            <View
              style={{
                borderBottomWidth: 0.8,
                borderColor: colors.grey,
                marginTop: width(2),
              }}>
              <Picker
                dropdownIconColor={'black'}
                style={{ width: '100%', fontSize: 13 }}
                itemStyle={{ backgroundColor: 'white', fontSize: 13 }}
                selectedValue={availibilityType}
                onValueChange={newText =>
                  setAvailibilityType(newText)
                }>
                <Picker.Item
                  label="Please select availability type"
                  value={''}
                  color="black"
                />
                {["pickup","delivery","both"].map((item, ind) => {
                  return (
                    <Picker.Item
                      label={item}
                      value={item}
                      color="black"
                    />
                  );
                })}
              </Picker>
            </View>
            <View
              style={{
                marginVertical: width(2),
                flex: 1,
                justifyContent: 'flex-end',
              }}>
              <Button
                heading={
                  type == 'add' ? 'Select Allergies' : 'Selected Allergies'
                }
                // onPress={() => navgation.navigate("AllergyCategory", {
                //   data: data,
                //   type: type,
                //   allergiesData: allergiesData
                // })}
                onPress={() => {
                  ref.current.isVisible({
                    allAllergies: allAllergies,
                    onPressOut: onPressOut,
                  });
                }}
              />
              <Button
                heading={type == 'add' ? 'Post Food' : 'Update Food'}
                onPress={handleAddEditProduct}
              />
              {type == 'edit' ? (
                <Button heading={'Delete Food'} onPress={showDeleteAlert} />
              ) : null}
            </View>
          </ScrollView>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default AddEditFood;

import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import Header from './../../../components/header/index';
import { width } from 'react-native-dimension';
import { ScrollView } from 'react-native-gesture-handler';
import { colors } from './../../../constants/index';
import FoodImages from './foodImages';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProduct } from '../../../services/product';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { handelGetProducts, setProducts } from '../../../redux/slices/Products';
import OverLayLoader from '../../../components/loader';
const PostFood = ({ navigation }) => {
  const disptach = useDispatch();
  const postedProducts = useSelector(state => state.ProductSlice.products);
  const isLoading = useSelector(state => state.ProductSlice.loading);
  console.log(postedProducts, "postedProductspostedProductspostedProducts");
  const [searchVal, setSearchVal] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([])
  // const [products, setProducts] = useState([])
  const ref = useRef();


  console.log(filteredProducts, "filteredProductsfilteredProducts");


  useEffect(() => {
    disptach(handelGetProducts("PostScreen"))
  }, [])

  useEffect(() => {
    setFilteredProducts(postedProducts)
  }, [postedProducts])


  // useFocusEffect(
  //   React.useCallback(() => {
  //     let filterArray = cardsData.filter(item => {
  //       return item?.name?.toLowerCase().includes(searchVal.toLowerCase());
  //     });
  //     setProducts(filterArray);
  //   }, [searchVal]),
  // );


  const handleAddEditFood = () => {
    navigation.navigate('AddEditFood', {
      type: 'add',
    });
  };

  const navigateToDetail = val => {
    console.log(val.allergiesData[0], "valvalvalvalval");
    navigation.navigate('AddEditFood', {
      data: val,
      type: 'edit',
      // allergiesData:val.allergiesData[0]
    });
  };



  const searchFood = (val) => {
    if (val == "") {
      setSearchVal("")
      setFilteredProducts(postedProducts)
    }
    else {
      let filterArray = postedProducts.filter(item => {
        return item?.name?.toLowerCase().includes(val.toLowerCase());
      });
      setSearchVal(val)
      console.log(filterArray, "filterArrayfilterArrayfilterArray");
      setFilteredProducts(filterArray);
    }
  }

 

  return (
    <>
    <OverLayLoader isloading={isLoading}/>
    <SafeAreaView style={styles.container}>
      <Header text="Food" drawer={true} />
      <View style={styles.inputStyle}>
        <TextInput placeholder="Search Food"
          style={{ color: colors.gray4}}
          value={searchVal}
          onChangeText={(e) => searchFood(e)}
          placeholderTextColor={colors.gray4}
        />
        <AntDesign
          name="search1"
          color={colors.yellow}
          size={20}
          style={{ marginRight: width(1) }}
        />
      </View>
      {filteredProducts?.length > 0 ?
        <FlatList
         data={filteredProducts}
         onRefresh={()=>disptach(handelGetProducts("PostScreen"))}
         refreshing={isLoading}
         renderItem={({item,index})=>{
          return(
            <View key={index} style={{ marginVertical: width(3),paddingVertical:width(2) }}>
            <TouchableOpacity
              style={{ marginHorizontal: 10 }}
              onPress={() => navigateToDetail(item)}>
              <FoodImages imageUrl={item.image} />
              <View>
                <Text style={styles.txt}>{item.name}</Text>
                <Text style={styles.priceTypo}>Price £{item.price}</Text>
                {item.discount > 0 &&
                  <Text style={styles.priceTypo}>After Discount Price £{item.discount}</Text>
                }
              </View>
            </TouchableOpacity>
          </View>
          )
         }}
        />
        :
        <View style={{ flex: 1, justifyContent: 'center', alignItems: "center" }}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 16,
              marginBottom: width(2),
              color: 'black',
              textAlign: 'center',
            }}>
            No products found
          </Text>
        </View>
      }
      <View style={{ marginVertical: width(1.5) }}>
        <View
          style={{
            position: 'absolute',
            bottom: 10,
            right: 5,
            marginHorizontal: width(2),
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: colors.yellow,
              borderRadius: 30,
              padding: width(3),
              alignItems: 'center',
            }}
            onPress={handleAddEditFood}
          >
            <AntDesign
              name="plus"
              size={25}
              color={'#ffff'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
    </>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.white,
  },
  imageStyles: {
    height: width(40),
    width: '100%',
    resizeMode: 'cover',
    borderRadius: 5,
  },
  txt: {
    color: 'black',
    fontSize: 14,
    fontWeight: '600',
  },
  priceTypo: {
    color: 'black',
    fontSize: 12,
    fontWeight: '600',
  },
  timeview: {
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 10,
    width: '20%',
    left: '2%',
    borderRadius: 30,
    alignItems: 'center',
  },
  timetext: {
    color: 'black',
    fontSize: 10,
    fontWeight: '600',
  },
  inputStyle: {
    borderRadius: 5,
    borderWidth:0.2,

    marginVertical: width(2),
    marginHorizontal: width(3),
    backgroundColor: colors.white,
    paddingHorizontal: width(1),
    paddingVertical: width(2),
    color: colors.gray4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
});

export default PostFood;

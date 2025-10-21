import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image
} from 'react-native';
import Header from './../../../components/header/index';
import { width } from 'react-native-dimension';
import { ScrollView } from 'react-native-gesture-handler';
// import Location from '../../auth/Location';
import { colors } from './../../../constants/index';
import Button from './../../../components/button/index';
import { getAllergiesByCategory } from '../../../services/allergies';
import { useEffect } from 'react';

const Allergies = ({ navigation,route }) => {
  const [allergiesData, setAllergiesData] = useState();

  const category=route?.params?.category
  
  useEffect(()=>{
          handleGetAllergies()
  },[])
  const handleAllergens = (item, ind) => {
    let tempArr = [...allergiesData];

    tempArr.map(val => {
      tempArr[ind].selected = !tempArr[ind].selected;
    });
    setAllergiesData(tempArr);
  };

  const handlePress = () => {
    alert("Allergies selection done")

  };


  const handleGetAllergies=()=>{
    let payload={category}
    console.log(payload,"kdlkdlk");
    getAllergiesByCategory(payload).then((response)=>{
          let data=response?.data?.data 
          // console.log(response?.data,"datadatadata");
          setAllergiesData(data)
      }).catch((error)=>{
          console.log(error,"Error====>");
      })
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header text="Allergies" />

      <ScrollView>
        {allergiesData?.map((item, ind) => {
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleAllergens(item, ind)}>
              <View
                style={{
                  shadowColor: colors.pinkColor,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  backgroundColor: item.selected ? colors.pinkColor : '#fff',
                  shadowRadius: 1,
                  borderRadius: 5,
                  // elevation: 1.2,
                  margin: width(2),
                  paddingVertical: width(5),
                  paddingHorizontal: width(5),
                  flexDirection:"row",
                  justifyContent:"space-between",
                  alignItems:"center"
                }}>
                <Text
                  style={{
                    fontWeight: '600',
                    fontSize: 15,
                    color: item.selected ? colors.white : colors.black,
                  }}>
                  {item.name}
                </Text>
               <Image source={{uri:item?.image}} style={{height:width(10),width:width(10),borderRadius:50}}/>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>



      <View style={{ marginBottom: width(2) }}>
        <Button heading="Next" color={colors.pinkColor} onPress={handlePress} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.white
  },
});

export default Allergies;

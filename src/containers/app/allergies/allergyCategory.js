import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Image,
} from 'react-native';
import Header from './../../../components/header/index';
import { width } from 'react-native-dimension';
import { ScrollView } from 'react-native-gesture-handler';
import { colors } from './../../../constants/index';
import Button from './../../../components/button/index';
import {
  getAllAllergies,
} from '../../../services/allergies';
import { useEffect } from 'react';
import CheckBox from '@react-native-community/checkbox';


const AllergyCategory = ({ navigation, route }) => {
  const [allergies, setAllAllergies] = useState([]);
  const { type, data, allergiesData } = route.params
  console.log(data, allergiesData, "DATA");

  useEffect(() => {
    handleGetAllergies();
  }, []);

  const handleGetAllergies = () => {
    if (type == "add") {
      getAllAllergies()
        .then(response => {
          let tempArr = [];
          let data = response?.data?.data;
          {
            data.map(item => {
              tempArr.push({
                ...item,
                isSelected: false
              })
            })
          }
          setAllAllergies(tempArr)
        })
        .catch(error => {
          console.log(error, 'Error====>');
        });
    }
    else {
      getAllAllergies()
        .then(response => {
          let tempArr = [];
          let data = response?.data?.data;
          {
            data.map(item => {
              tempArr.push({
                ...item,
                isSelected: false
              })
            })
          }
          setAllAllergies(tempArr)
        })
        .catch(error => {
          console.log(error, 'Error====>');
        });
    }
  };

  const handleChange = (index) => {
    // console.log(allergies[index],"allergiesallergies");
    let tempArr = [...allergies]
    tempArr[index].isSelected = !tempArr[index].isSelected
    setAllAllergies(tempArr);
  }

  console.log(allergies,"allergiesallergiesallergies");
  
  return (
    <SafeAreaView style={styles.container}>
      <Header text="Allergies Categories" goBack={true} />
      <ScrollView>
        {allergies?.map((item, index) => {
          return (
            <View style={{
              marginTop: 10,
              marginHorizontal: width(3),
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1,
              marginBottom: width(2)
            }}>
              <CheckBox
                disabled={false}
                checked={item?.isSelected}
                value={item?.isSelected}
                onValueChange={() => handleChange(index)}
                tintColors={{
                  true: colors.yellow,
                  false: colors.yellow,
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flex: 1,
                  marginLeft: width(1)
                }}>
                <Text style={{ color: colors.gray4, marginLeft: 10 }}>{item.name}</Text>
                <Image
                  source={{ uri: item?.image }}
                  style={{ width: 30, height: 30, borderRadius: 50 }}
                />
              </View>
            </View>
          );
        })}
      </ScrollView>
      <View style={{ marginBottom: width(1) }}>
        <Button heading="Confirm"
          onPress={() => navigation.navigate("AddEditFood", {
            allergiesData: allergiesData,
            type: type,
            data: data
          })}
        />
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

export default AllergyCategory;

import React from "react";
import { View, Text, SafeAreaView } from "react-native"
import { width } from "react-native-dimension";
import { TouchableOpacity } from "react-native-gesture-handler";
import Header from "../../../components/header";
import AntDesign from "react-native-vector-icons/AntDesign"
import { colors } from "../../../constants";
import { useNavigation } from "@react-navigation/native";

const Profile = () => {
  const navigation = useNavigation()
  const data = [
      {
          name: "Personal Information",
          screenName: "PersonalInfo"
      },
      {
        name: "Safety Certificate & License",
        screenName: "SafetyCertificate"
    },
      {
          name: "Change Password",
          screenName: "ChangePassword"
      },
      {
        name: "Account Information",
        screenName: "AccountInformation"
    },
      {
        name: "Support", 
        screenName: "Support"
    },
  ]
  return (
      <SafeAreaView style={{ flex:1,backgroundColor:colors.white}}>
          <Header text={"Profile"} drawer={true}/>
          <View style={{ marginTop: width(4) }}>
              {data.map((item, index) => {
                  return (
                      <TouchableOpacity
                          onPress={() => navigation.navigate(item.screenName)}
                          style={{
                              backgroundColor: "white",
                              marginVertical: width(2),
                              paddingVertical: width(6),
                              marginHorizontal: width(1),
                              borderRadius: 5,
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                              paddingHorizontal: width(3),
                              elevation:5
                          }}>
                          <Text style={{ fontWeight: "bold", fontSize: 15,color:colors.gray4 }}>{item.name}</Text>
                          <View style={{
                              height: 30,
                              width: 30,
                              justifyContent: "center",
                              alignItems: "center",
                              backgroundColor: colors.yellow,
                              borderRadius: 200
                          }}>
                              <AntDesign size={18} color={"white"} name="arrowright" />
                          </View>

                      </TouchableOpacity>
                  )
              })
              }
          </View>

      </SafeAreaView>
  )
}

export default Profile
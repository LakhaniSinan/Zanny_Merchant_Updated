import React, { useEffect } from "react"
import { Text, TextInput, View } from "react-native";
import Header from "../../../components/header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { width } from 'react-native-dimension';
import { colors } from "../../../constants";
import Button from "../../../components/button";
import { updateMerchantProfile } from "../../../services/profile";
import { useDispatch } from "react-redux";
import { setUserData } from "../../../redux/slices/Login";
import OverLayLoader from "../../../components/loader";

const DeliveryScreen = () => {


    const [deliveryTime, setDeliveryTime] = React.useState(0)
    const [isLoading, setIsLoading] = React.useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        getUserData();
    }, [])

    const getUserData = async () => {
        let data = await AsyncStorage.getItem('user')
        data = JSON.parse(data)
        setDeliveryTime(data.deliveryTime.toString())
        console.log(data, "datadata");
    }

    console.log(deliveryTime, "DD");

    const changeDeliveryTime = async () => {
        let data = await AsyncStorage.getItem('user');
        data = JSON.parse(data);
        console.log(data, "asdasdas");

        const payload = {
            deliveryTime: parseInt(deliveryTime),
        };
        if (deliveryTime < 0) return alert('Enter valid delivery time');
        setIsLoading(true);
        updateMerchantProfile(data?._id, payload)
            .then(response => {
                setIsLoading(false);
                if (response?.data?.status === 'ok') {
                    let newUser = response?.data?.data;
                    AsyncStorage.setItem('user', JSON.stringify(newUser));
                    dispatch(setUserData(newUser));
                    alert('Profile updated successfully');
                } else {
                    alert('Something went wrong!');
                }
            })
            .catch(err => {
                setIsLoading(false);
                console.log(err);
            });
    }


    return (
        <>
            <OverLayLoader isloading={isLoading} />
            <View>
                <Header text={'Update Delivery Time'} goBack={true} />
                <View
                    style={{
                        marginHorizontal: width(3),
                        borderBottomWidth: 0.5,
                        borderColor: colors.grey,
                        marginTop: width(5)
                    }}>
                    <Text style={{ fontSize: 13 }}>Enter the Delivery time in mins</Text>
                    <TextInput
                        style={{ marginTop: width(5), color: colors.black }}
                        placeholder="Enter delivery time"
                        value={deliveryTime}
                        onChangeText={newText => setDeliveryTime(newText)}
                        placeholderTextColor={colors.black}
                    />
                </View>
                <View style={{ marginTop: width(10), marginHorizontal: width(3) }}>
                    <Button heading={'Update Delivery Time'} onPress={changeDeliveryTime} />
                </View>
            </View>
        </>

    );
}

export default DeliveryScreen;

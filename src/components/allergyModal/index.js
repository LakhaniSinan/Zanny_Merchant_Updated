import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import Modal from 'react-native-modal';
import CheckBox from '@react-native-community/checkbox';
import { height, width } from 'react-native-dimension';
import { colors } from '../../constants';
import Button from '../button';

let data = {};

const AllergyModal = forwardRef((props, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [allergies, setAllergies] = useState([]);
    useImperativeHandle(ref, () => ({
        isVisible(params) {
            console.log(params, "paramsparams");
            data = params;
            setAllergies(params.allAllergies);
            setIsOpen(true);
        },
    }));

    const handleChange = (index) => {
        let tempArr = [...allergies]
        tempArr[index].isSelected = !tempArr[index].isSelected
        setAllergies(tempArr);
    }

    return (
        <View>
            <Modal
                onBackdropPress={() => {
                    data.onPressOut(allergies);
                    setIsOpen(false);
                }}
                isVisible={isOpen}
                animationIn="slideInLeft"
                animationOut="slideOutRight">
                <View style={{ backgroundColor: 'white', height:height(80) }}>
                    <ScrollView>
                        <Text style={{
                            marginHorizontal: 10,
                            marginVertical: 10,
                            fontWeight: "700",
                            fontSize:16
                        }}>All Allergies</Text>
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
                        <Button
                            heading="Confirm"
                            onPress={() => {
                                data.onPressOut(allergies);
                                setIsOpen(false);
                            }}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    )
})

export default AllergyModal
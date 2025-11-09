import React from 'react';
import { Image, Keyboard, Text, TouchableOpacity, View } from 'react-native';
import { width } from 'react-native-dimension';
import { colors } from '../../constants';

const TouchableInput = ({
    placeholder,
    showEndIcon,
    showStartIcon,
    fieldError,
    onPressEndIcon,
    value,
    showLabel,
    inputBgColor,
}) => {

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPressEndIcon}
            style={{
                height: width(14),
                marginBottom: width(5),
                borderRadius: width(1),
                backgroundColor: inputBgColor ? inputBgColor : colors.white,
                borderWidth: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderColor: fieldError ? colors.red : colors.borderDarkColor,
                paddingHorizontal: width(3),
            }}>
            {showStartIcon && (
                <View style={{ marginRight: width(2) }}>
                    <Image
                        source={showStartIcon}
                        resizeMode="contain"
                        style={{
                            height: width(5),
                            width: width(5),
                        }}
                    />
                </View>
            )}

            <View
                style={{
                    flex: 1,
                }}>
                {value !== '' && showLabel ? (
                    <Text
                        style={{
                            color: colors.lightText,
                            // fontFamily: fontFamily.PoppinsSemiBold,
                            fontSize: 10,
                            marginBottom: width(1)
                        }}>
                        {showLabel}
                    </Text>
                ) : null}

                <Text style={{
                    fontSize: 14,
                    color: colors.darkText,
                    // fontFamily: fontFamily.PoppinsSemiBold,
                    paddingVertical: 0,
                }}
                    numberOfLines={1}
                >{value ? value : placeholder}</Text>
            </View>
            {showEndIcon && (
                <TouchableOpacity onPress={onPressEndIcon}>
                    <Image
                        source={showEndIcon}
                        resizeMode="contain"
                        style={{
                            height: width(6),
                            width: width(6),
                            // tintColor: colors.lightText,
                        }}
                    />
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );
};

export default TouchableInput;

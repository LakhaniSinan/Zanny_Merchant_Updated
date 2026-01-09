import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {width} from 'react-native-dimension';
import {colors} from '../../constants';

const Button = ({heading, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          marginHorizontal: width(4),
          paddingVertical: 15,
          borderRadius: 100,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: width(5),
          backgroundColor: colors.redish,
        }}>
        <Text style={{color: 'white', fontWeight: 'bold'}}>{heading}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Button;

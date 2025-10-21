import React, {useState} from 'react';
import {ActivityIndicator, Image, StyleSheet, View} from 'react-native';
import {width, height} from 'react-native-dimension';
import {colors} from '../../../constants';

const FoodImages = ({imageUrl}) => {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <View
      style={{
        height: width(40),
        width: width(95),
      }}>
      <Image
        onLoadEnd={() => setImageLoading(false)}
        source={{uri: imageUrl}}
        style={styles.imageStyles}
        resizeMode="cover"
      />
      {imageLoading && (
        <View
          style={{
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
          }}>
          <ActivityIndicator size={'large'} color={colors.yellow} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  imageStyles: {
    height: '100%',
    width: '100%',
    borderRadius: 5,
  },
  img: {
    height: height(12),
    width: width(25),
    borderRadius: 10,
  },
});

export default FoodImages;

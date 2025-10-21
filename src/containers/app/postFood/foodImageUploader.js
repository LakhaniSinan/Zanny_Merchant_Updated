import React from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import {width} from 'react-native-dimension';
import ImageCropPicker from 'react-native-image-crop-picker';
import Entypo from 'react-native-vector-icons/Entypo';
import styles from './style';

const FoodImageUploader = ({imagePath, setImagePath}) => {
  const handleChangeIdImage = async () => {
    try {
      let resssss = await ImageCropPicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      });

      let params = {
        uri: resssss.path,
        type: resssss.mime,
        name: resssss.path,
      };
      setImagePath(resssss.path);
    } catch (error) {
      console.log(error, 'errorerrorerror');
    }
  };

  console.log(imagePath, 'lsakjalkdj');

  return (
    <View>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}>
        <TouchableOpacity onPress={handleChangeIdImage}>
          {imagePath == null ? (
            <Entypo
              name="camera"
              size={80}
              color="black"
              style={{marginTop: width(5)}}
            />
          ) : (
            <Image
              source={{
                uri: imagePath,
              }}
              resizeMode="cover"
              style={styles.imageStyle}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FoodImageUploader;

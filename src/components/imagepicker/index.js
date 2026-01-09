import React, {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import Entypo from 'react-native-vector-icons/Entypo';
import {colors} from '../../constants/index';
import {helper} from '../../helper';
import Styles from './style';

const ImagePicker = ({
  subtext,
  viewStyle,
  getImage,
  image,
  type,
  imageStyle,
}) => {
  const [isloading, setIsLoading] = useState(false);

  const handleChangeIdImage = async () => {
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

    uploadFunction(params);
  };
  const uploadFunction = async originalImage => {
    setIsLoading(true);
    try {
      // 🔥 HARD LIMIT 1MB
      console.log(originalImage, 'finalImagefinalImagefinalImagefinalImage');
      const finalImage = await helper.resizeImageBalanced(originalImage);

      const imageUrl = await helper.ImageUploadService(finalImage);

      getImage(imageUrl, type);
    } catch (error) {
      Alert.alert('Error', 'Image size 1MB se zyada hai');
    } finally {
      setIsLoading(false);
    }
  };

  const CheckImage = () => {
    if (isloading) {
      return (
        <View style={imageStyle}>
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
        </View>
      );
    } else {
      if (image) {
        return (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              resizeMode="cover"
              source={{uri: image}}
              style={imageStyle}
            />
          </View>
        );
      } else {
        return (
          <>
            <View style={viewStyle}>
              <Entypo name="camera" size={30} color="black" />
            </View>
            <Text style={Styles.iconViewText}>{subtext}</Text>
          </>
        );
      }
    }
  };

  return (
    <>
      <View>
        <TouchableOpacity
          style={{justifyContent: 'center', alignItems: 'center'}}
          onPress={handleChangeIdImage}>
          {CheckImage()}
        </TouchableOpacity>
      </View>
    </>
  );
};

export default ImagePicker;

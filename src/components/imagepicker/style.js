import {StyleSheet} from 'react-native';
import {width, height} from 'react-native-dimension';
import {colors} from '../../constants/index';

const Styles = StyleSheet.create({
  ImageProps: {
    width: width(90),
    height: height(30),
    borderRadius: 10,
    marginVertical: height(3),
    marginHorizontal: width(4),
  },
  image: {
    height: 100,
    width: 100,
    marginTop: height(3),
  },
  uploadicon: {
    marginTop: height(20),
  },
  iconView: {
    borderWidth: 0.5,
    borderColor: '#a3a3a3',
    borderStyle: 'dashed',
    height: height(30),
    width: width(90),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: width(4),
    marginVertical: height(3),
    borderRadius: 5,
  },
  iconViewText: {
    color: 'black',
    marginTop: width(1),
  },
});
export default Styles;

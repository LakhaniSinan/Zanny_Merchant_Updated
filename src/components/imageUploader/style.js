import {StyleSheet} from 'react-native';
import {width, height} from 'react-native-dimension';

const Styles = StyleSheet.create({
  imageStyle: {
    width: 100,
    height: 100,
    borderRadius: 100,
    overflow: 'hidden',
    borderColor: 'black',
    marginVertical: height(3),
  },
  image: {
    height: 100,
    width: 100,
    marginTop: height(3),
    alignItems: 'center',
  },
});
export default Styles;

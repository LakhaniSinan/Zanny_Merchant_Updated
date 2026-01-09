import {StyleSheet} from 'react-native';
import {height, width} from 'react-native-dimension';
import {colors} from '../../../constants/index';

const styles = StyleSheet.create({
  mainacard: {
    // width:"95%",
    margin: width(4),
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
  },

  textsviewtyle: {
    marginVertical: '3%',
    paddingLeft: '2%',
    paddingRight: '2%',
  },

  textstyle: {
    color: colors.yellow,
    fontWeight: '500',
    fontSize: 12,
    paddingBottom: width(2),
  },
  textstyledynamic: {
    color: 'black',
    fontWeight: '500',
    fontSize: 14,
    borderColor: colors.gray4,
    borderWidth: 0.5,
    paddingHorizontal: width(2),
    paddingVertical: width(2),
    borderRadius: 8,
  },

  btnview: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  ImageProps: {
    width: width(90),
    height: height(30),
    borderRadius: width(2),
    marginTop: height(3),
    marginHorizontal: width(4),
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    borderColor: 'black',
    height: height(30),
    width: width(90),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: width(4),
    marginVertical: height(3),
    borderRadius: 10,
  },
  iconViewText: {
    color: 'black',
  },
});
export default styles;

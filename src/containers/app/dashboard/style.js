import {StyleSheet} from 'react-native';
import {height, width} from 'react-native-dimension';
import {colors} from './../../../constants/index';

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
    marginBottom: width(3),
    borderRadius: 10,
    backgroundColor: colors.softgray,
    justifyContent: 'space-between',
    paddingVertical: width(5),
    paddingHorizontal: width(3),
    elevation: 2,
  },
  countContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: width(3),
  },
  cardTitle: {
    fontWeight: '600',
    color: colors.redish,
    fontSize: 15,
  },
  cardCount: {
    fontWeight: '600',
    color: colors.redish,
    fontSize: 15,
  },

  dateRangeStyle: {
    flexDirection: 'row',
    // justifyContent: 'space-around',
    alignItems: 'flex-start',
    marginHorizontal: width(3),
  },

  dateDisplay: {
    borderWidth: 0.5,
    marginVertical: width(3),
    borderRadius: 100,
    paddingHorizontal: width(4),
    padding: width(3),
    color: colors.gray4,
  },
  dateHeading: {
    color: 'black',
    marginBottom: 5,
    fontSize: 15,
    fontWeight: '600',
  },
  submitBtn: {
    backgroundColor: colors.redish,
    width: width(20),
    padding: width(2),
    borderRadius: 100,
  },
});

export default styles;

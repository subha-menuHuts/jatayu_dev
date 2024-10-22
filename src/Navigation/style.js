import {StyleSheet} from 'react-native';
import {moderartescale, scale, verticalscale} from '../Constants/PixelRatio';
import {Colors} from '../Constants/Colors';

export const navigationStyle = StyleSheet.create({
  bottm_items: {
    backgroundColor: Colors.themColor,
    width: moderartescale(37),
    borderRadius: moderartescale(100),
    height: moderartescale(37),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    height: verticalscale(3),
    width: scale(37),
    marginTop: moderartescale(2),
    backgroundColor: Colors.themColor,
  },
});

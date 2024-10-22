import {StyleSheet} from 'react-native';
import {Colors} from '../../Constants/Colors';
import {FONTS} from '../../Constants/Fonts';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

const Styles = () => {
  return StyleSheet.create({
    button: {
      height: responsiveWidth(4),
      width: '96%',
      backgroundColor: Colors.green,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      borderRadius: 10,
    },
    radioButton: {},
    checkbox: {
      alignSelf: 'center',
    },

    add_button: {
      height: responsiveWidth(6),
      width: responsiveWidth(12),
      backgroundColor: '#42E309',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      borderRadius: 10,
    },
  });
};

export default Styles;

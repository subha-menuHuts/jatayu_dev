import {useNavigation} from '@react-navigation/native';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  fonstSizeDynamic,
  moderartescale,
  verticalscale,
} from '../Constants/PixelRatio';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import {Icon} from 'react-native-basic-elements';
import {Colors} from '../Constants/Colors';
import {FONTS} from '../Constants/Fonts';

function ScreenHeader({title, back_display}) {
  const layout = useWindowDimensions();
  const navigation = useNavigation();

  return (
    <>
      <View style={styles.header_main}>
        <View
          style={
            back_display === true
              ? styles.header_containMain
              : styles.header_containMain_text
          }>
          {back_display === true && (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon
                type="Feather"
                name="arrow-left"
                size={19}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          )}
          <Text
            style={
              back_display === true
                ? styles.header_text
                : styles.header_text_back
            }>
            {title}
            {back_display}
          </Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header_main: {
    backgroundColor: Colors.themColor,
    height: verticalscale(40),
    width: responsiveWidth(100),
  },
  // flex-row p-[10px] items-center] justify-between
  header_containMain: {
    display: 'flex',
    flexDirection: 'row',
    padding: moderartescale(10),
    // backgroundColor:'red',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: responsiveWidth(55),
  },
  header_containMain_text: {
    display: 'flex',
    padding: moderartescale(10),
    alignItems: 'center',
    width: responsiveWidth(100),
    alignContent: 'center',
  },
  header_text: {
    color: '#FFFFFF',
    fontSize: fonstSizeDynamic(2),
    fontFamily: FONTS.Inter.medium,
  },
  header_text_back: {
    color: '#FFFFFF',
    fontSize: fonstSizeDynamic(2),
    fontFamily: FONTS.Inter.medium,
  },
});
export default ScreenHeader;

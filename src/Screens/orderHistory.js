import {StyleSheet, View, Text, TextInput} from 'react-native';
import {
  responsiveHeight,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import ScreenHeader from '../Component/screenHeader';
import {moderartescale, scale, verticalscale} from '../Constants/PixelRatio';
import {Icon} from 'react-native-basic-elements';
import OrderList from '../Component/Order/userOrder';

function OrderHistory() {
  return (
    <>
      <ScreenHeader title="Order History" back_display={true} />
      <View
        style={{
          width: responsiveScreenWidth(100),
          height: responsiveScreenHeight(100),
          backgroundColor: '#FFFFFF',
          // padding:moderartescale(10)
        }}>
        <View
          style={{
            height: responsiveHeight(100),
            // padding:moderartescale(10)
          }}>
          <OrderList />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  search_container: {
    margin: moderartescale(5),
    // backgroundColor:"red"
    //   padding: moderartescale(10),
  },
  searchBox: {
    width: moderartescale(346), // 90% of screen width
    height: verticalscale(42),
    padding: moderartescale(10),
    borderWidth: moderartescale(0.9),
    borderColor: '#CCCCCC',
    borderRadius: moderartescale(30),
    flexDirection: 'row',
    alignItems: 'center',
    margin: 'auto',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    height: verticalscale(42),
    color: '#000000',
  },
});
export default OrderHistory;

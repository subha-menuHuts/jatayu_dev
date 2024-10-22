import {View} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import ScreenHeader from '../Component/screenHeader';
import CartItemsList from '../Component/Cart/cartitemsDetails';

function UserCartListItems() {
  return (
    <>
      <View
        style={{
          height: responsiveHeight(100),
          width: responsiveWidth(100),
          backgroundColor: '#FFFFFF',
        }}>
        <ScreenHeader title="Cart" back_display={true} />
        <CartItemsList />
      </View>
    </>
  );
}
export default UserCartListItems;

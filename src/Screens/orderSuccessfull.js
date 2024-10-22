import {StyleSheet} from 'react-native';
import ScreenHeader from '../Component/screenHeader';
import OrderSucssDetails from '../Component/Order/orderSuccessfull';
function OrderSuccessfull() {
  return (
    <>
      <ScreenHeader title="Order Success" back_display={true} />
      <OrderSucssDetails />
    </>
  );
}

export default OrderSuccessfull;

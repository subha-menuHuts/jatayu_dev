import {View} from 'react-native';
import ScreenHeader from '../Component/screenHeader';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import OrderReview from '../Component/Order/review';

function UserorderReview() {
  return (
    <>
      <View
        style={{
          width: responsiveScreenWidth(100),
          height: responsiveScreenWidth(100),
          backgroundColor: '#FFF0F5',
        }}>
        <ScreenHeader title="Review" back_display={true} />
        <OrderReview />
      </View>
    </>
  );
}

export default UserorderReview;

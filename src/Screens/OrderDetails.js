import UserOrderDetials from '../Component/Order/userOrderDetails';
import ScreenHeader from '../Component/screenHeader';
import {useFocusEffect} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';

function OrderDetails({props, route, navigation}) {
  const [item, setItem] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      setItem(route.params.data);
    }, [route.params.data]),
  );

  return (
    <>
      <ScreenHeader title="Order Details" back_display={true} />
      <UserOrderDetials item_data={item} />
    </>
  );
}

export default OrderDetails;

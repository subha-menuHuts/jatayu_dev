//import liraries
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  useColorScheme,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
} from 'react-native';

import Styles from './Styles';
import {Colors} from '../../Constants/Colors';
import {FONTS} from '../../Constants/Fonts';
import {useDispatch, useSelector} from 'react-redux';
import {postWithOutToken} from '../../Service/service';
import {useNavigation} from '@react-navigation/native';
import {Icon} from 'react-native-basic-elements';
import {useFocusEffect} from '@react-navigation/native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

// create a component
const CartButton = props => {
  const styles = Styles();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const {baseUrl, siteUrl, userData, userToken, cartDetails} = useSelector(
    state => state.common,
  );
  const [display_card, setDisplayCard] = useState({display: false, count: 0});

  useFocusEffect(
    React.useCallback(() => {
      console.log('Cart Length : ' + cartDetails.length);
      console.log(cartDetails);
      if (cartDetails.length > 0) {
        let cartQty = 0;
        for (const cartDish of cartDetails) {
          for (const dish of cartDish.dish) {
            cartQty += dish.quantity;
          }
        }

        setDisplayCard({display: true, count: cartQty});
      } else {
        setDisplayCard({display: false, count: 0});
      }
    }, [cartDetails]),
  );

  useEffect(() => {}, []);

  useEffect(() => {}, []);

  return (
    <>
      {display_card.display === true ? (
        <TouchableOpacity
          style={{
            shadowColor: Colors.themColor,
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            position: 'absolute',
            right: 10,
            bottom: responsiveScreenHeight(4),
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: responsiveWidth(13),
            height: responsiveWidth(13),
            borderRadius: responsiveWidth(7),
            backgroundColor: Colors.themColor,
          }}
          onPress={() => {
            navigation.navigate('usercartScreen');
          }}>
          <View
            style={{
              position: 'absolute',
              right: 0,
              top: -18,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: responsiveWidth(7),
              height: responsiveWidth(7),
              borderRadius: responsiveWidth(3.5),
              backgroundColor: Colors.white,
            }}>
            <Text
              style={{
                fontFamily: FONTS.Inter.regular,
                fontSize: responsiveFontSize(1.5),
                color: Colors.black,
              }}>
              {display_card.count}
            </Text>
          </View>
          <View>
            <Icon
              type="AntDesign"
              name="shoppingcart"
              color={Colors.white}
              size={responsiveWidth(8)}
            />
          </View>
        </TouchableOpacity>
      ) : null}
    </>
  );
};
export default CartButton;

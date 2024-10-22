import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {moderartescale, scale, verticalscale} from '../../Constants/PixelRatio';
import {Icon} from 'react-native-basic-elements';
import {useNavigation} from '@react-navigation/native';
import {FONTS} from '../../Constants/Fonts';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import {useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {showToastMsg, getData, setData} from '../../Service/localStorage';
import {postWithToken, postWithOutToken} from '../../Service/service';
import {useFocusEffect} from '@react-navigation/native';
import {Colors} from '../../Constants/Colors';
import {
  setCartDetails,
  setCartQuantity,
} from '../../Store/Reducers/CommonReducer';
import Loader from '../../Component/loader';

function CartItemsList() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const {
    baseUrl,
    siteUrl,
    userToken,
    userData,
    selectedLang,
    LangValue,
    deviceToken,
    orderType,
    google_api_key,
    google_auto_complete_country,
    cartDetails,
  } = useSelector(state => state.common);
  const [viewloader, setLoader] = useState(false);
  const [language, setLanguage] = useState(null);

  const [CartDish, setCartDish] = useState({isLoading: true, list: []});
  const [cartQuantity, setcartQuantity] = useState(0);
  const [activeBusiness, setActiveBusiness] = useState(null);

  const [CartSubTotal, setCartSubTotal] = useState(0.0);
  const [PendingMinimumFee, setPendingMinimumFee] = useState(0.0);
  const [PendingFreeDelivery, setPendingFreeDelivery] = useState(false);
  const [PendingFreeDeliveryValue, setPendingFreeDeliveryValue] = useState('');

  const [preorderDetails, setPreorderDetails] = useState({
    preorder: false,
    preorderDate: '',
    preorderTime: '',
    preorderMenu: 0,
  });

  const [discountInfo, setDiscountInfo] = useState({
    discounttext: '',
    discounttype: '',
    discountid: '',
  });
  const [discount, setDiscount] = useState(0.0);
  const [tips, setTips] = useState(0.0);
  const [cartFee, setCartFee] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      setLanguage(LangValue);
    }, [selectedLang]),
  );

  useFocusEffect(
    React.useCallback(() => {
      if (cartDetails.length > 0) {
        console.log(cartDetails[0].details);
        setActiveBusiness(cartDetails[0].details);
        setCartDish({isLoading: false, list: cartDetails});
        let cartQty = 0;
        for (const cartDish of cartDetails) {
          for (const dish of cartDish.dish) {
            cartQty += dish.quantity;
          }
        }
        setcartQuantity(cartQty);
        dispatch(setCartQuantity(cartQty));
        calCartTotal(cartDetails, cartDetails[0].details);
      }
    }, []),
  );

  const addTocartIncrement = (index, dishindex, dishdataindex) => {
    let cart = JSON.parse(JSON.stringify(CartDish.list));
    cart[index].dish[dishindex].quantity =
      parseInt(cart[index].dish[dishindex].quantity) + 1;
    cart[index].dish[dishindex].data[dishdataindex].quantity =
      parseInt(cart[index].dish[dishindex].data[dishdataindex].quantity) + 1;
    cart[index].dish[dishindex].data[dishdataindex].total =
      parseFloat(cart[index].dish[dishindex].data[dishdataindex].totalprice) *
      parseInt(cart[index].dish[dishindex].data[dishdataindex].quantity);
    cart[index].dish[dishindex].data[dishdataindex].total = parseFloat(
      cart[index].dish[dishindex].data[dishdataindex].total,
    ).toFixed(2);
    updateCartDetails(cart);
    calCartTotal(cart, activeBusiness);
  };
  const addTocartDecrement = (index, dishindex, dishdataindex) => {
    let cart = JSON.parse(JSON.stringify(CartDish.list));
    cart[index].dish[dishindex].quantity =
      parseInt(cart[index].dish[dishindex].quantity) - 1;
    cart[index].dish[dishindex].data[dishdataindex].quantity =
      parseInt(cart[index].dish[dishindex].data[dishdataindex].quantity) - 1;
    cart[index].dish[dishindex].data[dishdataindex].total =
      parseFloat(cart[index].dish[dishindex].data[dishdataindex].totalprice) *
      parseInt(cart[index].dish[dishindex].data[dishdataindex].quantity);
    cart[index].dish[dishindex].data[dishdataindex].total = parseFloat(
      cart[index].dish[dishindex].data[dishdataindex].total,
    ).toFixed(2);
    if (cart[index].dish[dishindex].data[dishdataindex].quantity === 0) {
      cart[index].dish[dishindex].data.splice(dishdataindex, 1);
      if (cart[index].dish[dishindex].data.length === 0) {
        cart[index].dish.splice(dishindex, 1);
      }
      if (cart[index].dish.length === 0) {
        cart.splice(index, 1);
      }
    }

    updateCartDetails(cart);
    calCartTotal(cart, activeBusiness);
  };

  const updateCartDetails = cart => {
    setCartDish({isLoading: false, list: cart});
    dispatch(setCartDetails(cart));
    setData('cartDetails', JSON.stringify(cart));

    let cartQty = 0;
    for (const cartDish of cart) {
      for (const dish of cartDish.dish) {
        cartQty += dish.quantity;
      }
    }
    setcartQuantity(cartQty);
    dispatch(setCartQuantity(cartQty));

    if (cartQty == 0) {
      setTimeout(() => {
        navigation.navigate('BHome');
      }, 500);
    }
  };

  const calCartTotal = (cart, activeBusiness_val) => {
    let CartSubTotal_val = 0.0;
    for (let i = 0; i < cart.length; i++) {
      for (let j = 0; j < cart[i].dish.length; j++) {
        for (let k = 0; k < cart[i].dish[j].data.length; k++) {
          if (cart[i].dish[j].data[k].total) {
            CartSubTotal_val =
              parseFloat(CartSubTotal_val) +
              parseFloat(cart[i].dish[j].data[k].total);
            CartSubTotal_val = parseFloat(CartSubTotal_val).toFixed(2);
          }
        }
      }
    }

    setCartSubTotal(CartSubTotal_val);

    let PendingMinimumFee_val = activeBusiness_val.minimumfeeback;
    if (cart.length > 0) {
      if (cart[0].id === activeBusiness_val.id) {
        if (PendingMinimumFee_val > 0) {
          if (cart.length === 0) {
            PendingMinimumFee_val =
              parseFloat(PendingMinimumFee_val) - parseFloat(CartSubTotal_val);
            PendingMinimumFee_val = parseFloat(PendingMinimumFee_val).toFixed(
              2,
            );
          } else {
            if (cart[0].id === activeBusiness_val.id) {
              PendingMinimumFee_val =
                parseFloat(PendingMinimumFee_val) -
                parseFloat(CartSubTotal_val);
              PendingMinimumFee_val = parseFloat(PendingMinimumFee_val).toFixed(
                2,
              );
            }
          }

          setPendingMinimumFee(PendingMinimumFee_val);
        }
        if (activeBusiness_val.freedeliverystatus === '1') {
          if (
            parseFloat(CartSubTotal_val) >=
            parseFloat(activeBusiness_val.freedeliveryvalue)
          ) {
            setPendingFreeDelivery(true);
            setPendingFreeDeliveryValue(0.0);
          } else {
            setPendingFreeDelivery(false);
            let PendingFreeDeliveryValue_val =
              parseFloat(activeBusiness_val.freedeliveryvalue) -
              parseFloat(CartSubTotal_val);
            PendingFreeDeliveryValue_val = parseFloat(
              PendingFreeDeliveryValue_val,
            ).toFixed(2);
            setPendingFreeDeliveryValue(PendingFreeDeliveryValue_val);
          }
        }
      }

      postWithOutToken(baseUrl, 'module/business/rest-business.php', {
        f: 'checkoffer',
        bid: activeBusiness_val.id,
        price: CartSubTotal_val,
        orderType: orderType,
      })
        .then(response => {
          let offerResponse = response;
          if (offerResponse.status === true) {
            discountInfo.discounttype = 'offer';

            setDiscountInfo(discountInfo);

            if (offerResponse.d_type === '1') {
              let discount = offerResponse.price;
              setDiscount(discount);
              CalDiscount(cart, discount, CartSubTotal_val, activeBusiness_val);
            } else {
              let percent = Number(offerResponse.percent) * 0.01;
              let discount = parseFloat(CartSubTotal_val) * percent;
              discount = parseFloat(discount).toFixed(2);
              setDiscount(discount);
              CalDiscount(cart, discount, CartSubTotal_val, activeBusiness_val);
            }
          } else {
            CalDiscount(cart, discount, CartSubTotal_val, activeBusiness_val);
          }
        })
        .catch(error => {
          console.log('Error : ', error);
        });
    }
  };

  const CalDiscount = (
    cart_val,
    discount_val,
    CartSubTotal_val,
    activeBusiness_val,
  ) => {
    let cartFee = new Array();
    let SubTotal = 0.0;

    for (let i = 0; i < cart_val.length; i++) {
      for (let j = 0; j < cart_val[i].dish.length; j++) {
        for (let k = 0; k < cart_val[i].dish[j].data.length; k++) {
          if (cart_val[i].dish[j].data[k].total) {
            SubTotal =
              parseFloat(SubTotal) +
              parseFloat(cart_val[i].dish[j].data[k].total);
            SubTotal = parseFloat(SubTotal).toFixed(2);
          }
        }
      }
      let firstOffer = 0.0;
      if (
        activeBusiness_val.firstorderstatus === '1' &&
        activeBusiness_val.ordercountstatus
      ) {
        if (
          parseFloat(SubTotal) >= parseFloat(activeBusiness_val.firstordervalue)
        ) {
          firstOffer =
            parseFloat(SubTotal) * activeBusiness_val.firstorderoffer * 0.01;
          firstOffer = parseFloat(firstOffer).toFixed(2);
        }
      }
      cart_val[i].details.delivery = 0.0;
      if (activeBusiness_val.freedeliverystatus === '1') {
        if (
          parseFloat(SubTotal) >=
          parseFloat(activeBusiness_val.freedeliveryvalue)
        ) {
          cart_val[i].details.delivery = 0.0;
        }
      }
      let extraminimum = 0.0;
      if (activeBusiness_val.requiredminimumstatus === '1') {
        if (parseFloat(SubTotal) < parseFloat(activeBusiness_val.minimumfee)) {
          extraminimum =
            parseFloat(activeBusiness_val.minimumfee) - parseFloat(SubTotal);
          extraminimum = parseFloat(extraminimum).toFixed(2);
        }
      }
      let subtotal = parseFloat(SubTotal) - parseFloat(discount_val);
      subtotal = parseFloat(subtotal).toFixed(2);
      let taxprice =
        parseFloat(subtotal) * Number(cart_val[i].details.tax * 0.01);
      taxprice = parseFloat(taxprice).toFixed(2);
      let servicefeeprice = parseFloat(subtotal) + parseFloat(0);
      servicefeeprice = servicefeeprice * cart_val[i].details.servicefee * 0.01;
      servicefeeprice = parseFloat(servicefeeprice).toFixed(2);
      let total;
      if (cart_val[i].details.taxtype === '0') {
        total =
          parseFloat(CartSubTotal_val) -
          parseFloat(discount_val) +
          parseFloat(0) +
          parseFloat(taxprice) +
          parseFloat(servicefeeprice) +
          parseFloat(tips);
        total = parseFloat(total).toFixed(2);
      } else {
        total =
          parseFloat(CartSubTotal_val) -
          parseFloat(discount_val) +
          parseFloat(0) +
          parseFloat(servicefeeprice) +
          parseFloat(tips);
        total = parseFloat(total).toFixed(2);
      }
      if (activeBusiness_val.requiredminimumstatus === '1') {
        total = parseFloat(total) + parseFloat(extraminimum);
        total = parseFloat(total).toFixed(2);
      }
      if (
        activeBusiness_val.firstorderstatus === '1' &&
        activeBusiness_val.ordercountstatus
      ) {
        total = parseFloat(total) - parseFloat(firstOffer);
        total = parseFloat(total).toFixed(2);
      }
      let fee;
      fee = {
        id: cart_val[i].id,
        name: cart_val[i].details.name,
        subtotal: SubTotal,
        tax: cart_val[i].details.tax,
        taxtype: cart_val[i].details.taxtype,
        taxprice: taxprice,
        deliverycost: 0.0,
        extraminimum: extraminimum,
        firstoffer: firstOffer,
        servicefee: cart_val[i].details.servicefee,
        servicefeeprice: servicefeeprice,
        discount: parseFloat(discount_val).toFixed(2),
        tips: tips,
        total: total,
      };

      cartFee.push(fee);
    }
    setCartFee(cartFee);
  };

  const CheckOut = () => {
    if (userData == null) {
      navigation.navigate('login', {page: 'usercartScreen'});
    } else {
      navigation.navigate('cartCheckout');
    }
  };

  return (
    <View
      style={{
        position: 'relative',
        height: '80%',
        flex: 1,
        backgroundColor: '#000',
        display: 'flex',
      }}>
      <ScrollView style={styles.main_container}>
        {viewloader === true ? <Loader /> : null}
        {CartDish.isLoading === false && CartDish.list.length > 0 ? (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              padding: moderartescale(6),
              marginBottom: responsiveHeight(10),
            }}>
            {CartDish.list.map((cartdish, cartindex) => {
              return cartdish.dish.map((cdish, dishindex) => {
                return cdish.data.map((dish, dataindex) => {
                  let dish_image = require('../../assets/images/no-image.png');

                  if (dish.is_img == 1) {
                    dish_image = {uri: dish.img};
                  } else if (dish.is_img1 == 1) {
                    dish_image = {uri: dish.img1};
                  } else if (dish.is_img2 == 1) {
                    dish_image = {uri: dish.img2};
                  }

                  return (
                    <View key={'cdish_' + dataindex} style={styles.itemMain}>
                      <View style={styles.rowContainer}>
                        <View style={{flexDirection: 'row'}}>
                          <Image source={dish_image} style={styles.image} />
                          <View style={styles.contentContainer}>
                            <Text style={styles.itemName} numberOfLines={1}>
                              {dish.name}
                            </Text>
                            <View style={styles.quantityContainer}>
                              <TouchableOpacity
                                onPress={() => {
                                  addTocartDecrement(
                                    cartindex,
                                    dishindex,
                                    dataindex,
                                  );
                                }}
                                style={styles.quantityButton}>
                                <Icon
                                  type="Feather"
                                  name="minus"
                                  color="#FFFFFF"
                                  size={18}
                                />
                              </TouchableOpacity>
                              <View style={styles.quantityDisplay}>
                                <Text style={styles.displayText}>
                                  {dish.quantity}
                                </Text>
                              </View>
                              <TouchableOpacity
                                onPress={() => {
                                  addTocartIncrement(
                                    cartindex,
                                    dishindex,
                                    dataindex,
                                  );
                                }}
                                style={styles.quantityButton}>
                                <Icon
                                  type="Feather"
                                  name="plus"
                                  color="#FFFFFF"
                                  size={18}
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                        <Text style={styles.priceText}>
                          {activeBusiness != null
                            ? activeBusiness.currency_symbol
                            : null}
                          {dish.total}
                        </Text>
                      </View>
                    </View>
                  );
                });
              });
            })}

            <View style={styles.priceDetail}>
              <View style={styles.priceDetailsContain}>
                <View style={styles.row}>
                  <Text
                    style={[
                      styles.labelText,
                      {
                        fontFamily: FONTS.Inter.medium,
                      },
                    ]}>
                    Subtotal
                  </Text>
                  <Text style={styles.valueText}>
                    {activeBusiness.currency_symbol} :{CartSubTotal}
                  </Text>
                </View>

                {cartFee.map((cartfee, index) => {
                  return (
                    <View key={'carefee_' + index}>
                      {cartfee.discount > 0 ? (
                        <View
                          style={[styles.row, {marginTop: verticalscale(10)}]}>
                          <Text
                            style={[
                              styles.labelText,
                              {fontFamily: FONTS.Inter.regular},
                            ]}>
                            Discount
                          </Text>
                          <Text style={styles.valueText}>
                            {activeBusiness.currency_symbol} :{' '}
                            {cartfee.discount}
                          </Text>
                        </View>
                      ) : null}

                      {cartfee.taxprice > 0 ? (
                        <View
                          style={[styles.row, {marginTop: verticalscale(10)}]}>
                          <Text
                            style={[
                              styles.labelText,
                              {fontFamily: FONTS.Inter.regular},
                            ]}>
                            Tax ({cartfee.tax}%)
                          </Text>
                          <Text style={styles.valueText}>
                            {activeBusiness.currency_symbol} :{' '}
                            {cartfee.taxprice}
                          </Text>
                        </View>
                      ) : null}
                      {cartfee.servicefeeprice > 0 ? (
                        <View
                          style={[styles.row, {marginTop: verticalscale(10)}]}>
                          <Text
                            style={[
                              styles.labelText,
                              {fontFamily: FONTS.Inter.regular},
                            ]}>
                            Service Fee ({cartfee.servicefee}%)
                          </Text>
                          <Text style={styles.valueText}>
                            {activeBusiness.currency_symbol} :{' '}
                            {cartfee.servicefeeprice}
                          </Text>
                        </View>
                      ) : null}

                      {cartfee.tips > 0 ? (
                        <View
                          style={[styles.row, {marginTop: verticalscale(10)}]}>
                          <Text
                            style={[
                              styles.labelText,
                              {fontFamily: FONTS.Inter.regular},
                            ]}>
                            Tips
                          </Text>
                          <Text style={styles.valueText}>
                            {activeBusiness.currency_symbol} : {cartfee.tips}
                          </Text>
                        </View>
                      ) : null}

                      <TouchableOpacity style={styles.totalContainer}>
                        <Text style={styles.totalText}>Total</Text>
                        <Text style={styles.totalText}>
                          {activeBusiness.currency_symbol} : {cartfee.total}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            </View>

            {PendingMinimumFee > 0.0 ? (
              <View
                style={{
                  alignItems: 'center',
                  paddingVertical: responsiveHeight(1),
                }}>
                <Text
                  style={{
                    fontFamily: FONTS.Inter.medium,
                    fontSize: responsiveFontSize(2),
                    color: Colors.red,
                  }}>
                  minimum price need to add {activeBusiness.currency_symbol}
                  {PendingMinimumFee}
                </Text>
              </View>
            ) : null}
          </View>
        ) : (
          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              marginVertical={responsiveHeight(2)}
              marginHorizontal={responsiveWidth(4)}>
              <SkeletonPlaceholder.Item
                width={responsiveWidth(92)}
                height={responsiveHeight(12)}
                marginRight={responsiveWidth(3)}
                borderRadius={10}
              />
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              marginHorizontal={responsiveWidth(4)}>
              <SkeletonPlaceholder.Item
                width={responsiveWidth(92)}
                height={responsiveHeight(12)}
                marginRight={responsiveWidth(3)}
                borderRadius={10}
              />
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              marginVertical={responsiveHeight(2)}
              marginHorizontal={responsiveWidth(4)}>
              <SkeletonPlaceholder.Item
                width={responsiveWidth(92)}
                height={responsiveHeight(12)}
                marginRight={responsiveWidth(3)}
                borderRadius={10}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder>
        )}
      </ScrollView>
      {PendingMinimumFee <= 0.0 ? (
        <View
          style={{
            width: '100%',
            height: responsiveHeight(5),
            left: 0,
            bottom: responsiveHeight(2.5),
            backgroundColor: '#20D910',
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              CheckOut();
            }}>
            <Text
              style={{
                color: '#fff',
                textAlign: 'center',
                fontFamily: FONTS.Inter.bold,
                fontSize: responsiveFontSize(2.2),
              }}>
              Order Now
            </Text>
          </TouchableOpacity>
        </View>
      ) : PendingMinimumFee > 0.0 ? (
        <View
          style={{
            width: '100%',
            height: responsiveHeight(5),
            left: 0,
            bottom: responsiveHeight(2.5),
            backgroundColor: '#20D910',
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity>
            <Text
              style={{
                color: '#fff',
                textAlign: 'center',
                fontFamily: FONTS.Inter.bold,
                fontSize: responsiveFontSize(2.2),
              }}>
              {'Minumum Order'}:{activeBusiness.currency_symbol}
              {activeBusiness.minimumfee}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  main_container: {
    width: responsiveScreenWidth(100),
    backgroundColor: '#FFFFFF',
  },
  itemMain: {
    height: verticalscale(75),
    marginTop: verticalscale(10),
    width: scale(340),
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 2,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: moderartescale(5),
  },
  rowContainer: {
    flexDirection: 'row',
    padding: moderartescale(10),
    zIndex: 999,
    justifyContent: 'space-between',
  },
  image: {
    width: responsiveWidth(12),
    height: responsiveHeight(6),
    borderRadius: responsiveWidth(4),
  },
  contentContainer: {
    marginLeft: moderartescale(15),
  },
  itemName: {
    width: scale(170),
    fontSize: moderartescale(16),
    color: '#000000',
    fontWeight: '500',
    flexShrink: 1, // Allows the text to wrap and avoid overflow
    fontFamily: FONTS.Inter.medium,
  },
  quantityContainer: {
    flexDirection: 'row',
    width: moderartescale(80),
    marginTop: verticalscale(5),
    justifyContent: 'space-evenly',
  },
  quantityButton: {
    backgroundColor: '#F00049',
    borderRadius: moderartescale(5),
    justifyContent: 'center',
    alignItems: 'center',
    height: verticalscale(20),
    width: moderartescale(20),
  },
  quantityText: {
    color: '#FFFFFF',
    fontSize: moderartescale(18),
  },
  quantityDisplay: {
    backgroundColor: '#FFFFFF',
    borderWidth: moderartescale(2),
    borderColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderartescale(5),
    height: verticalscale(20),
    width: moderartescale(20),
  },
  displayText: {
    color: '#000000',
  },
  priceText: {
    color: '#20D910',
    fontSize: moderartescale(16),
    fontFamily: FONTS.Inter.semibold,
  },
  priceDetail: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderartescale(10),
  },
  priceDetailsContain: {
    width: scale(340),
    borderWidth: moderartescale(2),
    borderColor: '#F00049',
    borderRadius: moderartescale(10),
    height: verticalscale(144),
    padding: moderartescale(17),
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  labelText: {
    color: '#000000',
    fontSize: moderartescale(14),
    fontWeight: '500',
  },
  valueText: {
    color: '#000000',
    fontSize: moderartescale(14),
  },
  totalContainer: {
    marginTop: verticalscale(10),
    height: verticalscale(40),
    backgroundColor: '#F00049',
    borderRadius: moderartescale(5),
    padding: moderartescale(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalText: {
    color: '#FFFFFF',
    fontSize: moderartescale(16),
    fontFamily: FONTS.Inter.medium,
  },
});
export default CartItemsList;

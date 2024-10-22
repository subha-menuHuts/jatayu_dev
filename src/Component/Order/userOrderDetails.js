import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import {moderartescale, scale, verticalscale} from '../../Constants/PixelRatio';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {Icon} from 'react-native-basic-elements';
import {ScrollView} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {Colors} from '../../Constants/Colors';
import Loader from '../../Component/loader';
import {useFocusEffect} from '@react-navigation/native';
import {FONTS} from '../../Constants/Fonts';
import {useDispatch, useSelector} from 'react-redux';
import {showToastMsg, getData, setData} from '../../Service/localStorage';
import {postWithToken, postWithOutToken} from '../../Service/service';
import {useRoute} from '@react-navigation/native';
import {Rating} from 'react-native-ratings';

function UserOrderDetials({props}) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {
    baseUrl,
    siteUrl,
    userToken,
    userData,
    selectedLang,
    LangValue,
    deviceToken,
    google_api_key,
  } = useSelector(state => state.common);
  const [viewloader, setLoader] = useState(false);
  const [language, setLanguage] = useState(null);
  const [item, setItem] = useState(null);
  const route = useRoute();

  useFocusEffect(
    React.useCallback(() => {
      if (route.params != undefined) {
        if (route.params.order_id != undefined) {
          getOrderDetails(route.params.order_id);
        }
      }
    }, [route.params]),
  );

  useFocusEffect(
    React.useCallback(() => {
      setLanguage(LangValue);
    }, [selectedLang]),
  );

  const getOrderDetails = order_id => {
    setLoader(true);
    postWithOutToken(baseUrl, 'module/order/rest-order', {
      f: 'react_fetchorderDetails',
      userId: userData.id,
      langId: selectedLang,
      orderId: order_id,
    })
      .then(response => {
        setLoader(false);
        console.log(response);

        setItem(response);
      })
      .catch(error => {
        setLoader(false);
        console.log('Error : ', error);
      });
  };

  const displayVal = val => {
    if (val === '0') {
      return 'Pending';
    }
    if (val === '1') {
      return 'Accepted By Restaurant';
    }
    if (val === '2') {
      return 'Accepted by Driver';
    }
    if (val === '3') {
      return 'Delivery Complete by Driver';
    }
    if (val === '4') {
      return 'Completed by Resturant';
    }
    if (val === '5') {
      return 'Complete';
    }
    if (val === '6') {
      return 'Cancelled by Resturant';
    }
    if (val === '7') {
      return 'Rejected by Driver';
    }
    if (val === '8') {
      return 'Cancelled';
    }
    if (val === '9') {
      return 'Pickup Complete by Driver';
    }
    if (val === '10') {
      return 'Pickup Complete from user by Driver';
    }
    if (val === '11') {
      return 'Delivery Complete to Business by Driver';
    }
    if (val === '12') {
      return 'Verified by Resturant';
    }
  };

  const displayValColor = val => {
    if (val === '0') {
      return '#ee4336';
    }
    if (val === '1') {
      return '#e6b90e';
    }
    if (val === '2') {
      return '#e6b90e';
    }
    if (val === '3') {
      return '#4ac112';
    }
    if (val === '4') {
      return '#4ac112';
    }
    if (val === '5') {
      return '#4ac112';
    }
    if (val === '6') {
      return '#FF0000';
    }
    if (val === '7') {
      return '#FF0000';
    }
    if (val === '8') {
      return '#FF0000';
    }
    if (val === '9') {
      return '#4ac112';
    }
    if (val === '10') {
      return '#e6b90e';
    }
    if (val === '11') {
      return '#e6b90e';
    }
    if (val === '12') {
      return '#4ac112';
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          height: responsiveScreenHeight(100),
          width: responsiveScreenWidth(100),
        },
      ]}>
      {item == null ? <Loader /> : null}
      {item != null ? (
        <ScrollView>
          <View style={styles.paddingContainer}>
            <View style={styles.statusContainer}>
              <Text
                style={[
                  styles.statusText,
                  {color: displayValColor(item.status)},
                ]}>
                {displayVal(item.status)}
              </Text>
            </View>
            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <Icon
                  type="FontAwesome"
                  name="briefcase"
                  size={15}
                  color="#000000"
                />
                <Text style={styles.infoText}>
                  {'Name'} : {item.bname}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Icon
                  type="Entypo"
                  name="clipboard"
                  size={15}
                  color="#000000"
                />
                <Text style={styles.infoText}>
                  {language != null ? language.ORDER_ID : 'Order ID'} : #
                  {item.id}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Icon
                  type="FontAwesome5"
                  name="money-check"
                  size={15}
                  color="#000000"
                />
                <Text style={styles.infoText}>
                  {language != null ? language.ORDER_VALUE : 'Order Value'}:
                  {item.currency_symbol}
                  {item.total}
                </Text>
              </View>
              <View style={styles.divider} />
            </View>
          </View>
          {item.dishdata.length > 0
            ? item.dishdata.map((product_item, index) => {
                return product_item.data.map((dish, dish_index) => {
                  return (
                    <View key={dish_index} style={styles.itemRow}>
                      {dish.img != '' && dish.img != null ? (
                        <Image
                          style={styles.itemImage}
                          source={{uri: dish.img}}
                        />
                      ) : (
                        <Image
                          style={styles.itemImage}
                          source={require('../../assets/images/no-image.png')}
                        />
                      )}

                      <Text style={styles.itemText}>{dish.name}</Text>
                      <View style={styles.itemPriceContainer}>
                        <Text style={styles.itemPrice}>{dish.quantity}</Text>
                        <Text style={styles.itemPrice}>
                          {item.currency_symbol}
                          {dish.total}
                        </Text>
                      </View>
                    </View>
                  );
                });
              })
            : null}

          <View style={styles.divider} />
          <View
            style={{
              margin: scale(5),
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: responsiveHeight(30),
            }}>
            <View style={styles.summaryContainer}>
              <View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryText}>
                    {language != null
                      ? language.ORDER_TEMPLATE_SUB_TOTAL
                      : 'Sub Total'}
                  </Text>
                  <Text style={styles.summaryText}>
                    {item.currency_symbol} : {item.subtotal}
                  </Text>
                </View>

                {item.extraminimum > 0 && (
                  <View style={[styles.summaryRow, styles.marginTop]}>
                    <Text style={styles.summaryText}>
                      {language != null
                        ? language.EXTRA_CHARGE_MINIMUM
                        : 'Extra charge - minimum Delivery'}
                    </Text>
                    <Text style={styles.summaryText}>
                      {item.currency_symbol} : {item.extraminimum}
                    </Text>
                  </View>
                )}

                {item.order_type == 1 && (
                  <View style={[styles.summaryRow, styles.marginTop]}>
                    <Text style={styles.summaryText}>
                      {language != null
                        ? language.DELIEVRY_FEE
                        : 'Delivery Fee'}
                    </Text>

                    {item.deliverycost > 0 && (
                      <Text style={styles.summaryText}>
                        {item.currency_symbol} : {item.deliverycost}
                      </Text>
                    )}
                    {item.deliverycost == 0 && (
                      <Text style={styles.summaryText}>
                        {language != null ? language.FREE : 'Fee'}
                      </Text>
                    )}
                  </View>
                )}

                <View style={[styles.summaryRow, styles.marginTop]}>
                  <Text style={styles.summaryText}>
                    {language != null ? language.ORDER_TEMPLATE_TAX : 'TAX'}
                  </Text>
                  <Text style={styles.summaryText}>
                    {item.currency_symbol} : {item.tax_price}
                  </Text>
                </View>

                {item.servicefee_price > 0 && (
                  <View style={[styles.summaryRow, styles.marginTop]}>
                    <Text style={styles.summaryText}>
                      {language != null ? language.SERVICE_FEE : 'Service fee'}(
                      {item.servicefee}%)
                    </Text>
                    <Text style={styles.summaryText}>
                      {item.currency_symbol} : {item.servicefee_price}
                    </Text>
                  </View>
                )}

                {item.tips > 0 && (
                  <View style={[styles.summaryRow, styles.marginTop]}>
                    <Text style={styles.summaryText}>
                      {language != null ? language.TIPS : 'Tips'}
                    </Text>
                    <Text style={styles.summaryText}>
                      {item.currency_symbol} : {item.tips}
                    </Text>
                  </View>
                )}

                {item.discount > 0 && (
                  <View style={[styles.summaryRow, styles.marginTop]}>
                    <Text style={styles.summaryText}>
                      {language != null
                        ? language.ORDER_TEMPLATE_DISCOUNT
                        : 'Discount'}
                    </Text>
                    <Text style={styles.summaryText}>
                      {item.currency_symbol} : {item.discount}
                    </Text>
                  </View>
                )}

                {item.firstoffer > 0 && (
                  <View style={[styles.summaryRow, styles.marginTop]}>
                    <Text style={styles.summaryText}>
                      {language != null
                        ? language.DISCOUNT_FOR_FIRST_ORDER
                        : 'Discount for First Order'}
                    </Text>
                    <Text style={styles.summaryText}>
                      {item.currency_symbol} : {item.firstoffer}
                    </Text>
                  </View>
                )}

                <View style={[styles.totalContainer, styles.marginTop]}>
                  <Text style={styles.totalText}>
                    {language != null ? language.ORDER_TEMPLATE_TOTAL : 'Total'}
                  </Text>
                  <Text style={styles.totalText}>
                    {item.currency_symbol} : {item.total}
                  </Text>
                </View>
              </View>
            </View>

            {item.review.length == 0 ? (
              <TouchableOpacity
                style={styles.reviewButton}
                onPress={() =>
                  navigation.navigate('orderReview', {
                    order_id: item.id,
                    page: 'orderDetails',
                  })
                }>
                <Icon
                  type="FontAwesome"
                  name="star"
                  color={Colors.themColor}
                  size={20}
                />
                <Text style={styles.reviewText}>Review</Text>
              </TouchableOpacity>
            ) : (
              <View
                style={[styles.review_container, {width: responsiveWidth(90)}]}>
                <View style={styles.review_row}>
                  {item.review[0].img != '' ? (
                    <Image
                      style={styles.review_image}
                      source={{uri: item.review[0].img}}
                    />
                  ) : (
                    <Image
                      style={styles.review_image}
                      source={require('../../assets/images/profile.png')}
                    />
                  )}

                  <View style={styles.review_textContainer}>
                    <Text numberOfLines={2} style={[styles.review_text_bold]}>
                      {item.review[0].name}
                    </Text>
                    <Text numberOfLines={2} style={styles.review_text}>
                      {item.review[0].comment}
                    </Text>
                  </View>
                </View>

                <View style={styles.review_row_star}>
                  <View style={{marginLeft: responsiveWidth(16)}}>
                    <Rating
                      type="star"
                      readonly={true}
                      startingValue={item.review[0].average}
                      ratingCount={5}
                      imageSize={20}
                    />
                    {item.review[0].review}
                  </View>

                  <Text>{item.review[0].date}</Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
  paddingContainer: {
    padding: moderartescale(14),
  },
  statusContainer: {
    padding: moderartescale(5),
  },
  statusText: {
    fontSize: moderartescale(14),
    color: '#000000',
    fontWeight: '400',
    fontFamily: FONTS.Inter.medium,
  },
  infoContainer: {
    marginTop: moderartescale(10),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderartescale(5),
  },
  icon: {
    width: moderartescale(11),
    height: moderartescale(11),
  },
  infoText: {
    textAlign: 'center',
    marginLeft: moderartescale(8),
    fontSize: moderartescale(14),
    fontFamily: FONTS.Inter.regular,
  },
  divider: {
    borderWidth: moderartescale(1),
    borderColor: '#D9D9D9',
    marginVertical: moderartescale(10),
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: moderartescale(14),
  },
  itemImage: {
    width: moderartescale(52),
    height: moderartescale(53),
  },
  itemText: {
    fontSize: moderartescale(12),
    color: '#000000',
    marginLeft: moderartescale(10),
  },
  itemPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: moderartescale(150),
  },
  itemPrice: {
    fontSize: moderartescale(14),
    color: '#000000',
  },
  summaryContainer: {
    borderWidth: moderartescale(1),
    borderColor: Colors.themColor,
    borderRadius: moderartescale(14),
    width: moderartescale(346),
    height: verticalscale(155),
    justifyContent: 'center',
    alignItems: 'center',
    margin: moderartescale(5),
    // backgroundColor: 'green',
    // padding:moderartescale(14)
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: moderartescale(313),
  },
  summaryText: {
    fontSize: moderartescale(14),
    color: '#000000',
    fontWeight: '500',
    fontFamily: FONTS.Inter.regular,
  },
  totalContainer: {
    height: verticalscale(40),
    backgroundColor: Colors.themColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: moderartescale(10),
    borderRadius: moderartescale(5),
    width: moderartescale(313),
  },
  totalText: {
    fontSize: moderartescale(16),
    color: '#FFFFFF',
    fontFamily: FONTS.Inter.medium,
  },
  reviewButton: {
    width: moderartescale(342),
    height: verticalscale(35),
    borderWidth: moderartescale(1),
    borderColor: Colors.themColor,
    borderRadius: moderartescale(5),
    marginTop: moderartescale(20),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewText: {
    fontSize: moderartescale(14),
    color: Colors.themColor,
    marginLeft: moderartescale(10),
    fontFamily: FONTS.Inter.regular,
  },
  review_container: {
    width: '90%', // Adjust based on layout.width or other responsive needs
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: scale(10),
    marginTop: verticalscale(10),
    overflow: 'hidden',
    height: verticalscale(92),
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(4),
    marginBottom: responsiveHeight(20),
  },
  review_row: {
    flexDirection: 'row',
    // padding: scale(15),
    width: '100%',
  },
  review_row_star: {
    // padding: scale(15),
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  review_image: {
    marginLeft: scale(10),
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    resizeMode: 'cover',
    borderRadius: responsiveWidth(6),
  },
  review_textContainer: {
    flex: 1,
    marginLeft: scale(10),
  },
  review_text: {
    color: '#000000',
    fontSize: moderartescale(13),
    fontFamily: FONTS.Inter.regular,
  },
  review_text_bold: {
    color: '#000000',
    fontSize: responsiveFontSize(2),
    fontFamily: FONTS.Inter.bold,
  },
});
export default UserOrderDetials;

import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {moderartescale, verticalscale} from '../../Constants/PixelRatio';
import {FONTS} from '../../Constants/Fonts';
import {useNavigation} from '@react-navigation/native';
import {Rating} from 'react-native-ratings';
import Moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {showToastMsg, getData, setData} from '../../Service/localStorage';
import {postWithToken, postWithOutToken} from '../../Service/service';
import {useFocusEffect} from '@react-navigation/native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {ScrollView} from 'react-native-gesture-handler';
import {useRoute} from '@react-navigation/native';
import Loader from '../../Component/loader';

function OrderReview({props}) {
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
  const [product_quality_ratting, setProductQualityStar] = useState(3);
  const [puctuality_ratting, setPuctualityStar] = useState(3);
  const [service_ratting, setServiceStar] = useState(3);
  const [food_packing_ratting, setFoodPackingStar] = useState(3);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [order_id, setOrderId] = useState(null);
  const [redirectUrl, setRedirectUrl] = useState('');

  const route = useRoute();

  useFocusEffect(
    React.useCallback(() => {
      if (route.params != undefined) {
        if (route.params.order_id != undefined) {
          setOrderId(route.params.order_id);
          setRedirectUrl(route.params.page);
        }
      }
    }, [route.params]),
  );

  useEffect(() => {
    if (selectedLang != null) {
      setLanguage(LangValue);
      setEmail(userData.email);
    }
  }, [selectedLang]);

  function FineshProductQualityRatting(value) {
    console.log(value);
    setProductQualityStar(value);
  }

  function FineshPuctualityRatting(value) {
    setPuctualityStar(value);
  }

  function FineshServiceRatting(value) {
    setServiceStar(value);
  }

  function FineshFoodPackingRatting(value) {
    setFoodPackingStar(value);
  }

  const SubmitReview = () => {
    let flg = true;

    if (name.search(/\S/) == -1) {
      showToastMsg(
        language != null ? language['ENTER_NAME'] : 'Please enter name',
      );
      if (flg == true) {
        flg = false;
      }
      return false;
    }

    if (email.search(/\S/) == -1) {
      showToastMsg(
        language != null
          ? language['ENTER_EMAIL_ADDRESS']
          : 'Please enter email',
      );
      if (flg == true) {
        flg = false;
      }
      return false;
    } else if (email.search(/\S/) != -1) {
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
      if (reg.test(email) === false) {
        showToastMsg(
          language != null
            ? language['ENTER_VALID_EMAIL_ADDRESS']
            : 'Please enter valid email Id',
        );
        if (flg == true) {
          flg = false;
        }
        return false;
      }
    }

    if (message.search(/\S/) == -1) {
      showToastMsg(
        language != null ? language['ENETER_COMMENTS'] : 'Please enter message',
      );
      if (flg == true) {
        flg = false;
      }
      return false;
    }

    if (flg === true) {
      setLoader(true);
      postWithOutToken(baseUrl, 'module/order/rest-order', {
        f: 'addorderreview',
        userId: userData.id,
        orderId: order_id,
        quality: product_quality_ratting,
        punctuality: puctuality_ratting,
        service: service_ratting,
        packing: food_packing_ratting,
        username: name,
        useremail: email,
        usercomments: message,
      })
        .then(response => {
          setLoader(false);
          showToastMsg('Review Submitted Successfully');

          navigation.navigate(redirectUrl, {order_id: order_id});
        })
        .catch(error => {
          setLoader(false);
          console.log('Error : ', error);
        });
    }
  };
  return (
    <>
      <View
        style={{
          width: responsiveScreenWidth(100),
          height: responsiveScreenHeight(100),
          backgroundColor: '#FFFFFF',
        }}>
        <ScrollView>
          {viewloader === true ? <Loader /> : null}
          <View style={styles.container}>
            <Text style={styles.title}>Write A Review</Text>
            <View style={[styles.reviewSection, {width: moderartescale(300)}]}>
              <View style={styles.reviewRow}>
                <Text style={styles.row_text}>Product Quality</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignSelf: 'center',
                    marginVertical: 20,
                  }}>
                  <Rating
                    type="star"
                    startingValue={product_quality_ratting}
                    ratingCount={5}
                    imageSize={25}
                    showRating
                    onFinishRating={FineshProductQualityRatting}
                  />
                </View>
              </View>
              <View style={[styles.reviewRow, {marginTop: moderartescale(6)}]}>
                <Text style={styles.row_text}>Punctuality</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignSelf: 'center',
                    marginVertical: 20,
                  }}>
                  <Rating
                    type="star"
                    startingValue={puctuality_ratting}
                    ratingCount={5}
                    imageSize={25}
                    showRating
                    onFinishRating={FineshPuctualityRatting}
                  />
                </View>
              </View>
              <View style={[styles.reviewRow, {marginTop: moderartescale(6)}]}>
                <Text style={styles.row_text}>Service</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignSelf: 'center',
                    marginVertical: 20,
                  }}>
                  <Rating
                    type="star"
                    startingValue={service_ratting}
                    ratingCount={5}
                    imageSize={25}
                    showRating
                    onFinishRating={FineshServiceRatting}
                  />
                </View>
              </View>

              <View style={[styles.reviewRow, {marginTop: moderartescale(6)}]}>
                <Text style={styles.row_text}>Food Packing</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignSelf: 'center',
                    marginVertical: 20,
                  }}>
                  <Rating
                    type="star"
                    startingValue={food_packing_ratting}
                    ratingCount={5}
                    imageSize={25}
                    showRating
                    onFinishRating={FineshFoodPackingRatting}
                  />
                </View>
              </View>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Name"
                style={styles.input}
                onChangeText={text => setName(text)}
              />
              <TextInput
                placeholder="Email"
                style={[styles.input, {marginTop: moderartescale(14)}]}
                onChangeText={text => setEmail(text)}
              />
              <TextInput
                placeholder="Message"
                multiline={true}
                style={[
                  styles.input,
                  {
                    height: verticalscale(88),
                    marginTop: moderartescale(14),
                    textAlignVertical: 'top',
                  },
                ]}
                onChangeText={text => setMessage(text)}
              />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  viewloader === false ? SubmitReview() : null;
                }}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: moderartescale(14),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: responsiveScreenHeight(15),
  },
  row_text: {
    fontSize: moderartescale(14),
    color: '#000000',
    fontFamily: FONTS.Inter.regular,
  },
  title: {
    fontSize: moderartescale(15),
    color: '#000000',
    fontFamily: FONTS.Inter.medium,
  },
  reviewSection: {
    marginTop: moderartescale(10),
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: moderartescale(10),
  },
  inputContainer: {
    marginTop: moderartescale(15),
    alignItems: 'center',
  },
  input: {
    width: moderartescale(346),
    height: verticalscale(40),
    borderWidth: moderartescale(1),
    borderColor: '#CCCCCC',
    borderRadius: moderartescale(8),
    paddingHorizontal: moderartescale(10),
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: moderartescale(20),
  },
  button: {
    width: moderartescale(346),
    height: verticalscale(40),
    backgroundColor: '#F00049',
    borderRadius: moderartescale(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: moderartescale(14),
    color: '#FFFFFF',
  },
});

export default OrderReview;

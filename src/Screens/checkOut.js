import React, {useEffect, useState, useRef, useMemo} from 'react';
import ScreenHeader from '../Component/screenHeader';
import {
  StyleSheet,
  ScrollView,
  Image,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Pressable,
  useColorScheme,
} from 'react-native';
import {moderartescale, scale, verticalscale} from '../Constants/PixelRatio';
import {Icon, AppTextInput, RadioButton} from 'react-native-basic-elements';
import {FONTS} from '../Constants/Fonts';
import {Colors} from '../Constants/Colors';
import {useDispatch, useSelector} from 'react-redux';
import {showToastMsg, getData, setData} from '../Service/localStorage';
import {postWithToken, postWithOutToken} from '../Service/service';
import {useFocusEffect} from '@react-navigation/native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Loader from '../Component/loader';
import {useNavigation} from '@react-navigation/native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {useRoute} from '@react-navigation/native';
import {setCartDetails, setCartQuantity} from '../Store/Reducers/CommonReducer';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {Picker} from '@react-native-picker/picker';

function UserCheckout() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const colorScheme = useColorScheme();

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
    default_address,
    cartDetails,
  } = useSelector(state => state.common);
  const [color_theme, setColorTheme] = useState('#000000');
  const [color_theme_selected, setColorThemeSelected] = useState('#000000');
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
    preorder: true,
    preorderDate: '',
    preorderTime: '',
    preorderMenu: 0,
  });

  const [buyerDetails, setBuyerDetails] = useState({
    id: 0,
    preorder: true,
    name: '',
    last_name: '',
    email: '',
    cel: '',
    specialaddress: '',
    delievryaddress: '',
    notes: '',
    preorderDate: '',
    preorderTime: '',
  });

  const [discountInfo, setDiscountInfo] = useState({
    discounttext: '',
    discounttype: '',
    discountid: '',
  });
  const [discount, setDiscount] = useState(0.0);
  const [tips, setTips] = useState(0.0);
  const [cartFee, setCartFee] = useState([]);

  const [paymentMethod, setPaymentMethod] = useState({
    isLoading: true,
    list: [],
  });
  const [paymentId, setPaymentId] = useState('');

  const minDate = useMemo(() => {
    return new Date();
  }, [minDate]);
  const maxDate = useMemo(() => {
    let minD = new Date();
    return minD.setDate(minD.getDate() + 6);
  }, [minDate]);

  const [preorderDate, setPreorderDate] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [preordertimelist, setPreorderTimeList] = useState([]);
  const [preorderTime, setPreorderTime] = useState('');

  const [businessTime, setBusinessTime] = useState([]);

  useEffect(() => {
    if (colorScheme == 'dark') {
      setColorTheme('#ffffff');
      setColorThemeSelected('#000000');
    }
  }, []);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    //console.warn("A date has been picked: ", date);
    const dt = new Date(date);
    const dtx = dt.toISOString().split('T');
    console.log(dtx[0]);
    setPreorderDate(dtx[0]);
    onValueChange(dtx[0]);
    hideDatePicker();
  };

  useFocusEffect(
    React.useCallback(() => {
      setLanguage(LangValue);
    }, [selectedLang]),
  );

  useFocusEffect(
    React.useCallback(() => {
      if (cartDetails.length > 0) {
        setActiveBusiness(cartDetails[0].details);
        setCartDish({isLoading: false, list: cartDetails});
        FetchPaymentMothod(cartDetails[0].details.id, orderType);
        let cartQty = 0;
        for (const cartDish of cartDetails) {
          for (const dish of cartDish.dish) {
            cartQty += dish.quantity;
          }
        }
        setcartQuantity(cartQty);
        dispatch(setCartQuantity(cartQty));
        calCartTotal(cartDetails, cartDetails[0].details);
        let currentTime_now = new Date();
        GenrateTime(currentTime_now, cartDetails[0].details);
      }
    }, []),
  );

  const GenrateTime = (d, activeBusiness_val) => {
    let day = d.getDay() === 0 ? 7 : d.getDay();
    console.log(activeBusiness_val);
    let businessDaysObject = activeBusiness_val.schedule.sdays;

    let open =
      businessDaysObject[day].opens.hour +
      ':' +
      businessDaysObject[day].opens.minute;
    let close =
      businessDaysObject[day].closes.hour +
      ':' +
      businessDaysObject[day].closes.minute;
    let open2 =
      businessDaysObject[day].opens2.hour +
      ':' +
      businessDaysObject[day].opens2.minute;
    let close2 =
      businessDaysObject[day].closes2.hour +
      ':' +
      businessDaysObject[day].closes2.minute;

    let businessTime_arr = new Array();
    const minutesToAdjust = 15;
    const millisecondsPerMinute = 60000;
    let nowTime;
    let userTime1, userTime2, userTime3, userTime4;
    let date = new Date().toLocaleString('en-US', {
      timeZone: activeBusiness_val.timezone_code,
    });

    let date_obj_arr = date.split(',');
    let date_arr_date = date_obj_arr[0];
    let date_arr = date_arr_date.split('/');

    date = date_arr[2] + '-' + date_arr[0] + '-' + date_arr[1];
    let now = new Date(date);

    let mins = now.getMinutes();
    let quarterHours = Math.round(mins / 15);
    if (quarterHours === 4) {
      now.setHours(now.getHours() + 1);
    }
    let rounded = (quarterHours * 15) % 60;
    now.setMinutes(rounded);
    nowTime = new Date(
      now.getFullYear() +
        '-' +
        now.getMonth() +
        1 +
        '-' +
        now.getDate() +
        ' ' +
        now.getHours() +
        ':' +
        now.getMinutes(),
    );

    userTime1 = new Date(
      now.getFullYear() +
        '-' +
        now.getMonth() +
        1 +
        '-' +
        now.getDate() +
        ' ' +
        open,
    );
    userTime2 = new Date(
      now.getFullYear() +
        '-' +
        now.getMonth() +
        1 +
        '-' +
        now.getDate() +
        ' ' +
        close,
    );
    userTime3 = new Date(
      now.getFullYear() +
        '-' +
        now.getMonth() +
        1 +
        '-' +
        now.getDate() +
        ' ' +
        open2,
    );
    userTime4 = new Date(
      now.getFullYear() +
        1 +
        '-' +
        now.getMonth() +
        '-' +
        now.getDate() +
        ' ' +
        close2,
    );

    userTime2 = new Date(
      userTime2.valueOf() - minutesToAdjust * millisecondsPerMinute,
    );
    userTime4 = new Date(
      userTime4.valueOf() - minutesToAdjust * millisecondsPerMinute,
    );

    if (day == now.getDay()) {
      if (nowTime.getTime() < userTime1.getTime()) {
        let time;
        time = userTime1;
        while (time.getTime() <= userTime2.getTime()) {
          let hour;
          hour =
            time.getHours() <= 9 ? '0' + time.getHours() : '' + time.getHours();
          let minute;
          minute =
            time.getMinutes() <= 9
              ? '0' + time.getMinutes()
              : '' + time.getMinutes();
          businessTime_arr.push(hour + ':' + minute);
          time = new Date(
            time.valueOf() + minutesToAdjust * millisecondsPerMinute,
          );
        }
        time = userTime3;
        while (time.getTime() <= userTime4.getTime()) {
          let hour;
          hour =
            time.getHours() <= 9 ? '0' + time.getHours() : '' + time.getHours();
          let minute;
          minute =
            time.getMinutes() <= 9
              ? '0' + time.getMinutes()
              : '' + time.getMinutes();
          businessTime_arr.push(hour + ':' + minute);
          time = new Date(
            time.valueOf() + minutesToAdjust * millisecondsPerMinute,
          );
        }
      } else if (
        nowTime.getTime() >= userTime1.getTime() &&
        nowTime.getTime() <= userTime2.getTime()
      ) {
        let time;
        time = nowTime;
        time = new Date(
          time.valueOf() + minutesToAdjust * millisecondsPerMinute,
        );
        while (time.getTime() <= userTime2.getTime()) {
          let hour;
          hour =
            time.getHours() <= 9 ? '0' + time.getHours() : '' + time.getHours();
          let minute;
          minute =
            time.getMinutes() <= 9
              ? '0' + time.getMinutes()
              : '' + time.getMinutes();
          businessTime_arr.push(hour + ':' + minute);
          time = new Date(
            time.valueOf() + minutesToAdjust * millisecondsPerMinute,
          );
        }
        time = userTime3;
        while (time.getTime() <= userTime4.getTime()) {
          let hour;
          hour =
            time.getHours() <= 9 ? '0' + time.getHours() : '' + time.getHours();
          let minute;
          minute =
            time.getMinutes() <= 9
              ? '0' + time.getMinutes()
              : '' + time.getMinutes();
          businessTime_arr.push(hour + ':' + minute);
          time = new Date(
            time.valueOf() + minutesToAdjust * millisecondsPerMinute,
          );
        }
      } else if (nowTime.getTime() < userTime3.getTime()) {
        let time;
        time = userTime3;
        while (time.getTime() <= userTime4.getTime()) {
          let hour;
          hour =
            time.getHours() <= 9 ? '0' + time.getHours() : '' + time.getHours();
          let minute;
          minute =
            time.getMinutes() <= 9
              ? '0' + time.getMinutes()
              : '' + time.getMinutes();
          businessTime_arr.push(hour + ':' + minute);
          time = new Date(
            time.valueOf() + minutesToAdjust * millisecondsPerMinute,
          );
        }
      } else if (
        nowTime.getTime() >= userTime3.getTime() &&
        nowTime.getTime() <= userTime4.getTime()
      ) {
        let time;
        time = nowTime;
        time = new Date(
          time.valueOf() + minutesToAdjust * millisecondsPerMinute,
        );
        while (time.getTime() <= userTime4.getTime()) {
          let hour;
          hour =
            time.getHours() <= 9 ? '0' + time.getHours() : '' + time.getHours();
          let minute;
          minute =
            time.getMinutes() <= 9
              ? '0' + time.getMinutes()
              : '' + time.getMinutes();
          businessTime_arr.push(hour + ':' + minute);
          time = new Date(
            time.valueOf() + minutesToAdjust * millisecondsPerMinute,
          );
        }
      }
    } else {
      let time;
      time = userTime1;
      while (time.getTime() <= userTime2.getTime()) {
        let hour;
        hour =
          time.getHours() <= 9 ? '0' + time.getHours() : '' + time.getHours();
        let minute;
        minute =
          time.getMinutes() <= 9
            ? '0' + time.getMinutes()
            : '' + time.getMinutes();
        businessTime_arr.push(hour + ':' + minute);
        time = new Date(
          time.valueOf() + minutesToAdjust * millisecondsPerMinute,
        );
      }
      time = userTime3;
      while (time.getTime() <= userTime4.getTime()) {
        let hour;
        hour =
          time.getHours() <= 9 ? '0' + time.getHours() : '' + time.getHours();
        let minute;
        minute =
          time.getMinutes() <= 9
            ? '0' + time.getMinutes()
            : '' + time.getMinutes();
        businessTime_arr.push(hour + ':' + minute);
        time = new Date(
          time.valueOf() + minutesToAdjust * millisecondsPerMinute,
        );
      }
    }

    setBusinessTime(businessTime_arr);
    console.log(businessTime_arr);
  };

  const onValueChange = event => {
    let d = new Date(event);

    let day = d.getDay() === 0 ? 7 : d.getDay();

    this.businessDaysObject = activeBusiness.schedule.sdays;
    let open;
    let open2;
    let close;
    let close2;
    open =
      businessDaysObject[day].opens.hour +
      ':' +
      businessDaysObject[day].opens.minute;
    close =
      businessDaysObject[day].closes.hour +
      ':' +
      businessDaysObject[day].closes.minute;
    open2 =
      businessDaysObject[day].opens2.hour +
      ':' +
      businessDaysObject[day].opens2.minute;
    close2 =
      businessDaysObject[day].closes2.hour +
      ':' +
      businessDaysObject[day].closes2.minute;

    let businessTime_arr = new Array();
    const minutesToAdjust = 15;
    const millisecondsPerMinute = 60000;
    let nowTime;
    let userTime1, userTime2, userTime3, userTime4;
    let date;
    date = new Date().toLocaleString('en-US', {
      timeZone: activeBusiness.timezone_code,
    });
    let date_obj_arr = date.split(',');
    let date_arr_date = date_obj_arr[0];
    let date_arr = date_arr_date.split('/');

    date = date_arr[2] + '-' + date_arr[0] + '-' + date_arr[1];
    let now = new Date(date);
    let mins;
    mins = now.getMinutes();
    let quarterHours;
    quarterHours = Math.round(mins / 15);
    if (quarterHours === 4) {
      now.setHours(now.getHours() + 1);
    }
    let rounded;
    rounded = (quarterHours * 15) % 60;
    now.setMinutes(rounded);
    nowTime = new Date(
      now.getFullYear() +
        '-' +
        now.getMonth() +
        1 +
        '-' +
        now.getDate() +
        ' ' +
        now.getHours() +
        ':' +
        now.getMinutes(),
    );

    userTime1 = new Date(
      now.getFullYear() +
        '-' +
        now.getMonth() +
        1 +
        '-' +
        now.getDate() +
        ' ' +
        open,
    );
    userTime2 = new Date(
      now.getFullYear() +
        '-' +
        now.getMonth() +
        1 +
        '-' +
        now.getDate() +
        ' ' +
        close,
    );
    userTime3 = new Date(
      now.getFullYear() +
        '-' +
        now.getMonth() +
        1 +
        '-' +
        now.getDate() +
        ' ' +
        open2,
    );
    userTime4 = new Date(
      now.getFullYear() +
        1 +
        '-' +
        now.getMonth() +
        '-' +
        now.getDate() +
        ' ' +
        close2,
    );

    userTime2 = new Date(
      userTime2.valueOf() - minutesToAdjust * millisecondsPerMinute,
    );
    userTime4 = new Date(
      userTime4.valueOf() - minutesToAdjust * millisecondsPerMinute,
    );

    if (day === now.getDay()) {
      if (nowTime.getTime() < userTime1.getTime()) {
        let time;
        time = userTime1;
        while (time.getTime() <= userTime2.getTime()) {
          let hour;
          hour =
            time.getHours() <= 9 ? '0' + time.getHours() : '' + time.getHours();
          let minute;
          minute =
            time.getMinutes() <= 9
              ? '0' + time.getMinutes()
              : '' + time.getMinutes();
          this.businessTime.push(hour + ':' + minute);
          time = new Date(
            time.valueOf() + minutesToAdjust * millisecondsPerMinute,
          );
        }
        time = userTime3;
        while (time.getTime() <= userTime4.getTime()) {
          let hour;
          hour =
            time.getHours() <= 9 ? '0' + time.getHours() : '' + time.getHours();
          let minute;
          minute =
            time.getMinutes() <= 9
              ? '0' + time.getMinutes()
              : '' + time.getMinutes();
          businessTime_arr.push(hour + ':' + minute);
          time = new Date(
            time.valueOf() + minutesToAdjust * millisecondsPerMinute,
          );
        }
      } else if (
        nowTime.getTime() >= userTime1.getTime() &&
        nowTime.getTime() <= userTime2.getTime()
      ) {
        let time;
        time = nowTime;
        time = new Date(
          time.valueOf() + minutesToAdjust * millisecondsPerMinute,
        );
        while (time.getTime() <= userTime2.getTime()) {
          let hour;
          hour =
            time.getHours() <= 9 ? '0' + time.getHours() : '' + time.getHours();
          let minute;
          minute =
            time.getMinutes() <= 9
              ? '0' + time.getMinutes()
              : '' + time.getMinutes();
          businessTime_arr.push(hour + ':' + minute);
          time = new Date(
            time.valueOf() + minutesToAdjust * millisecondsPerMinute,
          );
        }
        time = userTime3;
        while (time.getTime() <= userTime4.getTime()) {
          let hour;
          hour =
            time.getHours() <= 9 ? '0' + time.getHours() : '' + time.getHours();
          let minute;
          minute =
            time.getMinutes() <= 9
              ? '0' + time.getMinutes()
              : '' + time.getMinutes();
          businessTime_arr.push(hour + ':' + minute);
          time = new Date(
            time.valueOf() + minutesToAdjust * millisecondsPerMinute,
          );
        }
      } else if (nowTime.getTime() < userTime3.getTime()) {
        let time;
        time = userTime3;
        while (time.getTime() <= userTime4.getTime()) {
          let hour;
          hour =
            time.getHours() <= 9 ? '0' + time.getHours() : '' + time.getHours();
          let minute;
          minute =
            time.getMinutes() <= 9
              ? '0' + time.getMinutes()
              : '' + time.getMinutes();
          businessTime_arr.push(hour + ':' + minute);
          time = new Date(
            time.valueOf() + minutesToAdjust * millisecondsPerMinute,
          );
        }
      } else if (
        nowTime.getTime() >= userTime3.getTime() &&
        nowTime.getTime() <= userTime4.getTime()
      ) {
        let time;
        time = nowTime;
        time = new Date(
          time.valueOf() + minutesToAdjust * millisecondsPerMinute,
        );
        while (time.getTime() <= userTime4.getTime()) {
          let hour;
          hour =
            time.getHours() <= 9 ? '0' + time.getHours() : '' + time.getHours();
          let minute;
          minute =
            time.getMinutes() <= 9
              ? '0' + time.getMinutes()
              : '' + time.getMinutes();
          businessTime_arr.push(hour + ':' + minute);
          time = new Date(
            time.valueOf() + minutesToAdjust * millisecondsPerMinute,
          );
        }
      }
    } else {
      let time;
      time = userTime1;
      while (time.getTime() <= userTime2.getTime()) {
        let hour;
        hour =
          time.getHours() <= 9 ? '0' + time.getHours() : '' + time.getHours();
        let minute;
        minute =
          time.getMinutes() <= 9
            ? '0' + time.getMinutes()
            : '' + time.getMinutes();
        businessTime_arr.push(hour + ':' + minute);
        time = new Date(
          time.valueOf() + minutesToAdjust * millisecondsPerMinute,
        );
      }
      time = userTime3;
      while (time.getTime() <= userTime4.getTime()) {
        let hour;
        hour =
          time.getHours() <= 9 ? '0' + time.getHours() : '' + time.getHours();
        let minute;
        minute =
          time.getMinutes() <= 9
            ? '0' + time.getMinutes()
            : '' + time.getMinutes();
        businessTime_arr.push(hour + ':' + minute);
        time = new Date(
          time.valueOf() + minutesToAdjust * millisecondsPerMinute,
        );
      }
    }

    setBusinessTime(businessTime_arr);
  };

  const FetchPaymentMothod = (bid, orderType_val) => {
    postWithOutToken(baseUrl, 'module/business/rest-business', {
      f: 'checkpayment',
      langId: selectedLang,
      bid: bid,
    })
      .then(response => {
        let paymentResponse = response;
        let payment_arr = [];
        for (let j = 0; j < paymentResponse.length; j++) {
          let pflag = false;
          if (orderType_val == 1 && paymentResponse[j].is_delivery == 1) {
            pflag = true;
          } else if (orderType_val == 2 && paymentResponse[j].is_pickup == 1) {
            pflag = true;
          } else if (orderType_val == 3) {
            pflag = true;
          }

          if (pflag) {
            let paymentc = new Object();
            paymentc.id = paymentResponse[j].pid;
            paymentc.name = paymentResponse[j].name;
            paymentc.displayName = response[j].displayName;
            paymentc.active = false;
            paymentc.credential = paymentResponse[j].credential;

            if (paymentc.id === '1') {
              payment_arr.push(paymentc);
            }
          }
        }

        setPaymentMethod({isLoading: false, list: payment_arr});
      })
      .catch(error => {
        console.log('Error : ', error);
      });
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

  const SelectPayment = val => {
    if (!checkValidation()) {
      return false;
    }

    setPaymentId(val.id);

    let payment_arr = JSON.parse(JSON.stringify(paymentMethod.list));

    for (let i = 0; i < payment_arr.length; i++) {
      if (payment_arr[i].id == val.id) {
        payment_arr[i].active = true;
      } else {
        payment_arr[i].active = false;
      }
    }

    setPaymentMethod({isLoading: false, list: payment_arr});
  };

  const checkValidation = () => {
    let flg = true;

    if (default_address.id == undefined) {
      showToastMsg('Please Add Address');
      return false;
    } else {
      setBuyerDetails({
        id: userData.id,
        preorder: false,
        name: userData.name,
        last_name: '',
        email: userData.email,
        cel: userData.cel,
        specialaddress: '',
        delievryaddress: default_address.address,
        notes: '',
        preorderTime: preorderTime,
        preorderDate: preorderDate,
      });
    }

    if (preorderDate == '') {
      showToastMsg('Please Select Date');
      return false;
    }

    if (preorderTime == '') {
      showToastMsg('Please Select Time');
      return false;
    }

    return flg;
  };

  const CheckallDetails = () => {
    let flg = true;

    if (paymentId == '') {
      showToastMsg('Please Select Payment Method');
      flg = false;
      return false;
    }

    if (default_address.id == undefined) {
      showToastMsg('Please Add Address');
      return false;
    } else {
      setBuyerDetails({
        id: userData.id,
        preorder: false,
        name: userData.name,
        last_name: '',
        email: userData.email,
        cel: userData.cel,
        specialaddress: '',
        delievryaddress: default_address.address,
        notes: '',
        preorderTime: preorderTime,
        preorderDate: preorderDate,
      });
    }

    if (preorderDate == '') {
      showToastMsg('Please Select Date');
      flg = false;
      return false;
    }

    if (preorderTime == '') {
      showToastMsg('Please Select Time');
      flg = false;
      return false;
    }

    if (flg === true) {
      placeOrder();
    }
  };

  const placeOrder = () => {
    let location = activeBusiness.location;
    let Search = {
      lat: location.latitud,
      lng: location.longitud,
      search_address: activeBusiness.street,
      order_type: orderType,
    };

    let postData = {
      f: 'react_placeorder',
      langId: 1,
      userId: buyerDetails.id,
      CartDish: JSON.stringify(CartDish.list),
      cartFee: JSON.stringify(cartFee),
      BuyerDetails: JSON.stringify(buyerDetails),
      deliveryDetails: JSON.stringify({
        minimum: activeBusiness.minimumfee,
        delivery: 0.0,
      }),
      Search: JSON.stringify(Search),
      paymentMethod: JSON.stringify(paymentMethod.list),
      rewardWallet: JSON.stringify({}),
      sourcetype: 'App',
      sourcetypename: JSON.stringify({}),
      discountInfo: JSON.stringify(discountInfo),
      txnId: '',
      extraJson: JSON.stringify({}),
    };

    Alert.alert('Coming Soon', 'This Section we will implement soon', [
      {
        text: 'Ok',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
    ]);

    console.log(postData);

    return false;

    /*setBuyerDetails({id: 0, preorder: false, name: "", last_name: "", email: "", cel: "", specialaddress: "", delievryaddress: "", notes: ""});
    setDiscountInfo({discounttext: '', discounttype: '', discountid: ''});
    setDiscount(0.00);
    setTips(0.00);
    setCartFee([]);

    setPaymentMethod({isLoading: true, list: []});
    setPaymentId("");

    navigation.navigate('orderSuccessfull', {orderId: '31714'})***/

    setLoader(true);

    postWithOutToken(baseUrl, 'module/place/rest-place', postData)
      .then(response => {
        setLoader(false);
        console.log(response);
        setBuyerDetails({
          id: 0,
          preorder: false,
          name: '',
          last_name: '',
          email: '',
          cel: '',
          specialaddress: '',
          delievryaddress: '',
          notes: '',
        });
        setDiscountInfo({discounttext: '', discounttype: '', discountid: ''});
        setDiscount(0.0);
        setTips(0.0);
        setCartFee([]);

        setPaymentMethod({isLoading: true, list: []});
        setPaymentId('');

        navigation.navigate('orderSuccessfull', {orderId: response[0]});
      })
      .catch(error => {
        console.log('Error : ', error);
      });
  };

  return (
    <>
      <ScreenHeader title="Checkout" back_display={true} />
      {viewloader === true ? <Loader /> : null}

      <ScrollView style={styles.container}>
        {default_address != null &&
        userData != null &&
        default_address.id != undefined ? (
          <View style={styles.addressContainer}>
            <View style={styles.addressInfo}>
              <Icon type="Feather" name="home" color="#000000" size={20} />
              <View style={styles.addressText}>
                <Text style={styles.addressLine}>
                  {default_address.address}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('addresslist', {page: 'cartCheckout'})
              }
              style={styles.editButton}>
              <Icon type="EvilIcon" name="pencil" color="#F00049" size={22} />
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: moderartescale(15),
            }}>
            <TouchableOpacity
              style={styles.newButton}
              onPress={() =>
                navigation.navigate('addresslist', {page: 'cartCheckout'})
              }>
              <Text style={styles.button_text}>Add Addrerss</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.dateTimeContainer}>
          <Text style={styles.selectDateTimeTitle}>Select Date And Time</Text>
          <View
            style={{
              marginBottom: responsiveHeight(1),
              paddingVertical: responsiveHeight(1),
              flexDirection: 'row',
              display: 'flex',
            }}>
            <View
              style={{
                width: responsiveWidth(98),
                marginHorizontal: responsiveWidth(1),
              }}>
              <Pressable onPress={showDatePicker}>
                <AppTextInput
                  inputStyle={{
                    paddingLeft: 10,
                    color: Colors.black,
                    fontFamily: FONTS.Inter.bold,
                    fontSize: responsiveFontSize(1.5),
                  }}
                  placeholder="Select Date"
                  value={preorderDate}
                  editable={false}
                  inputContainerStyle={{
                    height: responsiveHeight(6),
                  }}
                  onRightIconPress={showDatePicker}
                  rightAction={
                    <Icon
                      name="calendar"
                      type="AntDesign"
                      style={{color: Colors.btn_color}}
                    />
                  }
                  placeholderTextColor={Colors.black}
                />
              </Pressable>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                minimumDate={minDate}
                maximumDate={maxDate}
              />
            </View>
          </View>
        </View>

        <View
          style={{
            backgroundColor: '#ffffff',
            paddingHorizontal: responsiveWidth(1),
          }}>
          <View
            style={{
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: Colors.grey,
              borderRadius: 10,
              marginBottom: responsiveHeight(2),
            }}>
            <Picker
              selectedValue={preorderTime}
              onValueChange={(itemValue, itemIndex) =>
                setPreorderTime(itemValue)
              }
              style={{
                backgroundColor: Colors.white,
                color: color_theme_selected,
                paddingHorizontal: responsiveWidth(2),
              }}
              dropdownIconColor={color_theme_selected}>
              <Picker.Item key={'01'} label={'Select Time'} value={''} />
              {businessTime.map((item, index) => {
                return (
                  <Picker.Item
                    key={index}
                    style={{color: color_theme}}
                    label={item}
                    value={item}
                  />
                );
              })}
            </Picker>
          </View>
        </View>

        <View style={styles.orderDetailsContainer}>
          {CartDish.list.map((cartdish, cartindex) => {
            return cartdish.dish.map((cdish, dishindex) => {
              return cdish.data.map((dish, dataindex) => {
                let dish_image = require('../assets/images/no-image.png');

                if (dish.is_img == 1) {
                  dish_image = {uri: dish.img};
                } else if (dish.is_img1 == 1) {
                  dish_image = {uri: dish.img1};
                } else if (dish.is_img2 == 1) {
                  dish_image = {uri: dish.img2};
                }

                return (
                  <View key={'dish_' + dataindex} style={styles.orderItem}>
                    <View style={styles.orderItemInfo}>
                      <Image
                        style={styles.orderItemImage}
                        source={dish_image}
                      />
                      <Text style={styles.orderItemName}> {dish.name}</Text>
                    </View>
                    <View style={styles.orderItemPriceContainer}>
                      <Text style={styles.orderItemQuantity}>
                        {dish.quantity}
                      </Text>
                      <Text style={styles.orderItemPrice}>
                        {activeBusiness != null
                          ? activeBusiness.currency_symbol
                          : null}
                        {' : '}
                        {dish.total}
                      </Text>
                    </View>
                  </View>
                );
              });
            });
          })}
        </View>

        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Subtotal</Text>
            <Text style={styles.summaryText}>
              {activeBusiness != null ? activeBusiness.currency_symbol : null} :
              {CartSubTotal}
            </Text>
          </View>

          {cartFee.map((cartfee, index) => {
            return (
              <View key={'carefee_' + index}>
                {cartfee.discount > 0 ? (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryText}>Discount</Text>
                    <Text style={styles.summaryText}>
                      {activeBusiness != null
                        ? activeBusiness.currency_symbol
                        : null}{' '}
                      : {cartfee.discount}
                    </Text>
                  </View>
                ) : null}

                {cartfee.taxprice > 0 ? (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryText}>Tax ({cartfee.tax}%)</Text>
                    <Text style={styles.summaryText}>
                      {' '}
                      {activeBusiness != null
                        ? activeBusiness.currency_symbol
                        : null}{' '}
                      : {cartfee.taxprice}
                    </Text>
                  </View>
                ) : null}
                {cartfee.servicefeeprice > 0 ? (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryText}>
                      Service Fee ({cartfee.servicefee}%)
                    </Text>
                    <Text style={styles.summaryText}>
                      {' '}
                      {activeBusiness != null
                        ? activeBusiness.currency_symbol
                        : null}{' '}
                      : {cartfee.servicefeeprice}
                    </Text>
                  </View>
                ) : null}

                {cartfee.tips > 0 ? (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryText}>Tips</Text>
                    <Text style={styles.summaryText}>
                      {' '}
                      {activeBusiness != null
                        ? activeBusiness.currency_symbol
                        : null}{' '}
                      : {cartfee.tips}
                    </Text>
                  </View>
                ) : null}

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryText}>Total</Text>
                  <Text style={styles.summaryText}>
                    {activeBusiness != null
                      ? activeBusiness.currency_symbol
                      : null}{' '}
                    : {cartfee.total}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <View
          style={{
            marginVertical: responsiveHeight(2),
            paddingHorizontal: responsiveWidth(2),
          }}>
          <Text
            style={{
              fontFamily: FONTS.Inter.bold,
              fontSize: responsiveFontSize(2),
              color: Colors.black,
              marginBottom: responsiveHeight(2),
            }}>
            {language != null ? language['PAYMENT_METHOD'] : 'Payment Method'}
          </Text>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {paymentMethod.isLoading === false && paymentMethod.list.length > 0
              ? paymentMethod.list.map((item, index) => {
                  return (
                    <View key={'pay_' + index}>
                      <Text
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginRight: responsiveWidth(1),
                          fontFamily: FONTS.Inter.bold,
                          fontSize: responsiveFontSize(2),
                          color: Colors.black,
                        }}>
                        <RadioButton
                          selected={item.active}
                          onChange={() => {
                            SelectPayment(item);
                          }}
                          size={22}
                          style={[
                            styles.radioButton,
                            {marginRight: responsiveWidth(2)},
                          ]}
                          activeColor={Colors.themColor}
                          inactiveColor={Colors.themColor}
                        />
                        <Text style={{marginLeft: responsiveWidth(5)}}>
                          {item.displayName}
                        </Text>
                      </Text>
                    </View>
                  );
                })
              : null}
          </View>
        </View>

        <View style={styles.separatorContainer}>
          <View style={styles.separator} />
        </View>

        <View style={styles.placeOrderContainer}>
          <TouchableOpacity
            onPress={() => {
              CheckallDetails();
            }}
            style={styles.placeOrderButton}>
            <Text style={styles.placeOrderButtonText}>PLACE ORDER</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF0F5',
    height: responsiveScreenHeight(100),
    width: responsiveScreenWidth(100),
    flex: 1,
  },
  addressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: moderartescale(15),
    backgroundColor: '#FFFFFF',
  },
  addressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: responsiveWidth(80),
  },
  addressText: {
    paddingLeft: moderartescale(15),
  },
  addressLine: {
    fontSize: moderartescale(14),
    color: '#000000',
    fontFamily: FONTS.Inter.medium,
  },
  editButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    borderColor: '#F00049',
    borderWidth: moderartescale(1),
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateTimeContainer: {
    //height: verticalscale(180),
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsiveHeight(1),
  },
  selectDateTimeTitle: {
    fontSize: moderartescale(16),
    color: '#000000',
    padding: moderartescale(7),
    fontFamily: FONTS.Inter.medium,
  },
  dateTimeInput: {
    width: scale(345),
    height: verticalscale(45),
    flexDirection: 'row',
    padding: moderartescale(10),
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: moderartescale(1),
    borderColor: '#CCCCCC',
    borderRadius: moderartescale(8),
  },
  dateTimeText: {
    fontSize: moderartescale(14),
    color: '#000000',
    fontFamily: FONTS.Inter.regular,
  },
  scrollView: {
    backgroundColor: '#FFFFFF',
    marginTop: moderartescale(10),
    flex: 1,
    padding: moderartescale(18),
  },
  orderDetailsContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  orderItem: {
    padding: moderartescale(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderItemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderItemImage: {
    width: responsiveWidth(12),
    height: responsiveHeight(6),
    borderRadius: responsiveWidth(2),
  },
  orderItemName: {
    color: '#333333',
    marginLeft: moderartescale(13),
    fontSize: moderartescale(14),
    fontFamily: FONTS.Inter.regular,
  },
  orderItemPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: scale(100),
  },
  orderItemQuantity: {
    fontSize: moderartescale(14),
    color: '#000000',
    fontFamily: FONTS.Inter.regular,
  },
  orderItemPrice: {
    fontSize: moderartescale(14),
    color: '#000000',
    fontFamily: FONTS.Inter.regular,
  },
  summaryContainer: {
    padding: moderartescale(12),
    backgroundColor: '#FFFFFF',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: moderartescale(5),
  },
  summaryText: {
    fontSize: moderartescale(14),
    color: '#000000',
    fontFamily: FONTS.Inter.regular,
  },
  separatorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    width: scale(345),
    height: verticalscale(1),
    backgroundColor: '#D9D9D9',
  },
  placeOrderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: moderartescale(20),
  },
  placeOrderButton: {
    marginTop: moderartescale(10),
    width: scale(320),
    height: verticalscale(40),
    backgroundColor: '#F00049',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderartescale(10),
    padding: moderartescale(10),
    marginBottom: moderartescale(10),
  },
  placeOrderButtonText: {
    fontSize: moderartescale(15),
    color: '#FFFFFF',
    fontFamily: FONTS.Inter.semibold,
  },
  newButton: {
    width: responsiveWidth(60),
    height: responsiveHeight(5),
    backgroundColor: '#F00049',
    borderRadius: moderartescale(10),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button_text: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(2),
    // textAlign: 'center'
  },
});

export default UserCheckout;

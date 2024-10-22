import Businessitems from '../Component/items_business/businessItems';
import ScreenHeader from '../Component/screenHeader';
import React, {useEffect, useState, useRef} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {showToastMsg, getData, setData} from '../Service/localStorage';
import {postWithToken, postWithOutToken} from '../Service/service';
import {useFocusEffect} from '@react-navigation/native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Loader from '../Component/loader';
import {
  fonstSizeDynamic,
  moderartescale,
  verticalscale,
} from '../Constants/PixelRatio';
import {useNavigation} from '@react-navigation/native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {FONTS} from '../Constants/Fonts';
import {Colors} from '../Constants/Colors';

function FavoriteItem() {
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
    google_auto_complete_country,
  } = useSelector(state => state.common);
  const [viewloader, setLoader] = useState(false);
  const [language, setLanguage] = useState(null);
  const [business_list, setBusinessList] = useState({
    isLoading: true,
    list: [],
  });

  useFocusEffect(
    React.useCallback(() => {
      setLanguage(LangValue);
    }, [selectedLang]),
  );

  useFocusEffect(
    React.useCallback(() => {
      if (userData != null) {
        fetchFavBusList();
      }
    }, [userData]),
  );

  const fetchFavBusList = () => {
    postWithOutToken(baseUrl, 'module/business/rest-business', {
      f: 'react_allfav',
      langId: selectedLang,
      userId: userData.id,
    })
      .then(response => {
        console.log(response);
        if (response.status == true) {
          setBusinessList({
            isLoading: false,
            list: response.data,
          });
        }
      })
      .catch(error => {
        console.log('Error : ', error);
      });
  };

  const confirmLogin = () => {
    Alert.alert('Please Confirm', 'Login is required for this action', [
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Go to Login',
        onPress: () => {
          navigation.navigate('login');
        },
      },
    ]);
  };

  const addToFav = (bid, index) => {
    if (userData == null) {
      confirmLogin();
    } else {
      setLoader(true);
      postWithOutToken(baseUrl, 'module/business/rest-business', {
        f: 'addtofav',
        userId: userData.id,
        bId: bid,
      })
        .then(response => {
          setLoader(false);
          let data = JSON.parse(JSON.stringify(business_list.list));

          if (response.status === true) {
            data[index].addtofav = true;

            setBusinessList({
              isLoading: false,
              list: data,
            });
          } else {
            data[index].addtofav = false;
            setBusinessList({
              isLoading: false,
              list: data,
            });
          }
        })
        .catch(error => {
          console.log('Error : ', error);
        });
    }
  };

  return (
    <>
      <ScreenHeader title="Favorite" back_display={true} />
      {viewloader === true ? <Loader /> : null}
      {business_list.isLoading === false && business_list.list.length > 0 ? (
        <Businessitems item_data={business_list.list} addToFav={addToFav} />
      ) : business_list.isLoading === true && business_list.list.length == 0 ? (
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            marginVertical={responsiveHeight(2)}
            marginHorizontal={responsiveWidth(4)}>
            <SkeletonPlaceholder.Item
              width={responsiveWidth(45)}
              height={responsiveHeight(16)}
              marginRight={responsiveWidth(3)}
              borderRadius={10}
            />
            <SkeletonPlaceholder.Item
              width={responsiveWidth(45)}
              height={responsiveHeight(16)}
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
              width={responsiveWidth(45)}
              height={responsiveHeight(16)}
              marginRight={responsiveWidth(3)}
              borderRadius={10}
            />
            <SkeletonPlaceholder.Item
              width={responsiveWidth(45)}
              height={responsiveHeight(16)}
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
              width={responsiveWidth(45)}
              height={responsiveHeight(16)}
              marginRight={responsiveWidth(3)}
              borderRadius={10}
            />
            <SkeletonPlaceholder.Item
              width={responsiveWidth(45)}
              height={responsiveHeight(16)}
              marginRight={responsiveWidth(3)}
              borderRadius={10}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      ) : (
        <Text
          style={{
            marginTop: responsiveHeight(45),
            alignSelf: 'center',
            fontFamily: FONTS.bold,
            fontSize: responsiveFontSize(2.2),
            color: Colors.red,
          }}>
          No Record Found
        </Text>
      )}
    </>
  );
}
export default FavoriteItem;

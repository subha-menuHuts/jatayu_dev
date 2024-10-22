import MainContainerHeader from '../Component/businessDetails/mainContainer';
import ScreenHeader from '../Component/screenHeader';
import TabviewDetails from '../Component/businessDetails/tabView';

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
import {useRoute} from '@react-navigation/native';

function BusinessDetails() {
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
    google_api_key,
    google_auto_complete_country,
  } = useSelector(state => state.common);
  const [viewloader, setLoader] = useState(false);
  const [language, setLanguage] = useState(null);
  const [tab_page, setTabPage] = useState(null);
  const [business_data, setBusinessData] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      setLanguage(LangValue);
    }, [selectedLang]),
  );

  useFocusEffect(
    React.useCallback(() => {
      if (route.params != undefined) {
        if (route.params.data != undefined) {
          setBusinessData(route.params.data);
        }
        if (route.params.tab_page != undefined) {
          setTabPage(route.params.tab_page);
        }
      }
    }, [route.params]),
  );

  const addToFav = bid => {
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
          let data = JSON.parse(JSON.stringify(business_data));

          if (response.status === true) {
            data.addtofav = true;

            setBusinessData(data);
          } else {
            data.addtofav = false;
            setBusinessData(data);
          }
        })
        .catch(error => {
          console.log('Error : ', error);
        });
    }
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

  return (
    <View style={styles.main_container}>
      <ScreenHeader title="Business Details" back_display={true} />
      {viewloader === true ? <Loader /> : null}
      <View
        style={{
          padding: moderartescale(6),
          flex: 1,
        }}>
        {business_data != null ? (
          <>
            <MainContainerHeader
              business_data={business_data}
              addToFav={addToFav}
            />
            <View
              style={{
                height: responsiveHeight(100),
              }}>
              <TabviewDetails
                business_data={business_data}
                tab_page={tab_page}
              />
            </View>
          </>
        ) : (
          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              marginVertical={responsiveHeight(2)}
              marginHorizontal={responsiveWidth(4)}>
              <SkeletonPlaceholder.Item
                width={responsiveWidth(90)}
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
                width={responsiveWidth(90)}
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
                width={responsiveWidth(90)}
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
                width={responsiveWidth(90)}
                height={responsiveHeight(16)}
                marginRight={responsiveWidth(3)}
                borderRadius={10}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main_container: {
    width: responsiveWidth(100),
    flex: 1,
    // height:responsiveHeight(100),
    // padding: moderartescale(6),
    backgroundColor: '#FFFFFF',
  },
});
export default BusinessDetails;

import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {moderartescale, scale} from '../Constants/PixelRatio';
import {FONTS} from '../Constants/Fonts';

import React, {useEffect, useState, useRef} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
  Linking,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {postWithToken, postWithOutToken} from '../Service/service';
import ScreenHeader from '../Component/screenHeader';
import {showToastMsg, getData, setData} from '../Service/localStorage';
import Loader from '../Component/loader';
import {Colors} from '../Constants/Colors';
import {useFocusEffect} from '@react-navigation/native';

function Helpscreen() {
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
  const [data, setData] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      setLanguage(LangValue);
    }, [selectedLang]),
  );

  useEffect(() => {
    FetchData();
  }, []);

  const FetchData = () => {
    postWithOutToken(baseUrl, 'module/common/rest-common', {
      f: 'react_SiteSettingsContactData',
    })
      .then(response => {
        console.log(response);
        if (response.status == true) {
          setData(response.data);
        }
      })
      .catch(error => {
        console.log('Error : ', error);
      });
  };

  const OpenEmail = () => {
    Linking.openURL('mailto:' + data.admin_email);
  };

  const OpenWhatsApp = () => {
    Linking.openURL('whatsapp://send?text=hello&phone=' + data.whatsapp_number);
  };

  return (
    <>
      <View
        style={{
          width: responsiveScreenWidth(100),
          height: responsiveScreenHeight(100),
          backgroundColor: '#FFF0F5',
        }}>
        <ScreenHeader title="Contact Us" back_display={true} />
        <View>
          <TouchableOpacity
            onPress={() => {
              OpenWhatsApp();
            }}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: moderartescale(10),
              backgroundColor: '#FFFFFF',
              //  backgroundColor:'green'
            }}>
            <Image
              source={require('../assets/dynamic/whatsapp.png')}
              style={{
                height: scale(40),
                width: scale(40),
                resizeMode: 'contain',
              }}
            />

            <Text
              style={{
                fontFamily: FONTS.Inter.semibold,
                color: '#000000',
                fontSize: moderartescale(20),
                marginLeft: moderartescale(10),
              }}>
              {' '}
              WhatsApp
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              OpenEmail();
            }}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: moderartescale(10),
              backgroundColor: '#FFFFFF',
              marginTop: moderartescale(7),
            }}>
            <Image
              source={require('../assets/dynamic/gmail.png')}
              style={{
                height: scale(30),
                width: scale(30),
                resizeMode: 'contain',
              }}
            />

            <Text
              style={{
                fontFamily: FONTS.Inter.semibold,
                color: '#000000',
                fontSize: moderartescale(20),
                marginLeft: moderartescale(10),
              }}>
              {' '}
              Email
            </Text>
          </TouchableOpacity>
          <View
            style={{
              height: '100%',
              backgroundColor: '#FFFFFF',
              marginTop: moderartescale(7),
            }}></View>
        </View>
      </View>
    </>
  );
}

export default Helpscreen;

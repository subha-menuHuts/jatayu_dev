import ScreenHeader from '../Component/screenHeader';
import {
  fonstSizeDynamic,
  scale,
  verticalscale,
  moderartescale,
} from '../Constants/PixelRatio';

import {AppTextInput, Icon} from 'react-native-basic-elements';
import {FONTS} from '../Constants/Fonts';
import {Colors} from '../Constants/Colors';

import React, {useEffect, useState, useRef} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
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

import {useNavigation} from '@react-navigation/native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

function ForgotPassword() {
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
  const [email, setEmail] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      setLanguage(LangValue);
    }, [selectedLang]),
  );

  const ForgotAction = () => {
    let flg = true;
    if (email.search(/\S/) == -1) {
      showToastMsg(
        language != null ? language['ENTER_YOUR_EMAIL'] : 'Please enter email',
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

    if (flg == true) {
      setLoader(true);
      postWithOutToken(baseUrl, 'module/user/rest-user', {
        f: 'forgot',
        email: email,
        langId: selectedLang,
      })
        .then(response => {
          console.log(response);
          setLoader(false);
          if (response.status == true) {
            setEmail('');
            showToastMsg(response.message);
            setTimeout(() => {
              navigation.navigate('login');
            }, 1000);
          } else {
            setEmail('');
            showToastMsg(response.message);
          }
        })
        .catch(error => {
          console.log('Error : ', error);
        });
    }
  };

  return (
    <>
      <ScreenHeader title="Forgot Password" back_display={true} />
      {viewloader === true ? <Loader /> : null}
      <View
        style={{
          alignItems: 'center',
          margin: moderartescale(15),
        }}>
        <Image
          source={require('../assets/images/forgot.png')}
          style={{
            width: responsiveWidth(60),
            height: responsiveHeight(30),
            resizeMode: 'contain',
          }}
        />

        <AppTextInput
          inputContainerStyle={styls.inputContainer}
          placeholder={language != null ? language['EMAIL'] : 'Email'}
          onChangeText={text => setEmail(text)}
          value={email}
        />
        <TouchableOpacity
          onPress={() => {
            viewloader === false ? ForgotAction() : null;
          }}
          style={styls.submit_button}>
          <Text
            style={{
              fontSize: moderartescale(16),
              fontWeight: '500',
              fontFamily: FONTS.Inter.bold,
              color: '#FFFFFF',
            }}>
            SUBMIT
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styls = StyleSheet.create({
  inputContainer: {
    width: moderartescale(340),
    height: moderartescale(40),
    borderColor: '#CCCCCC',
    borderWidth: moderartescale(1),
    borderRadius: moderartescale(10),
  },
  submit_button: {
    width: moderartescale(340),
    height: moderartescale(40),
    backgroundColor: '#F00049',
    borderRadius: moderartescale(10),
    margin: moderartescale(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default ForgotPassword;

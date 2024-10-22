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
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import ScreenHeader from '../Component/screenHeader';
import {
  clearUserData,
  setCartDetails,
  saveOrderType,
} from '../Store/Reducers/CommonReducer';
import {
  showToastMsg,
  getData,
  setData,
  removeData,
} from '../Service/localStorage';

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

function RemoveAccounut() {
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
  const [password, setPassword] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      setLanguage(LangValue);
    }, [selectedLang]),
  );

  const RemoveAction = () => {
    let flg = true;
    if (password.search(/\S/) == -1) {
      showToastMsg(
        language != null
          ? language['ENTER_PASSWORD']
          : 'Please enter your password',
      );
      if (flg == true) {
        flg = false;
      }
      return false;
    }

    if (flg == true) {
      setLoader(true);
      postWithOutToken(baseUrl, 'module/user/rest-user', {
        f: 'removeaccount',
        id: userData.id,
        password: password,
      })
        .then(response => {
          console.log(response);
          setLoader(false);
          if (response.status == true) {
            showToastMsg(response.msg);
            handleLogout();
          } else {
            showToastMsg(response.msg);
          }
        })
        .catch(error => {
          console.log('Error : ', error);
        });
    }
  };

  const handleLogout = () => {
    setLoader(true);
    removeData('userDetails');
    removeData('userToken');
    removeData('selectedLang');
    removeData('LangValue');
    removeData('cartDetails');
    removeData('orderType');
    dispatch(clearUserData());
    dispatch(saveOrderType(null));
    dispatch(setCartDetails([]));

    navigation.reset({
      index: 0,
      routes: [{name: 'dashboard'}],
    });

    setTimeout(() => {
      setLoader(false);
      navigation.navigate('BHome');
    }, 1000);
  };

  return (
    <View
      style={{
        width: responsiveScreenWidth(100),
        height: responsiveScreenHeight(100),
        backgroundColor: '#FFF0F5',
      }}>
      <ScreenHeader title="Remove Account" back_display={true} />
      {viewloader === true ? <Loader /> : null}
      <View
        style={{
          width: responsiveScreenWidth(100),
          backgroundColor: '#FFFFFF',
        }}>
        <View style={styles.container}>
          <Image
            style={styles.image}
            source={require('../assets/dynamic/removeacc.png')}
          />

          <TextInput
            placeholder="Password"
            style={styles.input}
            secureTextEntry={true}
            onChangeText={text => setPassword(text)}
          />

          <TouchableOpacity
            onPress={() => {
              viewloader === false ? RemoveAction() : null;
            }}
            style={styles.submitButton}>
            <Text style={styles.submitButtonText}>SUBMIT</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderartescale(40),
  },
  image: {
    height: verticalscale(178),
    width: verticalscale(178),
  },
  input: {
    width: moderartescale(345), // 345px converted to percentage of screen width
    height: verticalscale(45),
    borderColor: '#CCCCCC',
    borderWidth: moderartescale(2),
    borderRadius: moderartescale(8),
    paddingHorizontal: moderartescale(10),
    marginTop: moderartescale(10),
  },
  submitButton: {
    width: moderartescale(345), // 345px converted to percentage of screen width
    height: verticalscale(42),
    backgroundColor: Colors.themColor,
    borderRadius: moderartescale(8),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: moderartescale(15),
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: moderartescale(14),
  },
});
export default RemoveAccounut;

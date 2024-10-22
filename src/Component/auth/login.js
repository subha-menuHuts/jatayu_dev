import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TextInput, useWindowDimensions} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {View} from 'react-native';
import {Icon} from 'react-native-basic-elements';
import {useNavigation} from '@react-navigation/native';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {FONTS} from '../../Constants/Fonts';
import {moderartescale, scale, verticalscale} from '../../Constants/PixelRatio';
import {useDispatch, useSelector} from 'react-redux';
import {setUserData, clearUserData} from '../../Store/Reducers/CommonReducer';
import {showToastMsg, getData, setData} from '../../Service/localStorage';
import {
  postWithOutToken,
  postWithOutTokenWithoutData,
} from '../../Service/service';
import {useFocusEffect} from '@react-navigation/native';
import Loader from '../../Component/loader';
import {Colors} from '../../Constants/Colors';
import {useRoute} from '@react-navigation/native';

function UserLogin() {
  const navigation = useNavigation();
  const route = useRoute();
  const layout = useWindowDimensions();

  const dispatch = useDispatch();
  const {baseUrl, siteUrl, deviceToken, selectedLang, LangValue} = useSelector(
    state => state.common,
  );

  const [language, setLanguage] = useState(null);
  const [page_redirect, setPageRedireact] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      if (route.params != undefined) {
        if (route.params.page != undefined) {
          setPageRedireact(route.params.page);
        }
      }
    }, [route.params]),
  );

  useFocusEffect(
    React.useCallback(() => {
      setLanguage(LangValue);
    }, [selectedLang]),
  );

  const [viewloader, setLoader] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      dispatch(clearUserData());
    }, []),
  );

  const handleLogin = () => {
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
        f: 'react_login',
        email: email,
        pass: password,
        langId: selectedLang,
        level: -1,
        device_id: deviceToken,
      })
        .then(response => {
          console.log(response);
          setLoader(false);
          if (response.status == true) {
            setEmail('');
            setPassword('');
            dispatch(setUserData(response));
            setData('userDetails', JSON.stringify(response.result));
            //setData("userToken", JSON.stringify(response.token));

            setTimeout(() => {
              if (page_redirect != null) {
                navigation.navigate(page_redirect);
              } else {
                navigation.navigate('BHome');
              }
            }, 200);
          } else {
            showToastMsg(response.message);
          }
        })
        .catch(error => {
          console.log('Error : ', error);
        });
    }

    //setTimeout(() => {navigation.navigate('Main')}, 200);
  };

  return (
    <>
      <View style={styls.main_container}>
        {viewloader === true ? <Loader /> : null}

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            // backgroundColor:'red'
          }}>
          <Text style={styls.logintext}>Welcome Back !</Text>
        </View>

        <View style={styls.inpt_main}>
          <View style={styls.input_field_outline}>
            <Icon
              type="Feather"
              name="mail"
              color={Colors.themColor}
              size={20}
            />
            <TextInput
              style={styls.inputfield}
              placeholder="Email"
              onChangeText={text => setEmail(text)}
            />
          </View>
          <View style={styls.input_field_outline}>
            <Icon
              type="Feather"
              name="lock"
              color={Colors.themColor}
              size={20}
            />
            <TextInput
              style={styls.inputfield}
              placeholder="Password"
              secureTextEntry={true}
              onChangeText={text => setPassword(text)}
            />
          </View>

          <TouchableOpacity
            onPress={() => {
              viewloader === false ? handleLogin() : null;
            }}
            style={styls.button}>
            <Text style={styls.login_text}>LOGIN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('forgotPassword')}>
            <Text style={styls.forget_text}>Forgot Password ?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
export default UserLogin;

const styls = StyleSheet.create({
  main_container: {
    height: responsiveHeight(50),
    width: responsiveWidth(100),
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
  },
  logintext: {
    fontSize: moderartescale(25),
    color: '#000000',
    fontFamily: FONTS.Inter.semibold,
  },
  inpt_main: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalscale(10),
  },
  input_field_outline: {
    width: scale(330),
    height: verticalscale(45),
    borderColor: '#CCCCCC',
    borderWidth: 2,
    display: 'flex',
    flexDirection: 'row',
    padding: moderartescale(10),
    alignItems: 'center',
    borderRadius: moderartescale(10),
    marginTop: 10,
  },
  inputfield: {
    width: '100%',
    height: scale(45),
    padding: moderartescale(10),
    color: '#000000',
  },
  button: {
    width: scale(330),
    height: verticalscale(45),
    display: 'flex',
    flexDirection: 'row',
    padding: moderartescale(10),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderartescale(10),
    marginTop: 10,
    backgroundColor: Colors.themColor,
  },
  login_text: {
    fontSize: moderartescale(14),
    color: '#FFFFFF',
    fontFamily: FONTS.Inter.semibold,
    fontWeight: '600',
  },
  forget_text: {
    marginTop: 10,
    color: Colors.themColor,
    fontSize: moderartescale(13),
    fontFamily: FONTS.Inter.regular,
  },
});

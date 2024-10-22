import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {View} from 'react-native';
import {Icon} from 'react-native-basic-elements';
import {useNavigation} from '@react-navigation/native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {FONTS} from '../../Constants/Fonts';
import {moderartescale, verticalscale, scale} from '../../Constants/PixelRatio';
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
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {useRoute} from '@react-navigation/native';

function Usersignup({setinitial}) {
  const navigation = useNavigation();
  const route = useRoute();
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
  const ref = useRef();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState({});
  const [password, setPassword] = useState('');
  const [viewloader, setLoader] = useState(false);

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

  const setSearchValue = details => {
    //console.log(details);
    let loc = {};

    for (let i = 0; i < details.address_components.length; i++) {
      for (let j = 0; j < details.address_components[i].types.length; j++) {
        if (details.address_components[i].types[j] === 'postal_code') {
          loc.zip = details.address_components[i].long_name;
        }
      }
    }

    loc.lat = details.geometry.location.lat;
    loc.lng = details.geometry.location.lng;
    loc.address = details.formatted_address;

    setAddress(details.formatted_address);
    setLocation(loc);
    ref.current?.setAddressText(details.formatted_address);
  };

  const SignupAction = () => {
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

    if (phone.search(/\S/) == -1) {
      showToastMsg(
        language != null
          ? language['ENTER_MOBILE']
          : 'Please enter phone number',
      );
      if (flg == true) {
        flg = false;
      }
      return false;
    } else {
      if (phone.length < 10) {
        showToastMsg('Please enter ten digit mobile number');
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

    if (address.search(/\S/) == -1) {
      showToastMsg(
        language != null
          ? language['ENTER_YOUR_ADDRESS']
          : 'Please enter your address',
      );
      if (flg == true) {
        flg = false;
      }
      return false;
    }

    /*console.log({
      f: 'react_userregister',
      langId: selectedLang,
      name: name,
      last_name: '',
      email: email,
      pass: password,
      address: address,
      cel: phone,
      location: location,
      device_id: deviceToken,
    });

    return false;*/

    if (flg == true) {
      setLoader(true);
      postWithOutToken(baseUrl, 'module/user/rest-user', {
        f: 'react_userregister',
        langId: selectedLang,
        name: name,
        last_name: '',
        email: email,
        pass: password,
        address: address,
        cel: phone,
        location: location,
        device_id: deviceToken,
      })
        .then(response => {
          console.log(response);
          setLoader(false);
          if (response.status == true) {
            showToastMsg(
              language != null
                ? language['SIGN_UP_SUCCESSFULLY']
                : 'Sign up Successfully',
            );
            setName('');
            setEmail('');
            setPhone('');
            setAddress('');
            setLocation({});
            setPassword('');

            //setinitial('login');

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
            // backgroundColor:'#000000'
          }}>
          <Text style={styls.top_signup}>Sign Up</Text>
        </View>

        <ScrollView keyboardShouldPersistTaps="always">
          <View style={styls.inpt_main}>
            <View style={styls.input_field_outline}>
              <Icon type="Feather" name="user" color="#F00049" size={20} />
              <TextInput
                style={styls.inputfield}
                className="bg-green w-full  p-[10px]"
                placeholder="Name"
                onChangeText={text => setName(text)}
              />
            </View>
          </View>

          <View
            style={{
              display: 'flex',
              zIndex: 999,
              flex: 1,
              width: '100%',
              marginTop: responsiveHeight(1.5),
            }}>
            <View
              style={{
                width: scale(330),
                borderColor: '#CCCCCC',
                borderWidth: moderartescale(2),
                borderRadius: moderartescale(8),
                paddingHorizontal: moderartescale(10),
                margin: 'auto',
              }}>
              <GooglePlacesAutocomplete
                ref={ref}
                keyboardShouldPersistTaps="handled"
                listViewDisplayed={false}
                keepResultsAfterBlur={false}
                placeholder="Search Address Location"
                fetchDetails={true}
                onPress={(data, details = null) => {
                  setSearchValue(details);
                }}
                query={{
                  key: google_api_key,
                  language: 'en',
                  components: 'country:in',
                }}
                onFail={error => console.log(error)}
                onNotFound={() => console.log('no results')}
                styles={{
                  textInput: {
                    width: moderartescale(330),
                    color: '#333',
                    borderRadius: responsiveWidth(2),
                    borderColor: Colors.black,
                    justifyContent: 'center',
                    display: 'flex',
                    height: verticalscale(40),
                  },
                }}
              />
            </View>
          </View>

          <View style={styls.inpt_main_two}>
            <View style={styls.input_field_outline}>
              <Icon type="Feather" name="mail" color="#F00049" size={20} />
              <TextInput
                style={styls.inputfield}
                placeholder="Email"
                onChangeText={text => setEmail(text)}
              />
            </View>
            <View style={styls.input_field_outline}>
              <Icon type="Feather" name="phone" color="#F00049" size={20} />
              <TextInput
                style={styls.inputfield}
                placeholder="Phone Number"
                maxLength={10}
                onChangeText={text => setPhone(text)}
              />
            </View>
            <View style={styls.input_field_outline}>
              <Icon type="Feather" name="lock" color="#F00049" size={20} />
              <TextInput
                style={styls.inputfield}
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={text => setPassword(text)}
              />
            </View>
            {/*navigation.navigate('homescreen')*/}
            <TouchableOpacity
              onPress={() => {
                viewloader === false ? SignupAction() : null;
              }}
              style={styls.button}>
              <Text style={styls.login_text}>SIGNUP</Text>
            </TouchableOpacity>
            <View style={styls.button_align}>
              <Text
                style={{
                  fontFamily: FONTS.Inter.semibold,
                  fontSize: responsiveFontSize(2),
                  color: '#CCCCCC',
                }}>
                Already have an account ?
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setinitial('login');
                }}>
                <Text
                  style={{
                    color: '#F00049',
                    fontSize: responsiveFontSize(2),
                    fontFamily: FONTS.Inter.bold,
                  }}>
                  {' '}
                  Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styls = StyleSheet.create({
  main_container: {
    height: responsiveHeight(65),
    width: responsiveWidth(100),
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    // right: 0,
    display: 'flex',
    // justifyContent: 'center',
    // alignItems: 'center'
  },
  logintext: {
    fontSize: moderartescale(25),
    width: scale(200),
    color: '#000000',
    fontFamily: FONTS.Inter.semibold,
  },
  inpt_main: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalscale(7),
  },
  inpt_main_two: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalscale(4),
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
    backgroundColor: '#F00049',
  },
  login_text: {
    fontSize: moderartescale(14),
    color: '#FFFFFF',
    fontFamily: FONTS.Inter.semibold,
    fontWeight: '600',
  },
  forget_text: {
    marginTop: 10,
    color: '#F00049',
    fontSize: moderartescale(13),
    fontFamily: FONTS.Inter.regular,
  },
  top_signup: {
    color: '#000000',
    fontSize: moderartescale(25),
    fontFamily: FONTS.Inter.medium,
    fontWeight: '600',
  },
  button_align: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: responsiveHeight(2),
  },
});
export default Usersignup;

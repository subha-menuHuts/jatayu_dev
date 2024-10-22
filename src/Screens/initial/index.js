//import liraries
import React, {useEffect} from 'react';
import {
  View,
  Image,
  Text,
  Platform,
  Alert,
  PermissionsAndroid,
} from 'react-native';
// import Styles from './style';
import {StatusBar} from 'react-native-basic-elements';
import {useNavigation} from '@react-navigation/native';
import Styles from './style';
import {useDispatch, useSelector} from 'react-redux';
import {getData, setData, removeData} from '../../Service/localStorage';
import {postWithOutToken} from '../../Service/service';
import {
  clearUserData,
  localstorage_TokenAdd,
  localstorage_UserdetailsAdd,
  setLanguage,
  setLanguageValue,
  setCartDetails,
  saveOrderType,
  setDefaultAddress,
} from '../../Store/Reducers/CommonReducer';
import Geocoder from 'react-native-geocoding';
import Geolocation from '@react-native-community/geolocation';
import {PERMISSIONS, request} from 'react-native-permissions';

// create a component
const Initial = props => {
  const style = Styles();
  const navigation = useNavigation();

  const dispatch = useDispatch();
  const {
    baseUrl,
    userData,
    userToken,
    cartDetails,
    selectedLang,
    default_address,
    google_api_key,
    google_auto_complete_country,
  } = useSelector(state => state.common);

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('main');
    }, 2000);
  }, []);

  useEffect(() => {
    /*removeData('userDetails');
    removeData('userToken');
    removeData('selectedLang');
    removeData('LangValue');
    removeData('orderType');
    removeData('cartDetails');
    removeData('default_address');
    dispatch(setDefaultAddress(null));
    dispatch(setCartDetails([]));
    dispatch(clearUserData());*/

    getData('orderType').then(Success => {
      if (Success) {
        dispatch(saveOrderType(JSON.parse(Success)));
      } else {
      }
    });

    getData('cartDetails').then(cartSuccess => {
      if (cartSuccess) {
        dispatch(setCartDetails(JSON.parse(cartSuccess)));
      } else {
      }
    });

    getData('default_address').then(addressSuccess => {
      if (addressSuccess) {
        dispatch(setDefaultAddress(JSON.parse(addressSuccess)));
      } else {
      }
    });

    getData('selectedLang').then(selectedLangSuccess => {
      if (selectedLangSuccess) {
        postWithOutToken(baseUrl, 'module/lang/rest-lang', {
          f: 'fetchlang',
        })
          .then(response => {
            setData('selectedLang', JSON.stringify(selectedLang));
            setData('LangValue', JSON.stringify(response.data[selectedLang]));
            dispatch(setLanguageValue(response.data[selectedLang]));
            dispatch(setLanguage(selectedLang));
          })
          .catch(error => {
            console.log('Error : ', error);
          });
      } else {
        postWithOutToken(baseUrl, 'module/lang/rest-lang', {
          f: 'fetchlang',
        })
          .then(response => {
            setData('selectedLang', JSON.stringify(selectedLang));
            setData('LangValue', JSON.stringify(response.data[selectedLang]));
            dispatch(setLanguageValue(response.data[selectedLang]));
            dispatch(setLanguage(selectedLang));
          })
          .catch(error => {
            console.log('Error : ', error);
          });
      }
    });

    getData('userDetails').then(respSuccess => {
      if (respSuccess) {
        dispatch(localstorage_UserdetailsAdd(JSON.parse(respSuccess)));
        setTimeout(() => {
          props.navigation.navigate('main');
        }, 3000);
      } else {
        removeData('userDetails');
        removeData('userToken');
        removeData('orderType');
        dispatch(clearUserData());
        dispatch(saveOrderType(null));

        selocation();
      }
    });
  }, []);

  function selocation() {
    Geocoder.init(google_api_key); // use a valid API key
    try {
      request(
        Platform.select({
          android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        }),
      ).then(res => {
        if (res == 'granted') {
          Geolocation.getCurrentPosition(info => {
            //getting the Latitude from the location json
            setTimeout(() => {
              props.navigation.navigate('main');
            }, 1000);
          });
        } else {
          console.log('Location is not enabled');
          setTimeout(() => {
            props.navigation.navigate('main');
          }, 1000);
        }
      });
    } catch (error) {
      console.log('location set error:', error);
    }
  }

  return (
    <View style={style.container}>
      <View style={style.main_View}>
        <Image
          source={require('../../assets/images/jatayu_icon.png')}
          style={style.logo_img}
        />
      </View>
    </View>
  );
};

//make this component available to the app
export default Initial;

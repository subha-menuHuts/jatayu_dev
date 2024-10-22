import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import {Icon} from 'react-native-basic-elements';
import {DrawerActions, useNavigation} from '@react-navigation/native';

const {width: screenWidth} = Dimensions.get('screen');
import {Colors} from '../../Constants/Colors';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {FONTS} from '../../Constants/Fonts';
import {useDispatch, useSelector} from 'react-redux';
import Geocoder from 'react-native-geocoding';
import Geolocation from '@react-native-community/geolocation';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {PERMISSIONS, request} from 'react-native-permissions';
import {
  reducer_setAddress,
  reducer_setLatLong,
} from '../../Store/Reducers/LocationReducer';
import {useFocusEffect} from '@react-navigation/native';
import {setDefaultAddress} from '../../Store/Reducers/CommonReducer';

function Header() {
  const drawernavigtion = useNavigation();
  const navigation = useNavigation();

  const dispatch = useDispatch();
  const ref = useRef();
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
    default_address,
  } = useSelector(state => state.common);
  const {formatted_address, latitude, longitude} = useSelector(
    state => state.location,
  );

  const [currentLongitude, setCurrentLongitude] = useState('');
  const [currentLatitude, setCurrentLatitude] = useState('');

  const [location, setLocation] = useState('');

  const [locaton_permisstion_action, setLocatonPermissionAction] =
    useState(false);

  const [address, setAddress] = useState('');

  useEffect(() => {}, []);

  useFocusEffect(
    React.useCallback(() => {
      if (default_address == null) {
        selocation();
      } else {
        console.log(default_address);
        setAddress(default_address.address);
      }
    }, [default_address]),
  );

  /* == Reverse geocoding is for find full address using coords ==*/
  const startReverseGeoCoding = (latitude, longitude) => {
    Geocoder.from(latitude, longitude)
      .then(json => {
        //console.log(json);
        if (json) {
          let addressComponent = json.results[0].formatted_address;
          ref.current?.setAddressText(addressComponent);
          setAddress(addressComponent);
          dispatch(reducer_setAddress(addressComponent));
          dispatch(reducer_setLatLong({lat: latitude, lng: longitude}));

          let address_data = {
            address: addressComponent,
            location: {lat: latitude, lng: longitude},
          };

          dispatch(setDefaultAddress(address_data));
        }
      })
      .catch(error => {
        console.warn('cdscsd:', error);
      });
  };

  function selocation() {
    console.log('let : ' + latitude);
    Geocoder.init(google_api_key); // use a valid API key
    if (latitude == '') {
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
              setCurrentLatitude(JSON.stringify(info.coords.latitude));
              setCurrentLongitude(JSON.stringify(info.coords.longitude));

              setLocatonPermissionAction(true);

              startReverseGeoCoding(
                JSON.stringify(info.coords.latitude),
                JSON.stringify(info.coords.longitude),
              );
            });
          } else {
            setLocatonPermissionAction(true);
            console.log('Location is not enabled');
          }
        });
      } catch (error) {
        console.log('location set error:', error);
      }
    } else {
      setCurrentLatitude(latitude);
      setCurrentLongitude(longitude);

      dispatch(reducer_setAddress(formatted_address));
      dispatch(reducer_setLatLong({lat: latitude, lng: longitude}));

      ref.current?.setAddressText(formatted_address);

      setAddress(formatted_address);
    }
  }

  const setSearchValue = details => {
    setCurrentLatitude(details.geometry.location.lat);
    setCurrentLongitude(details.geometry.location.lng);

    dispatch(reducer_setAddress(details.formatted_address));
    dispatch(reducer_setLatLong(details.geometry.location));

    setAddress(details.formatted_address);
  };

  const Add_Address = () => {
    if (userData == null) {
      navigation.navigate('login', {page: 'BHome'});
    } else {
      navigation.navigate('addresslist', {page: 'BHome'});
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/*<View
          style={{
            display: 'flex',
            position: 'absolute',
            zIndex: 999,
            flex: 1,
            width: '80%',
            flexDirection: 'row',
          }}>
          <View
            style={{
              width: '100%',
              marginHorizontal: responsiveWidth(2),
              marginVertical: responsiveWidth(1),
              shadowColor: Colors.themColor,
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              backgroundColor: Colors.white,
              borderRadius: responsiveWidth(2),
            }}>
            <GooglePlacesAutocomplete
              ref={ref}
              keyboardShouldPersistTaps="handled"
              listViewDisplayed={false}
              keepResultsAfterBlur={false}
              placeholder="Search location"
              fetchDetails={true}
              onPress={(data, details = null) => {
                setSearchValue(details);
              }}
              query={{
                key: google_api_key,
                language: 'en',
                components: google_auto_complete_country,
              }}
              onFail={error => console.log(error)}
              onNotFound={() => console.log('no results')}
              styles={{
                textInput: {
                  color: '#333',
                  borderRadius: responsiveWidth(2),
                },
              }}
            />
          </View>
        </View>*/}
        {address != '' ? (
          <TouchableOpacity
            onPress={() => {
              Add_Address();
            }}>
            <View style={styles.locationContainer}>
              <Icon
                type="EvilIcon"
                name="location"
                color={Colors.themColor}
                size={25}
              />
              <Text style={styles.locationText}>
                {address.substring(0, 35)}
              </Text>
              <Icon type="Feather" name="chevron-down" size={20} color="#000" />
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.locationContainer}></View>
        )}
        <View style={styles.iconsContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('notificationlist')}>
            <Icon
              type="MaterialIcon"
              name="notifications-none"
              color="#000000"
              size={26}
            />
          </TouchableOpacity>

          <View
            style={{
              width: responsiveWidth(8),
              height: responsiveWidth(8),
              borderRadius: responsiveWidth(4),
            }}>
            {userData != null ? (
              <TouchableOpacity
                onPress={() =>
                  drawernavigtion.dispatch(DrawerActions.openDrawer())
                }>
                {userData.is_img.is_img == 1 ? (
                  <Image
                    source={{uri: userData.img}}
                    style={styles.accountImage}
                  />
                ) : (
                  <Image
                    source={require('../../assets/images/profile.png')}
                    style={styles.accountImage}
                  />
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => navigation.navigate('login')}>
                <Image
                  source={require('../../assets/images/profile.png')}
                  style={styles.accountImage}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    //backgroundColor: '#FFFFFF',
  },
  header: {
    width: responsiveWidth(100),
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: moderateScale(10),
  },
  locationContainer: {
    width: responsiveWidth(72),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  locationText: {
    padding: 5,
    color: '#000000',
    fontFamily: FONTS.Inter.semibold,
  },
  iconsContainer: {
    flexDirection: 'row',
    width: responsiveWidth(28),
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountImage: {
    width: responsiveWidth(8),
    height: responsiveWidth(8),
    resizeMode: 'cover',
    borderRadius: responsiveWidth(4),
    marginLeft: responsiveWidth(2),
  },
  searchContainer: {
    padding: moderateScale(10),
  },
  searchBox: {
    height: verticalScale(43),
    padding: moderateScale(10),
    borderWidth: 0.9,
    borderColor: '#CCCCCC',
    borderRadius: 17,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'relative',
  },
  textInput: {
    height: verticalScale(43),
    marginLeft: 4,
  },
});

export default Header;

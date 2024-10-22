import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  ScrollView,
} from 'react-native';

import ScreenHeader from '../../Component/screenHeader';
import {moderartescale, scale, verticalscale} from '../../Constants/PixelRatio';
import {Icon} from 'react-native-basic-elements';
import {useNavigation} from '@react-navigation/native';
import {Colors} from '../../Constants/Colors';
import {useDispatch, useSelector} from 'react-redux';
import {showToastMsg, getData, setData} from '../../Service/localStorage';
import {postWithToken, postWithOutToken} from '../../Service/service';
import {useFocusEffect} from '@react-navigation/native';
import Loader from '../../Component/loader';
import {PERMISSIONS, request} from 'react-native-permissions';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import Geocoder from 'react-native-geocoding';
import Geolocation from '@react-native-community/geolocation';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {useRoute} from '@react-navigation/native';

function UserEditAddress() {
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
  const ref = useRef();
  const [viewloader, setLoader] = useState(false);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pin_code, setPinCode] = useState('');
  const [location, setLocation] = useState({});
  const [activeRadio, setRadio] = useState(null);
  const [language, setLanguage] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      setLanguage(LangValue);
    }, [selectedLang]),
  );

  useFocusEffect(
    React.useCallback(() => {
      if (route.params != undefined) {
        if (route.params.id != undefined) {
          getUserAddress(route.params.id);
        }
      }
    }, [route.params]),
  );

  var radio_props = [
    {label: 'Home', value: 'HOME'},
    {label: 'Office', value: 'OFFICE'},
    {label: 'other', value: 'OTHER'},
  ];

  const getUserAddress = id => {
    setLoader(true);
    postWithOutToken(baseUrl, 'module/user/rest-user', {
      f: 'react_getAddress',
      id: id,
      userId: userData.id,
    })
      .then(response => {
        console.log(response);

        setLoader(false);

        if (response.status === true) {
          setTimeout(() => {
            ref.current.setAddressText(response.data.address);
          }, 500);

          setAddress(response.data.address);
          setCity(response.data.city);
          setPinCode(response.data.pin_code);
          setLocation(response.data.location);
          setRadio(response.data.address_type);

          console.log(ref.current.getAddressText());
        }
      })
      .catch(error => {
        console.log('Error : ', error);
      });
  };

  const setSearchValue = details => {
    console.log(details);
    let loc = {};

    for (let i = 0; i < details.address_components.length; i++) {
      for (let j = 0; j < details.address_components[i].types.length; j++) {
        if (details.address_components[i].types[j] === 'postal_code') {
          loc.zip = details.address_components[i].long_name;
          setPinCode(details.address_components[i].long_name);
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

  /* == Reverse geocoding is for find full address using coords ==*/
  const startReverseGeoCoding = (latitude, longitude) => {
    Geocoder.from(latitude, longitude)
      .then(json => {
        //console.log(json);
        if (json) {
          ref.current.setAddressText('');
          ref.current.setAddressText(json.results[0].formatted_address);
          let loc = {};
          for (let i = 0; i < json.results[0].address_components.length; i++) {
            for (
              let j = 0;
              j < json.results[0].address_components[i].types.length;
              j++
            ) {
              if (
                json.results[0].address_components[i].types[j] === 'postal_code'
              ) {
                loc.zip = json.results[0].address_components[i].long_name;
                setPinCode(json.results[0].address_components[i].long_name);
              }
            }
          }

          loc.lat = json.results[0].geometry.location.lat;
          loc.lng = json.results[0].geometry.location.lng;
          loc.address = json.results[0].formatted_address;

          setAddress(json.results[0].formatted_address);
          setLocation(loc);
        }
      })
      .catch(error => {
        console.warn('cdscsd:', error);
      });
  };

  const GetCurrentLoction = () => {
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
            startReverseGeoCoding(
              JSON.stringify(info.coords.latitude),
              JSON.stringify(info.coords.longitude),
            );
          });
        } else {
          console.log('Location is not enabled');
        }
      });
    } catch (error) {
      console.log('location set error:', error);
    }
  };

  const SubmitAddress = () => {
    let flg = true;

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

    if (city.search(/\S/) == -1) {
      showToastMsg(
        language != null
          ? language['ENTER_YOUR_CITY']
          : 'Please enter your city',
      );
      if (flg == true) {
        flg = false;
      }
      return false;
    }

    if (pin_code.search(/\S/) == -1) {
      showToastMsg(
        language != null
          ? language['ENTER_PIN_CODE']
          : 'Please enter your pin code',
      );
      if (flg == true) {
        flg = false;
      }
      return false;
    }

    if (activeRadio == null) {
      showToastMsg(
        language != null
          ? language['PLEASE_SELECT_ADDRESS_TYPE']
          : 'Please select address type',
      );
      if (flg == true) {
        flg = false;
      }
      return false;
    }

    if (flg == true) {
      setLoader(true);
      postWithOutToken(baseUrl, 'module/user/rest-user', {
        f: 'react_UpdateAddress',
        address: address,
        location: location,
        city: city,
        pin_code: pin_code,
        address_type: activeRadio,
        userId: userData.id,
        id: route.params.id,
      })
        .then(response => {
          console.log(response);

          setLoader(false);
          showToastMsg('Address Updated Successfully');

          setTimeout(() => {
            navigation.navigate('addresslist');
          }, 1000);
        })
        .catch(error => {
          console.log('Error : ', error);
        });
    }
  };

  return (
    <View
      style={{
        width: responsiveScreenWidth(100),
        height: responsiveScreenHeight(100),
        backgroundColor: '#FFF0F5',
        flex: 1,
        // padding:moderartescale(10)
      }}>
      <ScreenHeader title="Edit Address" back_display={true} />

      <ScrollView keyboardShouldPersistTaps="always">
        {viewloader === true ? <Loader /> : null}
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.labelText}>Address</Text>
            <View
              style={{
                display: 'flex',
                zIndex: 999,
                width: '100%',
              }}>
              <View
                style={{
                  width: moderartescale(346), // 346px to percentage of screen width
                  borderColor: '#CCCCCC',
                  borderWidth: moderartescale(1),
                  borderRadius: moderartescale(8),
                  paddingHorizontal: moderartescale(10),
                  margin: 'auto',
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
                      width: moderartescale(346),
                      color: '#333',
                      borderRadius: responsiveWidth(2),
                      borderColor: Colors.black,
                      justifyContent: 'center',
                      display: 'flex',
                      height: verticalscale(42),
                    },
                  }}
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.cityContainer}>
              <Text style={styles.labelText}>City</Text>
              <TouchableOpacity
                onPress={() => {
                  GetCurrentLoction();
                }}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon
                  type="MaterialIcon"
                  name="gps-fixed"
                  color={Colors.themColor}
                  size={20}
                />
                <Text style={styles.locationText}>Current Location</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              onChangeText={text => {
                setCity(text);
              }}
              value={city}
            />
          </View>
          <View style={styles.section}>
            <Text style={styles.labelText}>Pincode</Text>
            <TextInput
              style={styles.input}
              maxLength={8}
              onChangeText={text => {
                setPinCode(text);
              }}
              value={pin_code}
            />
          </View>
        </View>
        <View style={styles.radioContainer}>
          <View style={styles.radioGroup}>
            {radio_props.map((item, index) => (
              <View key={index} style={styles.radioItem}>
                <TouchableOpacity
                  onPress={() => setRadio(item.value)}
                  style={[
                    styles.radioButton,
                    activeRadio === item.value && styles.activeRadioButton,
                  ]}
                />
                <Text style={styles.radioText}>{item?.label}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity
            onPress={() => {
              viewloader === false ? SubmitAddress() : null;
            }}
            style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF0F5',
    height: responsiveHeight(100),
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    // padding:moderartescale(10)
  },
  section: {
    padding: moderartescale(10),
  },
  labelText: {
    fontSize: moderartescale(14),
    color: '#000000',
    fontWeight: '400',
  },
  input: {
    width: moderartescale(340), // 346px to percentage of screen width
    marginTop: verticalscale(10),
    height: verticalscale(45),
    borderColor: '#CCCCCC',
    borderWidth: moderartescale(1),
    borderRadius: moderartescale(10),
    paddingHorizontal: moderartescale(10), // Optional for padding inside TextInput
  },
  cityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cityText: {
    fontSize: moderartescale(14),
    color: '#000000',
    fontWeight: '300',
  },
  locationText: {
    fontSize: moderartescale(12),
    color: Colors.themColor,
    fontWeight: '400',
  },
  icon: {
    width: moderartescale(20),
    height: moderartescale(20),
  },
  radioContainer: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioGroup: {
    flexDirection: 'row',
    padding: moderartescale(20),
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderartescale(10),
  },
  radioButton: {
    width: moderartescale(15),
    height: moderartescale(15),
    borderWidth: moderartescale(1),
    borderColor: Colors.themColor,
    borderRadius: moderartescale(10),
    backgroundColor: '#FFFFFF', // Default background
  },
  activeRadioButton: {
    backgroundColor: Colors.themColor,
  },
  radioText: {
    fontSize: moderartescale(14),
    marginLeft: moderartescale(10),
  },
  saveButton: {
    width: moderartescale(346), // 346px to percentage of screen width
    height: verticalscale(52),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00AB11',
    borderRadius: moderartescale(10),
    margin: moderartescale(10),
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: moderartescale(14),
  },
});

export default UserEditAddress;

import React, {useEffect, useState, useRef} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import ScreenHeader from '../Component/screenHeader';
import {moderartescale, scale, verticalscale} from '../Constants/PixelRatio';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Image,
  Platform,
  Alert,
} from 'react-native';
import {Icon} from 'react-native-basic-elements';
import {Colors} from '../Constants/Colors';
import {useDispatch, useSelector} from 'react-redux';
import {setUserDataAfterLogin} from '../Store/Reducers/CommonReducer';
import {showToastMsg, getData, setData} from '../Service/localStorage';
import {postWithToken, postWithOutToken} from '../Service/service';
import {useFocusEffect} from '@react-navigation/native';
import Loader from '../Component/loader';
import {PERMISSIONS, request} from 'react-native-permissions';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

function EditProfile() {
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
  const ref = useRef();
  const [viewloader, setLoader] = useState(false);
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState({});
  const [language, setLanguage] = useState(null);
  const [profileimage, setProfileImagePriview] = useState(null);
  const [filePath, setFilePath] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      setLanguage(LangValue);
    }, [selectedLang]),
  );

  useFocusEffect(React.useCallback(() => {}, []));

  useEffect(() => {
    if (userData != null) {
      console.log(userData);
      console.log('seprater');

      /*getData('userDetails').then(respSuccess => {
        if (respSuccess) {
          console.log(respSuccess);
        } else {
        }
      });*/

      setFirstName(userData.name);
      setLastName(userData.last_name);
      setAddress(userData.address);
      setPhone(userData.cel.toString());
      setLocation(userData.location);
      console.log(userData.address);
      ref.current?.setAddressText(userData.address);

      if (userData.is_img.is_img == 1) {
        setProfileImagePriview(userData.img);
      }
    }
  }, [userData]);

  const onSelectImge = async index => {
    try {
      request(
        Platform.select({
          android: PERMISSIONS.ANDROID.CAMERA,
          ios: PERMISSIONS.IOS.CAMERA,
        }),
      ).then(res => {
        if (res == 'granted') {
          Alert.alert('Upload', 'Choose an Option', [
            {text: 'Cencel', onPress: () => {}},
            {
              text: 'Choose from Library....',
              onPress: () => {
                chooseImageGallery(index);
              },
            },
            {
              text: 'Take Photo....',
              onPress: () => {
                chooseImageCamera(index);
              },
            },
          ]);
        } else {
          console.log('camera is not enabled');
        }
      });
    } catch (error) {
      console.log('camera set error:', error);
    }
  };

  const chooseImageCamera = async index => {
    const result = await launchCamera({
      saveToPhotos: true,
      mediaType: 'photo',
      includeBase64: true,
      maxWidth: 500,
      maxHeight: 500,
      quality: 0.5,
    });

    console.log(result);

    if (result?.assets && result.assets.length > 0) {
      const asset = result.assets[0]; // First image selected
      console.log('Selected Image:', asset);

      uploadImage(asset.base64, asset.uri);
    }
  };

  const chooseImageGallery = async index => {
    const result = await launchImageLibrary({
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
      maxWidth: 500,
      maxHeight: 500,
      quality: 0.5,
    });

    if (result?.assets && result.assets.length > 0) {
      const asset = result.assets[0]; // First image selected
      console.log('Selected Image:', asset);
      uploadImage(asset.base64, asset.uri);
    }
  };

  const uploadImage = (base64, path) => {
    setLoader(true);
    postWithOutToken(baseUrl, 'module/user/rest-upload.php', {
      myFile: base64,
      myId: userData.id,
    })
      .then(response => {
        console.log(response);
        setLoader(false);
        setProfileImagePriview(path);

        getData('userDetails').then(respSuccess => {
          if (respSuccess) {
            console.log(respSuccess);

            let user = respSuccess;

            user.is_img = response.data;
            user.img = response.data.secure_url;

            setData('userDetails', user);
            dispatch(setUserDataAfterLogin(JSON.parse(user)));
          }
        });

        showToastMsg(
          language != null
            ? language['SUCCESSFULLY_UPDATED']
            : 'Profile Image Updated Successfully',
        );
      })
      .catch(error => {
        console.log('Error : ', error);
      });
  };

  const updateProfile = () => {
    let flg = true;

    if (first_name.search(/\S/) == -1) {
      showToastMsg(
        language != null
          ? language['ENTER_FIRST_NAME']
          : 'Please enter first name',
      );
      if (flg == true) {
        flg = false;
      }
      return false;
    }

    if (last_name.search(/\S/) == -1) {
      showToastMsg(
        language != null
          ? language['ENTER_YOUR_LAST_NAME']
          : 'Please enter last name',
      );
      if (flg == true) {
        flg = false;
      }
      return false;
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

    if (flg == true) {
      /*console.log(true);

      console.log(address);*/
      //console.log(location);

      //return false;

      setLoader(true);
      postWithOutToken(baseUrl, 'module/user/rest-user', {
        f: 'react_update',
        langId: selectedLang,
        userId: userData.id,
        name: first_name,
        last_name: last_name,
        cel: phone,
        address: address,
        location: location,
      })
        .then(response => {
          console.log('userdata:');
          console.log(response);
          setLoader(false);

          dispatch(setUserDataAfterLogin(response));
          setData('userDetails', JSON.stringify(response));
          //setData("userToken", JSON.stringify(response.token));
          showToastMsg('Profile Updated Successfully');
        })
        .catch(error => {
          console.log('Error : ', error);
        });
    }
  };

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

  return (
    <>
      <ScreenHeader title="Edit Profile" back_display={true} />

      <ScrollView
        style={{
          width: responsiveScreenWidth(100),
          height: responsiveScreenHeight(70),
          backgroundColor: '#FFF0F5',
          // padding:moderartescale(10)
        }}
        keyboardShouldPersistTaps="always">
        {viewloader === true ? <Loader /> : null}

        <View style={styles.container}>
          <View style={styles.imageBackgroundContainer}>
            <View style={styles.profileImageBackground}>
              {profileimage != null ? (
                <Image
                  source={{uri: profileimage}}
                  style={styles.profile_image}
                />
              ) : (
                <Image
                  style={styles.profile_image}
                  source={require('../assets/dynamic/useremptyProfile.png')}
                />
              )}

              <View style={styles.overlayContainer}>
                <View></View>
                <TouchableOpacity
                  onPress={() => {
                    onSelectImge();
                  }}>
                  <ImageBackground
                    style={styles.editIconContainer}
                    source={require('../assets/dynamic/Ellipse34.png')}>
                    <Icon
                      type="Feather"
                      name="plus"
                      size={20}
                      color="#FFFFFF"
                    />
                  </ImageBackground>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View
            style={{
              display: 'flex',
              zIndex: 999,
              flex: 1,
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
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TextInput
              placeholder={language != null ? language['NAME'] : 'First Name'}
              onChangeText={setFirstName}
              value={first_name}
              style={styles.input}
            />
            <TextInput
              placeholder={
                language != null ? language['LAST_NAME'] : 'Last Name'
              }
              onChangeText={setLastName}
              value={last_name}
              style={styles.input}
            />

            <TextInput
              placeholder={
                language != null ? language['MOBILE'] : 'Mobile Number'
              }
              onChangeText={setPhone}
              value={phone}
              style={styles.input}
              maxLength={10}
              keyboardType="phone-pad"
            />
            {/*} <TextInput
              placeholder={language != null ? language['ADDRESS'] : 'Address'}
              onChangeText={setAddress}
              value={address}
              style={[styles.input, styles.largeInput]}
            />*/}

            <TouchableOpacity
              onPress={() => {
                viewloader === false ? updateProfile() : null;
              }}
              style={styles.submitButton}>
              <Text style={styles.submitButtonText}>SUBMIT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    // height: responsiveScreenHeight(100),
    width: responsiveScreenWidth(100),
    padding: moderartescale(10),
  },
  headerContainer: {
    // If needed, add specific styles for the ScreenHeader
  },
  imageBackgroundContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: verticalscale(200),
    // backgroundColor:'green'
  },
  profileImageBackground: {
    height: verticalscale(117),
    width: verticalscale(117),
    borderWidth: moderartescale(2),
    borderColor: Colors.themColor,
    borderRadius: scale(100),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  profile_image: {
    width: moderartescale(130),
    height: moderartescale(130),
    borderRadius: moderartescale(60),
    objectFit: 'cover',
    resizeMode: 'cover',
    zIndex: 0,
  },
  overlayContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editIconContainer: {
    height: verticalscale(31),
    width: verticalscale(31),
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: verticalscale(45),
    width: moderartescale(346), // 346px to percentage of screen width
    borderColor: '#CCCCCC',
    borderWidth: moderartescale(1),
    borderRadius: moderartescale(8),
    paddingHorizontal: moderartescale(10),
    marginTop: moderartescale(10),
  },
  largeInput: {
    height: verticalscale(89),
  },
  submitButton: {
    height: verticalscale(42),
    width: moderartescale(346), // 346px to percentage of screen width
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

export default EditProfile;

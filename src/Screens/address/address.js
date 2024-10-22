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
import ScreenHeader from '../../Component/screenHeader';
import {FONTS} from '../../Constants/Fonts';
import {Icon} from 'react-native-basic-elements';
import {useDispatch, useSelector} from 'react-redux';
import {showToastMsg, getData, setData} from '../../Service/localStorage';
import {postWithToken, postWithOutToken} from '../../Service/service';
import {useFocusEffect} from '@react-navigation/native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Loader from '../../Component/loader';
import {
  fonstSizeDynamic,
  moderartescale,
  verticalscale,
} from '../../Constants/PixelRatio';
import {useNavigation} from '@react-navigation/native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {useRoute} from '@react-navigation/native';
import {setDefaultAddress} from '../../Store/Reducers/CommonReducer';

function UserAddressList() {
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
    default_address,
  } = useSelector(state => state.common);
  const [viewloader, setLoader] = useState(false);
  const [language, setLanguage] = useState(null);
  const [address_list, setAddressList] = useState({isLoading: true, list: []});
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

  useFocusEffect(
    React.useCallback(() => {
      fetchAddressList();
    }, []),
  );

  const fetchAddressList = () => {
    postWithOutToken(baseUrl, 'module/user/rest-user', {
      f: 'react_getAddressList',
      userId: userData.id,
    })
      .then(response => {
        if (response.status == true) {
          setAddressList({
            isLoading: false,
            list: response.data,
          });
        }
      })
      .catch(error => {
        console.log('Error : ', error);
      });
  };

  const confirmDel = (id, user_id, index) => {
    Alert.alert('Please Confirm', 'Are you want to delete this Invoice?', [
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          deleteAddress(id, user_id, index);
        },
      },
    ]);
  };

  const deleteAddress = (id, user_id, index) => {
    setLoader(true);
    postWithOutToken(baseUrl, 'module/user/rest-user', {
      f: 'react_deleteAddress',
      id: id,
      userId: userData.id,
    })
      .then(response => {
        console.log(response);
        setLoader(false);
        if (response.status == true) {
          address_list.list.splice(index, 1);
          setAddressList({isLoading: false, list: address_list.list});
        } else {
          showToastMsg('Try after some time');
        }
      })
      .catch(error => {
        console.log('Error : ', error);
      });
  };

  const selectAddress = item => {
    let address_data = {
      id: item.id,
      address: item.address,
      location: item.location,
      city: item.city,
      pin_code: item.pin_code,
      address_type: item.address_type,
    };

    dispatch(setDefaultAddress(address_data));
    setData('default_address', JSON.stringify(address_data));

    if (page_redirect != null) {
      setTimeout(() => {
        navigation.navigate(page_redirect);
      }, 500);
    }
  };

  return (
    <>
      <View
        style={{
          flex: 1,
          height: responsiveHeight(100),
          width: responsiveWidth(100),
          backgroundColor: '#FFF0F5',
        }}>
        <ScreenHeader title="Address" back_display={true} />
        {viewloader === true ? <Loader /> : null}

        <ScrollView style={styles.main_container}>
          {address_list.isLoading === false && address_list.list.length > 0 ? (
            address_list.list.map((item, index) => {
              let address_type_image = '';

              if (item.address_type == 'HOME') {
                address_type_image = require('../../assets/dynamic/home27)2.png');
              } else if (item.address_type == 'OFFICE') {
                address_type_image = require('../../assets/dynamic/wall1.png');
              } else if (item.address_type == 'OTHER') {
                address_type_image = require('../../assets/dynamic/wall1.png');
              }

              let address_selected = '';

              if (default_address != null) {
                if (default_address.id == item.id) {
                  console.log(default_address.id + '-' + item.id);
                  address_selected = '#90EE90';
                } else {
                  address_selected = '';
                }
              }

              return (
                <View
                  key={index}
                  style={[
                    styles.container,
                    {marginTop: index != 0 ? verticalscale(10) : 0},
                  ]}>
                  <View
                    style={[
                      styles.itemContainer,
                      {
                        backgroundColor: address_selected,
                      },
                    ]}>
                    <TouchableOpacity
                      onPress={() => {
                        selectAddress(item);
                      }}
                      style={{flexDirection: 'row', gap: 10, display: 'flex'}}>
                      <Image source={address_type_image} style={styles.image} />
                      <View style={styles.textContainer}>
                        <Text style={styles.text} numberOfLines={3}>
                          {item.address}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('userEditAddress', {id: item.id});
                      }}
                      style={styles.button}>
                      <View style={styles.imageBackground}>
                        <Icon
                          type="EvilIcon"
                          name="pencil"
                          color="#D3D3D3"
                          size={17}
                        />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        confirmDel(item.id, item.user_id, index);
                      }}
                      style={styles.button}>
                      <View style={styles.imageBackground2}>
                        <Icon
                          type="Feather"
                          name="trash-2"
                          color="red"
                          size={17}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          ) : address_list.isLoading === true ? (
            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                marginVertical={responsiveHeight(2)}
                marginHorizontal={responsiveWidth(4)}>
                <SkeletonPlaceholder.Item
                  width={responsiveWidth(92)}
                  height={responsiveHeight(12)}
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
                  width={responsiveWidth(92)}
                  height={responsiveHeight(12)}
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
                  width={responsiveWidth(92)}
                  height={responsiveHeight(12)}
                  marginRight={responsiveWidth(3)}
                  borderRadius={10}
                />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
          ) : null}

          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: moderartescale(20),
            }}>
            <TouchableOpacity
              style={styles.newButton}
              onPress={() =>
                navigation.navigate('userNewAddress', {page: page_redirect})
              }>
              <Text style={styles.button_text}>Add New Addrerss</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  main_container: {
    height: responsiveHeight(100),
    width: responsiveWidth(100),
    // backgroundColor: '#FFFFFF',
    // flex: 1,
    // marginTop:moderartescale(10)
    // padding: moderartescale(10)
    // display:'flex'
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: moderartescale(15),
    backgroundColor: '#FFFFFF',
    // marginTop: verticalscale(10),
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor:'green',
    width: responsiveWidth(65),
  },
  image: {
    width: moderartescale(20),
    height: moderartescale(20),
  },
  textContainer: {
    //height: moderartescale(34),
    //marginLeft: responsiveWidth(4),
  },
  text: {
    fontSize: moderartescale(14),
    color: '#000000',
    fontWeight: '400',
    fontFamily: FONTS.Inter.regular,
  },
  buttonContainer: {
    flexDirection: 'row',
    // backgroundColor:'red'
  },
  button: {
    padding: moderartescale(10),
  },
  imageBackground: {
    width: moderartescale(25),
    height: moderartescale(25),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#D3D3D3',
    borderWidth: moderartescale(1.5),
    borderRadius: moderartescale(50),
  },
  imageBackground2: {
    width: moderartescale(25),
    height: moderartescale(25),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'red',
    borderWidth: moderartescale(1.5),
    borderRadius: moderartescale(50),
  },
  icon: {
    width: moderartescale(11),
    height: moderartescale(11),
  },
  newButton: {
    width: moderartescale(345),
    height: verticalscale(52),
    backgroundColor: '#F00049',
    borderRadius: moderartescale(10),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button_text: {
    color: '#FFFFFF',
    fontSize: fonstSizeDynamic(2),
    // textAlign: 'center'
  },
});

export default UserAddressList;

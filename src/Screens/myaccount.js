import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import ScreenHeader from '../Component/screenHeader';
import {moderartescale} from '../Constants/PixelRatio';
import {Icon} from 'react-native-basic-elements';
import {useNavigation} from '@react-navigation/native';
import {
  clearUserData,
  localstorage_TokenAdd,
  localstorage_UserdetailsAdd,
  setLanguage,
  setLanguageValue,
  setCartDetails,
  saveOrderType,
  setDefaultAddress,
} from '../Store/Reducers/CommonReducer';
import {getData, setData, removeData} from '../Service/localStorage';
import {useDispatch, useSelector} from 'react-redux';
import Loader from '../Component/loader';

function UserMyaccount() {
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
    default_address,
  } = useSelector(state => state.common);
  const [viewloader, setLoader] = useState(false);

  const handleLogout = () => {
    setLoader(true);
    removeData('userDetails');
    removeData('userToken');
    removeData('selectedLang');
    removeData('LangValue');
    removeData('cartDetails');
    removeData('orderType');
    removeData('default_address');
    dispatch(setDefaultAddress(null));
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
    <>
      <View
        style={{
          width: responsiveScreenWidth(100),
          height: responsiveScreenHeight(100),
          backgroundColor: '#FFF0F5',
        }}>
        <ScreenHeader title="My Account" back_display={true} />
        {viewloader === true ? <Loader /> : null}
        <View style={styles.container}>
          <View style={styles.section}>
            <View style={styles.itemContainer}>
              <View style={styles.itemContent}>
                <Icon
                  type="FontAwesome"
                  name="user"
                  color="#000000"
                  size={20}
                />

                <Text style={styles.itemText}>My Profile</Text>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('usereditProfile')}>
                <Icon
                  type="Entypo"
                  name="chevron-small-right"
                  color="#D3D3D3"
                  size={20}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.itemContainer}>
              <View style={styles.itemContent}>
                <Icon
                  type="Entypo"
                  name="circle-with-cross"
                  color="#000000"
                  size={20}
                />
                <Text style={styles.itemText}>Remove Account</Text>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('removeaccount')}>
                <Icon
                  type="Entypo"
                  name="chevron-small-right"
                  color="#D3D3D3"
                  size={20}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.itemContainer}>
              <View style={styles.itemContent}>
                <Icon
                  type="FontAwesome"
                  name="power-off"
                  size={20}
                  color="#000000"
                />
                <Text style={styles.itemText}>Logout</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  handleLogout();
                }}>
                <Icon
                  type="Entypo"
                  name="chevron-small-right"
                  color="#D3D3D3"
                  size={20}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
  section: {
    padding: moderartescale(10),
  },
  itemContainer: {
    borderBottomWidth: moderartescale(1.1),
    borderBottomColor: '#D9D9D9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: moderartescale(20),
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: moderartescale(16),
    height: moderartescale(16),
  },
  itemText: {
    marginLeft: moderartescale(10),
    fontSize: moderartescale(14),
    color: '#000000',
  },
  arrowImage: {
    width: moderartescale(14),
    height: moderartescale(14),
  },
});
export default UserMyaccount;

import React, {useEffect, useState} from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {TouchableHighlight} from 'react-native';
import {Home} from '../Screens';
import {DrawerActions} from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  useWindowDimensions,
} from 'react-native';
import {Icon} from 'react-native-basic-elements';
import {Colors} from '../Constants/Colors';
import {Calibri} from '../Constants/Fonts';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import Bottomtabs from './BottomTab';
import {moderartescale} from '../Constants/PixelRatio';
import {
  FavoriteItem,
  Helpscreen,
  OrderHistory,
  UserAddressList,
  UserMyaccount,
} from '../Screens';
import {useDispatch, useSelector} from 'react-redux';

const Drawer = createDrawerNavigator();

function CustomDrawerContent_User(props) {
  const [activeItem, setActiveitem] = React.useState('Home');

  const dispatch = useDispatch();
  const {
    baseUrl,
    siteUrl,
    userToken,
    userData,
    selectedLang,
    LangValue,
    deviceToken,
  } = useSelector(state => state.common);

  clickIndividual_DrawerMenu = screenName => {
    setActiveitem(screenName);
    if (screenName == 'Home') {
      console.log(activeItem);
      //props.navigation.replace(screenName);
      props.navigation.navigate(screenName);
    } else {
      console.log(activeItem);
      //props.navigation.replace(screenName);
      props.navigation.navigate(screenName);
    }
  };

  function logout() {}

  return (
    <DrawerContentScrollView
      style={{backgroundColor: Colors.white}}
      showsVerticalScrollIndicator={false}
      {...props}>
      <View
        style={{
          padding: moderartescale(11),
          // backgroundColor:'red',
          borderBottomColor: '#D3D3D3',
          borderBottomWidth: moderartescale(1),
        }}>
        <View
          style={{
            flexDirection: 'row',
            padding: moderartescale(5),
          }}>
          {userData != null && userData.is_img.is_img == 1 ? (
            <Image
              style={{
                width: responsiveWidth(14),
                height: responsiveWidth(14),
                borderRadius: responsiveWidth(7),
                resizeMode: 'cover',
              }}
              source={{uri: userData.img}}
            />
          ) : (
            <Image
              style={{
                width: responsiveWidth(14),
                height: responsiveWidth(14),
                borderRadius: responsiveWidth(7),
                resizeMode: 'cover',
              }}
              source={require('../assets/images/profile.png')}
            />
          )}

          <View
            style={{
              marginLeft: moderartescale(10),
            }}>
            <Text
              style={{
                color: '#000000',
                fontSize: 16,
                fontWeight: '600',
              }}>
              {userData != null ? userData.name : null}
            </Text>
            <Text
              style={{
                color: '#333333',
                fontSize: 14,
                fontWeight: '400',
              }}>
              {userData != null ? userData.email : null}
            </Text>
          </View>
        </View>
      </View>
      <DrawerItem
        label="Home"
        labelStyle={{
          fontSize: moderartescale(16),
          color: '#000000',
          fontWeight: '500',
        }}
        onPress={() => props.navigation.navigate('dashboard')}
        style={{
          color: activeItem == 'Home' ? Colors.primary : Colors.fontcolor,
          padding: 0,
        }}
        icon={() => (
          <Icon name="home" type="Feather" color={Colors.themColor} size={22} />
        )}
      />
      {/* </View> */}

      {/* <View> */}
      <DrawerItem
        label="My Orders"
        onPress={() => props.navigation.navigate('orderList')}
        labelStyle={{
          fontSize: moderartescale(16),
          color: '#000000',
          fontWeight: '500',
        }}
        style={{
          color: activeItem == 'Home' ? Colors.primary : Colors.fontcolor,
        }}
        icon={() => (
          <Icon
            name="shopping-cart"
            type="Feather"
            color={Colors.themColor}
            size={22}
          />
        )}
      />
      {/* </View> */}
      {/* <View> */}
      <DrawerItem
        label="My Accouunt"
        labelStyle={{
          fontSize: moderartescale(16),
          color: '#000000',
          fontWeight: '500',
        }}
        onPress={() => props.navigation.navigate('myaccount')}
        style={{
          color: activeItem == 'Home' ? Colors.primary : Colors.fontcolor,
        }}
        icon={() => (
          <Icon name="user" type="Feather" color={Colors.themColor} size={22} />
        )}
      />
      {/* </View>
        <View> */}
      <DrawerItem
        label="Address"
        labelStyle={{
          fontSize: moderartescale(16),
          color: '#000000',
          fontWeight: '500',
        }}
        onPress={() => props.navigation.navigate('addresslist')}
        style={{
          color: activeItem == 'Home' ? Colors.primary : Colors.fontcolor,
        }}
        icon={() => (
          <Icon
            name="location"
            type="EvilIcons"
            color={Colors.themColor}
            size={22}
          />
        )}
      />
      {/* </View>
        <View> */}
      <DrawerItem
        label="Favorite"
        labelStyle={{
          fontSize: moderartescale(16),
          color: '#000000',
          fontWeight: '500',
        }}
        onPress={() => props.navigation.navigate('favoriteList')}
        style={{
          color: activeItem == 'Home' ? Colors.primary : Colors.fontcolor,
        }}
        icon={() => (
          <Icon
            name="favorite-border"
            type="MaterialIcon"
            color={Colors.themColor}
            size={22}
          />
        )}
      />
      {/* </View>
        <View> */}
      <DrawerItem
        label="Help"
        labelStyle={{
          fontSize: moderartescale(16),
          color: '#000000',
          fontWeight: '500',
        }}
        onPress={() => props.navigation.navigate('helpscreen')}
        style={{
          color: activeItem == 'Home' ? Colors.primary : Colors.fontcolor,
        }}
        icon={() => (
          <Icon
            name="help-circle"
            type="Feather"
            color={Colors.themColor}
            size={22}
          />
        )}
      />
      {/* </View>

      </View> */}
    </DrawerContentScrollView>
  );
}

const DrawerNavigation = () => {
  return (
    <>
      <Drawer.Navigator
        screenOptions={{
          drawerPosition: 'left',
          headerShown: false,
          headerStyle: {backgroundColor: Colors.secondary},
          headerTitleStyle: {color: Colors.white},
          headerTintColor: Colors.white,
          headerTitleAlign: 'center',
          swipeEnabled: false,
          drawerStyle: {width: Dimensions.get('window').width / 1.5},
        }}
        drawerContent={props => <CustomDrawerContent_User {...props} />}>
        {/* == For showing Tabs under sidemenu == */}
        <Drawer.Screen name="dashboard" component={Bottomtabs} />
        <Drawer.Screen name="orderList" component={OrderHistory} />
        <Drawer.Screen name="myaccount" component={UserMyaccount} />
        <Drawer.Screen name="addresslist" component={UserAddressList} />
        <Drawer.Screen name="favoriteList" component={FavoriteItem} />
        <Drawer.Screen name="helpscreen" component={Helpscreen} />
      </Drawer.Navigator>
    </>
  );
};

export {DrawerNavigation};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  menuItemsCard: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  circleContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    padding: 10,
  },
});

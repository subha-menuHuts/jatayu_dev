import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  createNativeStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/native-stack';
import {navigationStyle} from './style';
import {
  Userloginsignup,
  HomeScren,
  Search,
  Myaccount,
  Details,
} from '../Screens';
import {TouchableOpacity, View} from 'react-native';
import {Icon} from 'react-native-basic-elements';
import {Text} from 'react-native';
import {moderartescale} from '../Constants/PixelRatio';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {useDispatch, useSelector} from 'react-redux';

const BottomTab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const DrawerStack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      initialRouteName="Home"
      screenOptions={{headerShown: false}}>
      <HomeStack.Screen name="Home" component={HomeScren} />
    </HomeStack.Navigator>
  );
}

function Bottomtabs() {
  const dispatch = useDispatch();
  const drawernavigtion = useNavigation();
  const {userData, userToken} = useSelector(state => state.common);
  return (
    <>
      <BottomTab.Navigator
        initialRouteName="BHome"
        screenOptions={{
          tabBarHideOnKeyboard: true,
          headerShown: false,
          tabBarActiveTintColor: '#0000',
          tabBarInactiveTintColor: '#1111',
          tabBarShowLabel: false,
          tabBarStyle: {
            height: responsiveHeight(8),
            margin: 0,
            padding: 6,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 9,
            },
            shadowOpacity: 0.5,
            shadowRadius: 12.35,
            elevation: 19,
            borderTopWidth: 1,
          },
        }}>
        <BottomTab.Screen
          name="BHome"
          component={HomeStackScreen}
          options={{
            tabBarIcon: ({focused}) => {
              return (
                // focused ?
                focused ? (
                  <React.Fragment>
                    {/* <Icon> */}
                    <View style={navigationStyle.bottm_items}>
                      <Icon
                        type="Feather"
                        name="home"
                        color="#FFFFFF"
                        size={20}
                      />
                    </View>
                    <Text style={navigationStyle.line}></Text>
                  </React.Fragment>
                ) : (
                  <Icon type="Feather" name="home" color="#D9D9D9" size={20} />
                )
              );
            },
          }}
        />
        <BottomTab.Screen
          name="Search"
          component={Search}
          options={{
            tabBarIcon: ({focused}) => {
              return focused ? (
                <React.Fragment>
                  {/* <Icon> */}
                  <View style={navigationStyle.bottm_items}>
                    <Icon
                      type="Feather"
                      name="search"
                      color="#FFFFFF"
                      size={20}
                    />
                  </View>
                  <Text style={navigationStyle.line}></Text>
                </React.Fragment>
              ) : (
                <Icon type="Feather" name="search" color="#D9D9D9" size={20} />
              );
            },
          }}
          listeners={({navigation, route}) => ({
            tabPress: e => {
              // Prevent default action
              e.preventDefault();

              // or, just delete the prop from the route instead of the above lines
              delete route.params?.param_to_delete;

              // Do something with the `navigation` object
              navigation.navigate('Search');
            },
          })}
        />
        {userData != null ? (
          <BottomTab.Screen
            name="Account"
            component={Myaccount}
            options={{
              tabBarIcon: ({focused}) => {
                return focused ? (
                  <React.Fragment>
                    {/* <Icon> */}
                    <View style={navigationStyle.bottm_items}>
                      <Icon
                        type="EvilIcon"
                        name="user"
                        color="#FFFFFF"
                        size={22}
                      />
                    </View>
                    <Text style={navigationStyle.line}></Text>
                  </React.Fragment>
                ) : (
                  <Icon type="EvilIcon" name="user" color="#D9D9D9" size={35} />
                );
              },
            }}
          />
        ) : (
          <BottomTab.Screen
            name="Account"
            component={Userloginsignup}
            options={{
              tabBarIcon: ({focused}) => {
                return focused ? (
                  <React.Fragment>
                    {/* <Icon> */}
                    <View style={navigationStyle.bottm_items}>
                      <Icon
                        type="EvilIcon"
                        name="user"
                        color="#FFFFFF"
                        size={22}
                      />
                    </View>
                    <Text style={navigationStyle.line}></Text>
                  </React.Fragment>
                ) : (
                  <Icon type="EvilIcon" name="user" color="#D9D9D9" size={35} />
                );
              },
            }}
          />
        )}

        <BottomTab.Screen
          name="Details"
          component={Details}
          options={{
            tabBarIcon: ({focused}) => {
              return focused ? (
                <React.Fragment>
                  {/* <Icon> */}
                  <View style={navigationStyle.bottm_items}>
                    <Icon
                      type="Feather"
                      name="align-right"
                      color="#FFFFFF"
                      size={22}
                    />
                  </View>
                  <Text style={navigationStyle.line}></Text>
                </React.Fragment>
              ) : (
                <Icon
                  type="Feather"
                  name="align-right"
                  color="#D9D9D9"
                  size={22}
                />
              );
            },
          }}
          listeners={({navigation, route}) => ({
            tabPress: e => {
              // Prevent default action
              e.preventDefault();
              drawernavigtion.dispatch(DrawerActions.openDrawer());
            },
          })}
        />
      </BottomTab.Navigator>
    </>
  );
}

export default Bottomtabs;

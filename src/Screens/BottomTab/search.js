import React, {useEffect, useState, useRef} from 'react';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {moderartescale, scale, verticalscale} from '../../Constants/PixelRatio';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  TextInput,
  BackHandler,
  ActivityIndicator,
  Alert,
} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {FlatList} from 'react-native-gesture-handler';
import {FONTS} from '../../Constants/Fonts';
import {useNavigation} from '@react-navigation/native';
import {Icon} from 'react-native-basic-elements';
import {Colors} from '../../Constants/Colors';
import {useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {showToastMsg, getData, setData} from '../../Service/localStorage';
import {postWithToken, postWithOutToken} from '../../Service/service';
import {useFocusEffect} from '@react-navigation/native';
import Loader from '../../Component/loader';
import ScreenHeader from '../../Component/screenHeader';
import {saveOrderType} from '../../Store/Reducers/CommonReducer';

function Search({navigation, route}) {
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
    default_address,
    orderType,
  } = useSelector(state => state.common);
  const [viewloader, setLoader] = useState(false);
  const [language, setLanguage] = useState(null);
  const [business_list, setBusinessList] = useState({
    isLoading: true,
    list: [],
  });

  const [viewmoreloader, setMoreLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState({
    isLoading: true,
    num: 0,
  });

  const [bus_temp, setBusTemp] = useState([]);

  const [businessTypeId, setBusinessId] = useState('');
  const [businessTypeName, setBusinessTypeName] = useState('Shop');

  useFocusEffect(
    React.useCallback(() => {
      console.log('params');
      console.log(route);
      if (route.params != undefined) {
        setBusinessTypeName(route.params.businessTypeName);
        setBusinessId(route.params.businessTypeId);

        setCurrentPage({
          isLoading: false,
          num: 0,
        });
        setBusinessList({
          isLoading: true,
          list: [],
        });
        setBusTemp([]);
        setTimeout(() => {
          fetchBusList(route.params.businessTypeId, 0);
        }, 500);
      } else {
        setBusinessTypeName('Shop');
        setBusinessId('');
        setCurrentPage({
          isLoading: false,
          num: 0,
        });
        setBusinessList({
          isLoading: true,
          list: [],
        });
        setBusTemp([]);
        setTimeout(() => {
          fetchBusList('', 0);
        }, 500);
      }
    }, [route.params]),
  );

  /*useEffect(() => {
    if (newFetch === true) {
      if (route.params != undefined) {
        if (route.params.businessTypeId != undefined) {
          setBusinessTypeName(route.params.businessTypeName);
          setBusinessId(route.params.businessTypeId);
          setBusinessTypeName(route.params.businessTypeName);
          setNewFetch(false);

          setTimeout(() => {
            fetchBusList();
          }, 500);
        }
      } else {
        setTimeout(() => {
          setNewFetch(false);
          fetchBusList();
        }, 500);
      }
    }
  }, [newFetch]);*/

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setCurrentPage({
        isLoading: false,
        num: 0,
      });
      setBusinessList({
        isLoading: true,
        list: [],
      });
      setBusTemp([]);
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      const UpdateCurrentNumber = () => {
        setCurrentPage({
          isLoading: false,
          num: 0,
        });
        setBusinessList({
          isLoading: true,
          list: [],
        });
        setBusTemp([]);
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        UpdateCurrentNumber,
      );

      return () => backHandler.remove();
    }, []),
  );

  useFocusEffect(
    React.useCallback(() => {
      setLanguage(LangValue);
    }, [selectedLang]),
  );

  const fetchBusList = (id, num) => {
    console.log('id:page:' + num);
    setMoreLoader(true);
    const nextPage = num + 1;
    postWithOutToken(baseUrl, 'module/search/rest-search', {
      f: 'BusinessByTypeLatLong',
      userId: userData != null ? userData.id : 0,
      business_type_id: id,
      lat: default_address.location.lat,
      long: default_address.location.lng,
      langId: selectedLang,
      orderType: orderType,
      pagenumber: nextPage,
    })
      .then(response => {
        console.log(response);
        setMoreLoader(false);

        if (response.status == true) {
          console.log('call function');
          if (response.data.length > 0) {
            setCurrentPage({
              isLoading: true,
              num: nextPage,
            });

            setBusinessList({
              isLoading: false,
              list: response.data,
            });

            setBusTemp(response.data);
          } else {
            setBusinessList({isLoading: false, list: []});

            setBusTemp([]);
          }
        }
      })
      .catch(error => {
        console.log('Error : ', error);
      });
  };

  const SecondfetchBusList = () => {
    console.log('id:page:' + currentPage.num);
    setMoreLoader(true);
    const nextPage = currentPage.num + 1;
    postWithOutToken(baseUrl, 'module/search/rest-search', {
      f: 'BusinessByTypeLatLong',
      userId: userData != null ? userData.id : 0,
      business_type_id: businessTypeId,
      lat: default_address.location.lat,
      long: default_address.location.lng,
      langId: selectedLang,
      orderType: orderType,
      pagenumber: nextPage,
    })
      .then(response => {
        //console.log(response);
        setMoreLoader(false);

        if (response.status == true) {
          console.log('call function');
          if (response.data.length > 0) {
            setCurrentPage({
              isLoading: true,
              num: nextPage,
            });

            setBusinessList({
              isLoading: false,
              list: [...business_list.list, ...response.data],
            });

            setBusTemp([...bus_temp, ...response.data]);
          } else {
            setBusinessList({isLoading: false, list: business_list.list});

            setBusTemp(bus_temp);
          }
        }
      })
      .catch(error => {
        console.log('Error : ', error);
      });
  };

  const renderLoader = () => {
    return (
      <View
        style={{
          marginVertical: responsiveHeight(3),
          marginLeft: responsiveWidth(-5),
          marginRight: 'auto',
          width: '100%',
          height: responsiveHeight(10),
        }}>
        {viewmoreloader === true ? (
          <ActivityIndicator size="large" color={Colors.themColor} />
        ) : null}
      </View>
    );
  };

  function search_bus(val) {
    if (val != '') {
      const items = business_list.list.filter(
        item => item.name.toLowerCase().indexOf(val.toLowerCase()) !== -1,
      );
      /*if(items.length > 0){
          setCategory({
            isLoading: false,
            list:  items
          });
          //console.log(items);
        }*/
      setBusinessList({
        isLoading: false,
        list: items,
      });
    } else {
      setBusinessList({
        isLoading: false,
        list: bus_temp,
      });
    }
  }

  const confirmLogin = () => {
    Alert.alert('Please Confirm', 'Login is required for this action', [
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Go to Login',
        onPress: () => {
          navigation.navigate('login');
        },
      },
    ]);
  };

  const addToFav = (bid, index) => {
    if (userData == null) {
      confirmLogin();
    } else {
      setLoader(true);
      postWithOutToken(baseUrl, 'module/business/rest-business', {
        f: 'addtofav',
        userId: userData.id,
        bId: bid,
      })
        .then(response => {
          setLoader(false);
          let data = JSON.parse(JSON.stringify(business_list.list));

          if (response.status === true) {
            data[index].addtofav = true;

            setBusinessList({
              isLoading: false,
              list: data,
            });
          } else {
            data[index].addtofav = false;
            setBusinessList({
              isLoading: false,
              list: data,
            });
          }
        })
        .catch(error => {
          console.log('Error : ', error);
        });
    }
  };

  const BusinessCategory = item => {
    setData('orderType', JSON.stringify('1'));
    dispatch(saveOrderType('1'));
    setTimeout(() => {
      navigation.navigate('businessDetails', {
        data: item,
        tab_page: 'category',
      });
    }, 200);
  };

  return (
    <>
      <ScreenHeader title={businessTypeName} back_display={false} />
      <View
        style={{
          backgroundColor: '#FFFFFF',
          height: responsiveHeight(100),
          flex: 1,
        }}>
        {viewloader === true ? <Loader /> : null}
        <View style={styles.container_search}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Find Your Perfect Business</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              padding: scale(4),
            }}>
            <View style={styles.searchContainer}>
              <View style={styles.searchIconContainer}>
                <Icon
                  type="Feather"
                  name="search"
                  color="#000000"
                  size={20}
                  style={{position: 'relative'}}
                />
              </View>
              <TextInput
                placeholder="Search Here"
                style={styles.searchInput}
                onChangeText={text => {
                  search_bus(text);
                }}
              />
            </View>
          </View>
        </View>

        {business_list.isLoading === false && business_list.list.length > 0 ? (
          <View style={{height: responsiveHeight(100)}}>
            <FlatList
              data={business_list.list}
              ListFooterComponent={renderLoader}
              onEndReached={SecondfetchBusList}
              onEndReachedThreshold={0.1}
              keyExtractor={item => item.id}
              renderItem={({item, index}) => {
                let is_img = item.is_img;
                let is_banner = item.is_banner;

                let logo_image = require('../../assets/images/no-image.png');
                let banner_image = require('../../assets/images/no-image.png');

                if (is_img.is_img == 1) {
                  logo_image = {uri: is_img.data.secure_url};
                }

                if (is_banner.is_img == 1) {
                  banner_image = {uri: is_banner.data.secure_url};
                }

                return (
                  <>
                    <View key={'bus_' + index} style={styles.container}>
                      <TouchableOpacity
                        onPress={() => {
                          BusinessCategory(item);
                        }}>
                        <View style={styles.imageBackground}>
                          <ImageBackground
                            source={banner_image}
                            style={styles.items_image}>
                            <View style={styles.topRightIconsContainer}>
                              <ImageBackground
                                source={require('../../assets/dynamic/search_details/Ellipse40.png')}
                                style={styles.iconContainer}>
                                <Image
                                  source={require('../../assets/dynamic/search_details/cool2.png')}
                                  style={styles.icon}
                                />
                              </ImageBackground>
                              <TouchableOpacity
                                onPress={() => {
                                  addToFav(item.id, index);
                                }}
                                style={{
                                  position: 'relative',
                                  backgroundColor: '#fff',
                                  width: responsiveWidth(5),
                                  height: responsiveWidth(5),
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  borderRadius: responsiveWidth(2.5),
                                  marginLeft: responsiveWidth(1),
                                }}>
                                {item.addtofav == false ? (
                                  <Icon
                                    type="AntDesign"
                                    name="hearto"
                                    size={responsiveWidth(4)}
                                    style={{color: '#b6b6b6'}}
                                  />
                                ) : item.addtofav == true ? (
                                  <Icon
                                    type="AntDesign"
                                    name="heart"
                                    size={responsiveWidth(4)}
                                    style={{color: Colors.themColor}}
                                  />
                                ) : null}
                              </TouchableOpacity>
                            </View>
                            <Image
                              source={logo_image}
                              style={styles.brandImage}
                            />
                          </ImageBackground>
                        </View>
                        <View style={styles.textContainer}>
                          <Text style={styles.itemName}>{item.name}</Text>
                          <TouchableOpacity style={{padding: 2}}>
                            <View style={styles.ratingContainer}>
                              <Icon
                                type="Feather"
                                name="star"
                                size={9}
                                color="#FFFFFF"
                              />
                              <Text style={styles.ratingText}>
                                {item.ratings}
                              </Text>
                            </View>
                          </TouchableOpacity>
                          <View style={styles.addressContainer}>
                            <Icon
                              type="EvilIcon"
                              name="location"
                              size={20}
                              color="#F00049"
                            />
                            <Text numberOfLines={1} style={styles.addressText}>
                              {item.street}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </>
                );
              }}
              style={{marginBottom: responsiveHeight(25)}}
              contentContainerStyle={{
                backgroundColor: '#ffecf2',
                padding: scale(6),
                width: responsiveWidth(100),
              }}
              numColumns={2}
            />
          </View>
        ) : business_list.isLoading === true &&
          business_list.list.length == 0 ? (
          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              marginVertical={responsiveHeight(2)}
              marginHorizontal={responsiveWidth(4)}>
              <SkeletonPlaceholder.Item
                width={responsiveWidth(45)}
                height={responsiveHeight(16)}
                marginRight={responsiveWidth(3)}
                borderRadius={10}
              />
              <SkeletonPlaceholder.Item
                width={responsiveWidth(45)}
                height={responsiveHeight(16)}
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
                width={responsiveWidth(45)}
                height={responsiveHeight(16)}
                marginRight={responsiveWidth(3)}
                borderRadius={10}
              />
              <SkeletonPlaceholder.Item
                width={responsiveWidth(45)}
                height={responsiveHeight(16)}
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
                width={responsiveWidth(45)}
                height={responsiveHeight(16)}
                marginRight={responsiveWidth(3)}
                borderRadius={10}
              />
              <SkeletonPlaceholder.Item
                width={responsiveWidth(45)}
                height={responsiveHeight(16)}
                marginRight={responsiveWidth(3)}
                borderRadius={10}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder>
        ) : business_list.isLoading === false &&
          business_list.list.length == 0 ? (
          <Text
            style={{
              marginTop: responsiveHeight(30),
              alignSelf: 'center',
              fontFamily: FONTS.bold,
              fontSize: responsiveFontSize(2.2),
              color: Colors.red,
            }}>
            No Record Found
          </Text>
        ) : null}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: scale(10),
    marginLeft: scale(5),
    marginBottom: responsiveHeight(3),
    alignItems: 'center',
    width: responsiveWidth(46), // Adjust based on design
    height: responsiveHeight(28),
    padding: scale(5),
  },
  imageBackground: {
    width: scale(151),
    height: moderartescale(100),
    flex: 1,
    padding: scale(5),
    justifyContent: 'space-between',
  },
  items_image: {
    height: verticalscale(101),
    borderRadius: scale(10),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  topRightIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: scale(5),
  },
  iconContainer: {
    width: scale(19),
    height: scale(19),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(10),
  },
  icon: {
    width: scale(12),
    height: scale(12),
  },
  heartIcon: {
    width: scale(10),
    height: scale(10),
  },
  brandImage: {
    width: responsiveWidth(9),
    height: responsiveWidth(9),
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    resizeMode: 'cover',
    borderRadius: responsiveWidth(4.5),
  },
  textContainer: {
    width: '100%',
    marginTop: verticalscale(1),
  },
  itemName: {
    fontSize: scale(13),
    color: '#000000',
    textAlign: 'left',
    fontFamily: FONTS.Inter.medium,
  },
  ratingContainer: {
    width: scale(36),
    height: verticalscale(15),
    backgroundColor: '#3BE400',
    borderRadius: scale(3),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // padding: scale(2),
  },
  ratingImage: {
    width: scale(9),
    height: scale(9),
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: scale(12),
    fontWeight: 'bold',
    marginLeft: scale(4),
  },
  addressContainer: {
    flexDirection: 'row',
    padding: scale(2),
  },
  addressText: {
    color: '#000000',
    fontSize: scale(13),
    marginLeft: scale(2),
    //flex: 1,
    fontFamily: FONTS.Inter.regular,
  },
  container_search: {
    padding: scale(8),
    height: responsiveHeight(12),
  },
  header: {
    marginLeft: scale(6),
  },
  headerText: {
    color: '#000000',
    fontSize: scale(18),
    fontWeight: '400',
  },
  searchContainer: {
    width: responsiveWidth(80),
    height: verticalscale(40),
    padding: scale(3),
    borderWidth: 0.9,
    borderColor: '#CCCCCC',
    borderRadius: scale(17),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'red'
  },
  searchIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: scale(5),
  },
  searchInput: {
    width: responsiveWidth(70),
    height: verticalscale(40),
    padding: scale(5),
    position: 'relative',
  },
});
export default Search;

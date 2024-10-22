import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {moderartescale, scale, verticalscale} from '../../Constants/PixelRatio';
import {FlatList} from 'react-native-gesture-handler';
import {Icon} from 'react-native-basic-elements';
import {useNavigation} from '@react-navigation/native';
import {Colors} from '../../Constants/Colors';
import {FONTS} from '../../Constants/Fonts';
import Moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {showToastMsg, getData, setData} from '../../Service/localStorage';
import {postWithToken, postWithOutToken} from '../../Service/service';
import {useFocusEffect} from '@react-navigation/native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

function OrderList() {
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
    google_api_key,
  } = useSelector(state => state.common);
  const [viewloader, setLoader] = useState(false);
  const [language, setLanguage] = useState(null);
  const [orderlist, setOrderList] = useState({
    isLoading: true,
    list: [],
  });
  const [order_temp, setOrderTemp] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      getOrderList();
    }, []),
  );

  /*useEffect(() => {
    getOrderList();
  }, []);*/

  useFocusEffect(
    React.useCallback(() => {
      setLanguage(LangValue);
    }, [selectedLang]),
  );

  const getOrderList = () => {
    postWithOutToken(baseUrl, 'module/order/rest-order', {
      f: 'react_fetchallorderbyuser',
      userId: userData.id,
      langId: selectedLang,
      pagenumber: 1,
    })
      .then(response => {
        setOrderList({
          isLoading: false,
          list: response,
        });
        setOrderTemp(response);
      })
      .catch(error => {
        console.log('Error : ', error);
      });
  };

  function search_type(val) {
    if (val != '') {
      const items = orderlist.list.filter(
        item => item.id.toLowerCase().indexOf(val.toLowerCase()) !== -1,
      );
      /*if(items.length > 0){
          setCategory({
            isLoading: false,
            list:  items
          });
          //console.log(items);
        }*/
      setOrderList({
        isLoading: false,
        list: items,
      });
    } else {
      setOrderList({
        isLoading: false,
        list: order_temp,
      });
    }
  }

  const displayVal = val => {
    if (val === '0') {
      return 'Pending';
    }
    if (val === '1') {
      return 'Accepted By Restaurant';
    }
    if (val === '2') {
      return 'Accepted by Driver';
    }
    if (val === '3') {
      return 'Delivery Complete by Driver';
    }
    if (val === '4') {
      return 'Completed by Resturant';
    }
    if (val === '5') {
      return 'Complete';
    }
    if (val === '6') {
      return 'Cancelled by Resturant';
    }
    if (val === '7') {
      return 'Rejected by Driver';
    }
    if (val === '8') {
      return 'Cancelled';
    }
    if (val === '9') {
      return 'Pickup Complete by Driver';
    }
    if (val === '10') {
      return 'Pickup Complete from user by Driver';
    }
    if (val === '11') {
      return 'Delivery Complete to Business by Driver';
    }
    if (val === '12') {
      return 'Verified by Resturant';
    }
  };

  const displayValColor = val => {
    if (val === '0') {
      return '#ee4336';
    }
    if (val === '1') {
      return '#e6b90e';
    }
    if (val === '2') {
      return '#e6b90e';
    }
    if (val === '3') {
      return '#4ac112';
    }
    if (val === '4') {
      return '#4ac112';
    }
    if (val === '5') {
      return '#4ac112';
    }
    if (val === '6') {
      return '#FF0000';
    }
    if (val === '7') {
      return '#FF0000';
    }
    if (val === '8') {
      return '#FF0000';
    }
    if (val === '9') {
      return '#4ac112';
    }
    if (val === '10') {
      return '#e6b90e';
    }
    if (val === '11') {
      return '#e6b90e';
    }
    if (val === '12') {
      return '#4ac112';
    }
  };

  return (
    <>
      <View style={styles.search_container}>
        <View style={styles.searchBox}>
          <View style={styles.iconContainer}>
            <Icon name="search" size={scale(20)} color="#000000" />
          </View>
          <TextInput
            placeholder="Search By Order Id"
            style={styles.textInput}
            onChangeText={text => {
              search_type(text);
            }}
          />
        </View>
      </View>
      {orderlist.isLoading === false && orderlist.list.length > 0 ? (
        <FlatList
          data={orderlist.list}
          keyExtractor={item => item?.id?.toString()}
          style={{
            width: responsiveScreenWidth(100),
            // height:responsiveHeight(100),
            padding: moderartescale(5),
            marginBottom: moderartescale(65),
          }}
          renderItem={({item}) => {
            return (
              <View style={[styles.container]}>
                <View style={styles.content}>
                  <View style={styles.header}>
                    <Text
                      style={{
                        color: displayValColor(item.status),
                        fontFamily: FONTS.Inter.bold,
                        fontSize: responsiveFontSize(1.8),
                      }}>
                      {displayVal(item.status)}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('orderDetails', {
                          order_id: item.id,
                        })
                      }
                      style={styles.button}>
                      <Text style={styles.buttonText}>View</Text>
                    </TouchableOpacity>
                  </View>
                  <View>
                    <View style={styles.infoRow}>
                      <Icon
                        type="FontAwesome"
                        name="briefcase"
                        size={15}
                        color="#000000"
                      />
                      <Text style={styles.infoText}>Name : {item.bname}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Icon
                        type="Entypo"
                        name="clipboard"
                        size={15}
                        color="#000000"
                      />

                      <Text style={styles.infoText}>Order ID : #{item.id}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Icon
                        type="FontAwesome5"
                        name="money-check"
                        size={15}
                        color="#000000"
                      />
                      <Text style={styles.infoText}>
                        Order Value : {item.currency_symbol}
                        {item.total}
                      </Text>
                    </View>

                    {item.review.length == 0 ? (
                      <TouchableOpacity
                        style={styles.reviewContainer}
                        onPress={() =>
                          navigation.navigate('orderReview', {
                            order_id: item.id,
                            page: 'orderList',
                          })
                        }>
                        <Icon
                          type="FontAwesome"
                          name="star"
                          color={Colors.themColor}
                          size={20}
                        />
                        <Text style={styles.reviewText}>Review</Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>
              </View>
            );
          }}
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: responsiveHeight(15),
          }}
        />
      ) : orderlist.isLoading === false && orderlist.list.length == 0 ? (
        <View>
          <Text
            style={{
              marginTop: responsiveHeight(30),
              alignSelf: 'center',
              fontFamily: FONTS.Inter.bold,
              fontSize: 18,
              color: Colors.red,
            }}>
            No Record Found{' '}
          </Text>
        </View>
      ) : (
        <View>
          <SkeletonPlaceholder borderRadius={4}>
            <View
              style={{
                width: '95%',
                alignSelf: 'center',
                marginTop: responsiveHeight(2),
              }}>
              <View style={{height: responsiveHeight(15), borderRadius: 10}} />
            </View>
            <View
              style={{
                width: '95%',
                alignSelf: 'center',
                marginTop: responsiveHeight(2),
              }}>
              <View style={{height: responsiveHeight(15), borderRadius: 10}} />
            </View>
            <View
              style={{
                width: '95%',
                alignSelf: 'center',
                marginTop: responsiveHeight(2),
              }}>
              <View style={{height: responsiveHeight(15), borderRadius: 10}} />
            </View>
            <View
              style={{
                width: '95%',
                alignSelf: 'center',
                marginTop: responsiveHeight(2),
              }}>
              <View style={{height: responsiveHeight(15), borderRadius: 10}} />
            </View>
          </SkeletonPlaceholder>
        </View>
      )}
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    width: moderartescale(346),
    borderWidth: moderartescale(1),
    borderColor: Colors.themColor,
    borderRadius: moderartescale(10),
    height: moderartescale(187),
    marginTop: moderartescale(15),
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: moderartescale(14),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: moderartescale(5),
  },
  button: {
    backgroundColor: Colors.themColor,
    height: verticalscale(21),
    width: moderartescale(50),
    borderRadius: moderartescale(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderartescale(5),
  },
  icon: {
    width: moderartescale(11),
    height: moderartescale(11),
  },
  infoText: {
    textAlign: 'center',
    marginLeft: moderartescale(8),
  },
  reviewContainer: {
    height: verticalscale(35),
    width: moderartescale(149),
    borderWidth: moderartescale(1),
    borderColor: Colors.themColor,
    borderRadius: moderartescale(5),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: moderartescale(5),
  },
  reviewText: {
    fontSize: moderartescale(14),
    color: Colors.themColor,
    padding: moderartescale(5),
  },
  search_container: {
    margin: moderartescale(5),
    // backgroundColor:"red"
    //   padding: moderartescale(10),
  },
  searchBox: {
    width: moderartescale(346), // 90% of screen width
    height: verticalscale(42),
    padding: moderartescale(10),
    borderWidth: moderartescale(0.9),
    borderColor: '#CCCCCC',
    borderRadius: moderartescale(30),
    flexDirection: 'row',
    alignItems: 'center',
    margin: 'auto',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    height: verticalscale(42),
    color: '#000000',
  },
});
export default OrderList;

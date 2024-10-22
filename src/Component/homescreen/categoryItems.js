import React, {useEffect, useState} from 'react';
import {Text, TextInput, ImageBackground, Modal, Pressable} from 'react-native';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Vibration,
  View,
  BackHandler,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {
  fonstSizeDynamic,
  moderartescale,
  scale,
  verticalscale,
} from '../../Constants/PixelRatio';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import {Icon} from 'react-native-basic-elements';
import {FONTS} from '../../Constants/Fonts';
import {Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Colors} from '../../Constants/Colors';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useDispatch, useSelector} from 'react-redux';
import {
  setCartDetails,
  setCartQuantity,
  saveOrderType,
} from '../../Store/Reducers/CommonReducer';
import {showToastMsg, getData, setData} from '../../Service/localStorage';
import {postWithToken, postWithOutToken} from '../../Service/service';
import {useFocusEffect} from '@react-navigation/native';

function CategoryItem() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {
    baseUrl,
    siteUrl,
    userToken,
    userData,
    selectedLang,
    LangValue,
    cartDetails,
    orderType,
  } = useSelector(state => state.common);
  const [visible, setvisible] = useState(false);
  const [viewloader, setLoader] = useState(false);

  const [bustype, setBusType] = useState({
    isLoading: true,
    list: [],
  });

  const [language, setLanguage] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      setLanguage(LangValue);
    }, [selectedLang]),
  );

  const [bustype_temp, setBusTypeTemp] = useState([]);

  useEffect(() => {
    BusinessType();
  }, []);

  const BusinessType = () => {
    postWithOutToken(baseUrl, 'module/business/rest-business', {
      f: 'allbusinesstype',
      langId: selectedLang,
    })
      .then(response => {
        console.log(response);
        setBusType({isLoading: false, list: response});
        setBusTypeTemp(response);
      })
      .catch(error => {
        console.log('Error : ', error);
      });
  };

  function search_type(val) {
    if (val != '') {
      const items = bustype.list.filter(
        item => item.name.toLowerCase().indexOf(val.toLowerCase()) !== -1,
      );
      /*if(items.length > 0){
          setCategory({
            isLoading: false,
            list:  items
          });
          //console.log(items);
        }*/
      setBusType({
        isLoading: false,
        list: items,
      });
    } else {
      setBusType({
        isLoading: false,
        list: bustype_temp,
      });
    }
  }

  const [business_type_id, setBusinessTypeId] = useState('');
  const [business_type_name, setBusinessTypeName] = useState('');

  const selectBusinessType = (business_type, id) => {
    if (business_type == 'Restaurant') {
      setvisible(true);
      setBusinessTypeId(id);
      setBusinessTypeName(business_type);
    } else {
      setData('orderType', JSON.stringify('1'));
      dispatch(saveOrderType('1'));
      setTimeout(() => {
        navigation.navigate('Search', {
          businessTypeId: id,
          businessTypeName: business_type,
          time: new Date().toJSON(),
        });
      }, 200);
    }
  };

  const updateOrderType = ordertype => {
    setvisible(false);
    setData('orderType', JSON.stringify(ordertype));
    dispatch(saveOrderType(ordertype));

    setTimeout(() => {
      navigation.navigate('Search', {
        businessTypeId: business_type_id,
        businessTypeName: business_type_name,
        time: new Date().toJSON(),
      });
    }, 200);
  };

  return (
    <>
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Icon
            type="Feather"
            name="search"
            color="#000000"
            size={20}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.textInput}
            onChangeText={text => {
              search_type(text);
            }}
          />
        </View>
      </View>
      <View style={styles.main_container}>
        {/* // modal vesible  onpress category items */}
        <Modal
          transparent={true}
          visible={visible}
          animationType="slide"
          onRequestClose={() => setvisible(false)}>
          <View style={styles.modal_main}>
            <View style={styles.inner_modalView}>
              <Text style={styles.modal_header}>Please Select One</Text>

              <View style={styles.modal_view}>
                <TouchableOpacity
                  onPress={() => {
                    updateOrderType('2');
                  }}
                  style={styles.modal_touchable}>
                  <Image
                    source={require('../../assets/dynamic/delivery-man.png')}
                    style={{height: scale(24), width: scale(24)}}
                  />
                  <Text
                    style={{
                      color: '#000000',
                      fontSize: fonstSizeDynamic(2),
                      marginLeft: scale(5),
                    }}>
                    Pickup
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    updateOrderType('1');
                  }}
                  style={styles.modal_touchable}>
                  <Image
                    source={require('../../assets/dynamic/fast-delivery.png')}
                    style={{height: scale(24), width: scale(24)}}
                  />
                  <Text
                    style={{
                      color: '#000000',
                      fontSize: fonstSizeDynamic(2),
                      marginLeft: scale(5),
                    }}>
                    Delivery
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {bustype.isLoading === false && bustype.list.length > 0 ? (
          <FlatList
            data={bustype.list}
            renderItem={({item, index}) => {
              return (
                <>
                  <Pressable
                    key={index}
                    style={styles.item_main}
                    onPress={() => {
                      selectBusinessType(item.name, item.id);
                    }}>
                    <View style={styles.items}>
                      {item.img != null ? (
                        <Image
                          source={{uri: item.img}}
                          style={styles.item_image}
                        />
                      ) : (
                        <Image source={item.image} style={styles.item_image} />
                      )}

                      <Text style={styles.item_text}>{item.name}</Text>
                    </View>
                  </Pressable>
                </>
              );
            }}
            numColumns={2}
            style={{
              width: Dimensions.get('screen').width,
              marginBottom: verticalscale(65),
            }}
            contentContainerStyle={{
              justifyContent: 'center',
            }}
          />
        ) : bustype.isLoading === true ? (
          <View
            style={{
              paddingHorizontal: responsiveWidth(6),
              backgroundColor: Colors.white,
            }}>
            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item
                flexDirection="row"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                marginBottom={responsiveHeight(2)}>
                <SkeletonPlaceholder.Item
                  width={responsiveWidth(40)}
                  height={responsiveHeight(18)}
                  marginRight={responsiveWidth(3)}
                  borderRadius={10}
                />
                <SkeletonPlaceholder.Item
                  width={responsiveWidth(40)}
                  height={responsiveHeight(18)}
                  borderRadius={10}
                />
              </SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item
                flexDirection="row"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                marginBottom={responsiveHeight(2)}>
                <SkeletonPlaceholder.Item
                  width={responsiveWidth(40)}
                  height={responsiveHeight(18)}
                  marginRight={responsiveWidth(3)}
                  borderRadius={10}
                />
                <SkeletonPlaceholder.Item
                  width={responsiveWidth(40)}
                  height={responsiveHeight(18)}
                  borderRadius={10}
                />
              </SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item
                flexDirection="row"
                display="flex"
                alignItems="center"
                justifyContent="space-between">
                <SkeletonPlaceholder.Item
                  width={responsiveWidth(40)}
                  height={responsiveHeight(18)}
                  marginRight={responsiveWidth(3)}
                  borderRadius={10}
                />
                <SkeletonPlaceholder.Item
                  width={responsiveWidth(40)}
                  height={responsiveHeight(18)}
                  borderRadius={10}
                />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
          </View>
        ) : bustype.isLoading === false && bustype.list.length == 0 ? (
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: responsiveHeight(35),
            }}>
            <Text
              style={{
                alignSelf: 'center',
                fontFamily: FONTS.Inter.regular,
                fontSize: responsiveFontSize(2),
                color: Colors.red,
              }}>
              No Active Category Found
            </Text>
          </View>
        ) : null}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  main_container: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
    backgroundColor: Colors.white,
  },
  item_main: {
    //  marginBottom:verticalscale(60)
  },
  items: {
    width: Dimensions.get('screen').width * 0.46,
    height: verticalscale(120),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderartescale(10),
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 2,
    shadowRadius: 4,
    elevation: 3,
    margin: moderartescale(5),
    backgroundColor: Colors.white,
    // gap:10
  },
  item_image: {
    height: verticalscale(50),
    width: scale(50),
  },
  item_text: {
    height: verticalscale(22),
    fontSize: fonstSizeDynamic(2),
    color: Colors.black,
    fontFamily: FONTS.Inter.medium,
  },
  modal_main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner_modalView: {
    width: scale(300),
    height: verticalscale(122),
    padding: scale(20),
    backgroundColor: 'white',
    borderRadius: scale(10),
    alignItems: 'center',
    elevation: 5, // for Android shadow
    shadowColor: Colors.black, // for iOS shadow
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: scale(4),
  },
  modal_header: {
    fontSize: fonstSizeDynamic(2),
    color: Colors.black,
    fontWeight: '500',
  },
  modal_view: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: verticalscale(5),
  },
  modal_touchable: {
    width: scale(130),
    height: verticalscale(40),
    borderWidth: scale(0.9),
    borderColor: '#CCCCCC',
    borderRadius: scale(8),
    // backgroundColor: Colors.themColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    padding: moderateScale(10),
  },
  searchBox: {
    height: verticalScale(43),
    padding: 10,
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
    height: responsiveHeight(5),
    width: responsiveWidth(95),
    marginLeft: 4,
  },
});
export default CategoryItem;

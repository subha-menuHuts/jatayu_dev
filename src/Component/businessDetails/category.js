import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {
  fonstSizeDynamic,
  scale,
  verticalscale,
} from '../../Constants/PixelRatio';
import {FONTS} from '../../Constants/Fonts';
import {Icon} from 'react-native-basic-elements';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {showToastMsg, getData, setData} from '../../Service/localStorage';
import {postWithToken, postWithOutToken} from '../../Service/service';
import {useFocusEffect} from '@react-navigation/native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Loader from '../../Component/loader';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

function Category({business_data}) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {
    baseUrl,
    siteUrl,
    userToken,
    userData,
    selectedLang,
    LangValue,
    orderType,
    deviceToken,
    google_api_key,
    google_auto_complete_country,
  } = useSelector(state => state.common);
  const [viewloader, setLoader] = useState(false);
  const [language, setLanguage] = useState(null);
  const [preorderDetails, setPreorderDetails] = useState({
    preorder: false,
    preorderDate: '',
    preorderTime: '',
    preorderMenu: 0,
  });

  const [categoryDetails, setCategoryDetails] = useState({
    isLoading: true,
    list: [],
  });

  useFocusEffect(
    React.useCallback(() => {
      setLanguage(LangValue);
    }, [selectedLang]),
  );

  useEffect(() => {
    fetchCategory(business_data.id);
  }, [business_data]);

  const fetchCategory = id => {
    postWithOutToken(baseUrl, 'module/product/rest-product', {
      f: 'getproductbybusiness',
      Id: id,
      langId: selectedLang,
      type: 3,
      preorder: preorderDetails,
    })
      .then(response => {
        console.log(response);
        setCategoryDetails({isLoading: false, list: response.category});
      })
      .catch(error => {
        console.log('Error : ', error);
      });
  };

  return (
    <>
      <View
        style={{
          width: responsiveWidth(100),
          flex: 1,
        }}>
        {categoryDetails.isLoading === false &&
        categoryDetails.list.length > 0 ? (
          <FlatList
            data={categoryDetails.list}
            keyExtractor={item => item.id}
            renderItem={({item, index}) => {
              return (
                <React.Fragment>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('businessCategory', {
                        cat_id: item.id,
                        cat: categoryDetails.list,
                        cat_index: index,
                        business_data: business_data,
                      })
                    }>
                    <View style={styles.container}>
                      <View style={styles.content}>
                        <View style={styles.leftSection}>
                          {item.is_img == 0 ? (
                            <Image
                              source={require('../../assets/images/no-image.png')}
                              style={styles.image}
                            />
                          ) : item.is_img == 1 ? (
                            <Image
                              source={{uri: item.img}}
                              style={styles.image}
                            />
                          ) : null}

                          <Text style={styles.text}>{item.name}</Text>
                        </View>
                        <View style={styles.rightSection}>
                          <Icon
                            type="Feather"
                            name="chevron-right"
                            size={20}
                            color="#000000"
                          />
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </React.Fragment>
              );
            }}
            style={{
              padding: 10,
              height: responsiveWidth(100),
              marginBottom: responsiveHeight(50),
            }}
            contentContainerStyle={{
              alignItems: 'center',
            }}
          />
        ) : categoryDetails.isLoading === true &&
          categoryDetails.list.length == 0 ? (
          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              marginVertical={responsiveHeight(2)}
              marginHorizontal={responsiveWidth(4)}>
              <SkeletonPlaceholder.Item
                width={responsiveWidth(90)}
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
                width={responsiveWidth(90)}
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
                width={responsiveWidth(90)}
                height={responsiveHeight(12)}
                marginRight={responsiveWidth(3)}
                borderRadius={10}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder>
        ) : (
          <Text
            style={{
              marginTop: responsiveHeight(10),
              alignSelf: 'center',
              fontFamily: FONTS.bold,
              fontSize: responsiveFontSize(2.2),
              color: Colors.red,
            }}>
            No Record Found
          </Text>
        )}
      </View>
    </>
  );
}

// styles for css
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    width: scale(310),
    height: verticalscale(60),
    marginBottom: verticalscale(10),
    borderBottomColor: '#D9D9D9',
    borderBottomWidth: 1,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: responsiveWidth(10),
    height: responsiveWidth(10),
    borderRadius: responsiveWidth(5),
    resizeMode: 'contain',
  },
  text: {
    color: '#000000',
    fontSize: fonstSizeDynamic(2),
    marginLeft: scale(17),
    fontWeight: '700',
    fontFamily: FONTS.Inter.Inter_18pt_Medium,
  },
  rightSection: {
    justifyContent: 'center',
  },
  nextImage: {
    // Assuming the next image has specific dimensions, adjust as needed
  },
});

export default Category;

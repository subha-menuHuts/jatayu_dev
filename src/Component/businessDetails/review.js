import {FlatList} from 'react-native-gesture-handler';
import {moderartescale, scale, verticalscale} from '../../Constants/PixelRatio';

import {Icon} from 'react-native-basic-elements';
import {FONTS} from '../../Constants/Fonts';
import {Colors} from '../../Constants/Colors';

import React, {useEffect, useState, useRef} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {showToastMsg, getData, setData} from '../../Service/localStorage';
import {postWithToken, postWithOutToken} from '../../Service/service';
import {useFocusEffect} from '@react-navigation/native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Loader from '../../Component/loader';
import {useNavigation} from '@react-navigation/native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {Rating} from 'react-native-ratings';

function Review({business_data}) {
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
    google_auto_complete_country,
  } = useSelector(state => state.common);
  const [viewloader, setLoader] = useState(false);
  const [language, setLanguage] = useState(null);
  const [review_list, setReviewList] = useState({isLoading: true, list: []});

  useFocusEffect(
    React.useCallback(() => {
      setLanguage(LangValue);
    }, [selectedLang]),
  );

  useEffect(() => {
    fetchReviewList(business_data.id);
  }, [business_data]);

  const fetchReviewList = id => {
    postWithOutToken(baseUrl, 'module/business/rest-business', {
      f: 'react_businessreview',
      langId: selectedLang,
      Id: id,
    })
      .then(response => {
        console.log(response);
        if (response.status == true) {
          setReviewList({
            isLoading: false,
            list: response.data,
          });
        }
      })
      .catch(error => {
        console.log('Error : ', error);
      });
  };

  return (
    <View
      style={{
        width: responsiveWidth(100),
      }}>
      {review_list.isLoading === false && review_list.list.length > 0 ? (
        <FlatList
          data={review_list.list}
          renderItem={({item, index}) => {
            return (
              <View
                key={'rev_' + index}
                style={[styles.review_container, {width: responsiveWidth(97)}]}>
                <View style={styles.review_row}>
                  {item.img != '' ? (
                    <Image
                      style={styles.review_image}
                      source={{uri: item.img}}
                    />
                  ) : (
                    <Image
                      style={styles.review_image}
                      source={require('../../assets/images/profile.png')}
                    />
                  )}

                  <View style={styles.review_textContainer}>
                    <Text numberOfLines={2} style={[styles.review_text_bold]}>
                      {item.name}
                    </Text>
                    <Text numberOfLines={2} style={styles.review_text}>
                      {item.comment}
                    </Text>
                  </View>
                </View>

                <View style={styles.review_row_star}>
                  <View style={{marginLeft: responsiveWidth(16)}}>
                    <Rating
                      type="star"
                      readonly={true}
                      startingValue={item.average}
                      ratingCount={5}
                      imageSize={20}
                    />
                    {item.review}
                  </View>

                  <Text>{item.date}</Text>
                </View>
              </View>
            );
          }}
          style={{
            marginBottom: responsiveHeight(50),
          }}
          keyExtractor={item => item.id}
          contentContainerStyle={{
            width: responsiveWidth(100),
          }}
        />
      ) : review_list.isLoading === true && review_list.list.length == 0 ? (
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            marginVertical={responsiveHeight(2)}
            marginHorizontal={responsiveWidth(4)}>
            <SkeletonPlaceholder.Item
              width={responsiveWidth(90)}
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
              width={responsiveWidth(90)}
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
              width={responsiveWidth(90)}
              height={responsiveHeight(16)}
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
  );
}

const styles = StyleSheet.create({
  container: {
    width: '90%', // Adjust based on layout.width or other responsive needs
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: scale(10),
    marginTop: verticalscale(10),
    overflow: 'hidden',
    height: verticalscale(92),
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(4),
  },
  row: {
    flexDirection: 'row',
    // padding: scale(15),
    width: '100%',
  },
  image: {
    width: scale(50),
    height: scale(50),
    marginLeft: scale(10),
  },
  textContainer: {
    flex: 1,
    marginLeft: scale(10),
  },
  text: {
    color: '#000000',
    fontSize: moderartescale(13),
    fontFamily: FONTS.Inter.regular,
  },
  review_container: {
    width: '90%', // Adjust based on layout.width or other responsive needs
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: scale(10),
    marginTop: verticalscale(10),
    overflow: 'hidden',
    height: verticalscale(92),
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(4),
  },
  review_row: {
    flexDirection: 'row',
    width: '100%',
  },
  review_row_star: {
    // padding: scale(15),
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  review_image: {
    marginLeft: scale(10),
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    resizeMode: 'cover',
    borderRadius: responsiveWidth(6),
  },
  review_textContainer: {
    flex: 1,
    marginLeft: scale(10),
  },
  review_text: {
    color: '#000000',
    fontSize: moderartescale(13),
    fontFamily: FONTS.Inter.regular,
  },
  review_text_bold: {
    color: '#000000',
    fontSize: responsiveFontSize(2),
    fontFamily: FONTS.Inter.bold,
  },
});
export default Review;

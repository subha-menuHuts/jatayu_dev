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

function Photo({business_data}) {
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
  const [photo_list, setPhotoList] = useState({isLoading: true, list: []});

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
      f: 'react_businessphoto',
      Id: id,
    })
      .then(response => {
        console.log(response);
        if (response.status == true) {
          setPhotoList({
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
    <>
      {photo_list.isLoading === false && photo_list.list.length > 0 ? (
        <FlatList
          data={photo_list.list}
          renderItem={({item, index}) => {
            return (
              <View key={'photo_' + index} style={styles.container}>
                <View>
                  <Image source={{uri: item}} style={styles.imageView} />
                </View>
              </View>
            );
          }}
          style={{
            marginBottom: responsiveHeight(50),
          }}
          contentContainerStyle={{
            backgroundColor: '#ffecf2',
            padding: scale(6),
          }}
          numColumns={2}
        />
      ) : photo_list.isLoading === true && photo_list.list.length == 0 ? (
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            marginVertical={responsiveHeight(2)}
            marginHorizontal={responsiveWidth(4)}>
            <SkeletonPlaceholder.Item
              width={responsiveWidth(45)}
              height={responsiveHeight(14)}
              marginRight={responsiveWidth(3)}
              borderRadius={10}
            />
            <SkeletonPlaceholder.Item
              width={responsiveWidth(45)}
              height={responsiveHeight(14)}
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
              height={responsiveHeight(14)}
              marginRight={responsiveWidth(3)}
              borderRadius={10}
            />
            <SkeletonPlaceholder.Item
              width={responsiveWidth(45)}
              height={responsiveHeight(14)}
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
              height={responsiveHeight(14)}
              marginRight={responsiveWidth(3)}
              borderRadius={10}
            />
            <SkeletonPlaceholder.Item
              width={responsiveWidth(45)}
              height={responsiveHeight(14)}
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: scale(10),
    marginLeft: scale(5),
    marginTop: verticalscale(3),
    alignItems: 'center',
    width: responsiveWidth(45), // Adjust based on design
    height: responsiveWidth(45),
    padding: scale(5),
  },
  imageView: {
    width: responsiveWidth(40),
    height: responsiveWidth(40),
  },
});

export default Photo;

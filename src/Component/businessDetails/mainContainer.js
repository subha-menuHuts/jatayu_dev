import {
  fonstSizeDynamic,
  scale,
  verticalscale,
} from '../../Constants/PixelRatio';

import {Icon} from 'react-native-basic-elements';
import {FONTS} from '../../Constants/Fonts';
import {Colors} from '../../Constants/Colors';

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
  Linking,
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

function MainContainerHeader({business_data, addToFav}) {
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

  useFocusEffect(
    React.useCallback(() => {
      setLanguage(LangValue);
    }, [selectedLang]),
  );

  let is_img = business_data.is_img;

  let logo_image = require('../../assets/images/no-image.png');

  if (is_img.is_img == 1) {
    logo_image = {uri: is_img.data.secure_url};
  }

  const OpenEmail = () => {
    Linking.openURL('mailto:' + business_data.email);
  };

  return (
    <>
      <View
        style={{
          width: responsiveWidth(100),
        }}>
        <View style={styles.container}>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              marginHorizontal: responsiveWidth(1),
            }}>
            <Text style={styles.headerText}>Business Profile</Text>
            {business_data.open == true ? (
              <Text style={styles.openHoursText}>Open</Text>
            ) : business_data.open == false ? (
              <Text style={styles.openHoursTextClose}>Close</Text>
            ) : null}
          </View>

          <View style={styles.row}>
            <Image source={logo_image} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={styles.text}>{business_data.name}</Text>
              <Image
                source={require('../../assets/dynamic/shield1.png')}
                style={styles.sheild}
              />
            </View>
          </View>

          <View style={{marginTop: verticalscale(10)}}>
            <View style={styles.row}>
              <Icon
                type="EvilIcon"
                name="location"
                color="#333333"
                size={scale(20)}
              />
              <Text style={styles.iconText}>{business_data.street}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Icon
              type="EvilIcon"
              name="clock"
              color="#000000"
              size={scale(20)}
            />

            <Text style={styles.openHoursText}>Open 24 hrs</Text>
          </View>

          <View style={styles.ratingsContainer}>
            <View style={styles.mutiple_image}>
              <Image
                source={require('../../assets/dynamic/Ellipse50.png')}
                style={styles.ratingsImage}
              />
              <Image
                source={require('../../assets/dynamic/Ellipse50.png')}
                style={styles.ratingsImage}
              />
              <Image
                source={require('../../assets/dynamic/Ellipse50.png')}
                style={styles.ratingsImage}
              />
              <ImageBackground
                source={require('../../assets/dynamic/Ellipse53.png')}
                style={styles.ratingsBackgroundImage}>
                <Image
                  source={require('../../assets/dynamic/Ellipse54.png')}
                  style={{marginHorizontal: scale(5)}}
                />
                <Image source={require('../../assets/dynamic/Ellipse54.png')} />
              </ImageBackground>
            </View>
            <View style={styles.mutiple_image}>
              <Image
                source={require('../../assets/dynamic/star14.png')}
                style={styles.starImage}
              />
              <Text style={styles.ratingText}>{business_data.ratings}</Text>
              <Text style={styles.ratingCountText}>
                ({business_data.reviews} Ratings)
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.buttonRow}>
          {business_data.addtofav == false ? (
            <TouchableOpacity
              onPress={() => {
                addToFav(business_data.id);
              }}
              style={[styles.button, styles.favoriteButtonFalse]}>
              <Icon
                type="AntDesign"
                name="hearto"
                size={responsiveWidth(4)}
                style={{color: '#b6b6b6'}}
              />
              <Text style={[styles.buttonText, styles.favoriteButtonTextFalse]}>
                Favorite
              </Text>
            </TouchableOpacity>
          ) : business_data.addtofav == true ? (
            <TouchableOpacity
              onPress={() => {
                addToFav(business_data.id);
              }}
              style={[styles.button, styles.favoriteButton]}>
              <Icon
                type="AntDesign"
                name="heart"
                size={responsiveWidth(4)}
                style={{color: Colors.white}}
              />
              <Text style={[styles.buttonText, styles.favoriteButtonText]}>
                Favorite
              </Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            onPress={() => {
              OpenEmail();
            }}
            style={[styles.button, styles.emailButton]}>
            <Text style={[styles.buttonText, styles.emailButtonText]}>
              Email Us
            </Text>
          </TouchableOpacity>
        </View>
        {/* </View> */}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: scale(10),
    backgroundColor: '#FFFFFF',
  },
  headerText: {
    color: '#000000',
    fontSize: fonstSizeDynamic(2),
    fontWeight: '700',
    fontFamily: FONTS.Inter.medium,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalscale(10),
  },
  image: {
    width: scale(62),
    height: verticalscale(66),
  },
  textContainer: {
    flexDirection: 'row',
    marginLeft: scale(20),
  },
  text: {
    color: '#000000',
    fontSize: fonstSizeDynamic(2),
    fontWeight: '700',
    fontFamily: FONTS.Inter.medium,
  },
  iconText: {
    color: '#333333',
    fontSize: fonstSizeDynamic(2),
    marginLeft: scale(10),
    fontWeight: '600',
    fontFamily: FONTS.Inter.regular,
  },
  openHoursText: {
    color: '#40DD08',
    fontSize: fonstSizeDynamic(2),
    marginLeft: scale(10),
    fontWeight: '600',
    fontFamily: FONTS.Inter.medium,
  },
  openHoursTextClose: {
    color: Colors.themColor,
    fontSize: fonstSizeDynamic(2),
    marginLeft: scale(10),
    fontWeight: '600',
    fontFamily: FONTS.Inter.medium,
  },
  ratingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor:'red',
    // padding:scale(4),
    marginTop: verticalscale(10),
    // display:'flex',
    // alignItems:'center'
  },
  mutiple_image: {
    flexDirection: 'row',
    padding: scale(4),
    alignItems: 'center',
  },
  ratingsImage: {
    width: scale(19),
    height: verticalscale(19),
    marginLeft: scale(-10),
  },
  ratingsBackgroundImage: {
    width: scale(19),
    height: verticalscale(19),
    marginLeft: scale(-10),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  starImage: {
    width: scale(13),
    height: scale(13),
  },
  ratingText: {
    color: '#000000',
    width: scale(22),
    height: verticalscale(17),
    marginLeft: scale(5),
    fontSize: fonstSizeDynamic(2),

    fontFamily: FONTS.Inter.medium,
  },
  ratingCountText: {
    color: '#888888',
    fontSize: fonstSizeDynamic(2),
    marginLeft: scale(5),
    fontFamily: FONTS.Inter.medium,
  },
  buttonRow: {
    flexDirection: 'row',
    // justifyContent: 'space-evenly',
    width: responsiveScreenWidth(100),
    marginTop: verticalscale(10),
    // backgroundColor: 'green'
  },
  button: {
    width: scale(163),
    height: verticalscale(40),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(10),
    padding: scale(5),
  },
  favoriteButton: {
    backgroundColor: '#F00049',
  },
  favoriteButtonFalse: {
    backgroundColor: '#FFFFFF',
    borderWidth: scale(2),
    borderColor: '#F00049',
  },
  favoriteButtonTextFalse: {
    color: '#F00049',
  },
  emailButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: scale(2),
    borderColor: '#F00049',
    marginLeft: scale(10),
  },
  buttonIcon: {
    width: scale(14),
    height: scale(14),
  },
  buttonText: {
    fontSize: fonstSizeDynamic(2),
    marginLeft: scale(10),
    fontWeight: '500',
    fontFamily: FONTS.Inter.medium,
  },
  favoriteButtonText: {
    color: '#FFFFFF',
  },
  emailButtonText: {
    color: '#F00049',
  },
  sheild: {
    height: verticalscale(18),
    width: scale(18),
  },
});

export default MainContainerHeader;

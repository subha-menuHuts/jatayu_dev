import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  PanResponder,
  Animated,
  TouchableOpacity,
  Text,
  ImageBackground,
  Pressable,
} from 'react-native';
import {
  responsiveHeight,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import Header from '../../Component/homescreen/header';
import CategoryItem from '../../Component/homescreen/categoryItems';
import {moderartescale, scale, verticalscale} from '../../Constants/PixelRatio';
import {Icon} from 'react-native-basic-elements';
import {useNavigation} from '@react-navigation/native';
import CartButton from '../../Component/CartButton/CartButton';
import {Colors} from '../../Constants/Colors';
import {useDispatch, useSelector} from 'react-redux';
import {setUserData} from '../../Store/Reducers/CommonReducer';
import {showToastMsg, getData, setData} from '../../Service/localStorage';
import {postWithOutToken, postWithToken} from '../../Service/service';
import {useFocusEffect} from '@react-navigation/native';

function HomeScren({navigation, route}) {
  //const navigation = useNavigation();
  const dispatch = useDispatch();
  const {
    baseUrl,
    siteUrl,
    userData,
    selectedLang,
    userToken,
    LangValue,
    deviceToken,
    google_api_key,
  } = useSelector(state => state.common);

  const [viewloader, setLoader] = useState(false);
  const [language, setLanguage] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      setLanguage(LangValue);
    }, [selectedLang]),
  );

  useEffect(() => {}, []);

  return (
    <View style={styles.main_container}>
      <View style={styles.list_container}>
        <Header />
        <CategoryItem />
      </View>
      <CartButton />
    </View>
  );
}

const styles = StyleSheet.create({
  main_container: {
    height: responsiveScreenHeight(100),
    width: responsiveScreenWidth(100),
    flex: 1,
    backgroundColor: Colors.white,
  },
  list_container: {
    marginBottom: verticalscale(57),
    backgroundColor: Colors.white,
  },
  containerimage: {
    position: 'absolute',
    width: scale(45),
    height: verticalscale(45),
    right: scale(10),
    bottom: moderartescale(30),
    zIndex: 1,
    borderRadius: moderartescale(50),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
});
export default HomeScren;

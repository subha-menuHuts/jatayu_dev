import {
  Image,
  ImageBackground,
  Keyboard,
  StyleSheet,
  View,
  ScrollView,
} from 'react-native';
import {useEffect, useState} from 'react';
import {moderartescale, scale, verticalscale} from '../Constants/PixelRatio';
import UserLogin from '../Component/auth/login';
import Usersignup from '../Component/auth/signup';
import ToogleButton from '../Component/tooglebutton';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

function Userloginsignup({navigation}) {
  const [initial, setinitial] = useState('login');
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      event => {
        console.log(event.endCoordinates.height, 'height,....');
        setKeyboardHeight(event.endCoordinates.height);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      },
    );
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  return (
    <View
      style={{
        flex: 1,
      }}>
      <ScrollView keyboardShouldPersistTaps="always">
        <ImageBackground
          style={styles.image_main}
          source={require('../assets/images/login_back.png')}>
          <ImageBackground
            style={styles.image_2}
            source={require('../assets/images/Group51.png')}>
            <View
              style={{
                bottom:
                  initial == 'login'
                    ? responsiveHeight(1)
                    : responsiveHeight(5),
              }}>
              <ImageBackground
                style={styles.image_main_icon}
                source={require('../assets/images/Ellipse.png')}>
                <Image
                  source={require('../assets/images/jatayu_icon.png')}
                  style={{
                    width: responsiveWidth(25),
                    height: responsiveWidth(25),
                    resizeMode: 'contain',
                  }}
                />
              </ImageBackground>
            </View>
            <View
              style={{
                position: 'absolute',
                bottom:
                  initial == 'login'
                    ? responsiveHeight(2)
                    : responsiveHeight(6),
                left: 0,
                right: 0,
                marginBottom: responsiveHeight(2),
              }}>
              <ToogleButton initial={initial} setinitial={setinitial} />
            </View>
          </ImageBackground>
          <View
            style={[
              styles.panel_main,
              {
                height:
                  initial == 'signup'
                    ? responsiveHeight(65)
                    : responsiveHeight(60),
              },
            ]}>
            {initial == 'login' ? (
              <UserLogin />
            ) : (
              <Usersignup setinitial={setinitial} />
            )}
          </View>
        </ImageBackground>
      </ScrollView>
    </View>
  );
}
export default Userloginsignup;

const styles = StyleSheet.create({
  image_main: {
    height: responsiveHeight(100),
    flex: 1,
  },
  image_2: {
    height: responsiveHeight(40),
    width: responsiveWidth(100),
    zIndex: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  panel_main: {
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  image_main_icon: {
    width: responsiveWidth(35),
    height: responsiveWidth(35),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

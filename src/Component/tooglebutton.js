import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {moderartescale, scale, verticalscale} from '../Constants/PixelRatio';
import {Colors} from '../Constants/Colors';

function ToogleButton({initial, setinitial}) {
  return (
    <>
      <View style={styles.main_contain}>
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => setinitial('login')}
            style={[
              styles.change_button,
              {
                backgroundColor:
                  initial === 'login' ? Colors.themColor : '#FFFFFF',
              },
            ]}>
            <Text
              style={{
                color: initial === 'login' ? '#FFFFFF' : '#000000',
              }}>
              Login
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setinitial('signup')}
            style={[
              styles.change_button,
              {
                backgroundColor:
                  initial === 'signup' ? Colors.themColor : '#FFFFFF',
              },
            ]}>
            <Text
              style={{
                color: initial === 'signup' ? '#FFFFFF' : '#000000',
              }}>
              Signup
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  main_contain: {
    display: 'flex',
    // flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: scale(178),
    height: verticalscale(40),
    borderRadius: moderartescale(30),
    backgroundColor: '#FFFFFF',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  change_button: {
    padding: moderartescale(5),
    width: scale(80),
    height: verticalscale(30),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderartescale(13),
  },
  text: {
    fontSize: moderartescale(16),
  },
});

export default ToogleButton;

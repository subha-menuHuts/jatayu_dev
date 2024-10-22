import {ActivityIndicator, View} from 'react-native';
import {Colors} from '../Constants/Colors';

function Loader() {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        width: '100%',
        height: '100%',
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 1,
      }}>
      <ActivityIndicator color={Colors.themColor} size="large" />
    </View>
  );
}

export default Loader;

import AsyncStorage from '@react-native-async-storage/async-storage';
import { ToastAndroid, Platform, AlertIOS } from 'react-native';

const getData = async key => {
  let value = await AsyncStorage.getItem(key);
  return value;
};

const setData = async (key, value) => {
  let resp = await AsyncStorage.setItem(key, value);
};

const removeData = async key => {
  let resp = await AsyncStorage.removeItem(key);
}

const deleteData = async () => {
  let resp = await AsyncStorage.clear();
};

/* == Show Toast msg function == */
const showToastMsg = async (msg) => {

  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  } else {
    AlertIOS.alert(msg);
  }
}

export {getData, setData, deleteData,showToastMsg, removeData};

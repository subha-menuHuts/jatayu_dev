/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-gesture-handler';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Dimensions, StatusBar, Text, View } from 'react-native';
import { MainNavigation } from "./src/Navigation/MainNaviagation";
import { store } from "./src/Store/AppStore";
import { Provider} from "react-redux";
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
function App() {
const screen_height = Dimensions.get('window').height

  return (
    <View style={{height :screen_height, backgroundColor:'#FFFFFF'}}>
        <GestureHandlerRootView style={{flex:1,}}>
          <StatusBar backgroundColor='#F00049' />
          <Provider store={store}>
              <NavigationContainer>
                <MainNavigation/>
              </NavigationContainer>
          </Provider>    
        </GestureHandlerRootView>
        

     </View>
  );
}



export default App;

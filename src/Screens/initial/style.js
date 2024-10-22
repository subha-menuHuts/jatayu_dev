//import liraries
import React, { Component } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Colors } from '../../Constants/Colors';
import { moderartescale } from '../../Constants/PixelRatio';
// import { moderateScale } from '../../Constants/PixelRatio';

const { height, width } = Dimensions.get('screen');
// create a component
const Styles =  () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.white
    },
    main_View:{
      height:moderartescale(140),
      width:moderartescale(140),
      borderRadius:moderartescale(80),
      alignItems:'center',
      justifyContent:'center',
      borderWidth:moderartescale(0.3),
      borderColor:'#333'
    },
    logo_img: {
      height: moderartescale(120),
      width: moderartescale(120),
      resizeMode:'contain'
    }
  });
} 

export default Styles;
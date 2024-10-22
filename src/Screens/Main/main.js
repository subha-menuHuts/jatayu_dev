//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DrawerNavigation } from '../../Navigation/DrawerNavigation';

// create a component
const Main = (props) => {
    return (
        <View style={styles.container}>
          <DrawerNavigation/>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

//make this component available to the app
export default Main;

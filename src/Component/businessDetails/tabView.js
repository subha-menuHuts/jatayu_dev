import React, {useEffect, useState, useRef} from 'react';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import Category from './category';
import About from './About';
import Photo from './photo';
import Review from './review';
import {
  responsiveHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Loader from '../loader';
import {View} from 'react-native';
import {moderartescale, scale} from '../../Constants/PixelRatio';
import {FONTS} from '../../Constants/Fonts';
import {useFocusEffect} from '@react-navigation/native';
function TabviewDetails({business_data, tab_page}) {
  const [index, setIndex] = useState(null);
  const [routes] = useState([
    {key: 'category', title: 'Category'},
    {key: 'about', title: 'About'},
    {key: 'photo', title: 'Photo'},
    {key: 'review', title: 'Review'},
  ]);

  useFocusEffect(
    React.useCallback(() => {
      if (tab_page == 'category') {
        setIndex(0);
      } else if (tab_page == 'about') {
        setIndex(1);
      } else if (tab_page == 'photo') {
        setIndex(2);
      } else if (tab_page == 'review') {
        setIndex(3);
      }
      console.log(tab_page);
    }, [tab_page]),
  );

  /*useEffect(() => {
    if (tab_page == 'category') {
      setIndex(0);
    } else if (tab_page == 'about') {
      setIndex(1);
    } else if (tab_page == 'photo') {
      setIndex(2);
    } else if (tab_page == 'review') {
      setIndex(3);
    }
    console.log(tab_page);
  }, [tab_page]);*/

  const CategoryTab = () => <Category business_data={business_data} />;

  const AboutTab = () => <About business_data={business_data} />;
  const PhotoTab = () => <Photo business_data={business_data} />;
  const ReviewTab = () => <Review business_data={business_data} />;

  const renderScene = SceneMap({
    category: CategoryTab,
    about: AboutTab,
    photo: PhotoTab,
    review: ReviewTab,
  });

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: '#F00049'}}
      style={{
        backgroundColor: '#FFFFFF',
        padding: 10,
        display: 'flex',
        width: responsiveWidth(100),
      }}
      labelStyle={{
        fontSize: moderartescale(14),
        fontFamily: FONTS.Inter.medium,
      }}
      activeColor="#F00049"
      inactiveColor="#888888"
      contentContainerStyle={{
        width: responsiveHeight(100),
      }}
      tabStyle={{
        width: scale(80),
        height: moderartescale(40),
        padding: 0,
      }}
    />
  );
  return (
    <>
      <View
        style={{
          flex: 1,
        }}>
        {index != null && (
          <TabView
            navigationState={{index, routes}}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{width: responsiveScreenWidth(100)}}
            lazy={true}
            renderLazyPlaceholder={() => {
              return <Loader />;
            }}
            sceneContainerStyle={{
              borderColor: 'red',
            }}
            renderTabBar={renderTabBar}
          />
        )}
      </View>
    </>
  );
}

export default TabviewDetails;

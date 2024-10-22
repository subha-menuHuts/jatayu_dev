import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {moderartescale, scale, verticalscale} from '../../Constants/PixelRatio';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {FONTS} from '../../Constants/Fonts';
import {useNavigation} from '@react-navigation/native';
import {Icon} from 'react-native-basic-elements';
import {Colors} from '../../Constants/Colors';

function Businessitems({item_data, addToFav}) {
  const navigation = useNavigation();

  return (
    <>
      <FlatList
        data={item_data}
        keyExtractor={item => item.id.toString()}
        renderItem={({item, index}) => {
          let is_img = item.is_img;
          let is_banner = item.is_banner;

          let logo_image = require('../../assets/images/no-image.png');
          let banner_image = require('../../assets/images/no-image.png');

          if (is_img.is_img == 1) {
            logo_image = {uri: is_img.data.secure_url};
          }

          if (is_banner.is_img == 1) {
            banner_image = {uri: is_banner.data.secure_url};
          }

          return (
            <>
              <View style={styles.container}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('businessDetails', {
                      data: item,
                      tab_page: 'category',
                    });
                  }}>
                  <View style={styles.imageBackground}>
                    <ImageBackground
                      source={banner_image}
                      style={styles.items_image}>
                      <View style={styles.topRightIconsContainer}>
                        <ImageBackground
                          source={require('../../assets/dynamic/search_details/Ellipse40.png')}
                          style={styles.iconContainer}>
                          <Image
                            source={require('../../assets/dynamic/search_details/cool2.png')}
                            style={styles.icon}
                          />
                        </ImageBackground>
                        <TouchableOpacity
                          onPress={() => {
                            addToFav(item.id, index);
                          }}
                          style={{
                            position: 'relative',
                            backgroundColor: '#fff',
                            width: responsiveWidth(5),
                            height: responsiveWidth(5),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: responsiveWidth(2.5),
                            marginLeft: responsiveWidth(1),
                          }}>
                          {item.addtofav == false ? (
                            <Icon
                              type="AntDesign"
                              name="hearto"
                              size={responsiveWidth(4)}
                              style={{color: '#b6b6b6'}}
                            />
                          ) : item.addtofav == true ? (
                            <Icon
                              type="AntDesign"
                              name="heart"
                              size={responsiveWidth(4)}
                              style={{color: Colors.themColor}}
                            />
                          ) : null}
                        </TouchableOpacity>
                      </View>
                      <Image source={logo_image} style={styles.brandImage} />
                    </ImageBackground>
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <TouchableOpacity style={{padding: 2}}>
                      <View style={styles.ratingContainer}>
                        <Icon
                          type="Feather"
                          name="star"
                          size={9}
                          color="#FFFFFF"
                        />
                        <Text style={styles.ratingText}>{item.ratings}</Text>
                      </View>
                    </TouchableOpacity>
                    <View style={styles.addressContainer}>
                      <Icon
                        type="EvilIcon"
                        name="location"
                        size={20}
                        color="#F00049"
                      />
                      <Text numberOfLines={1} style={styles.addressText}>
                        {item.street}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </>
          );
        }}
        style={{
          marginBottom: responsiveHeight(20),
        }}
        contentContainerStyle={{
          backgroundColor: '#ffecf2',
          height: responsiveHeight(100),
          padding: scale(6),
          width: responsiveWidth(100),
        }}
        numColumns={2}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: scale(10),
    marginLeft: scale(5),
    marginTop: verticalscale(3),
    alignItems: 'center',
    width: responsiveWidth(46), // Adjust based on design
    height: responsiveHeight(28),
    padding: scale(5),
  },
  imageBackground: {
    width: scale(151),
    height: moderartescale(100),
    flex: 1,
    padding: scale(5),
    justifyContent: 'space-between',
  },
  items_image: {
    height: verticalscale(101),
    borderRadius: scale(10),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  topRightIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: scale(5),
  },
  iconContainer: {
    width: scale(19),
    height: scale(19),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(10),
  },
  icon: {
    width: scale(12),
    height: scale(12),
  },
  heartIcon: {
    width: scale(10),
    height: scale(10),
  },
  brandImage: {
    width: responsiveWidth(9),
    height: responsiveWidth(9),
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    resizeMode: 'cover',
    borderRadius: responsiveWidth(4.5),
  },
  textContainer: {
    width: '100%',
    marginTop: verticalscale(1),
  },
  itemName: {
    fontSize: scale(13),
    color: '#000000',
    textAlign: 'left',
    fontFamily: FONTS.Inter.medium,
  },
  ratingContainer: {
    width: scale(36),
    height: verticalscale(15),
    backgroundColor: '#3BE400',
    borderRadius: scale(3),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // padding: scale(2),
  },
  ratingImage: {
    width: scale(9),
    height: scale(9),
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: scale(12),
    fontWeight: 'bold',
    marginLeft: scale(4),
  },
  addressContainer: {
    flexDirection: 'row',
    padding: scale(2),
  },
  addressText: {
    color: '#000000',
    fontSize: scale(13),
    marginLeft: scale(2),
    //flex: 1,
    fontFamily: FONTS.Inter.regular,
  },
});

export default Businessitems;

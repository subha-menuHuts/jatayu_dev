import React, {useState, useEffect} from 'react';
import ScreenHeader from '../Component/screenHeader';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import Loader from '../Component/loader';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {moderartescale, scale, verticalscale} from '../Constants/PixelRatio';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {FONTS} from '../Constants/Fonts';
import {useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {showToastMsg, getData, setData} from '../Service/localStorage';
import {postWithToken, postWithOutToken} from '../Service/service';
import {useFocusEffect} from '@react-navigation/native';
import {Colors} from '../Constants/Colors';
import OptionModel from '../Component/itemOptionModel';
import {setCartDetails, setCartQuantity} from '../Store/Reducers/CommonReducer';
import CartButton from '../Component/CartButton/CartButton';

function CategoryBusiness() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const {
    baseUrl,
    siteUrl,
    userToken,
    userData,
    selectedLang,
    LangValue,
    deviceToken,
    orderType,
    google_api_key,
    google_auto_complete_country,
    cartDetails,
  } = useSelector(state => state.common);
  const [viewloader, setLoader] = useState(false);
  const [language, setLanguage] = useState(null);
  const [preorderDetails, setPreorderDetails] = useState({
    preorder: false,
    preorderDate: '',
    preorderTime: '',
    preorderMenu: 0,
  });

  const [business_data, setBusinessData] = useState(null);
  const [categoryDetails, setCategoryDetails] = useState(null);
  const [selected_category, setSelectedCategory] = useState(null);
  const [selected_category_index, setSelectedCategoryIndex] = useState(null);
  const [category_name, setCategoryName] = useState('');

  const [category_menu, setCategoryMenu] = useState({
    isLoading: true,
    list: [],
  });

  const [cartQuantity, setcartQuantity] = useState(0);
  const [CartDish, setCartDish] = useState({isLoading: true, list: []});

  const [optionItem, setOptionItem] = useState(null);
  const [optionModelAdd, setoptionModelAdd] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setLanguage(LangValue);
    }, [selectedLang]),
  );

  /*useFocusEffect(
    React.useCallback(() => {
      // console.log('CartData');
      //console.log(cartDetails);
      setCartDish({isLoading: true, list: cartDetails});
      setcartQuantity(cartQuantity);
    }, [cartDetails, cartQuantity]),
  );*/

  useFocusEffect(
    React.useCallback(() => {
      if (route.params != undefined) {
        if (route.params.business_data != undefined) {
          // console.log(route.params.business_data);
          setBusinessData(route.params.business_data);
        }

        if (route.params.cat_index != undefined) {
          setSelectedCategoryIndex(route.params.cat_index);
          setCategoryName(route.params.cat[route.params.cat_index].name);

          //console.log(route.params.cat[route.params.cat_index]);

          setCategoryMenu({
            isLoading: false,
            list: [route.params.cat[route.params.cat_index]],
          });
        }

        if (route.params.cat_id != undefined) {
          setSelectedCategory(route.params.cat_id);
        }
        if (route.params.cat != undefined) {
          setCategoryDetails(route.params.cat);
        }
      }
    }, [route.params]),
  );

  const ChangeCat = (index, cat_id) => {
    setSelectedCategory(cat_id);
    setSelectedCategoryIndex(index);
    setCategoryName(categoryDetails[index].name);
    //console.log(categoryDetails[index].dish.length);

    setCategoryMenu({
      isLoading: false,
      list: [categoryDetails[index]],
    });

    /*setCategoryMenu({
      isLoading: false,
      list: categoryDetails[index],
    });*/
  };

  /*cart*/

  const productDetails = item => {
    /* if (item.sets.length > 0 || item.ingredientsarray.length > 0) {
      for (const ingre of item.ingredientsarray) {
        ingre.status = true;
      }
      productDetailsItem(item);
    } else {*/
    let cartDish = cartDetails;
    if (cartDish !== undefined && cartDish.length > 0) {
      setCartDish({isLoading: true, list: cartDish});
    }
    addToCart(item);
    /*}*/
  };

  const productDetailsItem = async item => {
    let itemDish;
    itemDish = JSON.stringify(item);

    let dataItem;
    dataItem = {
      dish: JSON.parse(itemDish),
      CartDish: cartDetails,
      type: 0,
    };

    setOptionItem(dataItem);
    setoptionModelAdd(true);
  };

  const addToCart = dishItem => {
    /*if (dishItem.sets !== undefined) {
      if (dishItem.sets.length > 0) {
        for (let i = 0; i < dishItem.sets.length; i++) {
          for (let j = 0; j < dishItem.sets[i].options.length; j++) {
            if (dishItem.sets[i].options[j].show === true) {
              if (dishItem.sets[i].options[j].type === 1) {
                let min = 0;

                for (
                  let k = 0;
                  k < dishItem.sets[i].options[j].choice.length;
                  k++
                ) {
                  if (dishItem.sets[i].options[j].choice[k].checked === true) {
                    min++;
                  }
                }
                if (
                  dishItem.sets[i].options[j].required === true &&
                  min === 0
                ) {
                  Alert.alert(
                    'Warning!',
                    dishItem.sets[i].options[j].name + ' is required',
                    [
                      {
                        text: 'Ok',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                      },
                    ],
                  );

                  return false;
                } else if (min < dishItem.sets[i].options[j].min) {
                  Alert.alert(
                    'Warning!',
                    dishItem.sets[i].options[j].name +
                      ' minimum choice is ' +
                      dishItem.sets[i].options[j].min,
                    [
                      {
                        text: 'Ok',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                      },
                    ],
                  );

                  return false;
                }
              } else if (
                dishItem.sets[i].options[j].required === true &&
                dishItem.sets[i].options[j].type === 0
              ) {
                let min = 0;
                for (
                  let k = 0;
                  k < dishItem.sets[i].options[j].choice.length;
                  k++
                ) {
                  if (dishItem.sets[i].options[j].choice[k].checked === true) {
                    min++;
                  }
                }
                if (min === 0) {
                  Alert.alert(
                    'Warning!',
                    dishItem.sets[i].options[j].name + ' is required ',
                    [
                      {
                        text: 'Ok',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                      },
                    ],
                  );

                  return false;
                }
              }
            }
          }
        }
      }
    }*/
    let dishTotal;
    dishTotal = dishItem.price;
    let business;
    business = {
      id: business_data.id,
      details: business_data,
      dish: new Array(),
    };

    let dish;
    dish = {
      id: dishItem.id,
      quantity: 1,
      data: new Array(),
    };
    let activeIngredients;
    activeIngredients = new Array();
    for (const ingre of dishItem.ingredientsarray) {
      if (ingre.status === false) {
        activeIngredients.push(ingre.name);
      }
    }
    let data;
    data = {
      id: dishItem.id,
      name: dishItem.name,
      price: dishItem.price,
      delprice: dishItem.delprice,
      pickprice: dishItem.pickprice,
      notes: dishItem.notes,
      totalprice: dishTotal,
      total: dishTotal,
      is_img: dishItem.is_img,
      img: dishItem.img,
      spicy: dishItem.spicy,
      spicyquantity: dishItem.spicyquantity,
      veg: dishItem.veg,
      nonveg: dishItem.nonveg,
      ingredients: dishItem.ingredients,
      ingredientsarray: dishItem.ingredientsarray,
      activeIngredients: activeIngredients,
      quantity: 1,
      sets: new Array(),
      relation: {
        options: new Array(),
        choices: new Array(),
      },
    };

    let optionsarray;
    optionsarray = new Array();
    let choicesarray;
    choicesarray = new Array();
    /*if (dishItem.sets !== undefined) {
      if (dishItem.sets.length > 0) {
        for (let i = 0; i < dishItem.sets.length; i++) {
          for (let j = 0; j < dishItem.sets[i].options.length; j++) {
            let options;
            options = {
              id: dishItem.sets[i].options[j].id,
              name: dishItem.sets[i].options[j].name,
              choice: new Array(),
            };

            for (
              let k = 0;
              k < dishItem.sets[i].options[j].choice.length;
              k++
            ) {
              if (dishItem.sets[i].options[j].choice[k].checked === true) {
                let choice;
                choice = {
                  id: dishItem.sets[i].options[j].choice[k].id,
                  name: dishItem.sets[i].options[j].choice[k].name,
                  price: dishItem.sets[i].options[j].choice[k].price,
                };
                choicesarray.push(choice.id);
                options.choice.push(choice);
              }
            }
            if (options.choice.length > 0) {
              optionsarray.push(options.id);
              data.sets.push(options);
            }
          }
        }
      }
    }
    if (data.sets.length > 0) {
      data.relation = {
        options: optionsarray,
        choices: choicesarray,
      };
    }*/

    let cart = JSON.parse(JSON.stringify(CartDish.list));

    let parent_index = CheckBusinessAddtoCart(business_data.id, cart);

    if (parent_index === -1) {
      cart.push(business);
    }
    parent_index = CheckBusinessAddtoCart(business_data.id, cart);

    let index = CheckAddtoCart(data.id, parent_index, cart);

    if (index === -1) {
      dish.data.push(data);
      cart[parent_index].dish.push(dish);
    } else {
      cart[parent_index].dish[index].quantity =
        parseInt(cart[parent_index].dish[index].quantity, 10) + 1;
      if (data.sets.length === 0 && data.activeIngredients.length === 0) {
        let index_data = CheckData(cart[parent_index].dish[index].data, data);

        if (index_data === -1) {
          cart[parent_index].dish[index].data.push(data);
        } else {
          cart[parent_index].dish[index].data[index_data].notes =
            dishItem.notes;
          cart[parent_index].dish[index].data[index_data].quantity = parseInt(
            cart[parent_index].dish[index].data[index_data].quantity + 1,
          );
          cart[parent_index].dish[index].data[index_data].total =
            parseFloat(
              cart[parent_index].dish[index].data[index_data].totalprice,
            ) *
            parseInt(
              cart[parent_index].dish[index].data[index_data].quantity,
              10,
            );
          cart[parent_index].dish[index].data[index_data].total = parseFloat(
            cart[parent_index].dish[index].data[index_data].total,
          ).toFixed(2);
        }
      } else if (
        data.sets.length === 0 &&
        data.activeIngredients.length !== 0
      ) {
        let index_data;
        index_data = CheckDataIngreExist(
          cart[parent_index].dish[index].data,
          data,
        );
        if (index_data === -1) {
          cart[parent_index].dish[index].data.push(data);
        } else {
          cart[parent_index].dish[index].data[index_data].notes =
            dishItem.notes;
          cart[parent_index].dish[index].data[index_data].quantity =
            parseInt(
              cart[parent_index].dish[index].data[index_data].quantity,
              10,
            ) + 1;
          cart[parent_index].dish[index].data[index_data].total =
            parseFloat(
              cart[parent_index].dish[index].data[index_data].totalprice,
            ) *
            parseInt(
              cart[parent_index].dish[index].data[index_data].quantity,
              10,
            );
          cart[parent_index].dish[index].data[index_data].total = parseFloat(
            cart[parent_index].dish[index].data[index_data].total,
          ).toFixed(2);
        }
      } else if (
        data.sets.length !== 0 &&
        data.activeIngredients.length === 0
      ) {
        let index_data;
        index_data = CheckDataSetExist(
          cart[parent_index].dish[index].data,
          data,
        );
        if (index_data === -1) {
          cart[parent_index].dish[index].data.push(data);
        } else {
          cart[parent_index].dish[index].data[index_data].notes =
            dishItem.notes;
          cart[parent_index].dish[index].data[index_data].quantity =
            parseInt(
              cart[parent_index].dish[index].data[index_data].quantity,
              10,
            ) + 1;
          cart[parent_index].dish[index].data[index_data].total =
            parseFloat(
              cart[parent_index].dish[index].data[index_data].totalprice,
            ) *
            parseInt(
              cart[parent_index].dish[index].data[index_data].quantity,
              10,
            );
          cart[parent_index].dish[index].data[index_data].total = parseFloat(
            cart[parent_index].dish[index].data[index_data].total,
          ).toFixed(2);
        }
      } else if (data.sets.length !== 0 && data.activeIngredients !== 0) {
        let index_data;
        index_data = CheckDataIngreSetsExist(
          cart[parent_index].dish[index].data,
          data,
        );
        if (index_data === -1) {
          cart[parent_index].dish[index].data.push(data);
        } else {
          cart[parent_index].dish[index].data[index_data].notes =
            dishItem.notes;
          cart[parent_index].dish[index].data[index_data].quantity =
            parseInt(
              cart[parent_index].dish[index].data[index_data].quantity,
              10,
            ) + 1;
          cart[parent_index].dish[index].data[index_data].total =
            parseFloat(
              cart[parent_index].dish[index].data[index_data].totalprice,
            ) *
            parseInt(
              cart[parent_index].dish[index].data[index_data].quantity,
              10,
            );
          cart[parent_index].dish[index].data[index_data].total = parseFloat(
            cart[parent_index].dish[index].data[index_data].total,
          ).toFixed(2);
        }
      }
    }
    if (cart.length > 0) {
      setCartDish({isLoading: false, list: cart});
      dispatch(setCartDetails(cart));
      setData('cartDetails', JSON.stringify(cart));

      showToastMsg('Item added successfully.');
      let cartQty = 0;
      for (const cartDish of cart) {
        for (const dish of cartDish.dish) {
          cartQty += dish.quantity;
        }
      }
      setcartQuantity(cartQty);
      dispatch(setCartQuantity(cartQty));
    } else {
      setCartQuantity(0);
    }
  };
  const CheckBusinessAddtoCart = (d, cDish) => {
    let b;
    b = cDish;
    if (b === undefined) {
      return -1;
    }
    for (let c = 0; c < b.length; c++) {
      if (b[c].id === d) {
        return c;
      }
    }
    return -1;
  };
  const CheckAddtoCart = (d, index, cDish) => {
    let b;
    if (cDish[index]) {
      b = cDish[index].dish;
      for (let c = 0; c < b.length; c++) {
        if (b[c].id === d) {
          return c;
        }
      }
    } else {
      return -1;
    }
    return -1;
  };
  const CheckData = (cartdata, data) => {
    if (data.sets.length === 0) {
      for (let i = 0; i < cartdata.length; i++) {
        if (cartdata[i].sets.length === 0) {
          return i;
        }
      }
      return -1;
    }
  };
  const CheckDataSetExist = (cartdata, data) => {
    for (let i = 0; i < cartdata.length; i++) {
      if (cartdata[i].relation) {
        let arrayDiffoptions;
        arrayDiffoptions = arrayDiff(
          cartdata[i].relation.options,
          data.relation.options,
        );
        let arrayDiffchoice;
        arrayDiffchoice = arrayDiff(
          cartdata[i].relation.choices,
          data.relation.choices,
        );
        if (
          arrayDiffoptions.arr1.length === 0 &&
          arrayDiffoptions.arr2.length === 0 &&
          arrayDiffchoice.arr1.length === 0 &&
          arrayDiffchoice.arr2.length === 0
        ) {
          return i;
        }
      }
    }
    return -1;
  };
  const CheckDataIngreExist = (cartdata, data) => {
    for (let i = 0; i < cartdata.length; i++) {
      let arrayDiffIngre;
      arrayDiffIngre = arrayDiff(
        cartdata[i].activeIngredients,
        data.activeIngredients,
      );
      if (
        arrayDiffIngre.arr1.length === 0 &&
        arrayDiffIngre.arr2.length === 0
      ) {
        return i;
      }
    }
    return -1;
  };
  const CheckDataIngreSetsExist = (cartdata, data) => {
    for (let i = 0; i < cartdata.length; i++) {
      if (cartdata[i].relation) {
        let arrayDiffoptions;
        arrayDiffoptions = arrayDiff(
          cartdata[i].relation.options,
          data.relation.options,
        );
        let arrayDiffchoice;
        arrayDiffchoice = arrayDiff(
          cartdata[i].relation.choices,
          data.relation.choices,
        );

        let arrayDiffIngre;
        arrayDiffIngre = arrayDiff(
          cartdata[i].activeIngredients,
          data.activeIngredients,
        );

        if (
          arrayDiffIngre.arr1.length === 0 &&
          arrayDiffIngre.arr2.length === 0 &&
          arrayDiffoptions.arr1.length === 0 &&
          arrayDiffoptions.arr2.length === 0 &&
          arrayDiffchoice.arr1.length === 0 &&
          arrayDiffchoice.arr2.length === 0
        ) {
          return i;
        }
      } else {
        let arrayDiffIngre;
        arrayDiffIngre = arrayDiff(
          cartdata[i].activeIngredients,
          data.activeIngredients,
        );
        if (
          arrayDiffIngre.arr1.length === 0 &&
          arrayDiffIngre.arr2.length === 0
        ) {
          return i;
        }
      }
    }
    return -1;
  };
  const arrayDiff = (arr1, arr2) => {
    let diff;
    diff = {
      arr1: '',
      arr2: '',
      concat: '',
    };

    diff.arr1 = arr1.filter(function (value) {
      if (arr2.indexOf(value) === -1) {
        return value;
      }
    });

    diff.arr2 = arr2.filter(function (value) {
      if (arr1.indexOf(value) === -1) {
        return value;
      }
    });

    diff.concat = diff.arr1.concat(diff.arr2);

    return diff;
  };

  const updateCartDetailsFromChild = cart => {
    setCartDish({isLoading: false, list: cart});
    dispatch(setCartDetails(cart));
    setData('cartDetails', JSON.stringify(cart));

    let cartQty = 0;
    for (const cartDish of cart) {
      for (const dish of cartDish.dish) {
        cartQty += dish.quantity;
      }
    }
    setcartQuantity(cartQty);
    dispatch(setCartQuantity(cartQty));
  };

  /*cart*/

  return (
    <>
      <View style={styles.main_conainer}>
        <ScreenHeader title={category_name} back_display={true} />

        <View style={styles.tab_container}>
          <ScrollView horizontal={true}>
            {categoryDetails != null
              ? categoryDetails.map((item, index) => {
                  return (
                    <View
                      key={'category_' + index}
                      style={{
                        gav: 30,
                        display: 'flex',
                        flexDirection: 'row',
                        paddingHorizontal: responsiveWidth(2),
                        borderBottomColor:
                          selected_category_index == index
                            ? Colors.themColor
                            : null,
                        borderBottomWidth:
                          selected_category_index == index
                            ? responsiveHeight(0.3)
                            : null,
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          ChangeCat(index, item.id);
                        }}
                        style={{paddingBottom: responsiveHeight(1)}}>
                        <Text
                          style={{
                            color:
                              selected_category_index == index
                                ? Colors.themColor
                                : Colors.black,
                            fontFamily: FONTS.Inter.bold,
                            fontSize: responsiveFontSize(1.8),
                          }}>
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })
              : null}
          </ScrollView>
        </View>
        <View style={styles.tab_view_container}>
          {category_menu.isLoading === false &&
          category_menu.list.length > 0 ? (
            <FlatList
              data={category_menu.list}
              renderItem={({item, index}) => {
                return (
                  <>
                    {item.dish.map((dish, dish_index) => {
                      if (dish.subcategory == 0) {
                        let dish_image = require('../assets/images/no-image.png');

                        if (dish.is_img == 1) {
                          dish_image = {uri: dish.img};
                        } else if (dish.is_img1 == 1) {
                          dish_image = {uri: dish.img1};
                        } else if (dish.is_img2 == 1) {
                          dish_image = {uri: dish.img2};
                        }

                        let open_close_style = '';

                        if (
                          business_data.open == true &&
                          dish.dishstatus == 1
                        ) {
                          open_close_style = 'opendish';
                        } else {
                          open_close_style = 'closedish';
                        }

                        return (
                          <React.Fragment key={'cat_' + dish_index}>
                            <View style={styles.container}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  width: '100%',
                                }}>
                                <Image
                                  source={dish_image}
                                  style={styles.image}
                                />
                                <View style={[styles.content, {width: '80%'}]}>
                                  <View
                                    style={{
                                      display: 'flex',
                                      flexDirection: 'row',
                                      justifyContent: 'space-between',
                                    }}>
                                    <Text style={styles.name} numberOfLines={1}>
                                      {dish.name}
                                    </Text>
                                    <TouchableOpacity
                                      onPress={() => {
                                        productDetails(dish);
                                      }}
                                      style={styles.button}>
                                      <Text style={styles.buttonText}>Add</Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.priceContainer}>
                                    {orderType != 2 && dish.offerprice > 0 ? (
                                      <Text style={styles.discountedPrice}>
                                        {business_data.currency_symbol}{' '}
                                        {dish.delprice}
                                      </Text>
                                    ) : orderType == 2 &&
                                      dish.pofferprice > 0 ? (
                                      <Text style={styles.discountedPrice}>
                                        {business_data.currency_symbol}{' '}
                                        {dish.pickprice}
                                      </Text>
                                    ) : null}

                                    <Text style={styles.price}>
                                      {' '}
                                      {business_data.currency_symbol}{' '}
                                      {dish.price}
                                    </Text>
                                  </View>
                                </View>
                              </View>
                            </View>
                          </React.Fragment>
                        );
                      }
                    })}

                    {item.subCat.map((subcat, subcat_index) => {
                      return subcat.dish.map((sub_dish, subcat_dish_index) => {
                        if (subcat.active == true) {
                          let dish_image = require('../assets/images/no-image.png');

                          if (sub_dish.is_img == 1) {
                            dish_image = {uri: sub_dish.img};
                          } else if (sub_dish.is_img1 == 1) {
                            dish_image = {uri: sub_dish.img1};
                          } else if (sub_dish.is_img2 == 1) {
                            dish_image = {uri: sub_dish.img2};
                          }

                          let open_close_style = '';

                          if (
                            business_data.open == true &&
                            sub_dish.dishstatus == 1
                          ) {
                            open_close_style = 'opendish';
                          } else {
                            open_close_style = 'closedish';
                          }

                          return (
                            <React.Fragment key={'cat_sub' + subcat_dish_index}>
                              <View style={styles.container}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    width: '100%',
                                  }}>
                                  <Image
                                    source={dish_image}
                                    style={styles.image}
                                  />
                                  <View
                                    style={[styles.content, {width: '80%'}]}>
                                    <View
                                      style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                      }}>
                                      <Text
                                        style={styles.name}
                                        numberOfLines={1}>
                                        {sub_dish.name}
                                      </Text>
                                      <TouchableOpacity
                                        onPress={() => {
                                          productDetails(sub_dish);
                                        }}
                                        style={styles.button}>
                                        <Text style={styles.buttonText}>
                                          Add
                                        </Text>
                                      </TouchableOpacity>
                                    </View>
                                    <View style={styles.priceContainer}>
                                      {orderType != 2 &&
                                      sub_dish.offerprice > 0 ? (
                                        <Text style={styles.discountedPrice}>
                                          {business_data.currency_symbol}{' '}
                                          {sub_dish.delprice}
                                        </Text>
                                      ) : orderType == 2 &&
                                        sub_dish.pofferprice > 0 ? (
                                        <Text style={styles.discountedPrice}>
                                          {business_data.currency_symbol}{' '}
                                          {sub_dish.pickprice}
                                        </Text>
                                      ) : null}

                                      <Text style={styles.price}>
                                        {' '}
                                        {business_data.currency_symbol}{' '}
                                        {sub_dish.price}
                                      </Text>
                                    </View>
                                  </View>
                                </View>
                              </View>
                            </React.Fragment>
                          );
                        }
                      });
                    })}
                  </>
                );
              }}
              style={
                {
                  // marginBottom: responsiveHeight(20),
                }
              }
              contentContainerStyle={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
            />
          ) : category_menu.isLoading === true &&
            category_menu.list.length == 0 ? (
            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                marginVertical={responsiveHeight(2)}
                marginHorizontal={responsiveWidth(4)}>
                <SkeletonPlaceholder.Item
                  width={responsiveWidth(90)}
                  height={responsiveHeight(12)}
                  marginRight={responsiveWidth(3)}
                  borderRadius={10}
                />
              </SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                marginHorizontal={responsiveWidth(4)}>
                <SkeletonPlaceholder.Item
                  width={responsiveWidth(90)}
                  height={responsiveHeight(12)}
                  marginRight={responsiveWidth(3)}
                  borderRadius={10}
                />
              </SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                marginVertical={responsiveHeight(2)}
                marginHorizontal={responsiveWidth(4)}>
                <SkeletonPlaceholder.Item
                  width={responsiveWidth(90)}
                  height={responsiveHeight(12)}
                  marginRight={responsiveWidth(3)}
                  borderRadius={10}
                />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
          ) : category_menu.isLoading === false &&
            category_menu.list.length == 0 ? (
            <Text
              style={{
                marginTop: responsiveHeight(10),
                alignSelf: 'center',
                fontFamily: FONTS.bold,
                fontSize: responsiveFontSize(2.2),
                color: Colors.red,
              }}>
              No Record Found
            </Text>
          ) : null}
        </View>
        <CartButton />
      </View>
      {optionModelAdd === true ? (
        <OptionModel
          optionItem={optionItem}
          business_data={business_data}
          orderType={orderType}
          setoptionModelAdd={setoptionModelAdd}
          cartQty={cartQuantity}
          updateCartDetails={updateCartDetailsFromChild}
        />
      ) : null}
    </>
  );
}
const styles = StyleSheet.create({
  main_conainer: {
    height: responsiveHeight(100),
    width: responsiveWidth(100),
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  tab_container: {
    alignItems: 'center',
    height: responsiveHeight(8),
    paddingVertical: responsiveHeight(2),
  },
  tab_view_container: {
    flex: 1,
  },
  container: {
    width: responsiveWidth(92),
    height: responsiveHeight(10),
    borderRadius: moderartescale(10),
    borderWidth: moderartescale(2),
    borderColor: '#CCCCCC',
    marginBottom: verticalscale(10),
    padding: moderartescale(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  image: {
    width: responsiveWidth(12),
    height: responsiveHeight(6),
    borderRadius: responsiveWidth(4),
  },
  content: {
    marginLeft: moderartescale(15),
  },
  name: {
    color: '#000000',
    fontSize: moderartescale(14),
    fontWeight: '500',
    flexShrink: 1, // allows the text to wrap and avoid overflow
  },
  priceContainer: {
    flexDirection: 'row',
    marginTop: verticalscale(5),
  },
  discountedPrice: {
    color: '#F10E0E',
    fontSize: moderartescale(13),
    textDecorationLine: 'line-through',
    marginRight: moderartescale(10),
    fontFamily: FONTS.Inter.regular,
  },
  price: {
    color: '#000000',
    fontSize: moderartescale(13),
    fontFamily: FONTS.Inter.semibold,
  },
  button: {
    width: moderartescale(40),
    height: verticalscale(23),
    borderRadius: moderartescale(8),
    backgroundColor: '#42E309',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: moderartescale(13),
    fontFamily: FONTS.Inter.semibold,
  },
});
export default CategoryBusiness;

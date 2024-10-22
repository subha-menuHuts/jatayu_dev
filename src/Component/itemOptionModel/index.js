import React, {useEffect, useState} from 'react';
import {
  useWindowDimensions,
  Text,
  View,
  BackHandler,
  Dimensions,
  TextInput,
  ScrollView,
  Image,
  Pressable,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Styles from './Styles';
import {Colors} from '../../Constants/Colors';
import {FONTS} from '../../Constants/Fonts';
import {Images} from '../../Constants/ImageIconContant';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useDispatch, useSelector} from 'react-redux';
import {
  setCartDetails,
  setCartQuantity,
} from '../../Store/Reducers/CommonReducer';
import {showToastMsg, getData, setData} from '../../Service/localStorage';
import {postWithToken, postWithOutToken} from '../../Service/service';
import {useFocusEffect} from '@react-navigation/native';
import {
  Container,
  Icon,
  AppTextInput,
  AppButton,
  RadioButton,
  CheckBox,
} from 'react-native-basic-elements';
import Modal from 'react-native-modal';
import RenderHtml from 'react-native-render-html';

// create a component
const OptionModel = props => {
  const styles = Styles();
  const dispatch = useDispatch();
  const {width} = useWindowDimensions();
  const {
    baseUrl,
    siteUrl,
    userToken,
    userData,
    selectedLang,
    LangValue,
    cartDetails,
  } = useSelector(state => state.common);

  const [isModalVisible, setModalVisible] = useState(false);
  const [activeBusiness, setActiveBusiness] = useState(null);
  const [dish, setDish] = useState(null);
  const [dishTotal, setDishTotal] = useState(null);
  const [CartDish, setCartDish] = useState([]);
  const [indexcart, setindexCart] = useState({});
  const [BackupCart, setBackupCart] = useState(null);
  const [dataItem, setDataItem] = useState(null);
  const [orderType, setOrderType] = useState();
  const [dish_note, setItemNote] = useState('');
  const [edit_product, setEditProduct] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  /*useEffect(() =>{
    
   
  },[props.optionItem])*/

  useFocusEffect(
    React.useCallback(() => {
      console.log(props);
      if (props.optionItem != undefined) {
        setActiveBusiness(props.activeBusiness);
        setOrderType(props.orderType);
        setDataItem(props.optionItem);

        let dish_value = JSON.parse(JSON.stringify(props.optionItem.dish));

        setDish(dish_value);
        setItemNote(dish_value.notes);
        console.log(dish_value.notes);
        setDishTotal(props.optionItem.dish.price);
        let CartDish = props.optionItem.CartDish;
        if (CartDish !== undefined && CartDish !== '') {
          setCartDish(CartDish);
        }

        if (props.optionItem.type === 1) {
          setindexCart(props.optionItem.indexCart);
          let indexcart = props.optionItem.indexCart;
          setEditProduct(true);
          let qty = parseInt(
            CartDish[indexcart.index].dish[indexcart.dishindex].data[
              indexcart.dishdataindex
            ].quantity,
            10,
          );
          let dishTotal = indexcart.dishTotal / qty;
          setDishTotal(dishTotal);
        }

        setModalVisible(true);
      }
    }, [props.optionItem]),
  );

  const checkProductOption = (
    setIndex,
    optionIndex,
    choiceIndex,
    checked_status,
  ) => {
    let dish_val = dish;

    if (dish_val.sets[setIndex].options[optionIndex].type === 0) {
      for (
        let i = 0;
        i < dish_val.sets[setIndex].options[optionIndex].choice.length;
        i++
      ) {
        if (checked_status === false && i == choiceIndex) {
          dish_val.sets[setIndex].options[optionIndex].choice[i].checked = true;
        } else {
          //dish_val.sets[setIndex].options[optionIndex].choice[i].checked = false;
        }
      }

      if (checked_status === false) {
        dish_val.sets[setIndex].options[optionIndex].choice[
          choiceIndex
        ].checked = true;
      } else {
        dish_val.sets[setIndex].options[optionIndex].choice[
          choiceIndex
        ].checked = false;
      }

      CheckType0(setIndex, optionIndex);
      for (
        let i = 0;
        i < dish_val.sets[setIndex].options[optionIndex].coditions.length;
        i++
      ) {
        if (
          dish_val.sets[setIndex].options[optionIndex].coditions[i].choice ===
          dish_val.sets[setIndex].options[optionIndex].choice[choiceIndex].id
        ) {
          for (let j = 0; j < dish_val.sets[setIndex].options.length; j++) {
            if (
              dish_val.sets[setIndex].options[j].id ===
              dish_val.sets[setIndex].options[optionIndex].coditions[i]
                .rest_op_id
            ) {
              dish_val.sets[setIndex].options[j].show = true;
            }
          }
        }
      }
    }
    if (dish_val.sets[setIndex].options[optionIndex].type === 1) {
      let trues = 0;
      if (
        dish_val.sets[setIndex].options[optionIndex].choice[choiceIndex]
          .checked === true
      ) {
        dish_val.sets[setIndex].options[optionIndex].choice[
          choiceIndex
        ].checked = false;
      } else {
        dish_val.sets[setIndex].options[optionIndex].choice[
          choiceIndex
        ].checked = true;
      }
      for (
        let i = 0;
        i < dish_val.sets[setIndex].options[optionIndex].choice.length;
        i++
      ) {
        if (
          dish_val.sets[setIndex].options[optionIndex].choice[i].checked ===
          true
        ) {
          trues++;
        }
      }
      if (trues > dish_val.sets[setIndex].options[optionIndex].max) {
        dish_val.sets[setIndex].options[optionIndex].choice[
          choiceIndex
        ].checked = false;

        showToastMsg(
          'Max number of selection is  ' +
            dish.sets[setIndex].options[optionIndex].max,
        );
        return false;
      }
      for (
        let i = 0;
        i < dish_val.sets[setIndex].options[optionIndex].coditions.length;
        i++
      ) {
        if (
          dish_val.sets[setIndex].options[optionIndex].coditions[i].choice ===
          dish.sets[setIndex].options[optionIndex].choice[choiceIndex].id
        ) {
          if (
            dish_val.sets[setIndex].options[optionIndex].choice[choiceIndex]
              .checked === true
          ) {
            for (let j = 0; j < dish_val.sets[setIndex].options.length; j++) {
              if (
                dish_val.sets[setIndex].options[j].id ===
                dish_val.sets[setIndex].options[optionIndex].coditions[i]
                  .rest_op_id
              ) {
                dish_val.sets[setIndex].options[j].show = true;
              }
            }
          }
        }
      }
      if (
        dish_val.sets[setIndex].options[optionIndex].choice[choiceIndex]
          .checked === false
      ) {
        let rest_op_id = 0;
        for (
          let i = 0;
          i < dish_val.sets[setIndex].options[optionIndex].coditions.length;
          i++
        ) {
          if (
            dish_val.sets[setIndex].options[optionIndex].choice[choiceIndex]
              .id ===
            dish_val.sets[setIndex].options[optionIndex].coditions[i].choice
          ) {
            rest_op_id =
              dish_val.sets[setIndex].options[optionIndex].coditions[i]
                .rest_op_id;
          }
        }
        if (rest_op_id !== 0) {
          let count = 0;
          for (
            let i = 0;
            i < dish_val.sets[setIndex].options[optionIndex].coditions.length;
            i++
          ) {
            if (
              dish_val.sets[setIndex].options[optionIndex].coditions[i]
                .rest_op_id === rest_op_id &&
              dish_val.sets[setIndex].options[optionIndex].coditions[i]
                .choice !==
                dish_val.sets[setIndex].options[optionIndex].choice[choiceIndex]
                  .id
            ) {
              for (
                let j = 0;
                j < dish_val.sets[setIndex].options[optionIndex].choice.length;
                j++
              ) {
                if (
                  dish_val.sets[setIndex].options[optionIndex].choice[j].id ===
                    dish_val.sets[setIndex].options[optionIndex].coditions[i]
                      .choice &&
                  dish_val.sets[setIndex].options[optionIndex].choice[j]
                    .checked === true
                ) {
                  count++;
                }
              }
            }
          }
          if (count === 0) {
            CheckType1(setIndex, optionIndex, choiceIndex, rest_op_id);
          }
        }
      }
    }

    let dishTotal_val = dish_val.price;

    for (let k = 0; k < dish_val.sets.length; k++) {
      for (let i = 0; i < dish_val.sets[k].options.length; i++) {
        if (dish_val.sets[k].options[i].show === true) {
          for (let j = 0; j < dish_val.sets[k].options[i].choice.length; j++) {
            if (dish_val.sets[k].options[i].choice[j].checked === true) {
              dishTotal_val =
                parseFloat(dishTotal_val) +
                parseFloat(dish_val.sets[k].options[i].choice[j].price);
              dishTotal_val = parseFloat(dishTotal_val).toFixed(2);
            }
          }
        }
      }
    }

    setDishTotal(dishTotal_val);
    setDish(dish_val);
  };

  const CheckType1 = (setIndex, optionIndex, choiceIndex, rest_op_id) => {
    let dish_val = dish;
    let temp = 0;
    for (let i = 0; i < dish_val.sets[setIndex].options.length; i++) {
      if (dish_val.sets[setIndex].options[i].id === rest_op_id) {
        dish_val.sets[setIndex].options[i].show = false;
        temp = i;
        for (
          let k = 0;
          k < dish_val.sets[setIndex].options[i].choice.length;
          k++
        ) {
          dish_val.sets[setIndex].options[i].choice[k].checked = false;
        }
        setDish(dish_val);
        CheckType0(setIndex, temp);
      }
    }
  };
  const CheckType0 = (setIndex, optionIndex) => {
    let dish_val = dish;
    let temp = 0;
    if (dish_val.sets[setIndex].options[optionIndex].coditions.length > 0) {
      for (
        let i = 0;
        i < dish_val.sets[setIndex].options[optionIndex].coditions.length;
        i++
      ) {
        for (let j = 0; j < dish_val.sets[setIndex].options.length; j++) {
          if (
            dish_val.sets[setIndex].options[optionIndex].coditions[i]
              .rest_op_id === dish_val.sets[setIndex].options[j].id
          ) {
            dish_val.sets[setIndex].options[j].show = false;
            temp = j;
            for (
              let k = 0;
              k < dish_val.sets[setIndex].options[j].choice.length;
              k++
            ) {
              dish_val.sets[setIndex].options[j].choice[k].checked = false;
            }
            setDish(dish_val);
            CheckType0(setIndex, temp);
          }
        }
      }
    }
  };

  const addToCart = dish_val => {
    if (dish_val.sets !== undefined) {
      if (dish_val.sets.length > 0) {
        for (let i = 0; i < dish_val.sets.length; i++) {
          for (let j = 0; j < dish_val.sets[i].options.length; j++) {
            if (dish_val.sets[i].options[j].show === true) {
              if (dish_val.sets[i].options[j].type === 1) {
                let min = 0;
                for (
                  let k = 0;
                  k < dish_val.sets[i].options[j].choice.length;
                  k++
                ) {
                  if (dish_val.sets[i].options[j].choice[k].checked === true) {
                    min++;
                  }
                }
                if (
                  dish_val.sets[i].options[j].required === true &&
                  min === 0
                ) {
                  Alert.alert(
                    'Warning!',
                    dish_val.sets[i].options[j].name + ' is required',
                    [
                      {
                        text: 'Ok',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                      },
                    ],
                  );

                  return false;
                } else if (min < dish_val.sets[i].options[j].min) {
                  Alert.alert(
                    'Warning!',
                    dish_val.sets[i].options[j].name +
                      ' minimum choice is ' +
                      dish_val.sets[i].options[j].min,
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
                dish_val.sets[i].options[j].required === true &&
                dish_val.sets[i].options[j].type === 0
              ) {
                let min = 0;
                for (
                  let k = 0;
                  k < dish_val.sets[i].options[j].choice.length;
                  k++
                ) {
                  if (dish_val.sets[i].options[j].choice[k].checked === true) {
                    min++;
                  }
                }
                if (min === 0) {
                  Alert.alert(
                    'Warning!',
                    dish_val.sets[i].options[j].name + ' is required ',
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
    }

    let business;
    business = {
      id: activeBusiness.id,
      details: activeBusiness,
      dish: new Array(),
    };

    let dish = {
      id: dish_val.id,
      quantity: 1,
      data: new Array(),
    };
    let activeIngredients = new Array();
    for (const ingre of dish_val.ingredientsarray) {
      if (ingre.status === false) {
        activeIngredients.push(ingre.name);
      }
    }
    let data;
    data = {
      id: dish_val.id,
      name: dish_val.name,
      price: dish_val.price,
      delprice: dish_val.delprice,
      pickprice: dish_val.pickprice,
      notes: dish_note,
      totalprice: dishTotal,
      total: dishTotal,
      is_img: dish_val.is_img,
      img: dish_val.img,
      spicy: dish_val.spicy,
      spicyquantity: dish_val.spicyquantity,
      veg: dish_val.veg,
      nonveg: dish_val.nonveg,
      ingredients: dish_val.ingredients,
      ingredientsarray: dish_val.ingredientsarray,
      activeIngredients: activeIngredients,
      activeIngredientsText: activeIngredients.join(', '),
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
    if (dish_val.sets !== undefined) {
      if (dish_val.sets.length > 0) {
        for (let i = 0; i < dish_val.sets.length; i++) {
          for (let j = 0; j < dish_val.sets[i].options.length; j++) {
            let options;
            options = {
              id: dish_val.sets[i].options[j].id,
              name: dish_val.sets[i].options[j].name,
              choice: new Array(),
              choiceText: '',
            };
            let choiceTextArray;
            choiceTextArray = new Array();
            for (
              let k = 0;
              k < dish_val.sets[i].options[j].choice.length;
              k++
            ) {
              if (dish_val.sets[i].options[j].choice[k].checked === true) {
                let choice;
                choice = {
                  id: dish_val.sets[i].options[j].choice[k].id,
                  name: dish_val.sets[i].options[j].choice[k].name,
                  price: dish_val.sets[i].options[j].choice[k].price,
                };

                choiceTextArray.push(
                  dish_val.sets[i].options[j].choice[k].name,
                );
                choicesarray.push(choice.id);
                options.choice.push(choice);
              }
            }
            options.choiceText = choiceTextArray.join(', ');
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
    }

    let cart = JSON.parse(JSON.stringify(props.optionItem.CartDish));

    let parent_index = CheckBusinessAddtoCart(activeBusiness.id, cart);

    if (parent_index === -1) {
      cart.push(business);
    }
    parent_index = CheckBusinessAddtoCart(activeBusiness.id, cart);
    let index;
    index = CheckAddtoCart(data.id, parent_index, cart);
    if (index === -1) {
      dish.data.push(data);
      cart[parent_index].dish.push(dish);
    } else {
      cart[parent_index].dish[index].quantity =
        parseInt(cart[parent_index].dish[index].quantity, 10) + 1;
      if (data.sets.length === 0 && data.activeIngredients === 0) {
        let index_data;
        index_data = CheckData(cart[parent_index].dish[index].data, data);
        if (index_data === -1) {
          cart[parent_index].dish[index].data.push(data);
        } else {
          cart[parent_index].dish[index].data[index_data].notes = dish_note;
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
      } else if (data.sets.length === 0 && data.activeIngredients !== 0) {
        let index_data;
        index_data = CheckDataIngreExist(
          cart[parent_index].dish[index].data,
          data,
        );
        if (index_data === -1) {
          cart[parent_index].dish[index].data.push(data);
        } else {
          cart[parent_index].dish[index].data[index_data].notes = dish_note;
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
      } else if (data.sets.length !== 0 && data.activeIngredients === 0) {
        let index_data;
        index_data = CheckDataSetExist(
          cart[parent_index].dish[index].data,
          data,
        );
        if (index_data === -1) {
          this.CartDish[parent_index].dish[index].data.push(data);
        } else {
          cart[parent_index].dish[index].data[index_data].notes = dish_note;
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
          cart[parent_index].dish[index].data[index_data].notes = dish_note;
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
    let response = {
      cartDish: cart,
      status: true,
    };

    props.updateCartDetails(cart);
    props.setoptionModelAdd(false);
    setModalVisible(false);
  };

  const editTocart = dish_val => {
    if (dish_val.sets !== undefined) {
      if (dish_val.sets.length > 0) {
        for (let i = 0; i < dish_val.sets.length; i++) {
          for (let j = 0; j < dish_val.sets[i].options.length; j++) {
            if (dish_val.sets[i].options[j].show === true) {
              if (dish_val.sets[i].options[j].type === 1) {
                let min = 0;
                for (
                  let k = 0;
                  k < dish_val.sets[i].options[j].choice.length;
                  k++
                ) {
                  if (dish_val.sets[i].options[j].choice[k].checked === true) {
                    min++;
                  }
                }
                if (
                  dish_val.sets[i].options[j].required === true &&
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
                } else if (min < dish_val.sets[i].options[j].min) {
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
                dish_val.sets[i].options[j].required === true &&
                dish_val.sets[i].options[j].type === 0
              ) {
                let min = 0;
                for (
                  let k = 0;
                  k < dish_val.sets[i].options[j].choice.length;
                  k++
                ) {
                  if (dish_val.sets[i].options[j].choice[k].checked === true) {
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
    }

    let cart = JSON.parse(JSON.stringify(props.optionItem.CartDish));

    let BackupCart =
      cart[indexcart.index].dish[indexcart.dishindex].data[
        indexcart.dishdataindex
      ];
    cart[indexcart.index].dish[indexcart.dishindex].quantity =
      cart[indexcart.index].dish[indexcart.dishindex].quantity -
      cart[indexcart.index].dish[indexcart.dishindex].data[
        indexcart.dishdataindex
      ].quantity;
    cart[indexcart.index].dish[indexcart.dishindex].data.splice(
      indexcart.dishdataindex,
      1,
    );
    let dishTotal_val =
      parseFloat(dishTotal) * parseInt(BackupCart.quantity, 10);

    setDishTotal(dishTotal_val);
    dishTotal_val = Number(dishTotal_val);
    let activeIngredients;
    activeIngredients = new Array();
    for (const ingre of dish_val.ingredientsarray) {
      if (ingre.status === false) {
        activeIngredients.push(ingre.name);
      }
    }
    let data;
    data = {
      id: dish_val.id,
      name: dish_val.name,
      //'description': this.dish.description,
      price: dish_val.price,
      delprice: dish_val.delprice,
      pickprice: dish_val.pickprice,
      notes: dish_note,
      totalprice: dishTotal_val,
      total: dishTotal_val,
      is_img: dish_val.is_img,
      img: dish_val.img,
      spicy: dish_val.spicy,
      spicyquantity: dish_val.spicyquantity,
      veg: dish_val.veg,
      nonveg: dish_val.nonveg,
      ingredients: dish_val.ingredients,
      ingredientsarray: dish_val.ingredientsarray,
      activeIngredients: activeIngredients,
      activeIngredientsText: activeIngredients.join(', '),
      quantity: BackupCart.quantity,
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
    if (dish_val.sets !== undefined) {
      for (let i = 0; i < dish_val.sets.length; i++) {
        for (let j = 0; j < dish_val.sets[i].options.length; j++) {
          let options;
          options = {
            id: dish_val.sets[i].options[j].id,
            name: dish_val.sets[i].options[j].name,
            choice: new Array(),
            choiceText: '',
          };
          let choiceTextArray;
          choiceTextArray = new Array();
          for (let k = 0; k < dish_val.sets[i].options[j].choice.length; k++) {
            if (dish_val.sets[i].options[j].choice[k].checked === true) {
              let choice;
              choice = {
                id: dish_val.sets[i].options[j].choice[k].id,
                name: dish_val.sets[i].options[j].choice[k].name,
                price: dish_val.sets[i].options[j].choice[k].price,
              };
              choiceTextArray.push(dish_val.sets[i].options[j].choice[k].name);
              choicesarray.push(choice.id);
              options.choice.push(choice);
            }
          }
          options.choiceText = choiceTextArray.join(', ');
          if (options.choice.length > 0) {
            optionsarray.push(options.id);
            data.sets.push(options);
          }
        }
      }
    }
    if (data.sets.length > 0) {
      data.relation = {
        options: optionsarray,
        choices: choicesarray,
      };
    }
    let parent_index = CheckBusinessAddtoCart(activeBusiness.id, cart);
    let index = CheckAddtoCart(data.id, parent_index, cart);
    if (data.sets.length === 0 && data.activeIngredients === 0) {
      let index_data = CheckData(cart[parent_index].dish[index].data, data);
      if (index_data === -1) {
        cart[parent_index].dish[index].data.push(data);
        cart[parent_index].dish[index].quantity = data.quantity;
      } else {
        cart[parent_index].dish[index].data[index_data].notes = dish_note;
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
    } else if (data.sets.length === 0 && data.activeIngredients !== 0) {
      let index_data = CheckDataIngreExist(
        cart[parent_index].dish[index].data,
        data,
      );
      if (index_data === -1) {
        cart[parent_index].dish[index].data.push(data);
        cart[parent_index].dish[index].quantity = data.quantity;
      } else {
        cart[parent_index].dish[index].data[index_data].notes = dish_val.notes;
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
    } else if (data.sets.length !== 0 && data.activeIngredients === 0) {
      let index_data = CheckDataSetExist(
        cart[parent_index].dish[index].data,
        data,
      );
      if (index_data === -1) {
        cart[parent_index].dish[index].data.push(data);
        cart[parent_index].dish[index].quantity = data.quantity;
      } else {
        cart[parent_index].dish[index].data[index_data].notes = dish_note;
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
      let index_data = CheckDataIngreSetsExist(
        cart[parent_index].dish[index].data,
        data,
      );
      if (index_data === -1) {
        cart[parent_index].dish[index].data.push(data);
        cart[parent_index].dish[index].quantity = data.quantity;
      } else {
        cart[parent_index].dish[index].data[index_data].notes = dish_note;
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
    indexcart.EDITPRODUCTCART = 0;
    let response = {
      cartDish: cart,
      status: true,
    };

    props.updateCartDetails(cart);
    props.setoptionModelAdd(false);
    setModalVisible(false);
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

  return (
    <>
      {dataItem != null && dish != null ? (
        <Modal
          isVisible={isModalVisible}
          style={{width: '95%', margin: 'auto', marginTop: '5%'}}>
          <View style={{flex: 1, position: 'relative'}}>
            <TouchableOpacity
              onPress={toggleModal}
              style={{
                position: 'absolute',
                right: responsiveWidth(1),
                top: responsiveHeight(1.5),
                zIndex: 1,
              }}>
              <Icon
                name="closecircleo"
                type="AntDesign"
                size={30}
                color={Colors.red}
              />
            </TouchableOpacity>
            <View
              style={{
                backgroundColor: Colors.white,
                borderRadius: 20,
                paddingHorizontal: responsiveWidth(2),
                paddingVertical: responsiveHeight(2),
              }}>
              <ScrollView>
                <View
                  style={{
                    paddingHorizontal: responsiveWidth(0.5),
                    marginVertical: responsiveHeight(1),
                  }}>
                  <View
                    style={{
                      marginTop: responsiveHeight(0.5),
                      marginBottom: responsiveHeight(1.5),
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontFamily: FONTS.Inter.bold,
                        fontSize: responsiveFontSize(2),
                        color: Colors.black,
                      }}>
                      {dish.name} {activeBusiness.currency_symbol}
                      {dish.price}
                    </Text>
                  </View>
                  <View
                    style={{
                      marginBottom: responsiveHeight(1.5),
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <RenderHtml
                      contentWidth={width}
                      source={{html: dish.description}}
                      baseStyle={{
                        fontFamily: FONTS.Inter.medium,
                        fontSize: responsiveFontSize(1.3),
                        color: Colors.black,
                      }}
                    />
                  </View>

                  {dish.sets.map((sets, setindex) => {
                    return sets.options.map((option, optionindex) => {
                      return option.show === true ? (
                        <View
                          key={'option_' + optionindex}
                          style={{marginBottom: responsiveHeight(3)}}>
                          <Text
                            style={{
                              fontFamily: FONTS.Inter.bold,
                              fontSize: responsiveFontSize(1.5),
                              color: Colors.themColor,
                              marginBottom: responsiveHeight(1),
                            }}>
                            {option.name}{' '}
                            {option.required === true ? '*' : null}
                          </Text>
                          {option.type == 1 ? (
                            <Text
                              style={{
                                fontFamily: FONTS.Inter.bold,
                                fontSize: responsiveFontSize(1),
                                color: Colors.black,
                              }}>
                              {'(Min: ' +
                                option.min +
                                ' & Max: ' +
                                option.max +
                                ')'}
                            </Text>
                          ) : null}
                          <View
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                              gap: responsiveWidth(2),
                            }}>
                            {option.choice.map((choice, choiceindex) => {
                              return option.type == 1 ? (
                                <View
                                  key={'choice_' + choiceindex}
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                  }}>
                                  <View>
                                    <RadioButton
                                      selected={choice.checked}
                                      onChange={() => {
                                        checkProductOption(
                                          setindex,
                                          optionindex,
                                          choiceindex,
                                          choice.checked,
                                        );
                                      }}
                                      size={22}
                                      containerStyle={{position: 'relative'}}
                                      activeColor={Colors.themColor}
                                      inactiveColor={Colors.themColor}
                                    />
                                  </View>
                                  <View
                                    style={{marginLeft: responsiveWidth(1)}}>
                                    <Text
                                      style={{
                                        fontFamily: FONTS.Inter.regular,
                                        color: Colors.black,
                                        fontSize: responsiveFontSize(1.2),
                                      }}>
                                      {choice.name}{' '}
                                      {choice.price > 0 ? (
                                        <>
                                          {activeBusiness.currency_symbol}{' '}
                                          {choice.price}
                                        </>
                                      ) : null}
                                    </Text>
                                  </View>
                                </View>
                              ) : option.type == 0 ? (
                                <View
                                  key={'choice_' + choiceindex}
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                  }}>
                                  <CheckBox
                                    checked={choice.checked}
                                    onChange={() => {
                                      checkProductOption(
                                        setindex,
                                        optionindex,
                                        choiceindex,
                                        choice.checked,
                                      );
                                    }}
                                    size={22}
                                    style={styles.checkbox}
                                    activeColor={Colors.themColor}
                                    inactiveColor={Colors.themColor}
                                  />
                                  <Text
                                    style={{
                                      marginLeft: responsiveWidth(1),
                                      fontFamily: FONTS.Inter.regular,
                                      fontSize: responsiveFontSize(1.2),
                                      color: Colors.black,
                                    }}>
                                    {choice.name}{' '}
                                    {choice.price > 0 ? (
                                      <>
                                        {activeBusiness.currency_symbol}{' '}
                                        {choice.price}
                                      </>
                                    ) : null}
                                  </Text>
                                </View>
                              ) : null;
                            })}
                          </View>
                        </View>
                      ) : null;
                    });
                  })}
                </View>

                <View
                  style={{
                    marginTop: responsiveHeight(2),
                    marginBottom: responsiveHeight(3),
                  }}>
                  <TextInput
                    multiline={true}
                    placeholder={'Special Comment'}
                    numberOfLines={10}
                    onChangeText={text => setItemNote(text)}
                    value={dish_note}
                    style={{
                      color: Colors.grey,
                      borderWidth: 1,
                      borderRadius: 15,
                      paddingLeft: 10,
                      height: responsiveHeight(15),
                      textAlignVertical: 'top',
                      borderColor: Colors.grey,
                      backgroundColor: Colors.white,
                    }}
                  />
                </View>

                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <View>
                    <Text
                      style={{
                        fontFamily: FONTS.Inter.bold,
                        fontSize: responsiveFontSize(1.9),
                        color: Colors.black,
                      }}>
                      Total {activeBusiness.currency_symbol}
                      {dishTotal}
                    </Text>
                  </View>
                  <View style={{paddingBottom: responsiveHeight(1)}}>
                    <TouchableOpacity
                      style={styles.add_button}
                      onPress={() => {
                        edit_product === false
                          ? addToCart(dish)
                          : editTocart(dish);
                      }}>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: responsiveFontSize(1.5),
                          color: '#fff',
                          fontFamily: FONTS.Inter.medium,
                        }}>
                        {dataItem.type == 1 ? 'Update' : 'Add'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      ) : null}
    </>
  );
};

export default OptionModel;

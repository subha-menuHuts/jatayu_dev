import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isDarkMode: false,
  userData: null,
  userToken: '',
  deviceToken: '',
  baseUrl: 'https://jatayu.menuhuts.com/apiv/',
  siteUrl: 'https://jatayu.menuhuts.com/',
  tempEmailorMobile: '',
  google_api_key: 'AIzaSyARNrCqoquwhpbimP4JYevdNmZXhjv12rc',
  google_auto_complete_country: 'country:in',
  //Navigation state
  isStackHeaderVisible: false,
  post_data: {},
  LangValue: {},
  selectedLang: 1,
  cartDetails: [],
  cartQuantity: 0,
  default_address: null,
  orderType: 1,
};

export const commonReducer = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setIsDarkMode: (state, action) => {
      state.isDarkMode = action.payload;
    },

    saveData: (state, action) => {
      console.log('csdkbcsdkbcdsbck');
      // state.userData = action.payload;
    },

    setTempEmail: (state, action) => {
      state.tempEmailorMobile = action.payload;
    },

    setUserData: (state, action) => {
      //console.log("action data : ", action.payload);
      state.userData = action.payload.result;
      //state.userToken = action.payload.token;
    },
    setUserDataAfterLogin: (state, action) => {
      state.userData = action.payload;
    },

    clearUserData: state => {
      state.userData = null;
      state.userToken = '';
    },

    localstorage_DeviceTokenAdd: (state, action) => {
      console.log('common:' + action.payload);
      state.deviceToken = action.payload;
    },

    localstorage_TokenAdd: (state, action) => {
      state.userToken = action.payload;
    },
    localstorage_UserdetailsAdd: (state, action) => {
      state.userData = action.payload;
    },

    //Navigation State
    setIsStackHeaderVisible: (state, action) => {
      state.isStackHeaderVisible = action.payload;
    },

    // advertisement for tab screens
    setAdvertisement: (state, action) => {
      console.log('adds payload', action);
      state.advertisements = action.payload;
    },

    setPostData: (state, action) => {
      //console.log("adds payload", action);
      state.post_data = action.payload;
    },
    removePostData: (state, action) => {
      //console.log("adds payload", action);
      state.post_data = {};
    },
    setLanguage: (state, action) => {
      state.selectedLang = action.payload;
    },
    setLanguageValue: (state, action) => {
      state.LangValue = action.payload;
    },
    setCartDetails: (state, action) => {
      state.cartDetails = action.payload;
    },
    setCartQuantity: (state, action) => {
      state.cartQuantity = action.payload;
    },
    saveOrderType: (state, action) => {
      state.orderType = action.payload;
    },
    setDefaultAddress: (state, action) => {
      state.default_address = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setIsDarkMode,
  saveData,
  setTempEmail,
  setUserData,
  clearUserData,
  localstorage_TokenAdd,
  localstorage_UserdetailsAdd,
  setUserDataAfterLogin,
  setPostData,
  removePostData,
  localstorage_DeviceTokenAdd,
  setCartDetails,
  setCartQuantity,
  setLanguage,
  setLanguageValue,
  saveOrderType,
  setDefaultAddress,

  //Navigation State
  setIsStackHeaderVisible,

  // advertisement for tab screens
  setAdvertisement,
} = commonReducer.actions;

export default commonReducer.reducer;

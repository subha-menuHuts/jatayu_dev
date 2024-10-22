import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formatted_address: "",
  latitude: "",
  longitude: "",
};

export const locationReducer = createSlice({
  name: "location",
  initialState,
  reducers: {
    reducer_setLatLong: (state, action) => {
      console.log(action.payload);
      state.latitude = action.payload.lat;
      state.longitude = action.payload.lng;
    },
    reducer_setAddress: (state, action) => {
      console.log(action.payload);
      state.formatted_address = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  reducer_setAddress,
  reducer_setLatLong,
} = locationReducer.actions;

export default locationReducer.reducer;

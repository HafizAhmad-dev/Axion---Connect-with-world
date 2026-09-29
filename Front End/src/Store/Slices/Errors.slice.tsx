import { createSlice } from "@reduxjs/toolkit";

type ErrorState = {
  code: Number | null,
  message: String | null;
};

const initialState: ErrorState = {
  code: null,
  message: null,
};

const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
   setError:(state,action)=>{
    state.code = action.payload.code;
    state.message = action.payload.message;
   },
   clearError:(state)=>{
    state.code = null;
    state.message = null;
   }
  },
});



export const { setError, clearError } = errorSlice.actions;
export default errorSlice.reducer;

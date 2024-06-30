import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    currentItem: null,
    error: null,
    loading: false,
}

const itemSlice = createSlice({
    name: 'item',
    initialState,
    reducers: {
        fetchItemStart: (state) => {
            state.loading = true;
        },
        fetchItemSuccess: (state, action) => {
            state.currentItem = action.payload;
            state.error = null;
            state.loading = false;
        },
        fetchItemFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
    }
});

export const {
  fetchItemStart, 
  fetchItemSuccess,
  fetchItemFailure,
} = itemSlice.actions;


export default itemSlice.reducer;
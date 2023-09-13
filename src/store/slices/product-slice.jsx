import { createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice({
    name: 'product',
    initialState: {
        products: [],
    },
    reducers: {
        _NO_USE_setProducts(state, action) {
            state.products = action.payload;
        }
    },
});

export const { _NO_USE_setProducts } = productSlice.actions;
export default productSlice.reducer;

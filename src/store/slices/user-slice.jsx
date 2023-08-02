import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: {}
    },
    reducers: {
        setUser(state, action) {
            const data = action.payload;
            state.user = {
                email: data.email,
                password: data.password
            };
        }
    },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
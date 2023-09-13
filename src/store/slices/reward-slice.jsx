import { createSlice } from '@reduxjs/toolkit';

const rewardSlice = createSlice({
    name: 'reward',
    initialState: {
        rewards: [],
    },
    reducers: {
        setRewards(state, action) {
            state.rewards = action.payload;
        }
    },
});

export const { setRewards } = rewardSlice.actions;
export default rewardSlice.reducer;

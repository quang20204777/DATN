import { createSlice } from "@reduxjs/toolkit";

const moviesSlice = createSlice({
    name: 'movies',
    initialState: {
        nowShowing: [],
    },
    reducers: {
        SetMovieNowShowing: (state, action) => {
            state.nowShowing = action.payload;
        }
    }
});

export const {SetMovieNowShowing} = moviesSlice.actions;
export default moviesSlice.reducer;
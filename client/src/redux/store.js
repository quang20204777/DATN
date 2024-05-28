import { configureStore } from "@reduxjs/toolkit";
import loadersReducer from "./loadersSlice";
import usersReducer from "./usersSlice";
import moviesReducer from "./moviesSlice";

const store = configureStore({
  reducer: {
    loaders: loadersReducer,
    users: usersReducer,
    movies: moviesReducer,
  },
});

export default store;
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers, applyMiddleware } from 'redux';
import LoginSlice from './slices/Login';
import CartSlice from './slices/Cart';
import ProductSlice from './slices/Products';
import thunk from 'redux-thunk';
const reducer = combineReducers({
  LoginSlice,
  CartSlice,
  ProductSlice
});

const store = configureStore(
  {reducer},
  applyMiddleware(thunk))

export default store;

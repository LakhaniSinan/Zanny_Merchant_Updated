import {createSlice} from '@reduxjs/toolkit';
import {useDispatch} from 'react-redux';
import {getProduct} from '../../services/product';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const initialState = {
  loading: false,
  hasErrors: false,
  products: [],
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    getProducts: state => {
      state.loading = true;
    },
    getProductsSuccess: (state, {payload}) => {
      state.products = payload;
      state.loading = false;
      state.hasErrors = false;
    },
    getProductsFailure: (state, {payload}) => {
      state.loading = false;
      state.hasErrors = payload;
    },
  },
});

export const {getProducts, getProductsSuccess, getProductsFailure} =
  productsSlice.actions;

export default productsSlice.reducer;

export function handelGetProducts(place) {
  console.log(place, 'placeplaceplace');
  try {
    return async dispatch => {
      // console.log("CALLEDDD");
      dispatch(getProducts());
      console.log('CALLEDDD_22');
      let data = await AsyncStorage.getItem('user');
      data = JSON.parse(data);
      console.log(data, 'DATAA');
      getProduct(data._id)
        .then(response => {
          if (response?.data?.status == 'ok') {
            let data = response?.data?.data;
            dispatch(getProductsSuccess(data));
          } else {
            dispatch(getProductsFailure(response.data));
            alert('something went wrong');
          }
        })
        .catch(error => {
          dispatch(getProductsFailure(error));
          console.log(error, 'error');
        });
    };
  } catch (error) {
    console.log(error, 'ERRR');
  }
}

// export const Products = createSlice({
//     name: "Products",
//     initialState: {
//         products: []
//     },
//     reducers: {
//         setProducts: (state, action) => {
//             state.products = action.payload
//         },
//     }
// })

// export const { setProducts } = Products.actions

// export default Products.reducer

// export function fetchRecipes() {
//     return async dispatch => {
//       dispatch(getRecipes())

//       try {
//         const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=')
//         const data = await response.json()

//         dispatch(getRecipesSuccess(data))
//       } catch (error) {
//         dispatch(getRecipesFailure())
//       }
//     }
//   }

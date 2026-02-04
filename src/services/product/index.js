import Api from '../index';
import {endPoints, requestType} from '../../constants/variables';

//Login Api
export const addProduct = params => {
  return Api(endPoints.addProduct, params, requestType.POST);
};

export const getProduct = id => {
  return Api(`${endPoints.getProduct}/${id}`, null, requestType.GET);
};

export const updateProduct = (id, params) => {
  return Api(`${endPoints.updateProduct}/${id}`, params, requestType.PUT);
};

export const deleteProduct = id => {
  return Api(`${endPoints.deleteProduct}/${id}`, null, requestType.DELETE);
};

import Api from "../index";
import { endPoints, requestType } from "../../constants/variables";

// export const getFoodCategoriesById = (id) => {
//   return Api(`${endPoints.getFoodCategoriesById}/${id}`, null, requestType.GET);
// };
// export const updateFoodCategory = (id, params) => {
//   return Api(`${endPoints.updateFoodCategory}/${id}`, params, requestType.PUT);
// };

// export const  createFoodCategory= (params) => {
//   return Api(endPoints.createFoodCategory, params, requestType.POST);
// };

// export const deleteFoodCategory = (id) => {
//   return Api(`${endPoints.deleteFoodCategory}/${id}`, null, requestType.DELETE);
// };

export const getAllFoodCategories = () => {
  return Api(endPoints.getAllFoodCategories, null, requestType.GET);
}

import Api from "../index"
import { endPoints,requestType } from "../../constants/variables"

export const getMerchantAccountDetails = id => {
    return Api(`${endPoints.getMerchantAccountDetails}/${id}`, null, requestType.GET);
  };
  
  export const updateMerchantAccountDetails = (id, params) => {
    return Api(
      `${endPoints.updateMerchantAccountDetails}/${id}`,
      params,
      requestType.PUT,
    );
  };
  
  export const addMerchantAccountDetails = params => {
    return Api(endPoints.addMerchantAccountDetails, params, requestType.POST);
  };
  export const connectAccount = (params) => {
    return Api(endPoints.connectAccount, params, requestType.POST);
  };
  
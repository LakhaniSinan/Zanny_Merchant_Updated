import Api from "../index";
import {endPoints, requestType} from "../../constants/variables"


//Login Api
export const registerMerchant = (params) => {
    return Api(endPoints.registerMerchant, params, requestType.POST);
  };

  export const loginMerchant =(params)=>{
    return Api(endPoints.loginMerchant, params, requestType.POST);
  }
  
  export const sendCode=(params)=>{
    return Api(endPoints.sendCode, params, requestType.POST);
  }
  export const sendResetCodeMerchant=(params)=>{
    return Api(endPoints.sendResetCodeMerchant, params, requestType.POST);
  }
  export const getCertificationLink = () => {
    return Api(`${endPoints.getCertificationLink}`, null, requestType.GET);
  };

  export const resetPasswordMerchant = params => {
    return Api(endPoints.resetPasswordMerchant, params, requestType.POST);
  };
  

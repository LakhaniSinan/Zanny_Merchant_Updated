import Api from "../index"
import { endPoints,requestType } from "../../constants/variables"

export const getMerchantProfile = id => {
    return Api(`${endPoints.getMerchantProfile}/${id}`, null, requestType.GET);
  };
  
  export const updateMerchantProfile = (id, params) => {
    return Api(
      `${endPoints.updateMerchantProfile}/${id}`,
      params,
      requestType.PUT,
    );
  };

  export  const getSupportMessagesById = (id, params) => {
    return Api(
      `${endPoints.getSupportMessagesById}/${id}`,
      null,
      requestType.GET,
    );
  };
  export  const createSupportMessage = (params) => {
    return Api(
      `${endPoints.createSupportMessage}`,
      params,
      requestType.POST,
    );
  };
  

  export const getMerchantPaymentHistory = (id) => {
    console.log(id,"kkfkkflklflf");
    return Api(`${endPoints.getMerchantPaymentHistory}/${id}`, null, requestType.GET);
  };

  
  export const changePasswordMerchant = params => {
    return Api(endPoints.changePasswordMerchant, params, requestType.POST);
  };
  
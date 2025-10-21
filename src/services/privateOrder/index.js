import Api from "../index";
import { endPoints,requestType } from "../../constants/variables";

export const getPrivateOrderByMerchant = (id) => {
    return Api(
        `${endPoints.getPrivateOrderByMerchant}/${id}`,
        null,
        requestType.GET,
    );
}

export const updatePrivateOrderStatus = (params)=>{
    return Api(
        `${endPoints.updatePrivateOrderStatus}`,
        params,
        requestType.PUT,
    );
}
import Api from "../index";
import { endPoints,requestType } from "../../constants/variables";

export const getOrderByMerchant = (id) => {
    return Api(
        `${endPoints.getOrderByMerchant}/${id}`,
        null,
        requestType.GET,
    );
}

export const updateOrderStatus = (params)=>{
    return Api(
        `${endPoints.updateOrderStatus}`,
        params,
        requestType.PUT,
    );
}
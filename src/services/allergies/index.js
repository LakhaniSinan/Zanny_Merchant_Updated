import Api from "../index"
import { endPoints,requestType } from "../../constants/variables";

 export const getAllAllergies = () => {
    return Api(
        `${endPoints.getAllAllergies}`,
        null,
        requestType.GET,
    );
}
export const getAllergiesByCategory = (params) => {
    return Api(
        `${endPoints.getAllergiesByCategory}`,
        params,
        requestType.GET,
    );
}


export const getAllergiesCategories = () => {
    return Api(
        `${endPoints.getAllergiesCategories}`,
        null,
        requestType.GET,
    );
}

export const getAllFAQs = () => {
    return Api(
        `${endPoints.getAllFAQs}`,
        null,
        requestType.GET,
    );
}
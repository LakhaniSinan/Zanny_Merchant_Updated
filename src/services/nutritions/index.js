import Api from "../index";
import { endPoints,requestType } from "../../constants/variables";

export const getAllNutritions = (id) => {
    return Api(
        `${endPoints.getAllPortionSections}`,
        null,
        requestType.GET,
    );
}


import { endPoints, requestType } from "../../constants/variables";
import Api from "../index"
export const getSettings = () => {
  return Api(endPoints.getSettings, null, requestType.GET);
};

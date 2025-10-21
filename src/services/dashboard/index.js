import Api from '../index';
import {endPoints, requestType} from '../../constants/variables';


export const merchantDashboard = (id, params) => {
  return Api(`${endPoints.merchantDashboard}/${id}`, params, requestType.POST);
};

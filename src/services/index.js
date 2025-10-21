import axios from 'axios';
// let baseUrl = 'http://192.168.0.43:4000/api/';
// let baseUrl = 'https://8d9r9mm3-4000.inc1.devtunnels.ms/api/';
let baseUrl = 'https://sirldigital.com/zannyFoods/api/';

const api = async (path, params, method) => {
  let options;
  options = {
    headers: {
      'Content-Type': 'application/json',
    },
    method: method,
    ...(params && {data: JSON.stringify(params)}),
  };
  console.log(baseUrl + path, options, 'options');

  return axios(baseUrl + path, options)
    .then(response => {
      return response;
    })
    .catch(async error => {
      console.log(error, 'error');
      return error.response;
    });
};

export default api;

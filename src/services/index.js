import axios from 'axios';
// let baseUrl = 'http://192.168.0.62:4000/api/';
// let baseUrl = 'https://0g01d8wd-4000.inc1.devtunnels.ms/api/';
let baseUrl = 'https://pure-sands-31625-2fc0c2d49903.herokuapp.com/api/';
// let baseUrl = 'https://rt2j38bh-4000.asse.devtunnels.ms/api/';

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

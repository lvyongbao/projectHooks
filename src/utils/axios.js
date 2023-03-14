import axios from 'axios';
import { message } from 'antd';
import { inRange } from 'lodash';
import qs from 'qs';
import { REQUEST_SUCCESS_REGION } from './config';

axios.defaults.baseURL = '/';
axios.defaults.withCredentials = true;
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.transformRequest = [
  (data) => {
    try {
      return JSON.parse(JSON.stringify(data), (_, v) => v || (v === 0 ? v : undefined));
    } catch (error) {
      return data;
    }
  },
  ...axios.defaults.transformRequest,
];

axios.interceptors.request.use((config) => {
  // 不传employeeId的接口
  // const noIncludes = ['getUserCenterDomain', 'login', 'getUser', 'getAuthority', 'getMenuList'];
  // if (!noIncludes.some((item) => config.url.includes(item))) {
  Object.assign(config, {
    ...config,
    params: config.params
      ? { ...config.params, employeeId: sessionStorage.getItem('employeeId') }
      : { employeeId: sessionStorage.getItem('employeeId') },
  });
  // }
  return config;
});

axios.interceptors.response.use((response) => {
  message.destroy();
  const { config, data } = response;
  if (config.responseType !== 'blob') {
    if (typeof data !== 'object') {
      message.error('服务端异常！');
      return Promise.reject(config);
    }

    if (data.code === 200) {
      return data;
    }
    if (inRange(data.code, ...REQUEST_SUCCESS_REGION)) {
      if (data.message) message.error(data.message);
      return response;
    }
    if (data.code === 999999 || data.code === 201) {
      if (data.message) message.error(data.message);
      return Promise.reject(data);
    }
    // if (data.code !== 200) {
    //   if (data.message) message.error(data.message);
    //   return Promise.reject(data);
    // }
    // return data;
  }
  return response;
});

// 文件上传方法
axios.file = (url, data = {}, options = {}) =>
  axios({
    ...options,
    url,
    data: qs.stringify(data),
    headers: {
      ...options.headers,
      'Content-Type': 'multipart/form-data',
    },
    method: 'POST',
  });

// form表单方法
axios.form = (url, data = {}, options = {}) =>
  axios({
    ...options,
    url,
    data: qs.stringify(data),
    headers: {
      ...options.headers,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
  });

// 自定义jsonp option{url,jsonp: 'callback',jsonpCallback: 'user_lbn_jsonpResponse',success:() =>{})}
axios.jsonp = (option) => {
  const defalus = {
    jsonp: 'callback', // 默认发送请求的值是函数名的值
  };
  // 覆盖默认参数
  // eslint-disable-next-line guard-for-in
  for (const attr in option) {
    defalus[attr] = option[attr];
  }
  let p = '';
  if (defalus.data) {
    // eslint-disable-next-line guard-for-in
    for (const key in defalus.data) {
      p += `${key}=${defalus.data[key]}&`;
    }
  }
  let cbName;
  if (defalus.jsonpCallback) {
    cbName = defalus.jsonpCallback;
  } else {
    // 回调函数名称
    cbName = `jQuery${`v1.11.1${Math.random()}`.replace(/\D/g, '')}_${new Date().getTime()}`;
  }
  window[cbName] = (data) => {
    defalus.success(data);
  };
  const srcipt = document.createElement('script');
  const head = document.getElementsByTagName('head')[0];

  srcipt.src = `${defalus.url}?${p}${defalus.jsonp}=${defalus.jsonpCallback}`;
  head.appendChild(srcipt);
};

export const { file, form, get, post, jsonp } = axios;
export default axios;

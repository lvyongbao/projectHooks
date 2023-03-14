/*
 * @Description: 前端下载
 * @Author: 大宝
 * @Date: 2022-09-20 15:53:36
 */
import qs from 'qs';
import { message } from 'antd';
import axios from './axios';

export default function downloadFile(url, params, method = 'get') {
  let config = {};
  if (method === 'get') {
    config = {
      method: 'get',
      url,
      params,
      responseType: 'blob',
    };
  } else if (method === 'postForm') {
    config = {
      method: 'post',
      url,
      data: qs.stringify(params),
      responseType: 'blob',
    };
  } else if (method === 'post') {
    config = {
      method: 'post',
      url,
      data: params,
      responseType: 'blob',
    };
  }

  return new Promise((resolve, reject) => {
    axios(config).then((response) => {
      const reader = new FileReader();
      reader.readAsText(response.data, 'utf-8');
      reader.onload = (e) => {
        try {
          // 说明是普通对象数据
          const jsonData = JSON.parse(e.target.result);
          resolve(jsonData);
          // message.error(jsonData.message || jsonData.msg);
        } catch (err) {
          // 流文件
          // download(response);
          resolve(response);
          // return response;
        }
      };
    });
  });
}

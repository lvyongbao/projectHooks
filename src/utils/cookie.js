/*
 * @Author: your name
 * @Date: 2021-07-02 10:59:25
 * @LastEditTime: 2021-07-05 11:12:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \main\src\utils\cookie.js
 */
const setCookie = (key, val, hour) => {
  if (!hour || hour === 0) {
    document.cookie = `${key}=${escape(val)}`;
  } else {
    const expires = hour * 60 * 60 * 1000;
    const date = new Date(+new Date() + expires);
    document.cookie = `${key}=${escape(val)};expires=${date.toUTCString()}`;
  }
};

/**
 * cookie获取
 * @param {*} key cookie的名称
 */
const getCookie = (key) => {
  const reg = new RegExp(`(^| )${key}=([^;]*)(;|$)`);
  const arr = document.cookie.match(reg);
  if (arr) {
    return unescape(arr[2]);
  }
  return null;
};

/**
 * cookie删除
 * @param {*} key cookie的名称
 */
const deleteCookie = (key) => {
  setCookie(key, ' ', -1);
};

export { setCookie, getCookie, deleteCookie };
// export default cookie;

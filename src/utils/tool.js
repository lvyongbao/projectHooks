/**
 * @正则验证
 */
const regExp = {
  // 身份证
  idCard: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
  // 电话（包括座机+手机）
  phone:
    /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|^[a-zA-Z]+)$)/,
  // 邮政编码
  postcode: /[1-9]\d{5}(?!\d)/,
  /**
   * 通用
   */
  // 中文
  chinese: /[\u4e00-\u9fa5]/,
  // 数字、英文，忽略大小写
  numberLetter: /^[a-z0-9]+$/i,
  taxnum: /^[a-zA-Z0-9]{6,20}$/,
  saletaxnum: /^[a-zA-Z0-9]{15,20}$/,
  email: /^[a-zA-Z0-9_.·•-]+@[a-zA-Z0-9_.·•-]+(\.[a-zA-Z0-9_.·•-]+)+$/,
  // eslint-disable-next-line no-control-regex
  chineFont: /[^\x00-\xff]|·/g, // 中文
  jskpCode: /^[A-Za-z0-9]{6}$/g, // 极速开票代码
  invoiceNumber: /^(\d{6})(\d{2})?$/, // 6位或8位的数字发票号码
  invoiceNumber8: /^(\d{8})$/, // 8位的数字发票号码
  invoicecode: /^(\d{10})(\d{2})?$/, // 10位或12位的数字发票代码
  price: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, // 金额校验
  href: /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+).)+([A-Za-z0-9-~\/])+$/, // 链接
};

/**
 *@description: 密码字段，校验规则
 *@modifyContent:
 *@date: 2022-07-22 10:56:34
 */
const PASSWORD_RULES = [
  { max: 20, message: '密码不能超过20位' },
  { min: 8, message: '密码不能少于8位' },
  {
    pattern:
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\\$%\\^&\\*\\(；;\\.~_\\?-\\+=·`\\\\\\|/,，。《》<>\\[\\{【】「」]).*$/,
    message: '密码必须同时含有大小写字母、数字和特殊字符',
  },
];

/**
 * 四舍五入。
 * @params v要转换的值 | e保留的位数
 */
function round(v, e) {
  let t = 1;
  for (; e > 0; t *= 10, e--);
  for (; e < 0; t /= 10, e++);
  return Math.round(v * t) / t;
}

/**
 *
 * @param {* 科学计数法} value
 * 科学计数法转换为正常数值显示
 */
function scienceToNum(value) {
  const val = value.toString();
  if (val.indexOf('e') < 0) {
    return val;
  }
  const scienArr = val.split('e');
  // 科学计数法数值
  const numTemp = scienArr[0];
  let num;
  // 科学计数法位数
  const digit = scienArr[1];
  const arr = numTemp.split('.');
  if (digit.indexOf('-') < 0) {
    if (arr.length > 1) {
      if (arr[1].length <= parseInt(digit.slice(1), 10)) {
        num = arr.join();
      } else {
        const next = arr[1].substring(0, parseInt(digit.slice(1), 10));
        const left = arr[1].slice(parseInt(digit.slice(1), 10));
        num = `${arr[0] + next}.${left}`;
      }
    } else {
      num = arr.join();
    }
  } else {
    num = arr.join();
  }

  // 计算需要补0的个数
  let zero = '';
  let len = 0;
  if (digit.indexOf('-') > -1) {
    len = parseInt(digit.slice(1), 10) - 1;
  } else if (arr[1]?.length < parseInt(digit, 10)) {
    len = parseInt(digit.slice(1), 10) - arr[1].length;
  }
  // 如果是整数
  if (arr.length <= 1) {
    len = parseInt(digit.slice(1), 10); // 零的个数和科学计数法的位数相等
  }
  if (digit.indexOf('-') > -1 || arr.length <= 1 || arr[1]?.length < parseInt(digit.slice(1), 10)) {
    for (let i = 0; i < len; i++) {
      zero += '0';
    }
  }
  if (digit.indexOf('-') > -1) {
    // 小数科学计数法
    return `0.${zero}${num}`;
  }
  // 整数科学计数法
  return num + zero;
}

/**
 * @param {String} val 要处理的字符串
 * @param {Number} limit 截取字符串的前limit位
 * @param {Boolean} isCalcChinese 中文是否按2个字符算，默认 是
 */
const subMixString = (val, limit, isCalcChinese = true) => {
  if (typeof val !== 'string') {
    return 0;
  }
  let valLength = 0;
  let subIndex = -1;
  for (let ii = 0; ii < val.length; ii++) {
    if (isCalcChinese && /[^\x00-\xff]|·/g.test(val[ii])) {
      valLength += 2;
    } else {
      valLength += 1;
    }
    if (valLength > limit) {
      subIndex = ii;
      break;
    }
  }
  return subIndex > -1 ? val.substring(0, subIndex) : val;
};

/**
 * @description: 获取url所有参数 返回 key : value 对象
 * @param {*}
 * @return {*} {a:1,b:2}
 */
const getQueryString = () => {
  const url = window.location.search; // 获取url中"?"符后的字串
  const searchParams = {};
  if (url.indexOf('?') !== -1) {
    const str = url.substr(1).split('&');
    for (let i = 0; i < str.length; i++) {
      searchParams[str[i].split('=')[0]] = unescape(str[i].split('=')[1]);
    }
  }
  return searchParams;
};

/**
 * @func 四舍五入保留小数，原生toFixed会有精度问题
 * @return <String>
 * @param digit <String, Number> 待转换数字
 * @param decimal <Number> 保留位数
 * @param number <Number> 小数部分末尾最多显示0的数量
 */
const toFixed = (digit, decimal, number) => {
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(digit) || digit === '') {
    return digit;
  }

  // 默认末尾只保留2个0
  if (number === undefined) {
    // eslint-disable-next-line no-param-reassign
    number = 2;
  }

  // eslint-disable-next-line no-param-reassign
  decimal = decimal || 0;

  // 将数字转换为字符串，用于分割
  let value = digit.toString();

  // 补零
  const mend = (num) => {
    let zero = '';
    while (num > 0) {
      zero += '0';
      // eslint-disable-next-line no-param-reassign
      num -= 1;
    }
    return zero;
  };

  // 正负数
  let pre = '';
  if (value < 0) {
    value = value.replace('-', '');
    pre = '-';
  }

  // 获取小数点所在位置
  const i = value.indexOf('.');
  // 存在小数点
  if (i !== -1 && decimal >= 0) {
    let integer = parseInt(value.substr(0, i), 10);
    // 小数部分转为0.xxxxx
    // eslint-disable-next-line no-underscore-dangle
    let _decimal = `0${value.substr(i)}`;
    const num = `1${mend(decimal)}`;
    _decimal = (Math.round(_decimal * num) / num).toFixed(decimal);
    // 小数四舍五入后，若大于等于1，整数部分需要加1
    if (_decimal >= 1) {
      integer = (integer + 1).toString();
    }
    value = pre + integer + _decimal.substr(1);
  }
  // 整数就直接补零
  else if (decimal > 0) {
    value = `${pre + value}.${mend(decimal)}`;
  }

  if (number !== null && number >= 0 && number < decimal) {
    value = value.replace(/0+$/, '');
    // eslint-disable-next-line no-shadow
    const i = value.indexOf('.');
    let len = 0;
    if (i !== -1) {
      len = value.substr(i + 1).length;
    }
    while (len < number) {
      value += '0';
      len += 1;
    }
    value = value.replace(/\.$/, '');
  }

  return value;
};

/**
 * @func function
 * @description 检测是否需要安装PDF阅读器
 * @return <Boolean>
 */
const isInstallPDF = () => {
  let i;
  let len;

  let flag = true;

  // if (Nui.browser.webkit || (Nui.browser.mozilla && Nui.browser.version > 19)) {
  //   flag = false;
  // }

  // eslint-disable-next-line no-cond-assign
  if (navigator.plugins && (len = navigator.plugins.length)) {
    for (i = 0; i < len; i++) {
      if (/Adobe Reader|Adobe PDF|Acrobat|Chrome PDF Viewer/.test(navigator.plugins[i].name)) {
        flag = false;
        break;
      }
    }
  }
  try {
    if (window.ActiveXObject || window.ActiveXObject.prototype) {
      for (i = 1; i < 10; i++) {
        try {
          // eslint-disable-next-line no-eval
          if (eval(`new ActiveXObject('PDF.PdfCtrl.${i}');`)) {
            flag = false;
            break;
          }
        } catch (e) {
          flag = true;
        }
      }

      const arr = [
        'PDF.PdfCtrl',
        'AcroPDF.PDF.1',
        'FoxitReader.Document',
        'Adobe Acrobat',
        'Adobe PDF Plug-in',
      ];
      len = arr.length;
      for (i = 0; i < len; i++) {
        try {
          // eslint-disable-next-line no-undef
          if (new ActiveXObject(arr[i])) {
            flag = false;
            break;
          }
        } catch (e) {
          flag = true;
        }
      }
    }
    // eslint-disable-next-line no-empty
  } catch (e) {}
  return flag;
};

/**
 *@description: ArrayBuffer转字符串 u-ArrayBuffer  |  f 回调函数
 *@date: 2022-07-22 10:56:34
 */
const ab2str = (u, f) => {
  const b = new Blob([u]);
  const r = new FileReader();
  r.readAsText(b, 'utf-8');
  r.onload = () => {
    if (f) {
      f.call(null, r.result);
    }
  };
};

/**
 *@description: 转换数字为千位逗号隔开格式
 *@date: 2022-07-22 10:56:34
 */
const numToThousands = (num = 0, fixTwo) => {
  return num.toString().replace(/\d+/, (n) => {
    return fixTwo && !Number(n) ? '0.00' : n.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  });
};

/*
 *@description: 下拉框数据转换
 *@params: list:原数据
 *@params: option:需要转换的配置项
 *@example:list:[{typeId:xxx,typeName:xxx}] option:{id:typeId,name:typeName}
 *@author: 大宝
 *@date: 2022-07-25 13:53:53
 */
const tranSelectOptions = (list = [], options = {}) => {
  if (!Object.keys(options).length >= 2 || !list.length) {
    return [];
  }
  return list.map((item) => ({
    id: item[options.id],
    key: item[options.id],
    name: item[options.name],
  }));
};

/*
 *@description: 树型下拉框数据转换
 *@params: list:原数据
 *@params: option:需要转换的配置项
 *@example: list:[{typeId:xxx,typeName:xxx,childrens:xxx}] option:{value:typeId,title:typeName,children:childrens}
 *@author: 大宝
 *@date: 2022-07-25 13:53:53
 */
const tranTreeSelectOptions = (list = [], options = {}) => {
  if (!Object.keys(options).length >= 2 || !list.length) {
    return [];
  }
  return list.map((items) => {
    if (items[options.children] && items[options.children].length) {
      return {
        title: items[options.title],
        value: items[options.value],
        key: items[options.value],
        children: tranTreeSelectOptions(items[options.children], options),
      };
    }
    return {
      title: items[options.title],
      value: items[options.value],
      key: items[options.value],
    };
  });
};

// 数组转对象
const arrayToMap = (array, keyName = 'id', valueName = 'name') => {
  return array.reduce((obj, item) => {
    return Object.assign(obj, { [item[keyName]]: item[valueName] });
  }, {});
};

// 下载
const download = (response) => {
  // for IE
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    let filename = response.headers; // 下载后文件名
    filename = filename['content-disposition'];
    const [, name] = filename.split(';');
    const [, fileName] = name.split('filename=');
    filename = fileName;
    const blob = new Blob([response.data]);
    window.navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    let filename = response.headers; // 下载后文件名
    filename = filename['content-disposition'];
    const [, name] = filename.split(';');
    const [, fileName] = name.split('filename=');
    filename = decodeURIComponent(fileName);
    const blob = new Blob([response.data]);
    const downloadElement = document.createElement('a');
    const href = window.URL.createObjectURL(blob); // 创建下载的链接
    downloadElement.href = href;
    downloadElement.download = filename;
    document.body.appendChild(downloadElement);
    downloadElement.click(); // 点击下载
    document.body.removeChild(downloadElement); // 下载完成移除元素
    window.URL.revokeObjectURL(href); // 释放掉blob对象
  }
};

export {
  regExp,
  PASSWORD_RULES,
  round,
  scienceToNum,
  subMixString,
  getQueryString,
  toFixed,
  isInstallPDF,
  ab2str,
  numToThousands,
  tranSelectOptions,
  tranTreeSelectOptions,
  arrayToMap,
  download,
};
// export default utils;

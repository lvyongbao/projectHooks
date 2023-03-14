const { NODE_ENV } = process.env;

const config = {
  // 请求前缀方便node代理服务转换
  baseUrl: NODE_ENV === 'production' ? '' : '/settlement',
  // 请求成功区间(开区间) 老的约定
  REQUEST_SUCCESS_REGION: [202, 2000],
  // 当前是否是生产环境
  prodEnv: NODE_ENV === 'production',
};

module.exports = config;

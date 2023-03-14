import { post } from '@/utils';

// 获取列表
// eslint-disable-next-line import/prefer-default-export
export const getOrderDetailList = (data) =>
  post('/settlement/web/detail/getOrderDetailList.do', data);

import { get, post } from '@/utils';

// 获取回单来源
export const getOrderList = (data) => post('/settlement/web/order/getOrderList.do', data);

// 获取订单来源
export const getOrderBusinessSource = () => get('/settlement/web/type/getOrderBusinessSource.do');

// 获取订单类型
export const getOrderChannel = () => get('/settlement/web/type/getOrderChannel.do');

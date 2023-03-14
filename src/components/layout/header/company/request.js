import { get } from '@/utils';

// 获取用户企业列表
export const getEnterpriseList = () => get('/settlement/web/homepage/getEnterpriseList.do');

// 切换结算系统
export const switchEnterprise = (params) =>
  get('/settlement/web/homepage/switchEnterprise.do', { params });

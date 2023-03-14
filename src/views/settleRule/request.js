import { get, post } from '@/utils';

// 获取回单列表
export const getPageRuleList = (data) => post('/settlement/web/rule/getPageRuleList.do', data);

// 删除结算规则
export const delRule = (params) => get('/settlement/web/rule/delRule.do', { params });

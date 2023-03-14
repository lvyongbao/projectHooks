import { get, post } from '@/utils';

// 添加结算规则
// eslint-disable-next-line import/prefer-default-export
export const addRule = (data) => post('/settlement/web/rule/addRule.do', data);

import { get, post } from '@/utils';

// 用户中心登录地址
export const getUserCenterDomain = (params) =>
  get('/settlement/web/allow/getUserCenterDomain.do', { params });

// 模拟登录
export const login = (params) => get('/settlement/web/allow/login.do', { params });

// 获取用户信息
export const getUser = (params) => get('/settlement/web/allow/getUser.do', { params });

// 权限查询
export const getAuthority = (params) => get('/settlement/web/homepage/getAuthority.do', { params });

// 菜单
export const getMenuList = () => get('/settlement/web/homepage/getMenuList.do');

// 获取业务类型/服务类型
export const getType = (params) => get('/settlement/web/type/getType.do', { params });

// 获取结算对象列表/结算对象下拉选
export const getTargetList = (data) => post('/settlement/web/target/getTargetList.do', data);

// 获取适用区域下拉选/订单收款方下拉选
export const getAllCompany = () => get('/settlement/web/shopBase/getAllCompany.do');

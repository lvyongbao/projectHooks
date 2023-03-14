import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { router } from '@/router';

/*
 *@description:用于判断是否有权限
 *@return:[无页面(无菜单或者跳转的地址不存在)，企业类型，未归属企业，归属企业非大宝网，归属企业为大宝网但非企业管理员]
 *@author: 大宝
 *@date: 2022-09-30 17:39:56
 */
export default () => {
  const { pathname } = useLocation();
  const { registerType, companyId, isDisable } = useSelector((state) => state.global.userInfo);
  const menus = useSelector((state) => state.global.menuList);
  const [noPage, setNoPage] = useState(false);

  // 判断有无页面，需根据数据变化而变化，所以要用useEffect

  useEffect(() => {
    setNoPage(
      () =>
        pathname !== '/' &&
        (!menus.find((item) => pathname.split('/')[1] === item.url) ||
          !router.find((item) => pathname === `/${item.path}`)),
    );
  }, [menus, pathname]);

  return [
    noPage,
    registerType === '1',
    registerType === '0' && !companyId,
    registerType === '0' && companyId && !isDisable,
    registerType === '0' && companyId && isDisable && !menus.length,
  ];
};

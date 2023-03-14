import React from 'react';
import SettleObject from './views/settleObject';
import SettleRule from './views/settleRule';
import SettleRuleDetail from './views/settleRule/detail';
import SettleOrder from './views/settleOrder';
import SettleDetail from './views/settleDetail';

const routers = [
  {
    path: 'settleObject',
    title: '结算对象',
    element: <SettleObject />,
  },
  {
    path: 'settleRule',
    title: '结算规则',
    element: <SettleRule />,
    children: [
      {
        path: 'detail',
        title: '添加结算规则',
        element: <SettleRuleDetail />,
        // children: [
        //   {
        //     path: 'aaa',
        //     element: <SettleRuleDetail />,
        //   },
        // ],
      },
    ],
  },
  {
    path: 'settleOrder',
    title: '结算订单',
    element: <SettleOrder />,
  },
  {
    path: 'settleDetail',
    title: '结算明细',
    element: <SettleDetail />,
  },
];

// const routers = [
//   {
//     path: 'settlementTarget',
//     title: '结算对象',
//     element: <SettleObject />,
//   },
//   {
//     path: 'settlementRule',
//     title: '结算规则',
//     element: <SettleRule />,
//     children: [
//       {
//         path: 'detail',
//         title: '结算规则配置',
//         element: <SettleRuleDetail />,
//         children: [
//           {
//             path: 'aaa',
//             element: <SettleRuleDetail />,
//           },
//         ],
//       },
//     ],
//   },
//   {
//     path: 'settlementOrder',
//     title: '结算订单',
//     element: <SettleOrder />,
//   },
//   {
//     path: 'settlementOrderDetail',
//     title: '结算明细',
//     element: <SettleDetail />,
//   },
// ];

// 重组路由
const deepRouter = (data, parentPath) => {
  const newRouter = [];
  (function deep(d, p) {
    d.forEach(({ path, element, children, title }) => {
      if (children && children.length) {
        deep(children, `${p ? `${p}/` : ''}${path}`);
      }
      newRouter.push({ path: `${p ? `${p}/` : ''}${path}`, element, title });
    });
  })(data, parentPath);
  return newRouter;
};
export const router = deepRouter(routers, '');

// 重组面包屑
export const deepBreadCrumb = (currentPath) => {
  const flag = currentPath.split('/').filter((flags) => flags)[0];
  const oneRouter = routers.filter((item) => item.path === flag);
  const newBreadCrumb = deepRouter(oneRouter, '')
    .map(({ path, title }) => ({ path, title }))
    .filter(({ path }) => currentPath.length >= path.length);
  return newBreadCrumb.reverse();
};

// 返回第一个叶节点
export function getFirstRoute(route) {
  function getLeaf(item) {
    if (item.children && item.children.length) {
      return getLeaf(item.children[0]);
    }
    return item;
  }
  return route && route.length ? getLeaf(route[0]) : '/';
}

// 返回当前路由的父节点，如果有
// export const findFatherMenu = (pathname) => {
//   return !!routers.find((key) => `/${key.path}` === pathname)?.parentMenuCode;
// };

export const findFatherNode = (pathname, data) => {
  const openKeys = [];
  (function deeps(key) {
    const current = routers.find((keys) => `/${keys.path}` === key);
    if (current.parentMenuCode) {
      deeps(`/${current.parentMenuCode}`);
      openKeys.push(current.parentMenuCode);
    }
  })(pathname);
  return openKeys.reverse();
};

export default routers;

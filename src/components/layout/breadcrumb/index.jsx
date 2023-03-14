import React from 'react';
import { Breadcrumb } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { deepBreadCrumb } from '@/router';
// import Style from './index.less';

const Breadcrumbs = () => {
  const { pathname } = useLocation();
  const breadcrumb = deepBreadCrumb(pathname);
  // const judgePath = useCallback(
  //   (e, url) => {
  //     if (isOaFlowPage) {
  //       e.preventDefault(); // 阻止跳转
  //       confirm({
  //         title: '返回后当前内容不会被保存，确认离开吗？',
  //         content: '',
  //         okText: '确定',
  //         cancelText: '取消',
  //         onOk() {
  //           history.push(url);
  //         },
  //         onCancel() {},
  //       });
  //     }
  //   },
  //   [history, isOaFlowPage],
  // );
  return breadcrumb.length >= 2 ? (
    <Breadcrumb>
      {breadcrumb.map(({ title, path }, index) => (
        <Breadcrumb.Item key={path}>
          {index ? <Link to={path}>{title}</Link> : title}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  ) : null;
};

// Breadcrumbs.propTypes = PropTypes.any;
export default Breadcrumbs;

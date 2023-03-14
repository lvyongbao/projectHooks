import React from 'react';
import { Layout } from 'antd';
import { useRoutes } from 'react-router-dom';
import PropTypes from 'prop-types';
import { router } from '@/router';
import useJudge from './errorPage/useJudge';
import Nav from './nav';
import Header from './header';
import Breadcrumb from './breadcrumb';
import Error from './errorPage';
import Style from './index.less';

const { Content } = Layout;

const LayoutSelf = () => {
  const content = useRoutes(router);
  const judgeData = useJudge();
  return (
    <Layout className={Style['self-layout']} style={{ minWidth: '1100px' }}>
      <Header />
      {judgeData.includes(true) ? (
        <Error />
      ) : (
        <Layout>
          <Nav />
          <Layout className={Style.main}>
            <Breadcrumb />
            <Content>{content}</Content>
          </Layout>
        </Layout>
      )}
    </Layout>
  );
};

// LayoutSelf.propTypes = PropTypes.any;
export default React.memo(LayoutSelf);

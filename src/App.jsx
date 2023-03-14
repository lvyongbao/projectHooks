import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import Layout from '@/components/layout';
import store from '@/store';
import '@/assets/js/antd-fixed';
import '@/assets/iconfont/iconfont.css';
import '@/assets/style/index.less';

const AppWrapper = () => {
  return (
    <ConfigProvider locale={zhCN} prefixCls="settle">
      <Provider store={store}>
        <BrowserRouter basename="/">
          <Layout />
        </BrowserRouter>
      </Provider>
    </ConfigProvider>
  );
};

export default AppWrapper;

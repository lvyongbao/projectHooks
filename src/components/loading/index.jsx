import React from 'react';
import { Spin } from 'antd';
import Style from './index.less';

export default () => (
  <div className={Style.loading}>
    <Spin size="large" tip="加载中..." />
  </div>
);

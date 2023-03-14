import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import logo from '@/assets/img/logo.png';
import Company from './company';
import HeaderImg from './headerImg';
import Style from './index.less';

function Header() {
  return (
    <Layout.Header className={Style.header} theme="light">
      <div>
        <img src={logo} className="f-vam" width="140" height="28" alt="logo" />
      </div>
      <div className={Style.headerIcon}>
        <Company />
        <HeaderImg />
      </div>
    </Layout.Header>
  );
}

// Header.propTypes = PropTypes.any;
export default React.memo(Header);

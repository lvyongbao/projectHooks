import React from 'react';
import { Dropdown, Menu } from 'antd';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import headImg from '@/assets/img/defaultHead.png';
import { getUserCenterDomain } from '@/request';
import { exit } from './request';
import Style from './index.less';

const HeaderImg = () => {
  const { photo, registerType, userName, companyName } = useSelector(
    (state) => state.global.userInfo,
  );
  const menusClick = async ({ key }) => {
    if (key === '2') {
      const res = await getUserCenterDomain();
      window.open(res.data);
    } else if (key === '3') {
      await exit();
      window.location.reload();
    }
  };

  const menus = (
    <Menu onClick={menusClick}>
      <Menu.Item key="1" disabled>
        {registerType === '0' ? userName : companyName}
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="2">个人中心</Menu.Item>
      <Menu.Item key="3">退出登录</Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlayClassName={Style.checkHead} placement="bottomRight" overlay={menus}>
      <div className={Style.headImgBox}>
        <img src={photo || headImg} width="28" height="28" alt="" />
      </div>
    </Dropdown>
  );
};

// HeaderImg.propTypes = PropTypes.any;
export default React.memo(HeaderImg);

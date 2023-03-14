import React, { useCallback, useState, useEffect } from 'react';
import { Menu, Layout } from 'antd';
// import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getFirstRoute, findFatherNode } from '@/router';
import IconCN from '@/components/iconCN';
// import { getMenuList } from './request';
import Style from './index.less';

const { Sider } = Layout;

const Nav = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const menus = useSelector((state) => state.global.menuList);

  // 列表转树形生成多级菜单
  const { url } = getFirstRoute(menus);
  const [collapsed, setCollapsed] = useState(false);
  const [selectKeys, setSelectKeys] = useState([]);
  const [openKeys, setOpenKeys] = useState(() => {
    const value = pathname !== `/${url}` && pathname !== '/' ? pathname : `/${url}`;
    return [value];
  });

  useEffect(() => {
    // 链接为空时，自动跳转至首个叶子路由地址
    if (pathname === '/') {
      navigate(url);
    } else {
      setSelectKeys(pathname);
    }
  }, [navigate, pathname, url]);

  const renderItems = useCallback((items) => {
    return items.map((item) => {
      if (item.children && item.children.length > 0) {
        return (
          <Menu.SubMenu
            key={item.url}
            title={
              <span>
                {item.icon && <IconCN type={item.icon} />}
                <span>{item.title}</span>
              </span>
            }
          >
            {renderItems(item.children)}
          </Menu.SubMenu>
        );
      }
      return (
        <Menu.Item key={item.url}>
          <Link to={item.url}>
            {item.icon && <IconCN type={item.icon} />}
            <span>{item.title}</span>
          </Link>
        </Menu.Item>
      );
    });
  }, []);

  const selectMenu = ({ key }) => {
    setSelectKeys([key]);
  };

  // const onOpenChange = (keys) => {
  //   setOpenKeys(keys);
  // };

  return (
    <Sider
      className={Style['self-sider']}
      theme="light"
      width="180"
      collapsedWidth="76"
      collapsible
      trigger={<IconCN type={collapsed ? 'icon-zhankaicaidan' : 'icon-shouqicaidan'} />}
      onCollapse={(collaps) => {
        if (collaps) {
          setOpenKeys([]);
        } else {
          setOpenKeys(findFatherNode(pathname));
        }
        setCollapsed(collaps);
      }}
    >
      <Menu
        className={Style['self-nav']}
        mode="inline"
        defaultOpenKeys={openKeys}
        // openKeys={openKeys}
        // onOpenChange={onOpenChange}
        onSelect={selectMenu}
        selectedKeys={selectKeys}
      >
        {renderItems(menus)}
      </Menu>
    </Sider>
  );
};

// Nav.propTypes = PropTypes.any;
export default React.memo(Nav);

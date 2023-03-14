import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useVirtualList } from 'ahooks';
import { Dropdown, Input } from 'antd';
// import PropTypes from 'prop-types';
import IconCN from '@/components/iconCN';
import noSearch from '@/assets/img/noSearch.png';
import signOn from '@/signOn';
import { getEnterpriseList, switchEnterprise } from './request';
import Style from './index.less';

const convertKeyword = (value, keyword) => {
  if (!keyword || !((value || '').indexOf(keyword) > -1)) {
    return value;
  }
  const list = value.split(keyword);

  return list.map((i, s) => {
    return (
      <>
        {i}
        {s >= list.length - 1 ? '' : <span style={{ color: '#1890ff' }}>{keyword}</span>}
      </>
    );
  });
};

const Company = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [visible, changeVisible] = useState(false);
  const [companyAuthList, setCompanyAuthList] = useState([]);
  const { registerType, companyName } = useSelector((state) => state.global.userInfo);

  useEffect(() => {
    (async () => {
      const { data } = await getEnterpriseList();
      setCompanyAuthList(data);
    })();
  }, []);

  const changeKeyword = useCallback((e) => {
    const { value } = e.target;
    setKeyword(value);
  }, []);

  const cleanKeyword = useCallback(async () => {
    const { data } = await getEnterpriseList();
    setCompanyAuthList(data);
    changeVisible(!visible);
  }, [visible]);

  useEffect(() => {
    !visible && setKeyword('');
  }, [visible]);

  const handleDropVisible = () => {
    changeVisible(!visible);
  };

  // 切换企业
  const changeCompany = useCallback(
    async (key) => {
      changeVisible(false);
      await switchEnterprise({ companyId: key });
      signOn(() => (pathname !== '/' ? navigate('/') : null));
    },
    [navigate, pathname],
  );

  const treeList = useMemo(() => {
    const authList = companyAuthList.filter(
      (item) =>
        (item.companyName || '').indexOf(keyword) > -1 ||
        (item.companyCode || '').indexOf(keyword) > -1,
    );
    return authList.map((item) => {
      return {
        key: item.companyId,
        title: convertKeyword(item.companyName, keyword),
      };
    });
  }, [companyAuthList, keyword]);

  // 不能用3.7.0版本的：数据渲染延迟
  const { list: finalTreeList = treeList, scrollTo } = useVirtualList(treeList, {
    overscan: 40,
    itemHeight: 36,
  });

  useEffect(() => {
    scrollTo(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treeList.length]);

  const menu = (
    <div className={Style['head-menu']}>
      <div>
        {companyAuthList.length > 6 && (
          <Input allowClear placeholder="搜索企业" value={keyword} onChange={changeKeyword} />
        )}
        {/* 数据量大时会出现卡顿 */}
        <div
          className={Style['head-menu-content']}
          style={{ marginTop: companyAuthList.length > 6 ? '12px' : '0px' }}
        >
          <div className={Style['list-wrap']}>
            {finalTreeList.length > 0 ? (
              finalTreeList.map(({ data }) => {
                return (
                  // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                  <div
                    className={Style['tree-title']}
                    key={data.key}
                    onClick={() => {
                      changeCompany(data.key);
                    }}
                    title={data.title}
                  >
                    {data.title}
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', padding: '42px 0px' }}>
                <img src={noSearch} width="160" height="120" alt="" />
                <p style={{ color: '#999999' }}>未搜索到相关结果</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (() => {
    let elements = null;
    if (registerType === '1' || (companyAuthList.length === 1 && registerType === '0')) {
      elements = (
        <div className={Style.checkOneCompany} onClick={handleDropVisible}>
          <IconCN type="icon-qiye" />
          <span style={{ marginRight: '5px', marginLeft: '6px' }}>{companyName}</span>
        </div>
      );
    }
    if (companyAuthList.length >= 2 && registerType === '0') {
      elements = (
        <Dropdown
          placement="bottomRight"
          overlayClassName={Style.checkMenu}
          overlay={menu}
          trigger={['click']}
          onVisibleChange={cleanKeyword}
          visible={visible}
        >
          <div className={Style.checkCompany} onClick={handleDropVisible}>
            <IconCN type="icon-qiye" />
            <span style={{ marginRight: '5px', marginLeft: '6px' }}>{companyName}</span>
            <IconCN type="icon-jiantouxia" style={{ fontSize: '14px' }} />
            {/* <Icon type="down" /> */}
          </div>
        </Dropdown>
      );
    }
    return elements;
  })();
};

// Company.propTypes = PropTypes.any;
export default React.memo(Company);

import React, { useEffect } from 'react';
import { Pagination } from 'antd';
import PropTypes from 'prop-types';
import style from './index.less';

const initPageSizeOption = ['20', '50', '100', '500'];
const StandardPagination = ({ onChange, isSetLocalStorage, tabName, ...values }) => {
  const { total, pageSize } = values;
  const handleShowSizeChange = (_, size) => {
    if (onChange) {
      onChange({ pageNum: 1, pageSize: size });
    }
  };

  const handlePageChange = (current, size) => {
    if (onChange) {
      onChange({ pageNum: current, pageSize: size });
    }
  };

  const paginationProps = {
    showSizeChanger: !values.notShowChanger,
    showTotal: (size) => `共 ${size} 条`,
    pageSizeOptions: Array.from(new Set([...initPageSizeOption, pageSize.toString()])).sort(
      (a, b) => a - b,
    ),
    ...values,
    current: values.current || values.pageNum,
    total: +values.total,
  };

  // isSetLocalStorage：是否需要存储pageSize本地缓存，缓存名根据路由名和是否有传入的tabName组成
  useEffect(() => {
    if (isSetLocalStorage) {
      const arr = window.location.href.split('/');
      const pageName = arr[arr.length - 1];
      window.localStorage.setItem(
        `${tabName ? pageName + tabName : pageName}_pageSize`,
        values.pageSize,
      );
    }
  }, [isSetLocalStorage, tabName, values.pageSize]);
  return (
    <div className={style['standard-pagination-wrapper']}>
      {+total > 0 && (
        <Pagination
          {...paginationProps}
          onChange={handlePageChange}
          onShowSizeChange={handleShowSizeChange}
          showQuickJumper
        />
      )}
    </div>
  );
};

StandardPagination.propTypes = {
  onChange: PropTypes.func,
  isSetLocalStorage: PropTypes.bool,
  tabName: PropTypes.string,
};
StandardPagination.defaultProps = {
  onChange: null,
  isSetLocalStorage: false,
  tabName: '',
};
export default StandardPagination;

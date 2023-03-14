import React from 'react';
import { arrayOf, bool, func, node, number, oneOfType, shape, string } from 'prop-types';
import { Alert, Icon, Spin } from 'antd';
import StickyTable from '@/components/StickyTable';
import Pagination from '@/components/pagination';
import Style from './index.less';
import Empty from '../Empty';

const View = ({
  children,
  buttons,
  columns,
  data,
  message,
  rowKey,
  spinning,
  changePage,
  ...rest
}) => {
  return (
    <Spin spinning={spinning}>
      <div className={Style['table-wrap']}>
        {children}
        {buttons && <div className={Style['button-wrap']}>{buttons}</div>}
        {message && (
          <Alert
            message={
              <div>
                <Icon type="info-circle" theme="filled" />
                {message}
              </div>
            }
            type="info"
          />
        )}
        <StickyTable
          columns={columns}
          dataSource={data?.list || []}
          pagination={false}
          rowKey={rowKey}
          // scroll={{ x: "100%" }}
          {...rest}
          locale={{ emptyText: <Empty text="暂无数据" /> }}
        />
        <Pagination {...data} onChange={changePage} />
      </div>
    </Spin>
  );
};

View.defaultProps = {
  buttons: null,
  message: null,
  rowKey: 'id',
  spinning: false,
};
View.propTypes = {
  buttons: oneOfType([arrayOf(node), node]),
  columns: arrayOf(
    shape({
      dataIndex: string.isRequired,
    }).isRequired,
  ).isRequired,
  data: shape({
    list: arrayOf(shape({})),
    pageNum: number,
    pageSize: number,
    total: number,
  }).isRequired,
  message: node,
  rowKey: oneOfType([string, func]),
  spinning: bool,
  changePage: func.isRequired,
};

export default View;

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import SearchForm from '@/components/form/searchForm';
import Table from '@components/Table';
import { getTargetList } from '@/request';
import { actions as ruleActions } from '@/views/settleRule/slice';
import { actions } from './slice';
import { formItems, columns } from './data';
// import Style from './index.less';

const SettleObject = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { targetOptions, tableList, searchParams, tableLoading } = useSelector(
    (state) => state.settleObject,
  );
  const { settlementRule } = useSelector((state) => state.global.authority);

  // 列表接口请求
  const onSearch = useCallback(
    (params) => {
      dispatch(actions.setLoading(true));
      getTargetList(params).then(({ data }) => {
        dispatch(actions.setTableList(data.list));
        dispatch(actions.setSearchParams({ ...params, total: data.total }));
        dispatch(actions.setLoading(false));
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch],
  );

  // 重置
  useEffect(() => {
    return () => {
      dispatch(actions.reset());
    };
  }, [dispatch]);

  // 搜索调用
  const handleSearch = useCallback(
    (values) => {
      dispatch(actions.setTargetOptions({}));
      return onSearch({ ...searchParams, pageNum: 1, ...values });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onSearch, JSON.stringify(searchParams)],
  );

  // 初次加载接口
  useEffect(() => {
    onSearch(searchParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onSearch]);

  //  根据接口获取对应数据
  const optionChange = async (value) => {
    if (value) {
      const { data } = await getTargetList({ name: value, pageSize: 10000, pageNum: 1 });
      dispatch(actions.setTargetOptions({ targetList: data.list, value }));
    } else {
      dispatch(actions.setTargetOptions({}));
    }
  };

  // 表格属性
  // 切换分页查询
  const handleChange = (params) => {
    onSearch({ ...searchParams, ...params });
    // document.getElementById('settleObject').scrollIntoView();
  };

  const jumpRule = (data) => {
    dispatch(ruleActions.setJumpOption({ value: data.guid, name: data.tagertName }));
    navigate('/settleRule');
  };
  return (
    <>
      {/* 搜索框内容 */}
      <SearchForm
        items={formItems({ targetOptions, optionChange })}
        onChange={handleSearch}
        onReset={handleSearch}
      />

      {/* 表格内容 */}
      <Table
        columns={columns({ jumpRule, settlementRule })}
        data={{
          list: tableList,
          ...searchParams,
        }}
        id="settleObject"
        loading={tableLoading}
        rowKey="guid"
        // scroll={{ x: '100%' }}
        changePage={handleChange}
      />
    </>
  );
};
export default React.memo(SettleObject);

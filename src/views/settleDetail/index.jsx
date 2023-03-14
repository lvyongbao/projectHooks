import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Tabs, Button, Spin, message } from 'antd';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import SearchForm from '@/components/form/searchForm';
import Table from '@components/Table';
import useAuthority from '@/hooks/use-authority';
import { downloadFile, download } from '@/utils';
import { getType, getTargetList, getAllCompany } from '@/request';
import { getOrderDetailList } from './request';
import { actions } from './slice';
import { TAB_LIST } from './constant';
import { columns, formItems } from './data';
import Style from './index.less';

const { TabPane } = Tabs;

const SettleDetail = () => {
  const dispatch = useDispatch();
  const itemForm = useRef();
  const [tabType, setSelectTabKey] = useState('collection');
  const [loading, setLoading] = useState(false);
  // const userInfo = useSelector((state) => state.global.userInfo);
  const {
    businessTypeList,
    serviceOptions,
    sellerList,
    targetOptions,
    searchParams,
    tableList,
    tableLoading,
  } = useSelector((state) => state.settleDetail);

  // 首次获取下拉数据项
  useEffect(() => {
    (async () => {
      const { data: typeData } = await getType();
      dispatch(actions.setBusinessTypeList(typeData));
      // 订单收款方接口
      const { data: sellerData } = await getAllCompany();
      dispatch(actions.setSellerList(sellerData));
    })();
  }, [dispatch]);

  // 列表接口请求
  const onSearch = useCallback(
    (params) => {
      dispatch(actions.setLoading(true));
      getOrderDetailList(params).then(({ data }) => {
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

  // 切换tab
  const changeTab = (key) => {
    setSelectTabKey(key);
  };

  // 初次加载接口
  useEffect(() => {
    onSearch(searchParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, onSearch, JSON.stringify(searchParams)]);

  // 搜索调用
  const handleSearch = useCallback(
    (values) => {
      dispatch(actions.setTargetOptions({}));
      const data = cloneDeep(values);
      delete data.orderTime;
      data.orderStartTime =
        values.orderTime && values.orderTime[0]
          ? moment(values.orderTime[0]).format('YYYY-MM-DD 00:00:00')
          : searchParams.orderStartTime;
      data.orderEndTime =
        values.orderTime && values.orderTime[1]
          ? moment(values.orderTime[1]).format('YYYY-MM-DD 23:59:59')
          : searchParams.orderEndTime;
      // if (moment(data.orderEndTime).diff(data.orderStartTime, 'day') > 365) {
      //   message.destroy();
      //   message.error('暂不支持跨年数据查询');
      //   return;
      // }
      onSearch({ ...searchParams, pageNum: 1, ...data });
    },
    [dispatch, onSearch, searchParams],
  );

  // 搜索框重置
  const handleReset = useCallback(
    (values) => {
      dispatch(actions.setServiceOptions({}));
      handleSearch(values);
    },
    [dispatch, handleSearch],
  );

  // 切换分页查询
  const handleChange = (params) => {
    onSearch({ ...searchParams, ...params });
    // document.getElementById('settleDetail').scrollIntoView();
  };

  // 导出
  const exported = async () => {
    setLoading(true);
    downloadFile('/settlement/web/detail/export.do', searchParams, 'post').then((res) => {
      if (res.status === 200) {
        download(res);
      } else {
        message.error(res.message || res.msg);
      }
      setLoading(false);
    });
  };

  // 业务类型变化，切换服务类型
  const businessChange = async (v) => {
    const { data } = await getType({ parentId: v });
    dispatch(actions.setServiceOptions({ serviceTypeList: data, value: v }));
    itemForm.current.setFieldsValue({ serviceTypeId: undefined });
  };

  //  根据接口获取对应数据
  const optionChange = async (value) => {
    if (value) {
      const { data } = await getTargetList({ name: value, pageSize: 10000, pageNum: 1 });
      dispatch(actions.setTargetOptions({ targetList: data.list, value }));
    } else {
      dispatch(actions.setTargetOptions({}));
    }
  };

  return (
    <Spin spinning={loading}>
      {/* tabs切换 */}
      <Tabs
        className={Style['public-tabs']}
        activeKey={tabType}
        onChange={changeTab}
        animated={false}
        destroyInactiveTabPane
      >
        {TAB_LIST.map((item) => {
          return <TabPane tab={item.label} key={item.key} />;
        })}
      </Tabs>

      {/* 搜索框内容 */}
      <SearchForm
        ref={itemForm}
        needMore
        items={formItems({
          businessTypeList,
          businessChange,
          serviceOptions,
          sellerList,
          tabType,
          targetOptions,
          optionChange,
        })}
        onChange={handleSearch}
        onReset={handleReset}
      />

      {/* 表格内容 */}
      <Table
        columns={columns()}
        id="settleDetail"
        data={{
          list: tableList,
          ...searchParams,
        }}
        loading={tableLoading}
        rowKey="settleNo"
        // scroll={{ x: '100%' }}
        changePage={handleChange}
        buttons={
          useAuthority('exportSettlementOrderDetail') && (
            <Button type="primary" onClick={exported}>
              导出
            </Button>
          )
        }
      />
    </Spin>
  );
};

export default React.memo(SettleDetail);

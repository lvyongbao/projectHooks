import React, { useEffect, useCallback, useRef, useState } from 'react';
import { Button, Spin, message } from 'antd';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import SearchForm from '@/components/form/searchForm';
import Table from '@components/Table';
import { downloadFile, download } from '@/utils';
import useAuthority from '@/hooks/use-authority';
import { getType, getTargetList, getAllCompany } from '@/request';
import { getOrderList, getOrderBusinessSource, getOrderChannel } from './request';
import { actions } from './slice';
import { formItems, columns } from './data';

const SettleOrder = () => {
  const dispatch = useDispatch();
  const itemForm = useRef();
  const [loading, setLoading] = useState(false);
  const {
    businessTypeList,
    serviceOptions,
    sellerList,
    sourceList,
    orderChannelList,
    targetOptions,
    searchParams,
    tableList,
    tableLoading,
  } = useSelector((state) => state.settleOrder);

  // 首次获取下拉数据项
  useEffect(() => {
    (async () => {
      const { data: typeData } = await getType();
      dispatch(actions.setBusinessTypeList(typeData));
      // 订单收款方接口
      const { data: sellerData } = await getAllCompany();
      dispatch(actions.setSellerList(sellerData));
      // 获取订单来源
      const { data: sourceData } = await getOrderBusinessSource();
      dispatch(actions.setSourceList(sourceData));
      // 获取订单类型
      const { data: orderChannelData } = await getOrderChannel();
      dispatch(actions.setOrderChannelList(orderChannelData));
    })();
  }, [dispatch]);

  // 列表接口请求
  const onSearch = useCallback(
    (params) => {
      dispatch(actions.setLoading(true));
      getOrderList(params).then(({ data }) => {
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

  // 初次加载接口
  useEffect(() => {
    onSearch(searchParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onSearch]);

  // 表格属性
  // 切换分页查询
  const handleChange = (params) => {
    onSearch({ ...searchParams, ...params });
    // document.getElementById('settleOrder').scrollIntoView();
  };

  // // 表格操作
  const relation = (relationData) => {
    // dispatch(actions.setReceiptAssociatedList({ ...relationData, taxnum: userInfo.taxnum }));
    // setModalVisible(true);
  };

  // 导出
  const exported = () => {
    setLoading(true);
    downloadFile('/settlement/web/order/export.do', searchParams, 'post').then((res) => {
      if (res.status === 200) {
        download(res);
      } else {
        message.error(res.message || res.msg);
      }
      setLoading(false);
    });
    // const { code } = await exportValid(searchParams);
  };

  // 业务类型变化，切换服务类型
  const businessChange = async (v) => {
    const { data } = await getType({ parentId: v });
    dispatch(actions.setServiceOptions({ ...serviceOptions, serviceTypeList: data, value: v }));
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
      {/* 搜索框内容 */}
      <SearchForm
        ref={itemForm}
        needMore
        items={formItems({
          businessTypeList,
          businessChange,
          serviceOptions,
          sellerList,
          sourceList,
          orderChannelList,
          targetOptions,
          optionChange,
        })}
        onChange={handleSearch}
        onReset={handleReset}
      />
      {/* 表格内容 */}
      <Table
        columns={columns(relation)}
        data={{
          list: tableList,
          ...searchParams,
        }}
        id="settleOrder"
        loading={tableLoading}
        rowKey="guid"
        scroll={{ x: '100%' }}
        changePage={handleChange}
        buttons={
          useAuthority('exportSettlementOrder') && (
            <Button type="primary" onClick={exported}>
              导出
            </Button>
          )
        }
      />
    </Spin>
  );
};
export default React.memo(SettleOrder);

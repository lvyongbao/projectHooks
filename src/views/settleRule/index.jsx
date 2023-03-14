import React, { useEffect, useCallback, useRef } from 'react';
import { Button, Modal, message } from 'antd';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import SearchForm from '@/components/form/searchForm';
import Table from '@components/Table';
import useAuthority from '@/hooks/use-authority';
import { getType, getTargetList, getAllCompany } from '@/request';
import { getPageRuleList, delRule } from './request';
import { actions } from './slice';
import { formItems, columns } from './data';
// import Style from './index.less';

const SettleRule = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const itemForm = useRef();
  // const fromSetFieldsValue = ({ setFieldsValue }) => setFieldsValue;
  // const [fromSetFieldsValue, setFromSetFieldsValue] = useState();
  // const [modalVisible, setModalVisible] = useState(false);
  const {
    jumpOption,
    businessTypeList,
    serviceOptions,
    areaList,
    targetOptions,
    searchParams,
    tableList,
    tableLoading,
  } = useSelector((state) => state.settleRule);

  // 首次获取下拉数据项
  useEffect(() => {
    (async () => {
      const { data: typeData } = await getType();
      dispatch(actions.setBusinessTypeList(typeData));
      const { data: areaData } = await getAllCompany();
      dispatch(actions.setAreaList(areaData));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 列表接口请求
  const onSearch = useCallback(
    (params) => {
      dispatch(actions.setLoading(true));
      getPageRuleList(params).then(({ data }) => {
        dispatch(actions.setTableList(data.list));
        dispatch(actions.setSearchParams({ ...params, total: data.total }));
        dispatch(actions.setLoading(false));
      });
    },
    [dispatch],
  );

  // 搜索调用
  const handleSearch = useCallback(
    (values) => {
      dispatch(actions.setTargetOptions({}));
      const data = cloneDeep(values);
      delete data.time;
      data.startTime =
        values.time && values.time[0]
          ? moment(values.time[0]).format('YYYY-MM-DD 00:00:00')
          : undefined;
      data.endTime =
        values.time && values.time[1]
          ? moment(values.time[1]).format('YYYY-MM-DD 23:59:59')
          : undefined;
      if (moment(data.endTime).diff(data.startTime, 'day') > 1095) {
        message.destroy();
        message.error('开始时间与结束时间不能超过3年');
        return;
      }
      onSearch({
        ...searchParams,
        pageNum: 1,
        ...data,
        targetGuid: targetOptions.value ? data.targetGuid : jumpOption.value,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onSearch, JSON.stringify(searchParams), JSON.stringify(targetOptions)],
  );

  // 初次加载接口
  useEffect(() => {
    onSearch({ ...searchParams, targetGuid: jumpOption.value });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onSearch]);

  // 重置
  useEffect(() => {
    return () => {
      dispatch(actions.reset());
    };
  }, [dispatch]);

  // 表格属性
  // 切换分页查询
  const handleChange = (params) => {
    onSearch({ ...searchParams, ...params });
    // document.getElementById('settleRule').scrollIntoView();
  };

  // 列表删除
  const deleteFunc = (data) => {
    delRule(data).then((res) => {
      if (res.data) {
        Modal.warning({
          title: '温馨提示',
          content: res.data,
        });
      } else {
        onSearch({ ...searchParams });
      }
    });
  };

  //  根据接口获取结算对象
  const optionChange = async (value) => {
    // dispatch(actions.setJumpOption({}));
    if (value) {
      const { data } = await getTargetList({ name: value, pageSize: 10000, pageNum: 1 });
      dispatch(actions.setTargetOptions({ targetList: data.list, value }));
    } else {
      dispatch(actions.setTargetOptions({}));
    }
  };

  // 业务类型变化，切换服务类型
  const businessChange = async (v) => {
    const { data } = await getType({ parentId: v });
    dispatch(actions.setServiceOptions({ serviceTypeList: data, value: v }));
    itemForm.current.setFieldsValue({ serviceTypeId: undefined });
  };

  return (
    <>
      {/* 搜索框内容 */}
      <SearchForm
        ref={itemForm}
        needMore
        items={formItems({
          jumpOption,
          businessTypeList,
          businessChange,
          serviceOptions,
          targetOptions,
          optionChange,
          areaList,
        })}
        onChange={handleSearch}
        onReset={handleSearch}
      />

      {/* 表格内容 */}
      <Table
        columns={columns({ deleteFunc, delAuth: useAuthority('delSettlementRule') })}
        data={{
          list: tableList,
          ...searchParams,
        }}
        id="settleRule"
        loading={tableLoading}
        rowKey="guid"
        // scroll={{ x: '100%' }}
        changePage={handleChange}
        buttons={
          useAuthority('addSettlementRule') && (
            <Button type="primary" onClick={() => navigate('/settleRule/detail')}>
              添加结算规则
            </Button>
          )
        }
      />
    </>
  );
};
export default React.memo(SettleRule);

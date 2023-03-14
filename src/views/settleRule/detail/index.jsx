import React, { useState, useEffect, useCallback, useRef } from 'react';
import { message, Modal } from 'antd';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import DetailForm from '@/components/form/detailForm';
import { getType, getTargetList, getAllCompany } from '@/request';
import { addRule } from './request';
import { actions } from './slice';
import DetailModal from './modal';
import { detailFormItems } from './data';
import Style from './index.less';

const Detail = () => {
  const dispatch = useDispatch();
  const itemForm = useRef();
  const { targetOptions, businessTypeList, serviceOptions, areaList, rangeList } = useSelector(
    (state) => state.settleRuleDetail,
  );
  const [modalVisible, setModalVisible] = useState(false);

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

  // 重置
  useEffect(() => {
    return () => {
      dispatch(actions.reset());
    };
  }, [dispatch]);

  // 提交请求
  const addForm = useCallback((params) => {
    (async (p) => {
      const { code } = await addRule(p);
      if (code === 200) {
        message.success('添加成功');
        window.history.back();
      }
    })(params);
  }, []);

  const handleSearch = useCallback(
    (values) => {
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
      data.ruleConfigDetails = JSON.stringify(rangeList);
      if (moment(data.endTime).diff(data.startTime, 'day') > 1095) {
        message.destroy();
        message.error('开始时间与结束时间不能超过3年');
        return;
      }
      Modal.confirm({
        title: '提交确认',
        content: '结算规则提交成功后无法修改，确定要提交吗？',
        onOk() {
          addForm(data);
        },
      });
    },
    [addForm, rangeList],
  );

  const refuse = () => {
    window.history.back();
  };

  // 弹窗相关
  const modalClick = () => {
    setModalVisible(true);
  };

  return (
    <div className={Style.detail}>
      <div style={{ width: '580px', margin: '0px auto', height: '100%' }}>
        {/* detailForm */}
        <DetailForm
          ref={itemForm}
          items={detailFormItems({
            targetOptions,
            optionChange,
            businessTypeList,
            businessChange,
            serviceOptions,
            areaList,
            modalClick,
            rangeList,
          })}
          onChange={handleSearch}
          onReset={refuse}
        />
        {/* 弹窗 */}
        <DetailModal visible={modalVisible} onCancel={setModalVisible} />
      </div>
    </div>
  );
};

export default Detail;

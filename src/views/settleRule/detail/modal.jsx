import React, { useState, useEffect } from 'react';
import { Table, Icon, message, Modal } from 'antd';
import { bool, func } from 'prop-types';
import { cloneDeep } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { toFixed } from '@/utils';
import Alink from '@/components/Alink';
import Modals from '@/components/Modal';
import { actions } from './slice';
import { detailModalColumns } from './data';
import Style from './index.less';

const DetailModal = ({ visible, onCancel }) => {
  const dispatch = useDispatch();
  const { rangeList } = useSelector((state) => state.settleRuleDetail);
  const [range, setRange] = useState([]);

  // 弹窗开启时数据重置
  useEffect(() => {
    if (visible) {
      // 因@reduxjs/toolkit state 不能直接修改，故要clone一份出来进行修改
      setRange(cloneDeep(rangeList));
    }
  }, [visible, rangeList]);

  const modalHandleOk = () => {
    message.destroy();
    if (range.length) {
      const lastObj = range[range.length - 1];
      if (lastObj.endNum !== '999999999') {
        Modal.error({
          title: '保存失败',
          content: '请将最后一个区间的结束数量设置为999999999',
        });
        return;
      }
      if (!range.every((item) => Object.keys(item).every((key) => item[key]))) {
        message.warning('请输入区间单价');
        return;
      }
      onCancel(false);
      dispatch(actions.setRangeList(range));
    } else {
      message.warning('请填写结算规则');
    }
  };
  const modalHandleCancel = () => {
    onCancel(false);
  };
  // 添加区间
  const addModalRange = () => {
    message.destroy();
    let newArr;
    if (range.length) {
      const lastObj = range[range.length - 1];
      if (!Object.keys(lastObj).every((key) => lastObj[key])) {
        if (!lastObj.endNum) {
          message.warning('请输入结束数量');
        } else if (!lastObj.price) {
          message.warning('请输入区间单价');
        }
        return;
      }
      if (Number(lastObj.endNum) <= Number(lastObj.startNum)) {
        message.warning('结束数量必须大于起始数量');
        return;
      }
      if (lastObj.endNum === '999999999') {
        message.warning('区间数量已达上限');
        return;
      }
      if (range.length >= 10) {
        message.warning('最多可添加10个区间');
        return;
      }
      lastObj.disabled = '1';
      newArr = [
        ...range,
        {
          startNum: Number(range[range.length - 1].endNum) + 1,
          endNum: undefined,
          price: undefined,
          disabled: '0',
        },
      ];
    } else {
      newArr = [{ startNum: '0', endNum: undefined, price: undefined, disabled: '0' }];
    }
    setRange(newArr);
  };

  // 数值改变
  const filesChange = (v, file, index) => {
    if (file === 'endNum' && /^([1-9][0-9]*)?$/g.test(v)) {
      range[index][file] = v;
    } else if (
      file === 'price' &&
      /^((0{1}\.\d{1,2})|((?!99999)[1-9]{1}[0-9]{0,4}\.\d{1,2})|([1-9]{1}[0-9]{0,4})|[0]{0,1})$/.test(
        v.includes('.') ? +v : v,
      )
    ) {
      range[index][file] = v;
    }
    setRange([...range]);
  };
  const filesBlur = (v, file, index) => {
    if (file === 'price') {
      range[index][file] = toFixed(+v, 2, 0);
    }
    setRange([...range]);
  };
  const deleteFunc = (index) => {
    const beforeObj = range[index - 1];
    beforeObj.disabled = '0';
    range.splice(index, 1);
    setRange([...range]);
  };
  return (
    <Modals
      visible={visible}
      width={800}
      title="结算规则配置"
      onOk={modalHandleOk}
      onCancel={modalHandleCancel}
    >
      <Table
        bordered
        rowKey="startNum"
        className={Style.modalTable}
        columns={detailModalColumns(filesChange, filesBlur, deleteFunc, range)}
        dataSource={range}
        pagination={false}
        locale={{ emptyText: '暂无数据' }}
      />
      <Alink className={Style.range} onClick={addModalRange}>
        <Icon type="plus-circle" style={{ marginRight: '2px' }} />
        添加区间
      </Alink>
      <div className={Style.tishi}>
        <div>配置提示：</div>
        <div>1、最多可添加10个区间</div>
        <div>2、请将最后一个区间的结束数量设置为999999999</div>
      </div>
    </Modals>
  );
};

DetailModal.propTypes = { visible: bool.isRequired, onCancel: func.isRequired };
export default DetailModal;

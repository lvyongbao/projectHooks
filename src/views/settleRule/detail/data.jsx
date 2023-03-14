import React from 'react';
import moment from 'moment';
import { tranSelectOptions, tranTreeSelectOptions } from '@/utils';
import { Input, TreeSelect, InputNumber } from 'antd';
import Alink from '@/components/Alink';
import { SETTLE_DIRECTION, SETTLE_CYCLE, SETTLE_FORM } from './constant';

const detailFormItems = ({
  targetOptions,
  optionChange,
  businessTypeList,
  businessChange,
  serviceOptions,
  areaList,
  modalClick,
  rangeList,
}) => [
  {
    type: 'title',
    key: '基础配置',
  },
  {
    label: '业务类型',
    key: 'businessTypeId',
    type: 'select',
    initialValue: undefined,
    onChange: businessChange,
    rules: [
      {
        required: true,
        message: '请选择业务类型',
      },
    ],
    dataSource: tranSelectOptions(businessTypeList, {
      id: 'typeId',
      name: 'typeName',
    }),
  },
  {
    label: '服务类型',
    key: 'serviceTypeId',
    type: 'select',
    disabled: !serviceOptions.value,
    initialValue: undefined,
    rules: [
      {
        required: true,
        message: '请选择服务类型',
      },
    ],
    dataSource: tranSelectOptions(serviceOptions.serviceTypeList, {
      id: 'typeId',
      name: 'typeName',
    }),
  },
  {
    label: '结算对象',
    key: 'targetGuid',
    needHide: true,
    type: 'select',
    initialValue: undefined,
    rules: [
      {
        required: true,
        message: '请输入结算对象',
      },
    ],
    showSearch: true,
    autoClearSearchValue: false,
    defaultActiveFirstOption: false,
    showArrow: false,
    filterOption: false,
    allowClear: true,
    defaultOpen: false,
    placeholder: '请输入',
    onSearch: optionChange,
    notFoundContent: !!targetOptions.value && !targetOptions.targetList.length,
    dataSource: tranSelectOptions(targetOptions.targetList, {
      id: 'guid',
      name: 'tagertName',
    }),
  },
  {
    label: '适用区域',
    key: 'areaIdList',
    needHide: true,
    type: 'treeSelect',
    placeholder: '请选择',
    initialValue: undefined,
    rules: [
      {
        required: true,
        message: '请选择适用区域',
      },
    ],
    // multiple: true,
    treeCheckable: true,
    showCheckedStrategy: TreeSelect.SHOW_PARENT,
    treeNodeFilterProp: 'title',
    treeDefaultExpandedKeys: ['all'],
    treeData: tranTreeSelectOptions(areaList, {
      value: 'companyId',
      title: 'subName',
      children: 'serviceStations',
    }),
  },
  {
    label: '生效时间',
    key: 'time',
    type: 'range',
    initialValue: undefined,
    rules: [
      {
        required: true,
        message: '请选择生效时间',
      },
    ],
    allowClear: true,
  },
  {
    type: 'title',
    key: '规则配置',
  },
  {
    label: '结算方向',
    key: 'direction',
    type: 'select',
    initialValue: undefined,
    rules: [
      {
        required: true,
        message: '请选择结算方向',
      },
    ],
    dataSource: SETTLE_DIRECTION,
  },
  {
    label: '结算周期',
    key: 'cycle',
    type: 'select',
    initialValue: undefined,
    rules: [
      {
        required: true,
        message: '请选择结算周期',
      },
    ],
    dataSource: SETTLE_CYCLE,
  },
  {
    label: '结算形式',
    key: 'form',
    type: 'select',
    initialValue: 1,
    rules: [
      {
        required: true,
        message: '请选择结算形式',
      },
    ],
    dataSource: SETTLE_FORM,
  },
  {
    type: 'modal',
    key: 'ruleConfigDetails',
    text: '结算规则配置',
    initialValue: rangeList,
    rules: [
      {
        required: true,
        message: '请配置结算规则',
      },
    ],
    columns: [
      {
        title: '结算规则',
        dataIndex: 'startNum',
        align: 'left',
        width: '8%',
        render: (val, { endNum, price }) => {
          return `${val}-${endNum}条 ${price}元/条`;
        },
      },
    ],
    buttonProps: {
      onClick: modalClick,
    },
  },
];

const detailModalColumns = (filesChange, filesBlur, deleteFunc, range) => [
  {
    title: '序号',
    width: '8%',
    render: (_, __, index) => {
      return <div style={{ padding: '0px 12px' }}>{index + 1}</div>;
    },
  },
  {
    title: '区间起始数量 (条)',
    dataIndex: 'startNum',
    width: '27%',
    render: (value) => {
      return (
        <div>
          <Input value={value} disabled />
        </div>
      );
    },
  },
  {
    title: '区间结束数量 (条)',
    dataIndex: 'endNum',
    width: '27%',
    render: (value, record, index) => {
      const { disabled } = record;
      return (
        <div>
          <Input
            value={value}
            maxLength={9}
            placeholder="请输入"
            disabled={+disabled === 1}
            onChange={(e) => filesChange(e.target.value, 'endNum', index)}
            onBlur={(e) => filesBlur(e.target.value, 'endNum', index)}
          />
        </div>
      );
    },
  },
  {
    title: '区间单价 (元/条)',
    dataIndex: 'price',
    width: '27%',
    render: (value, _, index) => {
      return (
        <div>
          <Input
            value={value}
            placeholder="请输入"
            onChange={(e) => filesChange(e.target.value, 'price', index)}
            onBlur={(e) => filesBlur(e.target.value, 'price', index)}
          />
        </div>
      );
    },
  },
  {
    title: '操作',
    dataIndex: 'opr',
    width: '11%',
    render: (_, __, index) => {
      if (index !== 0 && range.length === index + 1) {
        return (
          <div style={{ padding: '0px 12px' }}>
            <Alink onClick={() => deleteFunc(index)}>删除</Alink>
          </div>
        );
      }
      return null;
    },
  },
];

export { detailFormItems, detailModalColumns };

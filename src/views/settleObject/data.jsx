import React from 'react';
import { tranSelectOptions } from '@/utils';
import { message } from 'antd';
import Alink from '@/components/Alink';

const formItems = ({ targetOptions, optionChange }) => {
  return [
    {
      label: '结算对象',
      key: 'targetGuid',
      type: 'select',
      initialValue: undefined,
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
  ];
};

const columns = ({ jumpRule, settlementRule }) => {
  return [
    {
      title: '结算对象',
      dataIndex: 'tagertName',
      align: 'left',
      width: '73%',
      // width: 876,
      // width: 625,
      render: (val) => {
        return <div>{val || '-'}</div>;
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'left',
      width: '27%',
      // width: 320,
      // width: 231,
      render: (_, records) => {
        return (
          <Alink
            onClick={() => {
              if (settlementRule === 'false') {
                message.destroy();
                message.warning('您暂无结算规则配置权限');
              } else {
                jumpRule(records);
              }
            }}
          >
            结算规则配置
          </Alink>
        );
      },
    },
  ];
};

export { formItems, columns };

import React from 'react';
import { tranSelectOptions, tranTreeSelectOptions } from '@/utils';
import { Popconfirm, Popover, Table } from 'antd';
import Alink from '@/components/Alink';
import { SETTLE_DIRECTION, SETTLE_CYCLE, SETTLE_FORM } from './detail/constant';
import Style from './index.less';

const formItems = ({
  jumpOption,
  businessTypeList,
  businessChange,
  serviceOptions,
  areaList,
  targetOptions,
  optionChange,
}) => {
  return [
    {
      label: '业务类型',
      key: 'businessTypeId',
      type: 'select',
      initialValue: undefined,
      onChange: businessChange,
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
      initialValue: jumpOption.name || undefined,
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
      key: 'settleAreaId',
      needHide: true,
      type: 'treeSelect',
      placeholder: '请选择',
      initialValue: undefined,
      showSearch: true,
      // multiple: true,
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
      needHide: true,
      type: 'range',
      initialValue: undefined,
    },
  ];
};

const columns = ({ deleteFunc, delAuth }) => {
  return [
    {
      title: '业务类型',
      dataIndex: 'businessTypeName',
      fixed: 'left',
      width: 90,
      render: (val) => {
        return <div>{val || '-'}</div>;
      },
    },
    {
      title: '服务类型',
      dataIndex: 'serviceTypeName',
      fixed: 'left',
      width: 140,
      render: (val) => {
        return <div>{val || '-'}</div>;
      },
    },
    {
      title: '结算对象',
      dataIndex: 'targetName',
      // width: '8%',
      width: 100,
      // width: 68,
      render: (val) => {
        return <div>{val || '-'}</div>;
      },
    },
    {
      title: '适用区域',
      dataIndex: 'settleArea',
      // width: '10%',
      width: 120,
      // width: 86,
      render: (val) => {
        if (val) {
          const valArr = val.split(',');
          const content = (
            <Table
              className="popoverTable"
              rowKey="value"
              columns={[{ title: '适用区域', dataIndex: 'value', key: 'value' }]}
              dataSource={valArr.map((item) => ({ value: item }))}
              // scroll={{ y: '240px' }}
              pagination={false}
            />
          );
          return (
            <div>
              {valArr.map((item, index) => {
                let value;
                if (index <= 2) {
                  value = <div key={item}>{item}</div>;
                }
                return value;
              })}
              {valArr.length > 2 && (
                <Popover
                  placement="topRight"
                  content={content}
                  trigger="click"
                  overlayClassName={Style.SettleRule}
                  overlayStyle={{ width: '324px' }}
                >
                  <Alink>更多</Alink>
                </Popover>
              )}
            </div>
          );
        }
        return '-';
      },
    },
    {
      title: '生效时间',
      dataIndex: 'startTime',
      // width: '10%',
      width: 120,
      // width: 86,
      render: (val, { endTime }) => {
        return val && endTime ? `${val} ~ ${endTime}` : '-';
      },
    },
    {
      title: '结算方向',
      dataIndex: 'direction',
      // width: '7%',
      width: 80,
      // width: 60,
      render: (val) => {
        return <div>{SETTLE_DIRECTION.find((item) => item.id === val)?.name}</div>;
      },
    },
    {
      title: '结算周期',
      dataIndex: 'cycle',
      // width: '7%',
      width: 80,
      // width: 60,
      render: (val) => {
        return <div>{SETTLE_CYCLE.find((item) => item.id === val)?.name}</div>;
      },
    },
    {
      title: '结算形式',
      dataIndex: 'form',
      // width: '7%',
      width: 80,
      // width: 60,
      render: (val) => {
        return <div>{SETTLE_FORM.find((item) => item.id === val)?.name}</div>;
      },
    },
    {
      title: '结算规则',
      dataIndex: 'ruleConfigDetails',
      // width: '14%',
      width: 170,
      // width: 120,
      render: (val) => {
        if (val) {
          const valArr = JSON.parse(val);
          const content = (
            <Table
              className="popoverTable"
              rowKey="startNum"
              columns={[
                {
                  title: '结算规则',
                  dataIndex: 'startNum',
                  key: 'startNum',
                  render: (v, { endNum, price }) => {
                    return (
                      <div>
                        {v}-{endNum}条 {price}元/条
                      </div>
                    );
                  },
                },
              ]}
              dataSource={valArr}
              pagination={false}
            />
          );
          return (
            <div>
              {valArr.map((item, index) => {
                let value;
                if (index <= 2) {
                  value = (
                    <div key={item.startNum}>
                      {item.startNum}-{item.endNum}条 {item.price}元/条
                    </div>
                  );
                }
                return value;
              })}
              {valArr.length > 3 && (
                <Popover
                  placement="topRight"
                  content={content}
                  trigger="click"
                  overlayStyle={{ width: '324px' }}
                >
                  <Alink>更多</Alink>
                </Popover>
              )}
            </div>
          );
        }
        return '-';
      },
    },
    {
      title: '添加人及时间',
      dataIndex: 'creatorName',
      // width: '13%',
      width: 160,
      // width: 111,
      render: (val, { createTime }) => {
        return (
          <>
            <div>{val || '-'}</div>
            <div>{createTime || '-'}</div>
          </>
        );
      },
    },
    {
      dataIndex: 'operation',
      title: '操作',
      fixed: 'right',
      width: 56,
      render: (_, { guid }) => {
        return (
          delAuth && (
            <Popconfirm
              title="规则一经删除，按本规则生成的结算数据将同步删除、无法找回，确定要删除吗？"
              placement="topRight"
              overlayStyle={{ width: '240px' }}
              onConfirm={() => deleteFunc({ guid })}
              okText="确 定"
              cancelText="取 消"
            >
              <Alink>删除</Alink>
            </Popconfirm>
          )
        );
      },
    },
  ];
};

export { formItems, columns };

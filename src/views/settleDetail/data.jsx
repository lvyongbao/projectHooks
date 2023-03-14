import React from 'react';
import moment from 'moment';
import { Tooltip, message } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { tranSelectOptions, numToThousands, tranTreeSelectOptions } from '@/utils';
import { TAB_ARR } from './constant';
import Style from './index.less';

const formItems = ({
  businessTypeList,
  businessChange,
  serviceOptions,
  sellerList,
  tabType,
  targetOptions,
  optionChange,
}) => {
  return [
    {
      label: '业务类型',
      key: 'businessTypeId',
      type: 'select',
      tabType: TAB_ARR[0],
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
      tabType: TAB_ARR[0],
      initialValue: undefined,
      dataSource: tranSelectOptions(serviceOptions.serviceTypeList, {
        id: 'typeId',
        name: 'typeName',
      }),
    },
    {
      label: '明细编号',
      key: 'settleNo',
      needHide: true,
      type: 'input',
      tabType: TAB_ARR[0],
      initialValue: undefined,
      placeholder: '请输入',
    },
    {
      label: '下单企业',
      key: 'buyerName',
      needHide: true,
      type: 'input',
      tabType: TAB_ARR[0],
      initialValue: undefined,
      placeholder: '请输入企业名称或税号',
    },
    {
      label: '下单时间',
      key: 'orderTime',
      needHide: true,
      type: 'range',
      tabType: TAB_ARR[0],
      initialValue: [moment().subtract(7, 'day'), moment()],
    },
    {
      label: '订单编号',
      key: 'orderNo',
      needHide: true,
      type: 'input',
      tabType: TAB_ARR[0],
      initialValue: undefined,
      placeholder: '请输入',
    },
    {
      label: '订单收款方',
      key: 'sellerId',
      needHide: true,
      type: 'treeSelect',
      tabType: TAB_ARR[0],
      placeholder: '请选择',
      initialValue: undefined,
      showSearch: true,
      // multiple: true,
      treeNodeFilterProp: 'title',
      treeDefaultExpandedKeys: ['all'],
      treeData: tranTreeSelectOptions(sellerList, {
        value: 'companyId',
        title: 'subName',
        children: 'serviceStations',
      }),
    },
    {
      label: '结算对象',
      key: 'targetGuid',
      needHide: true,
      type: 'select',
      tabType: TAB_ARR[0],
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
  ].filter((item) => tabType === item.tabType);
};
const columns = () => {
  return [
    {
      title: '明细编号',
      dataIndex: 'settleNo',
      fixed: 'left',
      align: 'left',
      width: 140,
      render: (val) => {
        return <div>{val || '-'}</div>;
      },
    },
    {
      title: '企业名称及税号',
      dataIndex: 'buyerName',
      // width: '16%',
      width: 180,
      render: (val, { buyerId }) => {
        return (
          <>
            <CopyToClipboard
              text={val}
              onCopy={() => {
                message.success('复制成功');
              }}
            >
              <div className={Style.moreOverflow}>
                {val ? (
                  <Tooltip placement="top" title={val}>
                    {val}
                  </Tooltip>
                ) : (
                  '-'
                )}
              </div>
            </CopyToClipboard>
            <CopyToClipboard
              text={buyerId}
              onCopy={() => {
                message.success('复制成功');
              }}
            >
              <div className={Style.moreOverflow}>
                {buyerId ? (
                  <Tooltip placement="top" title={buyerId}>
                    {buyerId}
                  </Tooltip>
                ) : (
                  '-'
                )}
              </div>
            </CopyToClipboard>
          </>
        );
      },
    },
    {
      title: '服务类型',
      dataIndex: 'goodsName',
      // width: '10%',
      width: 120,
      render: (val) => {
        return <div>{val || '-'}</div>;
      },
    },
    {
      title: '服务开通数量',
      dataIndex: 'serviceNum',
      // width: '8%',
      width: 100,
      render: (val) => {
        return <div>{val || '-'}</div>;
      },
    },
    {
      title: '下单时间',
      dataIndex: 'orderCreateTime',
      // width: '8%',
      width: 100,
      render: (val) => {
        return <div>{val || '-'}</div>;
      },
    },
    {
      title: '订单编号',
      dataIndex: 'orderNo',
      // width: '14%',
      width: 160,
      render: (val) => {
        return <div>{val || '-'}</div>;
      },
    },
    {
      title: '订单收款方',
      dataIndex: 'sellerName',
      // width: '10%',
      width: 90,
      render: (val) => {
        return <div>{val || '-'}</div>;
      },
    },
    {
      title: '结算对象',
      dataIndex: 'targetName',
      // width: '8%',
      width: 100,
      render: (val) => {
        return <div>{val || '-'}</div>;
      },
    },
    {
      title: '结算金额(元)',
      dataIndex: 'settleAmount',
      // width: '8%',
      width: 100,
      align: 'right',
      render: (val) => {
        return <div>{val ? numToThousands(val.toFixed(2)) : '-'}</div>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      // width: '8%',
      width: 106,
      render: (val) => {
        return <div>{val || '-'}</div>;
      },
    },
  ];
};

export { formItems, columns };

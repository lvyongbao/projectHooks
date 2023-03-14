/* eslint-disable react/no-array-index-key */
import React from 'react';
import moment from 'moment';
import { tranSelectOptions, numToThousands, tranTreeSelectOptions } from '@/utils';
import { Tooltip, message } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { GEBERATE_SETTLE_DETAIL } from './constant';
import Style from './index.less';

const formItems = ({
  businessTypeList,
  businessChange,
  serviceOptions,
  sellerList,
  sourceList,
  orderChannelList,
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
      label: '订单编号',
      key: 'orderNo',
      needHide: true,
      type: 'input',
      initialValue: undefined,
      placeholder: '请输入',
    },
    {
      label: '下单企业',
      key: 'buyerName',
      needHide: true,
      type: 'input',
      initialValue: undefined,
      placeholder: '请输入企业名称或税号',
    },
    {
      label: '下单时间',
      key: 'orderTime',
      needHide: true,
      type: 'range',
      initialValue: [
        moment().subtract(7, 'day') < moment().startOf('year')
          ? moment().startOf('year')
          : moment().subtract(7, 'day'),
        moment(),
      ],
    },
    {
      label: '订单收款方',
      key: 'sellerId',
      needHide: true,
      type: 'treeSelect',
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
      label: '订单来源',
      key: 'orderBusinessSource',
      needHide: true,
      type: 'select',
      initialValue: undefined,
      dataSource: tranSelectOptions(sourceList, {
        id: 'businessSource',
        name: 'businessSourceName',
      }),
    },
    {
      label: '订单类型',
      key: 'orderBuyChannel',
      needHide: true,
      type: 'select',
      initialValue: undefined,
      dataSource: tranSelectOptions(orderChannelList, {
        id: 'buyChannel',
        name: 'channelName',
      }),
    },
    {
      label: '生成结算明细',
      key: 'isSettle',
      needHide: true,
      type: 'select',
      initialValue: undefined,
      dataSource: GEBERATE_SETTLE_DETAIL,
    },
    {
      label: '结算明细编号',
      key: 'settleNo',
      needHide: true,
      type: 'input',
      initialValue: undefined,
      placeholder: '请输入',
    },
    {
      label: '结算对象',
      key: 'targetGuid',
      needHide: true,
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

const columns = (relation) => {
  return [
    {
      title: '订单编号',
      dataIndex: 'orderNo',
      align: 'left',
      fixed: 'left',
      width: 160,
      render: (val) => {
        return <div>{val || '-'}</div>;
      },
    },
    {
      title: '企业名称及税号',
      dataIndex: 'buyerName',
      // width: '11%',
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
      title: '商品内容',
      dataIndex: 'orderName',
      // width: '7%',
      width: 100,
      render: (val) => {
        return <div>{val || '-'}</div>;
      },
    },
    {
      title: '下单时间',
      dataIndex: 'orderCreateTime',
      // width: '7%',
      width: 100,
      render: (val) => {
        return <div>{val || '-'}</div>;
      },
    },
    {
      title: '订单收款方',
      dataIndex: 'sellerName',
      // width: '6%',
      width: 90,
      align: 'left',
      render: (val) => {
        return <div className="f-tal">{val || '-'}</div>;
      },
    },
    {
      title: '订单金额(元)',
      dataIndex: 'orderPrice',
      // width: '7%',
      width: 100,
      align: 'right',
      render: (val) => {
        return <div>{val ? numToThousands(val.toFixed(2)) : '-'}</div>;
      },
    },
    {
      title: '订单来源',
      dataIndex: 'orderSourceName',
      // width: '6%',
      width: 90,
      align: 'left',
      render: (val) => {
        return <div className="f-tal">{val || '-'}</div>;
      },
    },
    {
      title: '订单类型',
      dataIndex: 'orderChannelName',
      // width: '6%',
      width: 90,
      align: 'left',
      render: (val) => {
        return <div className="f-tal">{val || '-'}</div>;
      },
    },
    // {
    //   title: '添加人',
    //   dataIndex: 'orderCreator',
    //   // width: '6%',
    //   width: 90,
    //   render: (val) => {
    //     return <div>{val || '-'}</div>;
    //   },
    // },
    {
      title: '包含服务类型',
      dataIndex: 'settlementOrderItemsGoodsName',
      // width: '9%',
      width: 120,
      render: (_, { settlementOrderItems: val }) => {
        return val && val.length
          ? val.map(({ goodsName }, index) => {
              return (
                <CopyToClipboard
                  text={goodsName}
                  onCopy={() => {
                    message.success('复制成功');
                  }}
                >
                  <div className={Style.moreOverflow} key={`${goodsName}${index}`}>
                    {goodsName ? (
                      <Tooltip placement="top" title={goodsName}>
                        {goodsName}
                      </Tooltip>
                    ) : (
                      '-'
                    )}
                  </div>
                </CopyToClipboard>
              );
            })
          : '-';
      },
    },
    {
      title: '服务开通数量',
      dataIndex: 'settlementOrderItemsServiceNum',
      // width: '7%',
      width: 100,
      render: (_, { settlementOrderItems: val }) => {
        return val && val.length
          ? val.map(({ serviceNum }, index) => {
              // eslint-disable-next-line react/no-array-index-key
              return (
                <div className={Style.serviceNum} key={`${serviceNum}${index}`}>
                  {serviceNum || '-'}
                </div>
              );
            })
          : '-';
      },
    },
    {
      title: '生成结算明细',
      dataIndex: 'settlementOrderItemsIsSettle',
      // width: '7%',
      width: 100,
      render: (_, { settlementOrderItems: val }) => {
        return val && val.length
          ? val.map(({ isSettle }, index) => {
              // eslint-disable-next-line react/no-array-index-key
              return (
                <div className={Style.serviceNum} key={`${isSettle}${index}`}>
                  {isSettle ? '是' : '否'}
                </div>
              );
            })
          : '-';
      },
    },
    {
      title: '结算明细编号',
      dataIndex: 'settlementOrderItemsSettleNo',
      // width: '7%',
      width: 100,
      render: (_, { settlementOrderItems: val }) => {
        return val && val.length
          ? val.map(({ settleNo, isSettle }, index) => {
              return (
                <CopyToClipboard
                  text={settleNo}
                  onCopy={() => {
                    message.success('复制成功');
                  }}
                >
                  <div className={Style.moreOverflow} key={`${settleNo}${index}`}>
                    {isSettle ? (
                      <Tooltip placement="top" title={settleNo}>
                        {settleNo}
                      </Tooltip>
                    ) : (
                      '-'
                    )}
                  </div>
                </CopyToClipboard>
              );
            })
          : '-';
      },
    },
    {
      title: '结算对象',
      dataIndex: 'settlementOrderItemsTargetName',
      // width: '7%',
      width: 100,
      render: (_, { settlementOrderItems: val }) => {
        return val && val.length
          ? val.map(({ targetName }, index) => {
              // eslint-disable-next-line react/no-array-index-key
              return (
                <div className={Style.serviceNum} key={`${targetName}${index}`}>
                  {targetName || '-'}
                </div>
              );
            })
          : '-';
      },
    },
    {
      title: '结算金额(元)',
      dataIndex: 'settlementOrderItemsSettleAmount',
      // width: '7%',
      width: 100,
      align: 'right',
      render: (_, { settlementOrderItems: val }) => {
        return val && val.length
          ? val.map(({ settleAmount }, index) => {
              return (
                // eslint-disable-next-line react/no-array-index-key
                <div className={Style.serviceNum} key={`${settleAmount}${index}`}>
                  {(settleAmount && numToThousands(settleAmount.toFixed(2))) || '-'}
                </div>
              );
            })
          : '-';
      },
    },
  ];
};

export { formItems, columns };

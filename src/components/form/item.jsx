import React, { forwardRef } from 'react';
import { arrayOf, string, any, shape, func, bool } from 'prop-types';
import { DatePicker, Input, Select, TreeSelect } from 'antd';
import SelectEmpty from './components/selectEmpty';

const Item = forwardRef(
  ({ type, dataSource, getFieldsValue, setFieldsValue, notFoundContent, ...rest }, ref) => {
    if (type === 'select') {
      return (
        <Select
          ref={ref}
          allowClear
          showSearch
          placeholder="请选择"
          optionLabelProp="label"
          optionFilterProp="children"
          dropdownStyle={{ maxHeight: '320px' }}
          notFoundContent={notFoundContent && rest.showSearch ? <SelectEmpty /> : null}
          {...rest}
        >
          {dataSource.length &&
            dataSource.map((item) => (
              <Select.Option label={item.name} key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            ))}
        </Select>
      );
    }

    if (type === 'date') {
      return <DatePicker allowClear={false} {...rest} />;
    }

    if (type === 'treeSelect') {
      return (
        <TreeSelect
          allowClear
          notFoundContent={notFoundContent && rest.showSearch ? <SelectEmpty /> : null}
          dropdownStyle={{ maxHeight: '320px' }}
          {...rest}
        />
      );
    }

    if (type === 'range') {
      return <DatePicker.RangePicker allowClear={false} {...rest} style={{ width: '100%' }} />;
    }

    if (type === 'timeRange') {
      return (
        <DatePicker.RangePicker
          allowClear={false}
          showTime={rest.noShowTime ? false : { format: rest.timeFormat || 'HH:mm:ss' }}
          {...rest}
          style={{ width: '100%' }}
        />
      );
    }

    return (
      <Input
        allowClear
        autoComplete="off"
        maxLength={rest.maxLength || 100}
        placeholder="请输入"
        ref={ref}
        {...rest}
      />
    );
  },
);

Item.propTypes = {
  type: string,
  dataSource: arrayOf(shape({ id: any, name: string })),
  getFieldsValue: func.isRequired,
  setFieldsValue: func.isRequired,
  notFoundContent: bool,
};
Item.defaultProps = {
  type: 'input',
  dataSource: [],
  notFoundContent: true,
};

export default Item;

import React, { useCallback, useEffect, useState } from 'react';
import { arrayOf, func, oneOf, shape, string, bool } from 'prop-types';
import { Button, Row, Col, Form, Tabs, Icon } from 'antd';
import moment from 'moment';
import classnames from 'classnames';
import Item from '../item';
import Style from './index.less';

const searchLayout = {
  xs: { span: 12 },
  xl: { span: 8 },
  xxl: { span: 6 },
};

const Search = React.forwardRef(
  (
    {
      form,
      initFilter,
      items,
      tabKey,
      tabs,
      tabsProps,
      onChange,
      onTabChange,
      needButton,
      searchText,
      needMore,
    },
    ref,
  ) => {
    const { getFieldDecorator, resetFields, validateFields, getFieldsValue, setFieldsValue } = form;
    const hasTab = tabs.length > 0;
    const [activeKey, setActiveKey] = useState(initFilter?.[tabKey]);
    const [isMore, setIsMore] = useState(false);
    const changeTab = useCallback(
      (value) => {
        setActiveKey(value);
        resetFields();
        onTabChange(value);
      },
      [onTabChange, resetFields],
    );
    const submit = useCallback(
      (e) => {
        e.preventDefault();
        validateFields((err, values) => {
          if (!err) {
            onChange({ ...initFilter, ...values });
          }
        });
      },
      [initFilter, onChange, validateFields],
    );
    const reset = useCallback(() => {
      resetFields();
      onChange({ ...initFilter });
    }, [initFilter, onChange, resetFields]);

    useEffect(() => {
      setActiveKey(initFilter?.[tabKey]);
    }, [initFilter, tabKey]);

    return (
      <div
        id="tabsSearchForm"
        className={classnames({ [Style.search]: true, [Style['no-tabs']]: tabs.length < 1 })}
        ref={ref}
      >
        {hasTab && (
          <Tabs {...tabsProps} activeKey={activeKey} size="large" onChange={changeTab}>
            {tabs.map(({ key, tab }) => (
              <Tabs.TabPane key={key} tab={tab} />
            ))}
          </Tabs>
        )}
        {items.length > 0 && (
          <Form className={Style['search-from']} layout="inline" onSubmit={submit}>
            <Row>
              {items.map(({ label, key, rules, normalize, needHide, ...rest }) => (
                <Col
                  key={key}
                  {...searchLayout}
                  style={{
                    display: needHide && !isMore ? 'none' : 'block',
                    width: rest.width ? rest.width : undefined,
                    marginRight: rest.marginRight ? rest.marginRight : undefined,
                  }}
                >
                  <Form.Item label={label}>
                    {getFieldDecorator(key, {
                      initialValue: rest.isRange
                        ? [moment(initFilter[rest.params[0]]), moment(initFilter[rest.params[1]])]
                        : initFilter[key],
                      normalize,
                      rules,
                    })(
                      <Item
                        {...rest}
                        getPopupContainer={() => document.getElementById('tabsSearchForm')}
                        getFieldsValue={getFieldsValue}
                        setFieldsValue={setFieldsValue}
                      />,
                    )}
                  </Form.Item>
                </Col>
              ))}
              {needButton && (
                <Col className={Style['search-buttons']} {...searchLayout}>
                  <Button htmlType="submit" type="primary">
                    {searchText}
                  </Button>
                  <Button onClick={reset}>重置</Button>
                  {needMore && (
                    <a onClick={() => setIsMore(!isMore)} style={{ marginLeft: '12px' }}>
                      {isMore ? '收起' : '更多筛选'}
                      {isMore ? <Icon type="up" /> : <Icon type="down" />}
                    </a>
                  )}
                </Col>
              )}
            </Row>
          </Form>
        )}
      </div>
    );
  },
);

Search.propTypes = {
  initFilter: shape({}).isRequired,
  items: arrayOf(
    shape({
      label: string.isRequired,
      key: string.isRequired,
      type: oneOf(['date', 'input', 'range', 'select', 'timeRange', 'treeSelect']),
      rules: arrayOf(shape({})),
      normalize: func,
      needHide: bool,
    }),
  ).isRequired,
  tabKey: string,
  tabs: arrayOf(shape({ key: string.isRequired, tab: string.isRequired })),
  tabsProps: shape({}),
  needButton: bool,
  searchText: string,
  needMore: bool,
  onChange: func,
  onTabChange: func,
};

Search.defaultProps = {
  tabKey: undefined,
  tabs: [],
  tabsProps: {},
  onTabChange: () => {},
  onChange: () => {},
  needButton: true,
  searchText: '查询',
  needMore: false,
};

export default Form.create({ name: 'search' })(Search);

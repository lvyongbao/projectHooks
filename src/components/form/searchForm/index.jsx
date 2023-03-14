import React, { useEffect, useCallback, useState } from 'react';
import { arrayOf, func, oneOf, shape, string, bool } from 'prop-types';
import { Button, Row, Col, Form, Icon } from 'antd';
import useWindowResize from '@/hooks/use-windowResize';
import Alink from '@/components/Alink';
import Item from '../item';
import Style from './index.less';

// const searchLayout = {
//   xs: { span: 12 },
//   xl: { span: 8 },
//   xxl: { span: 6 },
// };

const searchLayout = {
  xs: { span: 8 },
  xxl: { span: 6 },
};

const SearchForm = React.forwardRef(
  ({ form, items, onChange, onReset, needButton, searchText, needMore }, ref) => {
    const { getFieldDecorator, resetFields, validateFields, getFieldsValue, setFieldsValue } = form;
    const [isMore, setIsMore] = useState(false);
    const windowWidth = useWindowResize();

    // 根据尺寸判断是否展示筛选项
    if (items.length >= 3 && needMore) {
      Object.assign(items[2], { needHide: windowWidth < 1600 });
    }

    const submit = useCallback(
      (e) => {
        e.preventDefault();
        validateFields((err, values) => {
          if (!err) {
            onChange({ ...values });
          }
        });
      },
      [onChange, validateFields],
    );

    const reset = useCallback(() => {
      resetFields();
      onReset(getFieldsValue());
    }, [getFieldsValue, onReset, resetFields]);

    return (
      <div id="searchForm" className={Style.searchForm} ref={ref}>
        {items.length > 0 && (
          <Form
            className={Style['searchForm-from']}
            layout="inline"
            hideRequiredMark
            colon={false}
            onSubmit={submit}
          >
            <Row type="flex" align="middle" justify="start">
              {items.map(({ label, key, initialValue, rules, normalize, needHide, ...rest }) => {
                return isMore ? (
                  <Col
                    key={key}
                    {...searchLayout}
                    style={{
                      width: rest.width ? rest.width : undefined,
                      marginRight: rest.marginRight ? rest.marginRight : undefined,
                    }}
                  >
                    <Form.Item label={label}>
                      {getFieldDecorator(key, {
                        initialValue,
                        normalize,
                        rules,
                      })(
                        <Item
                          {...rest}
                          getFieldsValue={getFieldsValue}
                          setFieldsValue={setFieldsValue}
                        />,
                      )}
                    </Form.Item>
                  </Col>
                ) : (
                  !needHide && (
                    <Col
                      key={key}
                      {...searchLayout}
                      style={{
                        width: rest.width ? rest.width : undefined,
                        marginRight: rest.marginRight ? rest.marginRight : undefined,
                      }}
                    >
                      <Form.Item label={label}>
                        {getFieldDecorator(key, {
                          initialValue,
                          normalize,
                          rules,
                        })(
                          <Item
                            {...rest}
                            getPopupContainer={() => document.getElementById('searchForm')}
                            getFieldsValue={getFieldsValue}
                            setFieldsValue={setFieldsValue}
                          />,
                        )}
                      </Form.Item>
                    </Col>
                  )
                );
              })}
              {needButton && (
                <Col className={Style['searchForm-buttons']} {...searchLayout}>
                  <Button onClick={reset}>重置</Button>
                  <Button htmlType="submit" type="primary">
                    {searchText}
                  </Button>
                  {needMore && (
                    <Alink onClick={() => setIsMore(!isMore)} style={{ marginLeft: '12px' }}>
                      {isMore ? '精简筛选' : '更多筛选'}
                      {isMore ? <Icon type="up" /> : <Icon type="down" />}
                    </Alink>
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

SearchForm.propTypes = {
  items: arrayOf(
    shape({
      label: string.isRequired,
      key: string.isRequired,
      type: oneOf(['date', 'input', 'range', 'select', 'timeRange', 'treeSelect']),
      rules: arrayOf(shape({})),
      normalize: func,
      needHide: bool,
    }),
  ),
  needButton: bool,
  searchText: string,
  needMore: bool,
  onChange: func,
  onReset: func,
  itemsReset: func,
};

SearchForm.defaultProps = {
  items: [],
  needButton: true,
  searchText: '查询',
  needMore: false,
  onChange: () => {},
  onReset: () => {},
  itemsReset: () => {},
};

export default Form.create({ name: 'searchForm' })(SearchForm);

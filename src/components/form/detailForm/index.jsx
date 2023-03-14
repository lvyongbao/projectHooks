import React, { useCallback } from 'react';
import { arrayOf, func, oneOf, shape, string, bool } from 'prop-types';
import { Button, Row, Col, Form, Table, Input } from 'antd';
import Alink from '@/components/Alink';
import Item from '../item';
import Style from './index.less';

// const searchLayout = {
//   xs: { span: 12 },
//   xl: { span: 8 },
//   xxl: { span: 6 },
// };

const searchLayout = {
  span: 24,
};

const DetailForm = React.forwardRef(
  ({ form, items, onChange, onReset, needButton, searchText }, ref) => {
    const { getFieldDecorator, resetFields, validateFields, getFieldsValue, setFieldsValue } = form;

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
      <div id="detailForm" className={Style.detailForm} ref={ref}>
        {items.length > 0 && (
          <Form
            className={Style['detailForm-from']}
            layout="inline"
            colon={false}
            onSubmit={submit}
          >
            <Row type="flex" align="middle" justify="start">
              {items.map(({ label, key, initialValue, rules, normalize, needHide, ...rest }) => {
                let dom;
                if (rest.type === 'title') {
                  dom = (
                    <div className="detailTitle" key={key}>
                      {key}
                    </div>
                  );
                } else if (rest.type === 'modal') {
                  dom = (
                    <Col {...searchLayout} key={key}>
                      <div style={{ paddingLeft: '100px' }}>
                        {initialValue && !!initialValue.length && (
                          <div className={Style.modalTypeValue}>
                            <Table
                              columns={rest.columns}
                              rowKey={rest.columns[0].dataIndex}
                              dataSource={initialValue}
                              pagination={false}
                            />
                          </div>
                        )}
                        <Alink {...rest.buttonProps}>{rest.text}</Alink>
                        {initialValue && !initialValue.length && (
                          <Form.Item style={{ padding: '0px', paddingTop: '3px' }}>
                            {getFieldDecorator(key, {
                              initialValue,
                              normalize,
                              rules,
                            })(<Input type="hidden" />)}
                          </Form.Item>
                        )}
                      </div>
                    </Col>
                  );
                } else {
                  dom = (
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
                            getPopupContainer={() => document.getElementById('detailForm')}
                            getFieldsValue={getFieldsValue}
                            setFieldsValue={setFieldsValue}
                          />,
                        )}
                      </Form.Item>
                    </Col>
                  );
                }
                return dom;
              })}
              {needButton && (
                <Col className={Style['detailForm-buttons']} {...searchLayout}>
                  <Button onClick={reset}>取 消</Button>
                  <Button htmlType="submit" type="primary">
                    {searchText}
                  </Button>
                </Col>
              )}
            </Row>
          </Form>
        )}
      </div>
    );
  },
);

DetailForm.propTypes = {
  items: arrayOf(
    shape({
      label: string,
      key: string.isRequired,
      type: oneOf([
        'title',
        'modal',
        'date',
        'input',
        'range',
        'select',
        'timeRange',
        'treeSelect',
      ]),
      rules: arrayOf(shape({})),
      normalize: func,
      needHide: bool,
    }),
  ),
  needButton: bool,
  searchText: string,
  onChange: func,
  onReset: func,
};

DetailForm.defaultProps = {
  items: [],
  needButton: true,
  searchText: '提 交',
  onChange: () => {},
  onReset: () => {},
};

export default Form.create({ name: 'searchForm' })(DetailForm);

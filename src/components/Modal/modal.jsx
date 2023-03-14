import React from 'react';
import { bool, func, string, object } from 'prop-types';
import { Button, Modal, Spin } from 'antd';
import Style from './index.less';

const View = ({
  children,
  cancelText,
  okText,
  okButtonProps,
  cancelButtonProps,
  spinning,
  onCancel,
  onOk,
  showFooter,
  wrapStyle,
  ...rest
}) => {
  return (
    <Modal
      {...rest}
      wrapClassName={Style['modal-wrap']}
      maskClosable={false}
      onCancel={onCancel}
      footer={
        showFooter
          ? [
              <Button {...cancelButtonProps} onClick={onCancel}>
                {cancelText}
              </Button>,
              <Button type="primary" {...okButtonProps} onClick={onOk}>
                {okText}
              </Button>,
            ]
          : null
      }
    >
      <Spin spinning={spinning}>
        <div className={Style['body-wrap']} style={wrapStyle}>
          {children}
        </div>
      </Spin>
    </Modal>
  );
};

View.defaultProps = {
  cancelText: '取 消',
  okText: '保 存',
  spinning: false,
  showFooter: true,
  okButtonProps: {},
  cancelButtonProps: {},
  wrapStyle: {},
  onOk: () => {},
  onCancel: () => {},
};
View.propTypes = {
  cancelText: string,
  okText: string,
  spinning: bool,
  okButtonProps: object,
  cancelButtonProps: object,
  onCancel: func,
  onOk: func,
  showFooter: bool,
  wrapStyle: object,
};

export default View;

import { Modal, Spin, message } from 'antd';

function fixModalPrefixCls(fn) {
  return (option) =>
    fn({
      ...option,
      prefixCls: 'settle-modal',
      okButtonProps: {
        ...option.okButtonProps,
        prefixCls: 'settle-btn',
      },
      cancelButtonProps: {
        ...option.cancelButtonProps,
        prefixCls: 'settle-btn',
      },
    });
}

Modal.confirm = fixModalPrefixCls(Modal.confirm);
Modal.error = fixModalPrefixCls(Modal.error);
Modal.info = fixModalPrefixCls(Modal.info);
Modal.success = fixModalPrefixCls(Modal.success);
Modal.warn = fixModalPrefixCls(Modal.warn);
Modal.warning = fixModalPrefixCls(Modal.warning);
Spin.defaultProps.delay = 200;
message.config({ duration: 5, prefixCls: 'settle-message', top: 80 });

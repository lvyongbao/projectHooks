import React, { useEffect, useState, useCallback } from 'react';
import Modal from '@/components/Modal';
import { getSVGDoms } from '@nuo-common/ofd';
import { downloadFile } from '@/utils'; // 目前不用
import { viewFile } from './service';
// import Style from "./index.module.less"; 目前不用

/**
 *@param visible 显示弹窗
 *@param onClose 关闭弹窗回调
 *@param previewData { taxnum：税号, downloadId:文件id, downloadType：下载类型 0是回单 1对账单..., documentKey：回单传校验码 对账单传id...}
 *@authors 大宝
 *@date 2022-07-29 10:34:50
 */
const Index = ({ visible, onClose, previewData }) => {
  const [loading, setLoading] = useState(false);

  // 进入调用预览接口
  useEffect(() => {
    if (visible) {
      (async function () {
        setLoading(true);
        const res = await viewFile(previewData);
        getSVGDoms({
          ofd: window.URL.createObjectURL(new Blob([res.data])),
          id: 'texts',
        });
        setLoading(false);
      })();
    }
  }, [previewData, visible]);

  // 下载操作
  const downLoad = useCallback(() => {
    downloadFile('/bankelink/web/common/downloadFile.do', previewData);
  }, [previewData]);

  return (
    <Modal
      visible={visible}
      title="附件信息"
      width={1120}
      spinning={loading}
      showFooter
      wrapStyle={{ height: 'calc(80vh - 120px)', padding: '0px 20px' }}
      okText="下载附件"
      onOk={downLoad}
      okButtonProps={{
        type: 'link',
        style: { height: 'auto', fontSize: '14px', padding: '0px' },
      }}
      cancelText="关闭"
      onCancel={() => onClose(false)}
      cancelButtonProps={{ type: 'primary', style: { marginLeft: '16px' } }}
      style={{ top: '10vh' }}
    >
      <div id="texts" />
    </Modal>
  );
};

export default Index;

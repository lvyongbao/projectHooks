import { get } from '@/utils';

// 预览附件 公共方法
// eslint-disable-next-line import/prefer-default-export
export const viewFile = (params) =>
  get('/bankelink/web/common/downloadFile.do', {
    params,
    responseType: 'blob',
  });

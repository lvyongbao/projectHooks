import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import Alink from '@/components/Alink';
import noData from '@/assets/img/noData.png';
import permission from '@/assets/img/nePermission.png';
import pageError from '@/assets/img/pageError.png';
import useJudge from './useJudge';
import Style from './index.less';

const ErrorPage = () => {
  const [noPage, enterpriseType, notCompany, notDaBao, notEnterpriseAdmin] = useJudge();
  const [error, setError] = useState();

  useEffect(() => {
    if (enterpriseType) {
      setError(
        <div>
          <div>
            <img src={noData} width="160" height="160" alt="" />
          </div>
          <p>暂不支持企业账号登录，请使用结算系统管理员账号登录，</p>
          <p>若无管理员，请点击头像下方的“个人中心”进行管理员角色配置</p>
        </div>,
      );
    } else if (notDaBao) {
      setError(
        <div>
          <div>
            <img src={noData} width="160" height="160" alt="" />
          </div>
          <p>当前企业暂未开通结算系统</p>
          <p>请检查当前登录企业是否正确，右上角可进行企业切换</p>
        </div>,
      );
    } else if (notCompany || notEnterpriseAdmin) {
      setError(
        <div>
          <div>
            <img src={permission} width="160" height="160" alt="" />
          </div>
          <p>暂无权限，请联系企业管理员开通权限</p>
        </div>,
      );
    } else if (noPage) {
      setError(
        <div>
          <div>
            <img src={pageError} width="160" height="160" alt="" />
          </div>
          <p style={{ marginBottom: '10px' }}>哎呀！你访问的页面出错啦~</p>
          <p>
            <Alink onClick={() => window.location.reload()}>刷新页面</Alink>
          </p>
        </div>,
      );
    }
  }, [noPage, enterpriseType, notCompany, notDaBao, notEnterpriseAdmin]);

  return <Layout className={Style.errorPage}>{error}</Layout>;
};

export default React.memo(ErrorPage);

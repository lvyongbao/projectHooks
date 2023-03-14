import store from '@/store';
import { jsonp } from '@/utils';
import { actions } from '@/global';
import { getUserCenterDomain, login, getUser, getAuthority, getMenuList } from '@/request';

const signOn = async (callback) => {
  let userInfo;
  try {
    // 获取用户信息
    userInfo = await getUser();
  } catch (e) {
    // 获取用户中心登录地址
    const configData = await getUserCenterDomain();

    // 检测登陆
    const token = await new Promise((resolve) => {
      jsonp({
        url: `${configData.data}/u/v1/auth/check_login`,
        jsonp: 'callback',
        jsonpCallback: 'user_lbn_jsonpResponse',
        success: ({ code, data }) => {
          if (code === 200) {
            resolve(data.token);
          } else {
            window.location.href = `${configData.data}/Contents/usercenter/allow/login/login.jsp?redirecturl=settlement`;
          }
        },
      });
    });
    if (token) {
      // 授权模拟登录获取用户信息
      userInfo = await login({ token });
    }
  }
  sessionStorage.setItem('employeeId', userInfo.data.employeeId);
  // 登陆成功获取权限
  const authority = await getAuthority();
  store.dispatch(actions.setAuthority(authority.data));
  // 登陆成功获取菜单
  const menuData = await getMenuList();
  store.dispatch(actions.setMenuList(menuData.data));

  // 切换时会先取上一次的数据，所以要把其放在最后，不然会导致Nav组件获取问题
  store.dispatch(actions.setUserInfo(userInfo.data));

  // 获取菜单列表
  // store.dispatch(
  //   actions.setMenuList([
  //     {
  //       icon: '&#xf390;',
  //       // resourceKey: 'settleObject',
  //       resourceKey: 'settlementTarget',
  //       title: '结算对象',
  //       url: 'settleObject',
  //       children: [],
  //     },
  //     {
  //       // resourceKey: 'settleRule',
  //       resourceKey: 'settlementRule',
  //       url: 'settleRule',
  //       title: '结算规则',
  //       icon: '&#xf393;',
  //       children: [],
  //     },
  //     {
  //       // resourceKey: 'settleOrder',
  //       resourceKey: 'settlementOrder',
  //       url: 'settleOrder',
  //       icon: '&#xf38f;',
  //       title: '结算订单',
  //       children: [],
  //     },
  //     {
  //       // resourceKey: 'settleDetail',
  //       resourceKey: 'settlementOrderDetail',
  //       url: 'settleDetail',
  //       icon: '&#xf391;',
  //       title: '结算明细',
  //       children: [],
  //     },
  //   ]),
  // );
  callback();
};

export default signOn;

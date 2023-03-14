import React from 'react';
import { Icon } from 'antd';
import { string, any } from 'prop-types';
import classnames from 'classnames';
import iconfont from '@/assets/iconfont/iconfont';
import { glyphs } from '@/assets/iconfont/iconfont.json';
import Style from './index.less';

const NewIcon = Icon.createFromIconfontCN({ scriptUrl: iconfont });

/**
 * @decrition 组合iconfont生成icon
 * @param {*} type:"&#xf38;"/ icon-jiesuanguize
 */
const IconCN = ({ type, className, ...others }) => {
  const newType = /^&#x[a-z0-9]+;$/.test(type)
    ? `icon-${glyphs.find(({ unicode }) => type.includes(unicode)).font_class}`
    : type;
  return <NewIcon className={classnames(Style.iconCN, className)} type={newType} {...others} />;
};

IconCN.propTypes = { type: string.isRequired, className: any };
IconCN.defaultProps = { className: {} };
export default IconCN;

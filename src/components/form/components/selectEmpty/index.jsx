import React from 'react';
import noSearch from '@/assets/img/noSearch.png';
// import PropTypes from 'prop-types';
import Style from './index.less';

const Item = () => {
  return (
    <div className={Style.selectNotFound}>
      <img src={noSearch} alt="" />
      <p>未搜索到相关结果</p>
    </div>
  );
};

Item.propTypes = {};
Item.defaultProps = {};
export default Item;

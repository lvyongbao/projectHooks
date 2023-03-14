import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Style from './index.less';

const Alink = ({ children, className, ...others }) => {
  return (
    <a
      className={classnames(Style['link-btn-a'], className)}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...others}
    >
      {children}
    </a>
  );
};
Alink.propTypes = {
  children: PropTypes.any.isRequired,
  className: PropTypes.any,
};
Alink.defaultProps = {
  className: {},
};

export default Alink;

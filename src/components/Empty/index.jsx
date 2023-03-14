import React from 'react';
import PropTypes from 'prop-types';
import pic from '@/assets/img/empty.png';

const Empty = ({ text }) => {
  return (
    <>
      <div>
        <img src={pic} alt="" width={130} height={100} />
      </div>

      <span>{text}</span>
    </>
  );
};

Empty.propTypes = {
  text: PropTypes.string.isRequired,
};
export default Empty;

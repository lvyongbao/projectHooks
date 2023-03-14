import React, { useEffect, useState, useRef } from 'react';
import { bool } from 'prop-types';
import Modal from './modal';

const Index = (props) => {
  const [states, setStates] = useState(true);
  const { visible } = props;
  const timerRef = useRef();
  useEffect(() => {
    if (!visible) {
      timerRef.current = setTimeout(() => {
        setStates(false);
      }, 200);
    } else {
      clearTimeout(timerRef.current);
      setStates(true);
    }
  }, [visible]);

  return states ? <Modal {...props} /> : null;
};

Index.defaultProps = { visible: false };
Index.propTypes = { visible: bool };
export default Index;

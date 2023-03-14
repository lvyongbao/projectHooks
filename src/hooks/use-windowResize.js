import { useState } from 'react';

export default () => {
  const [width, setWidth] = useState(window.innerWidth);
  window.addEventListener('resize', (e) => {
    setWidth(e.target.innerWidth);
  });
  return width;
};

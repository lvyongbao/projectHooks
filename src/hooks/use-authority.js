import { useSelector } from 'react-redux';

export default (auth) => {
  const authority = useSelector((state) => state.global.authority);
  return authority[auth] === 'true';
};

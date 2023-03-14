import { Table } from 'antd';
import React, { useCallback, useEffect, useRef, useMemo } from 'react';
import { useSize } from 'ahooks';
import PropTypes from 'prop-types';
import { getScrollYParent } from './utils';
import './index.less';

const StickyTable = React.memo(({ scroll, prefix, searchId, showSearch, ...restProps }) => {
  const tableFixedRightEle = useRef({ current: null });
  const fixedRightHeaderEle = useRef({ current: null });
  const fixedLeftHeaderEle = useRef({ current: null });
  const mainHeaderEle = useRef({ current: null });
  const headerHeight = useRef({ current: 59 });
  const tableTopFlagVisible = useRef({ current: true });
  const scrollYParent = useRef();
  const tableTopFlag = useRef();
  const tableSize = useSize(tableTopFlag);
  const caculatePosition = useCallback(() => {
    try {
      if (tableTopFlagVisible.current) {
        // 表格顶部标志可见时
        tableTopFlag.current.style.marginBottom = `0px`;
        mainHeaderEle.current && mainHeaderEle.current.classList.remove('sticky-fixed-main');
        fixedRightHeaderEle.current &&
          fixedRightHeaderEle.current.classList.remove('sticky-fixed-right');
        fixedLeftHeaderEle.current &&
          fixedLeftHeaderEle.current.classList.remove('sticky-fixed-left');
        return;
      }
      // 如果从表头到底部，内容和可见区域差别不大。不处理固定；
      if (
        scrollYParent.current.scrollHeight -
          (scrollYParent.current.scrollTop + scrollYParent.current.clientHeight) <
          8 &&
        mainHeaderEle.current &&
        !mainHeaderEle.current.classList.contains('sticky-fixed-main')
      )
        return;

      // 表单顶部标志不可见时
      const tableTopFlagRect = tableTopFlag.current.getBoundingClientRect();
      const right = document.documentElement.clientWidth - tableTopFlagRect.right;
      headerHeight.current = mainHeaderEle.current.clientHeight;
      let top = 0;
      if (
        scrollYParent.current !== document.documentElement &&
        scrollYParent.current !== document.body
      ) {
        const scrollYParentRect = scrollYParent.current.getBoundingClientRect();
        top = scrollYParentRect.top;
      }

      if (mainHeaderEle.current) {
        // 表头固定之后，剩下的内容不够展示一页，导致上边的内容被拖动，展示出来
        // 表头固定之后，默认遮住第一行；滚动之后才能展示出来;修复
        // --------------start
        tableTopFlag.current.style.marginBottom = `${headerHeight.current + 2}px`;
        // --------------end
        mainHeaderEle.current.classList.add('sticky-fixed-main');
        mainHeaderEle.current.style.left = `${tableTopFlagRect.left}px`;
        mainHeaderEle.current.style.right = `${right}px`;
        mainHeaderEle.current.style.top = `${top}px`;
      }

      if (tableFixedRightEle.current) {
        const fixedRightEleRect = tableFixedRightEle.current.getBoundingClientRect();
        fixedRightHeaderEle.current.classList.add('sticky-fixed-right');
        fixedRightHeaderEle.current.style.top = `${top}px`;
        fixedRightHeaderEle.current.style.left = `${fixedRightEleRect.left}px`;
        fixedRightHeaderEle.current.style.right = `${right}px`; // 控制右侧位置，这样中间的header就不会因为右边的内容太少，层级问题展示到右边的header之上
      }

      if (fixedLeftHeaderEle.current) {
        fixedLeftHeaderEle.current.classList.add('sticky-fixed-left');
        fixedLeftHeaderEle.current.style.top = `${top}px`;
        fixedLeftHeaderEle.current.style.left = `${tableTopFlagRect.left}px`;
      }
    } catch (err) {
      console.error('stickytable 定位异常:', err?.message);
    }
  }, []);

  const throttleCaculatePosition = useMemo(() => {
    return () => requestAnimationFrame(caculatePosition);
  }, [caculatePosition]);

  useEffect(() => {
    const intersectionObserver = new IntersectionObserver(function tableObserver(entries) {
      if (
        !entries[0].isIntersecting &&
        entries[0].boundingClientRect.top <= document.documentElement.clientHeight
      ) {
        tableTopFlagVisible.current = false;
        caculatePosition();
        if (searchId) {
          showSearch(true);
        }
      } else {
        tableTopFlagVisible.current = true;
        caculatePosition();
        if (searchId) {
          showSearch(false);
        }
      }
    });
    intersectionObserver.observe(tableTopFlag.current);

    return () => {
      intersectionObserver.disconnect();
    };
  }, [caculatePosition, searchId, showSearch]);

  const tableRefCallback = useCallback(
    (ele) => {
      if (ele) {
        try {
          mainHeaderEle.current = ele.querySelector(`.${prefix}-table-header`);
          tableFixedRightEle.current = ele.querySelector(`.${prefix}-table-fixed-right`);
          fixedRightHeaderEle.current = ele.querySelector(
            `.${prefix}-table-fixed-right .${prefix}-table-header`,
          );
          fixedLeftHeaderEle.current = ele.querySelector(
            `.${prefix}-table-fixed-left .${prefix}-table-header`,
          );
          scrollYParent.current = getScrollYParent(tableTopFlag.current);
          headerHeight.current = mainHeaderEle.current.clientHeight;

          const marginTopOfmain = Math.abs(
            getComputedStyle(mainHeaderEle.current).marginBottom.slice(0, -2),
          );
          mainHeaderEle.current.style.marginBottom = '0px';
          fixedLeftHeaderEle.current &&
            (fixedLeftHeaderEle.current.style.marginBottom = `${marginTopOfmain}px`);
          fixedRightHeaderEle.current &&
            (fixedRightHeaderEle.current.style.marginBottom = `${marginTopOfmain}px`);
        } catch (err) {
          //
        }
      }
    },
    [prefix],
  );

  useEffect(() => {
    tableTopFlagVisible.current = true;
    window.addEventListener('scroll', throttleCaculatePosition);
    window.addEventListener('resize', throttleCaculatePosition);
    return () => {
      window.removeEventListener('scroll', throttleCaculatePosition);
      window.removeEventListener('resize', throttleCaculatePosition);
    };
  }, [throttleCaculatePosition]);

  useEffect(() => {
    throttleCaculatePosition();
  }, [tableSize, throttleCaculatePosition]);

  const scrollProps = useMemo(() => {
    return { y: 9999, x: '100%', ...(scroll || {}) };
  }, [scroll]);

  return (
    <>
      <div
        ref={tableTopFlag}
        style={{ width: '100%', height: '1px' }}
        className="sticky-table-top-flag"
      />
      <div ref={tableRefCallback} className="sticky-table">
        <Table {...restProps} scroll={scrollProps} />
      </div>
    </>
  );
});

StickyTable.propTypes = {
  scroll: PropTypes.objectOf(PropTypes.number || PropTypes.string),
  prefix: PropTypes.string,
  searchId: PropTypes.string,
  showSearch: PropTypes.bool,
};
StickyTable.defaultProps = {
  scroll: {},
  prefix: 'settle',
  searchId: '',
  showSearch: false,
};
export default StickyTable;

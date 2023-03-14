// 获取x方向上的滚动父节点
export const getScrollXParent = (ele) => {
  let parent = ele;
  let scrollParent = null;
  while (parent && parent !== document.documentElement) {
    const computedStyle = getComputedStyle(parent);
    if (computedStyle.overflowX === 'scroll' || computedStyle.overflowX === 'auto') {
      scrollParent = parent;
      break;
    } else {
      parent = parent.parentNode;
    }
  }
  return scrollParent || document.documentElement;
};

// 获取y方向上的滚动父节点
export const getScrollYParent = (ele) => {
  let parent = ele;
  let scrollParent = null;
  while (parent && parent !== document.documentElement) {
    const computedStyle = getComputedStyle(parent);
    if (computedStyle.overflowY === 'scroll' || computedStyle.overflowY === 'auto') {
      scrollParent = parent;
      break;
    } else {
      parent = parent.parentNode;
    }
  }
  return scrollParent || document.documentElement;
};

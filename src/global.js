import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: {},
  authority: {},
  menuList: [],
  collapsed: false,
};

export const { reducer, actions } = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setUserInfo: (state, { payload }) => ({
      ...state,
      userInfo: payload,
    }),
    setAuthority: (state, { payload }) => ({
      ...state,
      authority: payload,
    }),
    setCollapsed: (state, { payload }) => ({ ...state, collapsed: payload }),
    setMenuList: (state, { payload }) => ({ ...state, menuList: payload }),
    logout: () => initialState,
  },
});

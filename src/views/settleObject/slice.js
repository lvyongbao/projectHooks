import { createAction, createReducer, createSlice } from '@reduxjs/toolkit';

const initialState = {
  targetOptions: { targetList: [], value: undefined },
  tableList: [],
  searchParams: { pageNum: 1, pageSize: 20, total: 0 },
  tableLoading: true,
};

export const { actions, reducer } = createSlice({
  name: 'settleObject',
  initialState,
  reducers: {
    setLoading: (state, { payload }) => {
      return {
        ...state,
        tableLoading: payload,
      };
    },
    setTargetOptions: (state, { payload }) => {
      return {
        ...state,
        targetOptions: payload,
      };
    },
    setTableList: (state, { payload }) => {
      return {
        ...state,
        tableList: payload,
      };
    },
    setSearchParams: (state, { payload }) => {
      return {
        ...state,
        searchParams: payload,
      };
    },
    reset: () => initialState,
  },
});

import { createAction, createReducer, createSlice } from '@reduxjs/toolkit';

const initialState = {
  jumpOption: {
    value: undefined,
    name: undefined,
  },
  businessTypeList: [],
  serviceOptions: { serviceTypeList: [], value: undefined },
  areaList: [],
  targetOptions: { targetList: [], value: undefined },
  searchParams: { pageNum: 1, pageSize: 20, total: 0 },
  tableList: [],
  tableLoading: true,
};

export const { actions, reducer } = createSlice({
  name: 'settleRule',
  initialState,
  reducers: {
    setJumpOption: (state, { payload }) => {
      return {
        ...state,
        jumpOption: payload,
      };
    },
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
    setBusinessTypeList: (state, { payload }) => {
      return {
        ...state,
        businessTypeList: payload,
      };
    },
    setServiceOptions: (state, { payload }) => {
      return {
        ...state,
        serviceOptions: payload,
      };
    },
    setAreaList: (state, { payload }) => {
      return {
        ...state,
        areaList: payload,
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

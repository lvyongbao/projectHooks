import { createAction, createReducer, createSlice } from '@reduxjs/toolkit';
import moment from 'moment';

const initialState = {
  businessTypeList: [],
  serviceOptions: { serviceTypeList: [], value: undefined },
  sellerList: [],
  targetOptions: { targetList: [], value: undefined },
  searchParams: {
    orderStartTime: moment().subtract(7, 'day').format('YYYY-MM-DD 00:00:00'),
    orderEndTime: moment().format('YYYY-MM-DD 23:59:59'),
    pageNum: 1,
    pageSize: 20,
    total: 0,
  },
  tableList: [],
  tableLoading: false,
};

export const { reducer, actions } = createSlice({
  name: 'settleDetail',
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
    setSellerList: (state, { payload }) => {
      return {
        ...state,
        sellerList: payload,
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

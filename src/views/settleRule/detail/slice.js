import { createAction, createReducer, createSlice } from '@reduxjs/toolkit';

const initialState = {
  businessTypeList: [],
  serviceOptions: { serviceTypeList: [], value: undefined },
  areaList: [],
  targetOptions: { targetList: [], value: undefined },
  rangeList: [],
};

export const { actions, reducer } = createSlice({
  name: 'settleRuleDetail',
  initialState,
  reducers: {
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
    setRangeList: (state, { payload }) => {
      return {
        ...state,
        rangeList: payload,
      };
    },
    reset: () => initialState,
  },
});

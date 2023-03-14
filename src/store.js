import { createStore, applyMiddleware, compose, combineReducers } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { reducer as global } from '@/global';
import { reducer as settleObject } from '@/views/settleObject/slice';
import { reducer as settleRule } from '@/views/settleRule/slice';
import { reducer as settleRuleDetail } from '@/views/settleRule/detail/slice';
import { reducer as settleOrder } from '@/views/settleOrder/slice';
import { reducer as settleDetail } from '@/views/settleDetail/slice';

const store = createStore(
  combineReducers({
    global,
    settleObject,
    settleRule,
    settleRuleDetail,
    settleOrder,
    settleDetail,
  }),
  compose(applyMiddleware(thunk)),
);

export default store;

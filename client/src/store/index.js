import { configureStore } from '@reduxjs/toolkit';
import accountReducer from "./slices/account.slice"
import employeeReducer from "./slices/employee.slice"

const store = configureStore({
  reducer: {
    accountState: accountReducer,
    employeeState: employeeReducer
  },
});

export * from './actions';
export * from './slices';

export default store;

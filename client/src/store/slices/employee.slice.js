import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  isLoading: false,
  employeeData: [],
  employeeCount: 0,
}

const employeeSlice = createSlice({
  name: 'employeeSlice',
  initialState,
  reducers: {
    getEmployeeData: (state, { payload }) => {
      state.employeeData = payload
    },
    getTotalCount: (state, { payload }) => {
      state.employeeCount = payload
    },
    getEmployeeLoading: (state, { payload }) => {
      state.isLoading = payload
    },
  }
})

const { actions, reducer } = employeeSlice;

export const {
  getEmployeeData,
  getTotalCount,
  getEmployeeLoading,
} = actions;

export default reducer;
import { getEmployeeData, getTotalCount, getEmployeeLoading } from "../slices";
import { getAllEmployeeURL, getError, createEmployeeURL, updateEmployeeURL, deleteEmployeeURL } from "../../lib";
import axios from "axios";
import getHeader from "../../utils/getHeader";

export const getAllEmployeeAPI = (header, body) => {
  return async (dispatch) => {
    dispatch(getEmployeeLoading(true));
    try {
      const { url } = getAllEmployeeURL();
      let response = await axios.post(url, body, { headers: header });
      const { data, status: { code } } = response.data;

      if (code === "200") {
        dispatch(getEmployeeData(data.employeeList));
        dispatch(getTotalCount(data.totalEmployees));
      }
      if (code === "404") {
        dispatch(getEmployeeData([]));
        dispatch(getTotalCount(0));
      }
      dispatch(getEmployeeLoading(false));
    } catch (error) {
      getError(error);
      dispatch(getEmployeeLoading(false));
    }
  };
};

export const createEmployeeAPI = (header, body) => {
  const { account_uuid } = header;
  return async (dispatch) => {
    dispatch(getEmployeeLoading(true));
    try {
      const { url } = createEmployeeURL();
      let response = await axios.post(url, body, { headers: header });
      const { status: { code } } = response.data;
      if (code === "200") {
        dispatch(getAllEmployeeAPI(getHeader(header), { account_uuid: account_uuid, page: 1, limit: 10 }))
      }
      dispatch(getEmployeeLoading(false));
    } catch (error) {
      getError(error);
      dispatch(getEmployeeLoading(false));
    }
  };
};

export const updateEmployeeAPI = (header, body) => {
  const { account_uuid } = header;
  return async (dispatch) => {
    dispatch(getEmployeeLoading(true));
    try {
      const { url } = updateEmployeeURL();
      let response = await axios.post(url, body, { headers: header });
      const { status: { code } } = response.data;
      if (code === "200") {
        dispatch(getAllEmployeeAPI(getHeader(header), { account_uuid: account_uuid, page: 1, limit: 10 }))
      }
      dispatch(getEmployeeLoading(false));
    } catch (error) {
      getError(error);
      dispatch(getEmployeeLoading(false));
    }
  };
};

export const deleteEmployeeAPI = (header, body) => {
  const { account_uuid } = header;
  return async (dispatch) => {
    dispatch(getEmployeeLoading(true));
    try {
      const { url } = deleteEmployeeURL();
      let response = await axios.post(url, body, { headers: header });
      const { status: { code } } = response.data;
      if (code === "200") {
        dispatch(getAllEmployeeAPI(getHeader(header), { account_uuid: account_uuid, page: 1, limit: 10 }))
      }
      dispatch(getEmployeeLoading(false));
    } catch (error) {
      getError(error);
      dispatch(getEmployeeLoading(false));
    }
  };
};

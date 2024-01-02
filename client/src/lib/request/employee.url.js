import { apiURL } from "../apiURL";

export const getAllEmployeeURL = () => (
  { url: `${apiURL()}/employee/getAllUsers` }
)

export const createEmployeeURL = () => (
  { url: `${apiURL()}/employee/createUsers` }
)

export const updateEmployeeURL = () => (
  { url: `${apiURL()}/employee/updateUsers` }
)

export const deleteEmployeeURL = () => (
  { url: `${apiURL()}/employee/deleteUsers` }
)
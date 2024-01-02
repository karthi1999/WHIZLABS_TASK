import { createService, deleteService, getAllService, updateService } from "../../service/employees.sevice.js";
import dataJSON from "../../utilities/dataJSON.js";

// DESC     create employee
// Route    POST /createUsers
const createEmployees = async (req, res, next) => {
  try {
    const { status, description, message, data } = await createService(req.headers, req.body, req);
    return res.status(200).json(dataJSON(status, description, message, data));
  } catch (error) {
    next(error);
  }
};

// DESC     get employee list
// Route    POST /getAllUsers
const getAllEmployees = async (req, res, next) => {
  try {
    const { status, description, message, data } = await getAllService(req.body);
    return res.status(200).json(dataJSON(status, description, message, data));
  } catch (error) {
    next(error);
  }
};


// DESC     update employee details
// Route    POST /updateUsers
const updateEmployees = async (req, res, next) => {
  try {
    const { status, description, message, data } = await updateService(req.body, req);
    return res.status(200).json(dataJSON(status, description, message, data));
  } catch (error) {
    next(error);
  }
};

// DESC     delete employee details
// Route    POST /deleteUsers
const deleteEmployees = async (req, res, next) => {
  try {
    const { status, description, message, data } = await deleteService(req.body);
    return res.status(200).json(dataJSON(status, description, message, data));
  } catch (error) {
    next(error);
  }
};

export {
  createEmployees,
  getAllEmployees,
  updateEmployees,
  deleteEmployees
}
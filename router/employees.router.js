import express from "express";
import { createEmployees, getAllEmployees, updateEmployees, deleteEmployees } from "../controller/employees/employees.controller.js";
import dataJSON from "../utilities/dataJSON.js";
import validateAdminPermissions from "../middleware/adminPermission.js";
import multer from "multer";

const upload = multer();

const router = express.Router();

router.route('/createUsers').post(validateAdminPermissions, upload.array('avatar'), createEmployees)
router.route('/getAllUsers').post(validateAdminPermissions, getAllEmployees)
router.route('/updateUsers').post(validateAdminPermissions, upload.array('avatar'), updateEmployees)
router.route('/deleteUsers').post(validateAdminPermissions, deleteEmployees)

router.use((req, res, next) => {
  res.status(404).json(dataJSON('404', 'URL or Method not found', 'The requested URL or Method does not exist.'));
});

export default router
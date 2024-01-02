import { createEmployeesQuery, getEmployeeQuery, getAllEmployeesQuery, updateEmployeesQuery, deleteEmployeesQuery } from "../bdq/employees.dbq.js";
import { handleUndefinedFields, isEmployeeFieldValid, isValidEmail, isValidPhone } from "../utilities/checkHandler.js";
import { v4 as uuidv4 } from 'uuid';
import cloudinary from "../config/cloudinary.config.js";

// Create Employee
const createService = async (header, data, req) => {
  try {
    const { account_uuid } = header;
    const { uuid, ...employeeData } = data;
    let newUuid = uuid || uuidv4();
    const {
      id,
      first_name,
      last_name,
      phone,
      email,
      company,
      job_title,
      is_profile,
    } = employeeData;
    let avatar = null;
    const imageBuffer = req?.files ? req.files.length > 0 && req.files[0].buffer : null;
    // Image upload functionality
    const uploadImage = () => {
      return new Promise(async (resolve, reject) => {
        try {
          if (imageBuffer) {
            const cloudinaryResult = await cloudinary.uploader.upload_stream(
              { resource_type: 'image', folder: 'avatar' },
              (cloudinaryError, cloudinaryResult) => {
                if (cloudinaryError) {
                  reject(cloudinaryError);
                } else {
                  const cdnUrl = cloudinaryResult.secure_url;
                  resolve(cdnUrl);
                }
              }
            ).end(imageBuffer);
          } else {
            resolve(null);
          }
        } catch (error) {
          reject(error);
        }
      });
    };

    avatar = await uploadImage()


    if (!isEmployeeFieldValid(employeeData)) {
      return handleUndefinedFields();
    }
    if (email && !isValidEmail(email)) {
      return { status: '403', description: 'Invalid email', message: 'Please provide a valid email id' };
    }
    if (phone && !isValidPhone(phone)) {
      return { status: '403', description: 'Invalid phone number', message: 'Please provide a valid phone number' };
    }

    let result = await createEmployeesQuery(account_uuid, id, newUuid, first_name, last_name, avatar, phone, email, company, job_title, is_profile);

    if (result.rowCount > 0) {
      return { status: '200', description: 'Success', message: 'Successfully created employee', data: { uuid: newUuid, ...employeeData, avatar: avatar } };
    } else {
      return { status: '404', description: 'Failed', message: 'Unable to create employee' };
    }
  } catch (error) {
    throw new Error(error);
  }
}

// Get all employee
const getAllService = async (data) => {
  try {
    const { account_uuid, page, limit } = data;
    if (!account_uuid) {
      return handleUndefinedFields();
    }
    const getAllEmployees = await getAllEmployeesQuery(account_uuid, page, limit);
    const totalEmployees = getAllEmployees.total;

    if (getAllEmployees.rows.length > 0) {
      const newData = getAllEmployees.rows.map(({ account_uuid, created_at, updated_at, ...rest }) => rest);

      return {
        status: '200',
        description: 'Success',
        message: 'Successfully retrieved employees',
        data: {
          employeeList: newData,
          totalEmployees: totalEmployees
        }
      }
    } else {
      return { status: '404', description: 'No employees found', message: 'No employees found' };
    }
  } catch (error) {
    throw new Error(error);
  }
};

// Update employee details
const updateService = async (data, req) => {
  try {
    const { uuid } = data;
    if (!uuid) {
      return handleUndefinedFields();
    }
    let avatar = null;

    const imageBuffer = req?.files ? req.files.length > 0 && req.files[0].buffer : null;
    // Image upload functionality
    const uploadImage = () => {
      return new Promise(async (resolve, reject) => {
        try {
          if (imageBuffer) {
            const cloudinaryResult = await cloudinary.uploader.upload_stream(
              { resource_type: 'image', folder: 'avatar' },
              (cloudinaryError, cloudinaryResult) => {
                if (cloudinaryError) {
                  reject(cloudinaryError);
                } else {
                  const cdnUrl = cloudinaryResult.secure_url;
                  resolve(cdnUrl);
                }
              }
            ).end(imageBuffer);
          } else {
            resolve(null);
          }
        } catch (error) {
          reject(error);
        }
      });
    };

    avatar = await uploadImage() || data.avatar;
    const result = await updateEmployeesQuery({ ...data, avatar: avatar || null });
    const getEmployee = await getEmployeeQuery(uuid);

    if (result.rowCount > 0) {
      const { uuid, first_name, last_name, phone, email, company, job_title, is_profile } = getEmployee.rows[0];
      const response = { uuid, first_name, last_name, phone, email, company, job_title, is_profile, avatar };

      return { status: '200', description: 'Success', message: 'Successfully updated employee details', data: response };
    } else {
      return { status: '404', description: 'Employee not found', message: 'Employee not found by the given uuid' };
    }
  } catch (error) {
    throw new Error(error);
  }
};


// Delete employee
const deleteService = async (data) => {
  try {
    const { uuid, account_uuid } = data;

    let result;
    if (!data) {
      return handleUndefinedFields()
    }

    result = await deleteEmployeesQuery(uuid || account_uuid);

    if (result.rowCount > 0) {

      return { status: '200', description: 'Success', message: 'Successfully deleted employee', data: null };
    } else {
      return { status: '404', description: 'Employee not found', message: 'Employee not found by the give uuid' };
    }
  } catch (error) {
    throw new Error(error)
  }
}

export {
  createService,
  getAllService,
  deleteService,
  updateService
}
import { pool } from "../db.js";

const getEmployeesByEmailQuery = async (email) => {
  return await pool.query('SELECT * FROM whizlabs.employees WHERE email = $1', [email]);
};

const getEmployeeQuery = async (uuid) => {
  return await pool.query('SELECT * FROM whizlabs.employees WHERE uuid = $1', [uuid]);
}

const getAllEmployeesQuery = async (account_uuid, page, limit) => {
  const offset = (page - 1) * limit;
  const query = limit && page
    ? 'SELECT * FROM whizlabs.employees WHERE account_uuid = $1 and is_profile = $2 LIMIT $3 OFFSET $4'
    : 'SELECT * FROM whizlabs.employees WHERE account_uuid = $1 and is_profile = $2';

  const queryParams = [account_uuid, true];

  if (limit && page) {
    queryParams.push(limit, offset);
  }

  const result = await pool.query(query, queryParams);

  // Total count of the rows
  const totalResult = await pool.query('SELECT COUNT(*) FROM whizlabs.employees WHERE account_uuid = $1 and is_profile = $2', [account_uuid, true]);
  const total = totalResult.rows[0].count;

  return { rows: result.rows, total: total };
};

const createEmployeesQuery = async (account_uuid, id, uuid, first_name, last_name, avatar, phone, email, company, job_title, is_profile) => {
  return await pool.query(
    'INSERT INTO whizlabs.employees (account_uuid, id, uuid, first_name, last_name, avatar, phone, email, company, job_title, is_profile, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
    [account_uuid, id, uuid, first_name, last_name, avatar, phone, email, company, job_title, is_profile, new Date(), new Date()]
  );
};

const updateEmployeesQuery = async (updateFields) => {
  const { uuid, first_name, last_name, avatar, phone, email, company, job_title } = updateFields;
  const values = [uuid];

  const setClauses = [];

  if (first_name !== undefined) setClauses.push(`first_name = $${values.push(first_name)}`);
  if (last_name !== undefined) setClauses.push(`last_name = $${values.push(last_name)}`);
  if (avatar !== undefined) setClauses.push(`avatar = $${values.push(avatar)}`);
  if (phone !== undefined) setClauses.push(`phone = $${values.push(phone)}`);
  if (email !== undefined) setClauses.push(`email = $${values.push(email)}`);
  if (company !== undefined) setClauses.push(`company = $${values.push(company)}`);
  if (job_title !== undefined) setClauses.push(`job_title = $${values.push(job_title)}`);

  setClauses.push(`updated_at = $${values.push(new Date())}`);

  return await pool.query(`UPDATE whizlabs.employees SET ${setClauses.join(', ')} WHERE uuid = $1`, values);
};

const deleteEmployeesQuery = async (uuid) => {
  return await pool.query('DELETE FROM whizlabs.employees WHERE uuid=$1 OR account_uuid = $2', [uuid, uuid]);
};

export {
  getEmployeesByEmailQuery,
  createEmployeesQuery,
  getEmployeeQuery,
  getAllEmployeesQuery,
  updateEmployeesQuery,
  deleteEmployeesQuery
}
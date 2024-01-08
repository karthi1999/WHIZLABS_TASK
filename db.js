import pg from "pg";
import { Redis } from "ioredis";

// Postgres connection
const { Pool } = pg;

const pool = new Pool({
  user: "root",
  password: "root@123",
  host: "localhost",
  port: "5432",
  database: "whizlabs_task"
})

// Redis Connection
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT // default port
})



export {
  pool,
  redis
};
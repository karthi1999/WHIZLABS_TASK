import pg from "pg";
import { Redis } from "ioredis";

// Postgres connection
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + "?sslmode=require",
})

// Redis Connection
const redis = new Redis({
  host: "localhost",
  port: 6379 // default port
})



export {
  pool,
  redis
};
import express from 'express';
import cors from 'cors';
import authRouter from './router/auth.router.js';
import employeesRouter from './router/employees.router.js';
import errorHandler from './middleware/errorMiddleware.js';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import checkRouteMiddleware from './middleware/checkRouteMiddleware.js';

dotenv.config();
const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use the checkRoute middleware for all routes
app.use(checkRouteMiddleware);

app.use('/account', authRouter);
app.use('/employee', employeesRouter);

app.use(errorHandler)

app.listen(process.env.PORT, () => {
  console.log('Successfully started server on port 5000');
});

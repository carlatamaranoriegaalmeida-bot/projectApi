import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import empleadosRoutes from './routes/employees.routes.js';
import { globalErrorHandler } from './middleware/error.middleware.js';


const app = express();
app.use(express.json());
app.use(cors());

//settings
app.set('puerto', process.env.PORT || 3000);
app.set('nombreApp','Gestión de empleados');
app.use(morgan('dev'));
app.use('/api', empleadosRoutes);
app.use(globalErrorHandler);

export default app;
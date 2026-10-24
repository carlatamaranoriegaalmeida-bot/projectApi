import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

const app = express();
app.use(express.json());
app.use(cors());

//settings
app.set('puerto', process.env.PORT || 3000);
app.set('nombreApp','Gestión de empleados');
app.use(morgan('dev'));

export default app;
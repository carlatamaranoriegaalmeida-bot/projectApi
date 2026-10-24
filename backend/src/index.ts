import 'dotenv/config';
import app from './app.js';
import authRouter from './modules/auth/routes/auth.routes.js';
import employeeRouter from './routes/employees.routes.js';
import { globalErrorHandler } from './middleware/error.middleware.js';
import { connectDatabase } from './config/database.js';

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/empleados', employeeRouter);
app.use(globalErrorHandler);

const port = app.get('puerto');

await connectDatabase();
app.listen(port, () => {
  console.log('Servidor escuchando en el puerto ' + port);
});
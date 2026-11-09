import 'dotenv/config';
import app from './app.js';
import authRouter from './modules/auth/routes/auth.routes.js';
import employeeRouter from './routes/employees.routes.js';
import { globalErrorHandler } from './middleware/error.middleware.js';
import { connectDatabase } from './config/database.js';
import { sendSlackAlert } from './utils/slack-alert.js';

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/empleados', employeeRouter);
app.use(globalErrorHandler);

process.on('uncaughtException', async (error) => {
  await sendSlackAlert(`Uncaught Exception: \`\`\`${error.stack ?? error.message}\`\`\``);
  process.exit(1);
});

process.on('unhandledRejection', async (reason) => {
  const details = reason instanceof Error ? reason.stack ?? reason.message : String(reason);
  await sendSlackAlert(`Unhandled Rejection: \`\`\`${details}\`\`\``);
});

const port = app.get('puerto');

await connectDatabase();
app.listen(port, () => {
  console.log('Servidor escuchando en el puerto ' + port);
});
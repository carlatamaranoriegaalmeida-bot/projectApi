import app from './app.js';
import { connectDatabase } from './config/database.js';

const port = app.get('puerto');

await connectDatabase();
app.listen(port, () => {
  console.log('Servidor escuchando en el puerto ' + port);
});
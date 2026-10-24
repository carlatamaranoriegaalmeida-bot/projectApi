# Backend y base de datos

Guía para configurar MongoDB local o Atlas, iniciar la API y ejecutar la aplicación completa.

## Requisitos

- Node.js 20.19 o posterior y npm.
- MongoDB Community Server local o una cuenta de MongoDB Atlas.

## 1. Configurar MongoDB

El backend obtiene la conexión de la variable de entorno `MONGODB_URI`. No carga archivos `.env`; configura la variable en la terminal donde iniciarás el backend.

### Opción A: MongoDB local

1. Instala MongoDB Community Server para Windows desde [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community). MongoDB Compass es opcional y permite visualizar los datos.
2. Habilita MongoDB como servicio durante la instalación y verifica que esté iniciado desde **Servicios** (`services.msc`).
3. En la terminal del backend, establece la URI:

   ```powershell
   $env:MONGODB_URI = "mongodb://127.0.0.1:27017/empleados_db"
   ```

   `empleados_db` es un nombre de ejemplo que puedes cambiar.

### Opción B: MongoDB Atlas

1. Crea una cuenta e inicia sesión en [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Crea un proyecto y un clúster. El nivel gratuito sirve para desarrollo.
3. En **Database Access**, crea un usuario de base de datos y guarda su contraseña.
4. En **Network Access**, autoriza la dirección IP pública desde la que se conectará tu equipo. Evita permitir el acceso desde cualquier IP salvo que sea estrictamente necesario.
5. En el clúster, elige **Connect** → **Drivers** y copia la cadena de conexión.
6. Sustituye el usuario, la contraseña y el nombre del clúster; añade `empleados_db` como nombre de la base de datos:

   ```powershell
   $env:MONGODB_URI = 'mongodb+srv://USUARIO:CONTRASENA@TU_CLUSTER.mongodb.net/empleados_db?retryWrites=true&w=majority'
   ```

   Las comillas simples ayudan a que PowerShell no interprete caracteres de la contraseña. Si contiene caracteres reservados para URL, codifícalos antes de incluirla en la cadena. No compartas ni subas credenciales al repositorio.

No necesitas crear manualmente la base de datos ni la colección: MongoDB las crea al guardar el primer empleado.

## 2. Instalar e iniciar el backend

Desde la raíz del repositorio, abre una terminal y ejecuta:

```powershell
cd backend
npm ci
$env:MONGODB_URI = "mongodb://127.0.0.1:27017/empleados_db"
npm run dev
```

Si utilizas Atlas, configura la URI de Atlas en vez de la URI local. El servidor escucha en `http://localhost:3000`. El puerto predeterminado es `3000`; puede cambiarse mediante la variable `PORT`.

La variable `$env:MONGODB_URI` solo permanece en esa terminal. Si la cierras o abres otra, vuelve a configurarla antes de ejecutar el backend.

## 3. Instalar e iniciar el frontend

Deja el backend ejecutándose y abre una segunda terminal en la raíz del repositorio:

```powershell
cd frontend
npm ci
npm start
```

Abre [http://localhost:4200](http://localhost:4200). El frontend consume la API en `http://localhost:3000/api/v1/empleados`, por lo que ambos servidores deben estar ejecutándose.

## 4. Probar la API

La ruta `POST /api/v1/auth/login` permite iniciar sesión con una cuenta existente y devuelve un JWT. No hay una ruta para registrar usuarios. Todas las rutas de empleados requieren autenticación; el cliente debe enviar el JWT obtenido al iniciar sesión. El backend valida la firma usando `JWT_SECRET`.

| Método | Ruta | Operación |
|---|---|---|
| `POST` | `/api/v1/auth/login` | Iniciar sesión |
| `GET` | `/api/v1/empleados` | Listar empleados (requiere autenticación) |
| `GET` | `/api/v1/empleados/:id` | Obtener un empleado (requiere autenticación) |
| `POST` | `/api/v1/empleados` | Crear un empleado (requiere autenticación) |
| `PUT` | `/api/v1/empleados/:id` | Actualizar un empleado (requiere autenticación) |
| `DELETE` | `/api/v1/empleados/:id` | Eliminar un empleado (requiere autenticación) |

Para crear un empleado desde PowerShell, configura `$token` con un JWT válido:

```powershell
$token = "JWT_VALIDO"
$empleado = @{
  name = "Ana Pérez"
  position = "Desarrolladora"
  department = "Tecnología"
  salary = 45000
} | ConvertTo-Json

Invoke-RestMethod `
  -Method Post `
  -Uri "http://localhost:3000/api/v1/empleados" `
  -Headers @{ Authorization = "Bearer $token" } `
  -ContentType "application/json" `
  -Body $empleado
```

El nombre, el puesto y el departamento son obligatorios; el salario debe ser un número positivo. Las rutas de un empleado requieren su ID de MongoDB.

## Solución de problemas

- **`Falta configurar la variable de entorno MONGODB_URI.`** Configúrala en la terminal del backend antes de ejecutar `npm run dev`.
- **No conecta a MongoDB local.** Verifica que MongoDB Community Server esté instalado y que su servicio de Windows esté iniciado.
- **Atlas rechaza la conexión.** Revisa la IP autorizada en **Network Access**, el usuario y contraseña de **Database Access**, y la URI.
- **El frontend no accede a la API.** Comprueba que ambos servidores estén activos y que el backend use el puerto `3000`.

## Pruebas del backend

Desde la carpeta `backend`:

```powershell
npm test
```

import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string({ error: 'El correo electrónico es obligatorio' })
    .trim()
    .email('El formato del correo electrónico proporcionado no es válido'),
  password: z.string({ error: 'La contraseña es obligatoria' })
    .min(6, 'La credencial de acceso debe poseer una longitud mínima de 6 caracteres'),
});

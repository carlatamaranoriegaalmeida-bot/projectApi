import type { Request, Response, NextFunction } from 'express';
import { sendResponse } from '../utils/responseWrapper.js';
import { sendSlackAlert } from '../utils/slack-alert.js';

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('CRITICAL ERROR:', err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  sendResponse(res, statusCode, message, null);

  // Disparar alerta a Slack solo para errores internos graves (5xx)
  if (statusCode >= 500) {
    const slackMessage = 
      `🔥 *Error 500 - Servidor Interno*\n` +
      `• *Endpoint:* \`${req.method} ${req.originalUrl}\`\n` +
      `• *Stack Trace:* \`\`\`${err.stack || message}\`\`\``;

    // Se ejecuta de forma asíncrona sin bloquear la respuesta HTTP al cliente
    sendSlackAlert(slackMessage).catch((slackErr) => {
      console.error('Error al despachar la alerta de Slack:', slackErr);
    });
  }
};
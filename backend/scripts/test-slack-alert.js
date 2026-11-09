import 'dotenv/config';

const webhookUrl = process.env.SLACK_WEBHOOK_URL;

if (!webhookUrl) {
  console.error('Falta configurar la variable de entorno SLACK_WEBHOOK_URL.');
  process.exit(1);
}

let parsedWebhookUrl;
try {
  parsedWebhookUrl = new URL(webhookUrl);
} catch {
  console.error('SLACK_WEBHOOK_URL no contiene una URL válida.');
  process.exit(1);
}

if (
  parsedWebhookUrl.protocol !== 'https:' ||
  parsedWebhookUrl.hostname !== 'hooks.slack.com' ||
  !parsedWebhookUrl.pathname.startsWith('/services/') ||
  parsedWebhookUrl.username ||
  parsedWebhookUrl.password
) {
  console.error('SLACK_WEBHOOK_URL debe ser una URL HTTPS válida de Slack.');
  process.exit(1);
}

try {
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: '🚨 [mi-backend] Alerta de prueba enviada desde la terminal.',
    }),
    redirect: 'error',
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    console.error(`Slack rechazó la alerta: HTTP ${response.status} ${response.statusText}.`);
    process.exitCode = 1;
  } else {
    console.log('Slack aceptó la alerta de prueba.');
  }
} catch (error) {
  console.error(
    'No se pudo enviar la alerta de prueba a Slack:',
    error instanceof Error ? error.message : String(error),
  );
  process.exitCode = 1;
}

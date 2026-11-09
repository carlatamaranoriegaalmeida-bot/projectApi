export async function sendSlackAlert(message: string): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error('SLACK_WEBHOOK_URL no está configurada; no se pudo enviar la alerta a Slack.');
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `🚨 *PM2-AWS-Bot Alert* (${process.env.NODE_ENV || 'production'}):\n${message}`,
      }),
    });

    if (!response.ok) {
      console.error(`Error enviando alerta a Slack: HTTP ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error(
      'Error enviando alerta a Slack:',
      error instanceof Error ? error.message : error,
    );
  }
}

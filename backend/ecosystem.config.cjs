module.exports = {
  apps: [
    {
      name: "mi-backend",
      script: "./dist/index.js",
      env: {
        NODE_ENV: "production",
        SLACK_WEBHOOK_URL: process.env.SLACK_WEBHOOK_URL,
      },
    },
  ],
};
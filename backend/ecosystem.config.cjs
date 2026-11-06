module.exports = {
 apps : [{
        name: "mi-node-app",
        script: "./backend/dist/index.js",
        instances: "max",
        exec_mode: "cluster",
 env: {
        NODE_ENV: "production",
        PORT: 3000,
        MONGODB_URI: process.env.MONGODB_URI,
        JWT_SECRET: process.env.JWT_SECRET
},
env_production: {
        NODE_ENV: "production",
        PORT: 3000,
        MONGODB_URI: process.env.MONGODB_URI,
        JWT_SECRET: process.env.JWT_SECRET
},
        error_file: "/var/www/backend/logs/err.log",
        out_file: "/var/www/backend/logs/out.log",
        log_date_format: "YYYY-MM-DD HH:mm:ss Z",
        merge_logs: true,
}],

// Automatización del Despliegue desde tu PC local
deploy : {
        production : {
        user : 'ubuntu',
        host : '18.225.128.127',
        ref : 'origin/feature/jwt', 
        repo : 'git@github.com:carlatamaranoriegaalmeida-bot/projectApi.git',
        path : '/var/www/backend/projectApi/backend',
       'post-deploy' : 'mkdir -p logs && npm install && pm2 reload ecosystem.config.cjs --env production && pm2 save && curl -X POST -H "Content-type: application/json" --data \'{"text":"🚀 ¡Despliegue exitoso de `mi-node-app` en producción (`feature/jwt`)!"}\' $SLACK_WEBHOOK_URL',
        ssh_options: "IdentityFile=C:/keys/bclaves.pem"
        }
        }
};

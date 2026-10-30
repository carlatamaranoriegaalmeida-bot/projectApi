module.exports = {
 apps : [{
        name: "mi-node-app",
        script: "./backend/dist/index.js",
        instances: "max",
        exec_mode: "cluster",
 env: {
        NODE_ENV: "production",
        PORT: 3000,
        MONGODB_URI: "mongodb+srv://taminoriega28_db_user:zombie1991@cluster0.a9apcrm.mongodb.net/usuarios_db?retryWrites=true&w=majority",
        JWT_SECRET: "UnAHeXAdEcImAL_o_FrAsE_UlTrA_SeCrEtA_Y_LaRgA_2026"
},
env_production: {
        NODE_ENV: "production",
        PORT: 3000,
        MONGODB_URI: "mongodb+srv://taminoriega28_db_user:zombie1991@cluster0.a9apcrm.mongodb.net/usuarios_db?retryWrites=true&w=majority",
        JWT_SECRET: "UnAHeXAdEcImAL_o_FrAsE_UlTrA_SeCrEtA_Y_LaRgA_2026"
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
        'post-deploy' : 'mkdir -p logs && npm install && pm2 reload ecosystem.config.cjs --env production && pm2 save',
        ssh_options: "IdentityFile=C:/keys/bclaves.pem" 
        }
        }
};


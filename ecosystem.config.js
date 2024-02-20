module.exports = {
  apps : [{
    name: "foodexplorer",
    script: "./src/server.js",
    instances: "foodexplorer",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}
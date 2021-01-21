// run `pm2 start` in root directory to run this app in a cluster mode

module.exports = {
  apps: [
    {
      name: "biodiv-ui",
      script: "yarn",
      args: "serve",
      interpreter: "none",
      instances: "max",
      exec_mode: "cluster"
    }
  ]
};

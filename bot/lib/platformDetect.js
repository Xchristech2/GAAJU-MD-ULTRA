function detectPlatform() {
      if (process.env.PLATFORM) return process.env.PLATFORM;
      if (process.env.DYNO) return 'Heroku';
      if (process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_ID) return 'Railway';
      if (process.env.RENDER) return 'Render';
      if (process.env.FLY_APP_NAME) return 'Fly.io';
      if (process.env.PTERODACTYL_ENVIRONMENT || process.env.P_SERVER_UUID) return 'Pterodactyl';
      return 'Panel';
  }
  module.exports = { detectPlatform };
  
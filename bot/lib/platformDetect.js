function hasEnv(...names) {
  return names.some(name => {
    const value = process.env[name];
    return value !== undefined && value !== "" && value !== "false";
  });
}

function detectPlatform() {
  const explicit = String(process.env.PLATFORM || "").trim();
  if (explicit && !/^panel$/i.test(explicit)) return explicit;

  if (process.platform === "win32") return "Windows";
  if (process.platform === "darwin") return "macOS";

  if (hasEnv("VERCEL", "VERCEL_ENV", "VERCEL_URL")) return "Vercel";
  if (hasEnv("DYNO", "HEROKU_APP_NAME", "HEROKU_DYNO_ID")) return "Heroku";
  if (hasEnv("RENDER", "RENDER_SERVICE_ID", "RENDER_INSTANCE_ID")) return "Render";
  if (hasEnv("RAILWAY_ENVIRONMENT", "RAILWAY_PROJECT_ID")) return "Railway";
  if (hasEnv("FLY_APP_NAME", "FLY_REGION")) return "Fly.io";
  if (hasEnv("KOYEB_APP_ID", "KOYEB_REGION")) return "Koyeb";

  if (hasEnv("PTERODACTYL_ENVIRONMENT", "P_SERVER_UUID", "P_SERVER_LOCATION")) return "Pterodactyl Panel";
  if (hasEnv("CPANEL", "CPANEL_VERSION", "WHM_VERSION")) return "cPanel";
  if (hasEnv("PANEL", "PANEL_NAME", "PANEL_URL")) return "Hosting Panel";
  if (hasEnv("KUBERNETES_SERVICE_HOST")) return "Kubernetes";
  if (process.platform === "linux") return "Linux VPS";
  return "Unknown Platform";
}

module.exports = { detectPlatform };

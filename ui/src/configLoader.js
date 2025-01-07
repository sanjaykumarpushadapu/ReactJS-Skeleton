// configLoader.js
let cachedConfig = null;

const loadConfig = async () => {
  if (cachedConfig) return cachedConfig;

  const env = __ENV__; // `__ENV__` is injected by Webpack at build time
  try {
    const response = await fetch(`/config/appSettings.${env}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load configuration for ${env}`);
    }
    cachedConfig = await response.json();
    return cachedConfig;
  } catch (error) {
    console.error('Error loading configuration:', error);
    throw error;
  }
};

const getConfigByKey = async (key) => {
         const config = await loadConfig();
  return config[key];
};

export { loadConfig, getConfigByKey };

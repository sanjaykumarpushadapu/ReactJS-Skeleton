const loadConfig = async () => {
  const env = __ENV__; // `__ENV__` is injected by Webpack at build time
  try {
    const response = await fetch(`/config/appSettings.${env}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load configuration for ${env}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading configuration:', error);
    throw error;
  }
};

export default loadConfig;

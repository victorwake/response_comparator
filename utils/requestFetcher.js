const axios = require('axios');

async function executeRequest(apiConfig) {
  const { url, method = 'GET', headers = {}, body = null, timeout = 30000 } = apiConfig;

  if (!url) {
    throw new Error('URL is required');
  }

  const config = {
    url,
    method: method.toLowerCase(),
    headers: { ...headers },
    timeout,
    validateStatus: () => true,
    responseType: 'json',
  };

  const methodUpper = method.toUpperCase();
  if (['POST', 'PUT', 'PATCH'].includes(methodUpper) && body) {
    config.data = body;
    if (!config.headers['Content-Type'] && !config.headers['content-type']) {
      config.headers['Content-Type'] = 'application/json';
    }
  }

  const startTime = Date.now();
  const response = await axios(config);
  const elapsed = Date.now() - startTime;

  return {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
    body: response.data,
    elapsed,
  };
}

module.exports = { executeRequest };

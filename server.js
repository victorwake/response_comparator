const express = require('express');
const cors = require('cors');
const path = require('path');
const { executeRequest } = require('./utils/requestFetcher');
const { compareAll } = require('./utils/deepCompare');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/compare', async (req, res) => {
  try {
    const { api1, api2, options = {} } = req.body;

    if (!api1 || !api2) {
      return res.status(400).json({ error: 'Both api1 and api2 configurations are required' });
    }

    const [response1, response2] = await Promise.all([
      executeRequest(api1),
      executeRequest(api2),
    ]);

    const comparison = compareAll(response1, response2, options);

    res.json({
      equal: comparison.equal,
      summary: comparison.summary,
      differences: comparison.differences,
      api1Response: {
        status: response1.status,
        statusText: response1.statusText,
        elapsed: response1.elapsed,
        body: response1.body,
      },
      api2Response: {
        status: response2.status,
        statusText: response2.statusText,
        elapsed: response2.elapsed,
        body: response2.body,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: 'Comparison failed',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;

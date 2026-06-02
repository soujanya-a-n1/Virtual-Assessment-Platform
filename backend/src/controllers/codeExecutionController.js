const axios = require('axios');

// Use local Piston instance (Docker container on port 2000)
const PISTON_URL = process.env.PISTON_URL || 'http://localhost:2000';

// Map language names to exact versions installed in local Piston
const LANGUAGE_VERSIONS = {
  python: '3.10.0',
  java: '15.0.2',
  c: '10.2.0',
};

const executeCode = async (req, res) => {
  try {
    const { language, files, stdin, args, compile_timeout, run_timeout } = req.body;

    // Resolve exact version for local Piston (doesn't support wildcard *)
    const version = LANGUAGE_VERSIONS[language] || LANGUAGE_VERSIONS[language?.toLowerCase()];
    if (!version) {
      return res.status(400).json({ message: `Unsupported language: ${language}. Supported: python, java, c` });
    }

    console.log('Executing code:', { language, version, filesCount: files?.length });

    const response = await axios.post(`${PISTON_URL}/api/v2/execute`, {
      language,
      version,
      files,
      stdin: stdin || '',
      args: args || [],
      compile_timeout: Math.min(compile_timeout || 3000, 3000),
      run_timeout: Math.min(run_timeout || 3000, 3000),
    });

    console.log('Piston response:', JSON.stringify(response.data).substring(0, 150));
    res.json(response.data);
  } catch (error) {
    console.error('Code execution error:', error.message);
    res.status(500).json({ 
      message: 'Error executing code', 
      error: error.response?.data || error.message 
    });
  }
};

const getRuntimes = async (req, res) => {
  try {
    const response = await axios.get(`${PISTON_URL}/api/v2/runtimes`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching runtimes:', error.message);
    res.status(500).json({ 
      message: 'Error fetching runtimes', 
      error: error.message 
    });
  }
};

module.exports = {
  executeCode,
  getRuntimes,
};

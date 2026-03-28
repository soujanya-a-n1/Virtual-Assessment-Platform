const axios = require('axios');

const PISTON_URL = process.env.PISTON_URL || 'https://emkc.org';

const executeCode = async (req, res) => {
  try {
    const { language, version, files, stdin, args, compile_timeout, run_timeout } = req.body;

    console.log('Executing code:', { language, version, filesCount: files?.length });

    // Use the correct Piston API endpoint
    const response = await axios.post(`${PISTON_URL}/api/v2/execute`, {
      language,
      version: version || '*',
      files,
      stdin: stdin || '',
      args: args || [],
      compile_timeout: compile_timeout || 10000,
      run_timeout: run_timeout || 5000,
    });

    console.log('Piston response:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Code execution error:', error.message);
    console.error('Error details:', error.response?.data);
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

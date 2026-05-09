const axios = require('axios');

// Test basic connection to backend
async function testConnection() {
  try {
    console.log('Testing connection to backend...');
    
    // Test health endpoint
    const healthResponse = await axios.get('http://localhost:5000/api/health');
    console.log('Health check:', healthResponse.data);
    
    // Test app generation endpoint (without auth)
    try {
      const appResponse = await axios.post('http://localhost:5000/api/apps/generate', {
        name: 'Test App',
        description: 'Test Description',
        category: 'business',
        features: ['User Authentication'],
        techStack: ['React', 'Node.js']
      });
      console.log('App generation response:', appResponse.data);
    } catch (appError) {
      console.log('Expected auth error for app generation:', appError.response?.data);
    }
    
  } catch (error) {
    console.error('Connection test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('Backend is not running or not accessible');
    }
  }
}

testConnection();

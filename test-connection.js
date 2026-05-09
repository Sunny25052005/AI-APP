const API = require('./utils/api.js');

// Test connection to backend
async function testConnection() {
  try {
    console.log('Testing connection to backend...');
    const response = await API.post('/auth/signup', {
      email: 'test@connection.com',
      password: 'test123'
    });
    console.log('Connection successful:', response.data);
  } catch (error) {
    console.error('Connection failed:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
  }
}

testConnection();

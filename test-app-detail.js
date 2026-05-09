const axios = require('axios');

// Test app detail page functionality
async function testAppDetail() {
  try {
    console.log('=== Testing App Detail Page ===');
    
    // Login first
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'nitesh44470@gmail.com',
      password: '45'
    });
    const token = loginResponse.data.token;
    console.log('Login successful');
    
    // Get user's apps
    const appsResponse = await axios.get('http://localhost:5000/api/apps', {
      headers: { 'Authorization': token }
    });
    console.log('User apps:', appsResponse.data.length);
    
    if (appsResponse.data.length > 0) {
      const firstApp = appsResponse.data[0];
      console.log(`Testing app detail for: ${firstApp.name} (ID: ${firstApp.id})`);
      console.log(`App detail URL should be: http://localhost:3000/app/${firstApp.id}`);
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testAppDetail();

const axios = require('axios');

// Test complete user flow
async function testFullFlow() {
  try {
    console.log('=== Testing Full AI App Generator Flow ===');
    
    // Step 1: Login
    console.log('\n1. Testing login...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'nitesh44470@gmail.com',
      password: '45'
    });
    console.log('Login successful:', loginResponse.data);
    const token = loginResponse.data.token;
    
    // Step 2: Test app generation with auth
    console.log('\n2. Testing app generation with auth...');
    const appResponse = await axios.post('http://localhost:5000/api/apps/generate', {
      name: 'Test E-commerce App',
      description: 'An AI-generated e-commerce platform',
      category: 'business',
      features: ['User Authentication', 'Payment Processing', 'Product Catalog'],
      techStack: ['React', 'Node.js', 'MongoDB']
    }, {
      headers: {
        'Authorization': token
      }
    });
    console.log('App generation successful:', appResponse.data);
    
    // Step 3: Get user's apps
    console.log('\n3. Testing get apps...');
    const appsResponse = await axios.get('http://localhost:5000/api/apps', {
      headers: {
        'Authorization': token
      }
    });
    console.log('User apps:', appsResponse.data);
    
    console.log('\n=== All tests passed! AI App Generator is working ===');
    
  } catch (error) {
    console.error('Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Status:', error.response.status);
    }
  }
}

testFullFlow();

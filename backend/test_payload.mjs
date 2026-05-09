const payload = {
  name: "Sunny",
  email: "sunny@gmail.com"
};

async function run() {
  console.log("1. Setting up Auth Session...");
  
  // Register a mock user
  const regRes = await fetch("http://localhost:3001/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "system@admin.com", password: "password123" })
  });
  
  let token = "";
  if (regRes.ok) {
    const regData = await regRes.json();
    token = regData.token;
  } else {
    // Maybe user exists, try login
    const loginRes = await fetch("http://localhost:3001/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "system@admin.com", password: "password123" })
    });
    const loginData = await loginRes.json();
    token = loginData.token;
  }

  console.log("\n2. Submitting Payload to /api/users...");
  
  // Hit dynamic API with JWT
  const res = await fetch("http://localhost:3001/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  const body = await res.json();
  console.log("\n--- SERVER RESPONSE ---");
  console.log(`Status: ${res.status}`);
  console.log(JSON.stringify(body, null, 2));
}

run();

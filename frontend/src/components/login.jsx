// src/Login.js
import React, { useState } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform login logic here, like sending the data to the server
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form onSubmit={handleSubmit} style={{ padding: '2rem', border: '1px solid #ccc', borderRadius: '10px', width: '300px' }}>
        <h2>Login</h2>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '.5rem' }}>Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '.5rem' }}>Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '.5rem' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '.5rem', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px' }}>
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;

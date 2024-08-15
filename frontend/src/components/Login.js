// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';

function Login() {
  const [formData, setFormData] = useState({ name: '', passwd: '' });
  const { name, passwd } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/v1/checkuser/', formData);
      console.log(res.data); // The JWT token
      localStorage.setItem('token', res.data.token);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        alert('Invalid credentials');
      } else {
        console.error(err.response.data);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={onSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Name:</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password:</label>
          <input
            type="password"
            name="passwd"
            value={passwd}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
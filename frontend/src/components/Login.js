// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';

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
      console.error(err.response.data);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>Name:</label>
        <input type="text" name="name" value={name} onChange={onChange} required />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" name="passwd" value={passwd} onChange={onChange} required />
      </div>
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;

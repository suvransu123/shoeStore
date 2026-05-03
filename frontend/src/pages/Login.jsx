import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Auth.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/auth/login', form);
      login(res.data.user);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-header">
          <h1 className="heading-md">Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              id="login-email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="form-input"
              placeholder="Email"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              id="login-password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Password"
              required
            />
          </div>
          <button id="login-btn" type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer-text">
          Don't have an account? <Link to="/signup" className="auth-link">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

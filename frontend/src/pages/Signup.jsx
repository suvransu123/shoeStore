import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Auth.css';

export default function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('/auth/signup', form);
      login(res.data.user);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-header">
          <h1 className="heading-md">Create Account</h1>
          <p>Join SoleStyle today</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              id="signup-name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="form-input"
              placeholder="Name"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              id="signup-email"
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
              id="signup-password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Password"
              required
            />
          </div>
          <button id="signup-btn" type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

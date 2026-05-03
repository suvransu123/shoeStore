import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Profile.css';

export default function Profile() {
  const { user, login } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', address: { street: '', city: '', state: '', zipCode: '' } });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        phone: user.phone || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || '',
        },
      });
    }
  }, [user]);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleAddressChange = e =>
    setForm(prev => ({ ...prev, address: { ...prev.address, [e.target.name]: e.target.value } }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put('/auth/profile', form);
      login(res.data.user);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content container">
      <div className="profile-wrap">
        {/* Profile Header */}
        <div className="profile-header card">
          <div className="profile-avatar-lg">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-header-info">
            <h1 className="heading-md">{user?.name}</h1>
            <p className="profile-email">{user?.email}</p>
            <span className={`badge ${user?.role === 'admin' ? 'badge-warning' : 'badge-primary'}`}>
              {user?.role === 'admin' ? 'Admin' : 'Member'}
            </span>
          </div>
          <div className="profile-stats">
            <div className="profile-stat">
              <span className="stat-value">0</span>
              <span className="stat-label">Orders</span>
            </div>
            <div className="profile-stat">
              <span className="stat-value">0</span>
              <span className="stat-label">Reviews</span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="profile-form-section card">
          <h2 className="heading-sm" style={{ marginBottom: '1.5rem' }}>Edit Profile</h2>

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input id="profile-name" name="name" value={form.name} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input id="profile-phone" name="phone" value={form.phone} onChange={handleChange} className="form-input" placeholder="Phone Number" />
              </div>
            </div>

            <div className="divider" />
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '1rem' }}>Shipping Address</h3>

            <div className="form-group">
              <label className="form-label">Street Address</label>
              <input name="street" value={form.address.street} onChange={handleAddressChange} className="form-input" placeholder="Street Address" />
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">City</label>
                <input name="city" value={form.address.city} onChange={handleAddressChange} className="form-input" placeholder="City" />
              </div>
              <div className="form-group">
                <label className="form-label">State</label>
                <input name="state" value={form.address.state} onChange={handleAddressChange} className="form-input" placeholder="State" />
              </div>
            </div>
            <div className="form-group" style={{ maxWidth: '200px' }}>
              <label className="form-label">Zip Code</label>
              <input name="zipCode" value={form.address.zipCode} onChange={handleAddressChange} className="form-input" placeholder="Zip Code" />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button id="save-profile-btn" type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

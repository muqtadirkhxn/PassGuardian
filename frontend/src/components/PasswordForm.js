import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, RefreshCw, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const PasswordForm = ({ password, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    website: '',
    username: '',
    password: '',
    notes: '',
    category: 'Other'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { api } = useAuth();

  const categories = ['Social', 'Work', 'Finance', 'Shopping', 'Entertainment', 'Other'];

  useEffect(() => {
    if (password) {
      setFormData({
        title: password.title || '',
        website: password.website || '',
        username: password.username || '',
        password: '', // Don't pre-fill password for security
        notes: password.notes || '',
        category: password.category || 'Other'
      });
    }
  }, [password]);

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let result = '';
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, password: result }));
    toast.success('Strong password generated!');
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!formData.username.trim()) {
      toast.error('Username is required');
      return;
    }
    if (!password && !formData.password) {
      toast.error('Password is required');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: formData.title.trim(),
        website: formData.website.trim(),
        username: formData.username.trim(),
        notes: formData.notes.trim(),
        category: formData.category
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      if (password) {
        await api.put(`/passwords/${password._id}`, payload);
        toast.success('Password updated successfully!');
      } else {
        await api.post('/passwords', payload);
        toast.success('Password added successfully!');
      }

      onSuccess();
      onClose();
    } catch (error) {
      const msg = error.response?.data?.message || 'Something went wrong';
      toast.error(msg);
      console.error('Form submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const pwd = formData.password;
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = getPasswordStrength();
  const strengthClass = strength <= 2 ? 'strength-weak' : strength <= 4 ? 'strength-medium' : 'strength-strong';
  const strengthText = strength <= 2 ? 'Weak' : strength <= 4 ? 'Medium' : 'Strong';
  const strengthColor = strength <= 2 ? 'var(--danger)' : strength <= 4 ? 'var(--warning)' : 'var(--accent)';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{password ? 'Edit Password' : 'Add New Password'}</h2>
          <button className="modal-close" onClick={onClose} type="button">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Title <span className="required">*</span></label>
              <input
                type="text"
                name="title"
                className="form-input"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Gmail Account"
                required
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label>Website</label>
              <input
                type="text"
                name="website"
                className="form-input"
                value={formData.website}
                onChange={handleChange}
                placeholder="e.g., gmail.com"
              />
            </div>

            <div className="form-group">
              <label>Username / Email <span className="required">*</span></label>
              <input
                type="text"
                name="username"
                className="form-input"
                value={formData.username}
                onChange={handleChange}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Password {password && <span className="optional">(leave blank to keep current)</span>}</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="form-input"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={password ? "•••••••• (unchanged)" : "Enter password"}
                  required={!password}
                />
                <div className="password-input-actions">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="btn btn-icon"
                    title={showPassword ? 'Hide' : 'Show'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="btn btn-icon generate-btn"
                    title="Generate strong password"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
              </div>
              {formData.password && (
                <div className="strength-indicator">
                  <div className="strength-header">
                    <span>Strength:</span>
                    <span style={{ color: strengthColor, fontWeight: 600 }}>
                      {strengthText}
                    </span>
                  </div>
                  <div className="strength-bar-bg">
                    <div className={`strength-bar-fill ${strengthClass}`}></div>
                  </div>
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                className="form-input"
                value={formData.category}
                onChange={handleChange}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea
                name="notes"
                className="form-input"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional notes..."
                rows="3"
                maxLength={500}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <div className="spinner-small"></div>
                  Saving...
                </>
              ) : password ? (
                <>
                  <Check size={16} />
                  Update Password
                </>
              ) : (
                <>
                  <Check size={16} />
                  Add Password
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordForm;

import React, { useState } from 'react';
import { Eye, EyeOff, Copy, Edit2, Trash2, ExternalLink, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const PasswordCard = ({ password, onEdit, onDelete }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const { api } = useAuth();

  const handleCopy = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(label);
      toast.success(`${label} copied!`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedField(label);
      toast.success(`${label} copied!`);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this password? This action cannot be undone.')) {
      return;
    }
    try {
      await api.delete(`/passwords/${password._id}`);
      toast.success('Password deleted!');
      onDelete();
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to delete password';
      toast.error(msg);
    }
  };

  const handleEdit = () => {
    onEdit(password);
  };

  const getWebsiteUrl = (url) => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

  const categoryClass = (password.category || 'Other').toLowerCase();
  const displayPassword = showPassword ? password.password : '•'.repeat(Math.min(password.password?.length || 8, 16));

  return (
    <div className="password-card">
      <div className="password-card-header">
        <div style={{ minWidth: 0 }}>
          <div className="password-card-title" title={password.title}>
            {password.title}
          </div>
          {password.website && (
            <div className="password-card-website">
              <a 
                href={getWebsiteUrl(password.website)}
                target="_blank" 
                rel="noopener noreferrer"
                className="website-link"
              >
                {password.website}
                <ExternalLink size={12} />
              </a>
            </div>
          )}
        </div>
        <span className={`password-category ${categoryClass}`}>
          {password.category || 'Other'}
        </span>
      </div>

      <div className="password-field">
        <div className="password-field-label">Username</div>
        <div className="password-field-value">
          <span className="field-text" title={password.username}>{password.username}</span>
          <button
            onClick={() => handleCopy(password.username, 'Username')}
            className={`btn btn-icon copy-btn ${copiedField === 'Username' ? 'copied' : ''}`}
            title="Copy username"
          >
            {copiedField === 'Username' ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      <div className="password-field">
        <div className="password-field-label">Password</div>
        <div className="password-field-value">
          <span className="field-text password-text" title={showPassword ? password.password : 'Click eye to reveal'}>
            {displayPassword}
          </span>
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="btn btn-icon toggle-btn"
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          <button
            onClick={() => handleCopy(password.password, 'Password')}
            className={`btn btn-icon copy-btn ${copiedField === 'Password' ? 'copied' : ''}`}
            title="Copy password"
          >
            {copiedField === 'Password' ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      {password.notes && (
        <div className="password-field">
          <div className="password-field-label">Notes</div>
          <div className="notes-text">
            {password.notes}
          </div>
        </div>
      )}

      <div className="password-actions">
        <button
          onClick={handleEdit}
          className="btn btn-secondary btn-sm action-btn"
        >
          <Edit2 size={14} />
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="btn btn-danger btn-sm action-btn"
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </div>
  );
};

export default PasswordCard;

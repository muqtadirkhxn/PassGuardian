import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Key, Shield, Lock, AlertTriangle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import PasswordCard from '../components/PasswordCard';
import PasswordForm from '../components/PasswordForm';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [passwords, setPasswords] = useState([]);
  const [stats, setStats] = useState({ total: 0, categories: [] });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPassword, setEditingPassword] = useState(null);
  const { api } = useAuth();
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [passwordsRes, statsRes] = await Promise.all([
        api.get('/passwords'),
        api.get('/passwords/stats/overview')
      ]);

      if (passwordsRes.data.success) {
        setPasswords(passwordsRes.data.passwords.slice(0, 6));
      }
      if (statsRes.data.success) {
        setStats(statsRes.data);
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEdit = (password) => {
    setEditingPassword(password);
    setShowForm(true);
  };

  const handleDelete = () => {
    fetchData();
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPassword(null);
  };

  const handleSuccess = () => {
    fetchData();
  };

  const getCategoryCount = (cat) => {
    const found = stats.categories.find(c => c._id === cat);
    return found ? found.count : 0;
  };

  const getTotalByCategories = (cats) => {
    return cats.reduce((sum, cat) => sum + getCategoryCount(cat), 0);
  };

  if (loading) {
    return (
      <div className="dashboard">
        <Sidebar />
        <main className="main-content">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading your vault...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <div>
            <h1>Dashboard</h1>
            <p>Overview of your password vault</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={18} />
            Add Password
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <Key size={24} />
            </div>
            <div>
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Passwords</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">
              <Shield size={24} />
            </div>
            <div>
              <div className="stat-value">{getTotalByCategories(['Work', 'Finance'])}</div>
              <div className="stat-label">Work & Finance</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange">
              <Lock size={24} />
            </div>
            <div>
              <div className="stat-value">{getTotalByCategories(['Social', 'Shopping'])}</div>
              <div className="stat-label">Social & Shopping</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon red">
              <AlertTriangle size={24} />
            </div>
            <div>
              <div className="stat-value">{stats.categories.length}</div>
              <div className="stat-label">Categories Used</div>
            </div>
          </div>
        </div>

        <div className="section-header">
          <h2>Recent Passwords</h2>
          <button 
            className="link-btn" 
            onClick={() => navigate('/passwords')}
          >
            View All <ArrowRight size={16} />
          </button>
        </div>

        {passwords.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Key size={36} />
            </div>
            <h3>No passwords yet</h3>
            <p>Click "Add Password" to start securing your credentials</p>
            <button 
              className="btn btn-primary" 
              onClick={() => setShowForm(true)}
              style={{ marginTop: '16px' }}
            >
              <Plus size={18} />
              Add Your First Password
            </button>
          </div>
        ) : (
          <div className="passwords-grid">
            {passwords.map(password => (
              <PasswordCard
                key={password._id}
                password={password}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {showForm && (
          <PasswordForm
            password={editingPassword}
            onClose={handleCloseForm}
            onSuccess={handleSuccess}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;

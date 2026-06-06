import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Key, Filter, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import PasswordCard from '../components/PasswordCard';
import PasswordForm from '../components/PasswordForm';
import { toast } from 'react-toastify';

const Passwords = () => {
  const [passwords, setPasswords] = useState([]);
  const [filteredPasswords, setFilteredPasswords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPassword, setEditingPassword] = useState(null);
  const [searchQuery, setSearchQuery] = useState(() => {
    return localStorage.getItem('passguardian_search') || '';
  });
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return localStorage.getItem('passguardian_category') || 'All';
  });
  const { api } = useAuth();

  const categories = ['All', 'Social', 'Work', 'Finance', 'Shopping', 'Entertainment', 'Other'];

  const fetchPasswords = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/passwords');
      if (res.data.success) {
        setPasswords(res.data.passwords);
      }
    } catch (error) {
      console.error('Fetch passwords error:', error);
      toast.error('Failed to load passwords');
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchPasswords();
  }, [fetchPasswords]);

  // Persist search to localStorage
  useEffect(() => {
    localStorage.setItem('passguardian_search', searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    localStorage.setItem('passguardian_category', selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    let filtered = [...passwords];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.title?.toLowerCase().includes(query) ||
        p.website?.toLowerCase().includes(query) ||
        p.username?.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query) ||
        p.notes?.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    setFilteredPasswords(filtered);
  }, [searchQuery, selectedCategory, passwords]);

  const handleEdit = (password) => {
    setEditingPassword(password);
    setShowForm(true);
  };

  const handleDelete = () => {
    fetchPasswords();
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPassword(null);
  };

  const handleSuccess = () => {
    fetchPasswords();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    localStorage.removeItem('passguardian_search');
    localStorage.removeItem('passguardian_category');
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'All';

  if (loading) {
    return (
      <div className="dashboard">
        <Sidebar />
        <main className="main-content">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading your passwords...</p>
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
            <h1>Passwords</h1>
            <p>Manage all your stored credentials</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={18} />
            Add Password
          </button>
        </div>

        <div className="search-bar">
          <div className="search-input-wrapper">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search passwords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                className="clear-search" 
                onClick={() => setSearchQuery('')}
              >
                <X size={16} />
              </button>
            )}
          </div>
          <div className="filter-wrapper">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <Filter size={16} className="filter-icon" />
          </div>
          {hasActiveFilters && (
            <button className="btn btn-secondary btn-sm" onClick={clearFilters}>
              <X size={14} />
              Clear
            </button>
          )}
        </div>

        <div className="results-info">
          Showing {filteredPasswords.length} of {passwords.length} passwords
          {hasActiveFilters && ' (filtered)'}
        </div>

        {filteredPasswords.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Key size={36} />
            </div>
            <h3>
              {hasActiveFilters 
                ? 'No passwords match your filters' 
                : 'No passwords stored yet'}
            </h3>
            <p>
              {hasActiveFilters
                ? 'Try adjusting your search or category filter'
                : 'Click "Add Password" to get started'}
            </p>
            {hasActiveFilters && (
              <button 
                className="btn btn-secondary" 
                onClick={clearFilters}
                style={{ marginTop: '16px' }}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="passwords-grid">
            {filteredPasswords.map(password => (
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

export default Passwords;

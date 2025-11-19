import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import type { UserType } from '../../types';
import { fetchWithCache, clearCacheKey } from '../../utils/cache';
import { Trash2 } from 'lucide-react';

type SortOrder = 'asc' | 'desc';

const User: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortKey, setSortKey] = useState<keyof UserType>('firstName');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const [newAdmin, setNewAdmin] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  // --- Fetch all users ---
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const userData = await fetchWithCache(
        'admin_users',
        async () => {
          const res = await axios.get(`${apiBaseUrl}/api/users`);
          return res.data.users || [];
        },
        3 * 60 * 1000
      );
      setUsers(userData);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- Handle Create Admin ---
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = { ...newAdmin, role: 'admin' };
      await axios.post(`${apiBaseUrl}/api/users`, payload);
      setNewAdmin({ firstName: '', lastName: '', email: '', password: '' });
      clearCacheKey('admin_users');
      fetchUsers();
      alert('Admin created successfully');
    } catch (err) {
      console.error('Failed to create admin', err);
      alert('Failed to create admin');
    } finally {
      setLoading(false);
    }
  };

  // --- Handle Delete User ---
  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`${apiBaseUrl}/api/users/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
      clearCacheKey('admin_users');
      alert('User deleted successfully');
    } catch (err) {
      console.error('Failed to delete user', err);
      alert('Failed to delete user');
    }
  };

  // --- Handle Sorting ---
  const handleSort = (key: keyof UserType) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  // --- Sort users based on key and order ---
  const sortedUsers = useMemo(() => {
    const copy = [...users];
    return copy.sort((a, b) => {
      const aVal = a[sortKey] ?? '';
      const bVal = b[sortKey] ?? '';
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [users, sortKey, sortOrder]);

  // --- Separate admins and normal users ---
  const admins = sortedUsers.filter(u => u.role === 'admin');
  const normalUsers = sortedUsers.filter(u => u.role !== 'admin');

  // --- Tailwind classes ---
  const inputClass =
    'w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)] transition duration-150';
  const buttonGold =
    'bg-[var(--color-brand-gold)] hover:bg-[var(--color-brand-gold-hover)] text-white font-semibold shadow-md';

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* --- Header --- */}
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-brand-navy)]">User Management</h1>
          <p className="text-gray-600">Manage all users and admins</p>
        </div>

        {/* --- Create Admin Form --- */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-semibold mb-4">Create New Admin</h2>
          <form
            onSubmit={handleCreateAdmin}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
          >
            <input
              type="text"
              placeholder="First Name"
              value={newAdmin.firstName}
              onChange={e => setNewAdmin({ ...newAdmin, firstName: e.target.value })}
              required
              className={inputClass}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={newAdmin.lastName}
              onChange={e => setNewAdmin({ ...newAdmin, lastName: e.target.value })}
              required
              className={inputClass}
            />
            <input
              type="email"
              placeholder="Email"
              value={newAdmin.email}
              onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })}
              required
              className={inputClass}
            />
            <input
              type="password"
              placeholder="Password"
              value={newAdmin.password}
              onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })}
              required
              className={inputClass}
            />
            <button
              type="submit"
              className={`col-span-full md:col-auto px-4 py-2 rounded-lg ${buttonGold}`}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Admin'}
            </button>
          </form>
        </div>

        {/* --- Admins Table --- */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-semibold mb-4">Admins</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                  onClick={() => handleSort('firstName')}
                >
                  Name {sortKey === 'firstName' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                  onClick={() => handleSort('email')}
                >
                  Email {sortKey === 'email' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={3} className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : admins.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-4">
                    No admins found
                  </td>
                </tr>
              ) : (
                admins.map(u => (
                  <tr key={u._id} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4">{u.firstName} {u.lastName}</td>
                    <td className="px-6 py-4">{u.email}</td>
                    <td className="px-6 py-4 space-x-2 text-sm">
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* --- Normal Users Table --- */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-semibold mb-4">Users</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                  onClick={() => handleSort('firstName')}
                >
                  Name {sortKey === 'firstName' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                  onClick={() => handleSort('email')}
                >
                  Email {sortKey === 'email' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={3} className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : normalUsers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-4">
                    No users found
                  </td>
                </tr>
              ) : (
                normalUsers.map(u => (
                  <tr key={u._id} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4">{u.firstName} {u.lastName}</td>
                    <td className="px-6 py-4">{u.email}</td>
                    <td className="px-6 py-4 space-x-2 text-sm">
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="p-2 text-gray-500 hover:text-red-600 transition duration-150 rounded-full"
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default User;

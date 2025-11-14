import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface UserType {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

type SortOrder = 'asc' | 'desc';

const User: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(false);
  const [sortKey, setSortKey] = useState<keyof UserType>('firstName');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const [newAdmin, setNewAdmin] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  // --- Fetch all users ---
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiBaseUrl}/api/users`);
      setUsers(res.data.users || []);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  // --- Fetch single user by ID ---
  const fetchUserById = async (id: string) => {
    try {
      const res = await axios.get(`${apiBaseUrl}/api/users/${id}`);
      setSelectedUser(res.data.user);
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top smoothly
    } catch (err) {
      console.error('Failed to fetch user', err);
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
      if (selectedUser?._id === id) setSelectedUser(null);
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

  const sortedUsers = [...users].sort((a, b) => {
    if (a[sortKey] < b[sortKey]) return sortOrder === 'asc' ? -1 : 1;
    if (a[sortKey] > b[sortKey]) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="p-8 space-y-8">
      {/* --- Create Admin Form --- */}
      <div className="border p-4 rounded shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-3">Create New Admin</h2>
        <form onSubmit={handleCreateAdmin} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="First Name"
            value={newAdmin.firstName}
            onChange={(e) => setNewAdmin({ ...newAdmin, firstName: e.target.value })}
            required
            className="border px-3 py-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={newAdmin.lastName}
            onChange={(e) => setNewAdmin({ ...newAdmin, lastName: e.target.value })}
            required
            className="border px-3 py-2 rounded w-full"
          />
          <input
            type="email"
            placeholder="Email"
            value={newAdmin.email}
            onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
            required
            className="border px-3 py-2 rounded w-full"
          />
          <input
            type="password"
            placeholder="Password"
            value={newAdmin.password}
            onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
            required
            className="border px-3 py-2 rounded w-full"
          />
          <button
            type="submit"
            className="col-span-full md:col-auto px-4 py-2 bg-[#d4a574] text-white rounded hover:bg-[#b88f5a]"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Admin'}
          </button>
        </form>

        {/* --- Selected User Details BELOW Create Admin --- */}
        {selectedUser && (
          <div className="mt-6 border p-4 rounded shadow-sm bg-gray-50">
            <h2 className="text-xl font-semibold mb-2">User Details</h2>
            <p><strong>Name:</strong> {selectedUser.firstName} {selectedUser.lastName}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Role:</strong> {selectedUser.role}</p>
          </div>
        )}
      </div>

      {/* --- Users Table --- */}
      <div className="bg-white border rounded shadow-sm overflow-x-auto">
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
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                onClick={() => handleSort('role')}
              >
                Role {sortKey === 'role' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-4">Loading...</td>
              </tr>
            ) : sortedUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4">No users found</td>
              </tr>
            ) : (
              sortedUsers.map((u) => (
                <tr
                  key={u._id}
                  className={selectedUser?._id === u._id ? 'bg-yellow-50' : ''}
                >
                  <td className="px-6 py-4">{u.firstName} {u.lastName}</td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4 capitalize">{u.role}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => fetchUserById(u._id)}
                      className="px-3 py-1 bg-[#d4a574] text-white rounded hover:bg-[#b88f5a]"
                    >
                      View
                    </button>
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
    </div>
  );
};

export default User;

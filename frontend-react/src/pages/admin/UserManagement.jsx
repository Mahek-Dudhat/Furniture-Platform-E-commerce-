import { useState, useEffect } from 'react';
import { getAllUsers, updateUserRole, toggleUserStatus } from '../../api/adminservice';
import { Search, Shield, Ban, CheckCircle } from 'lucide-react';
import './UserManagement.css';

export default function UserManagement() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
    const [filters, setFilters] = useState({ search: '', role: '', page: 1, limit: 20 });
    const [msg, setMsg] = useState({ error: '', success: '' });
    const [updatingUserId, setUpdatingUserId] = useState(null);



    useEffect(() => {
        fetchUsers();
    }, [filters]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await getAllUsers(filters);
            setUsers(response.data.data);
            setPagination({ page: response.data.page, totalPages: response.data.totalPages, total: response.data.total });
        } catch (err) {
            setMsg({ error: err.response?.data?.message || 'Failed to fetch users', success: '' });
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole, currentRole, userEmail) => {

        if (newRole === currentRole) return;

        //Confirm promotions:
        if (currentRole !== 'admin' && newRole === 'admin') {
            const ok = window.confirm(`Promote ${userEmail || 'this user'} to ADMIN? This grants full admin privileges.`);
            if (!ok) return;
        }

        //Confirm demotions:
        if (currentRole === 'admin' && newRole === 'user') {
            // extra warning if someone tries to demote themself (best-effort)
            const currentUser = JSON.parse(localStorage.getItem('user'));
            console.log(currentUser);
            const demotingSelf = currentUser && currentUser.id === userId;
            const message = demotingSelf
                ? 'You are about to remove your own admin privileges. Are you sure?'
                : `Demote ${userEmail || 'this user'} from ADMIN? This will remove admin access.`;

            const ok = window.confirm(message);
            if (!ok) return;
        }

        try {
            await updateUserRole(userId, newRole);
            setUpdatingUserId(userId);
            setMsg({ error: '', success: 'Role updated successfully' });
            fetchUsers();

        } catch (err) {
            setMsg({ error: err.response?.data?.message || 'Failed to update role', success: '' });
        } finally {
            setUpdatingUserId(null);
        }
    }

    const handleToggleStatus = async (userId) => {
        try {
            await toggleUserStatus(userId);
            setUpdatingUserId(userId);
            setMsg({ error: '', success: 'Status updated successfully..' });
            fetchUsers();
        } catch (err) {
            setMsg({ error: err.response?.data?.message || 'Failed to update status', success: '' });
        } finally {
            setUpdatingUserId(null);
        }
    }

    return (
        <div className="user-management">
            <div className="page-header">
                <h1>User Management</h1>
            </div>

            {msg.error && <div className="alert alert-error">{msg.error}</div>}
            {msg.success && <div className="alert alert-success">{msg.success}</div>}

            <div className="filters-bar">
                <div className="search-box">
                    <Search size={18} />
                    <input type="text" placeholder="Search users..." value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })} />
                </div>
                <select className="filter-select" value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value, page: 1 })}>
                    <option value="">All Roles</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            </div>

            {
                loading ? <div className="loading">Loading...</div>
                    : (
                        <div className="users-table-container">
                            <table className="users-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Verified</th>
                                        <th>Joined</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user._id}>
                                            <td>{user.fullname}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <select value={user.role} onChange={(e) => handleRoleChange(user._id, e.target.value, user.role, user.email)} className="role-select">
                                                    <option value="user">User</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                                                    {user.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td>{user.isVerified ? <CheckCircle size={18} color="#22c55e" /> : <Ban size={18} color="#ef4444" />}</td>
                                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <button className="btn-toggle" onClick={() => handleToggleStatus(user._id)}>
                                                    {user.isActive ? 'Deactivate' : 'Activate'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
            }

        </div>
    );

}

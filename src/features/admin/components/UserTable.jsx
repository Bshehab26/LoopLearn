// src/features/admin/components/UserTable.jsx
import { useState } from 'react';
import { HiDotsVertical, HiPencil, HiTrash, HiBan, HiCheckCircle } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

const UserTable = ({ users, loading, onRoleChange, onDelete, onSuspend, onActivate }) => {
  const [openMenu, setOpenMenu] = useState(null);

  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'instructor': return 'bg-blue-100 text-blue-700';
      case 'admin': return 'bg-purple-100 text-purple-700';
      default: return 'bg-green-100 text-green-700';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'suspended': return 'bg-red-100 text-red-700';
      case 'inactive': return 'bg-gray-100 text-gray-700';
      default: return 'bg-green-100 text-green-700';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!users?.length) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <span className="text-3xl">👥</span>
        </div>
        <p className="text-gray-500">No users found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Stats</th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map((user, index) => (
            <motion.tr
              key={user.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="hover:bg-gray-50 transition"
            >
              <td className="px-6 py-4">
                <div>
                  <p className="font-medium text-gray-800">{user.username}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </td>
              
              <td className="px-6 py-4">
                <select
                  value={user.role}
                  onChange={(e) => onRoleChange(user.id, e.target.value)}
                  className={`text-xs px-2 py-1 rounded-full font-medium border-0 cursor-pointer ${getRoleBadgeColor(user.role)}`}
                >
                  <option value="Student">Student</option>
                  <option value="Instructor">Instructor</option>
                  <option value="Admin">Admin</option>
                </select>
              </td>
              
              <td className="px-6 py-4">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadgeColor(user.status)}`}>
                  {user.status || 'Active'}
                </span>
              </td>
              
              <td className="px-6 py-4 text-sm text-gray-500">
                {new Date(user.joinDate).toLocaleDateString()}
              </td>
              
              <td className="px-6 py-4 text-sm text-gray-500">
                {user.role === 'Instructor' ? (
                  <span>{user.totalCourses || 0} courses • {user.totalStudents || 0} students</span>
                ) : (
                  <span>{user.enrolledCourses || 0} enrolled</span>
                )}
              </td>
              
              <td className="px-6 py-4 text-right relative">
                <button
                  onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <HiDotsVertical size={16} className="text-gray-400" />
                </button>
                
                <AnimatePresence>
                  {openMenu === user.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-6 top-12 z-10 w-40 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden"
                    >
                      {user.status === 'Suspended' ? (
                        <button
                          onClick={() => { onActivate(user.id); setOpenMenu(null); }}
                          className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 flex items-center gap-2"
                        >
                          <HiCheckCircle size={14} /> Activate
                        </button>
                      ) : (
                        <button
                          onClick={() => { onSuspend(user.id); setOpenMenu(null); }}
                          className="w-full px-4 py-2 text-left text-sm text-orange-600 hover:bg-orange-50 flex items-center gap-2"
                        >
                          <HiBan size={14} /> Suspend
                        </button>
                      )}
                      <button
                        onClick={() => { onDelete(user.id); setOpenMenu(null); }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-100"
                      >
                        <HiTrash size={14} /> Delete
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
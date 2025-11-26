import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);

  // Task modal states
  const [selectedUser, setSelectedUser] = useState(null); // object to display tasks
  const [userTasks, setUserTasks] = useState([]);
  const [taskLoading, setTaskLoading] = useState(false);

  // Promote confirmation modal states
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [promoteUserId, setPromoteUserId] = useState(null);
  const [adminPassword, setAdminPassword] = useState("");

  // Toast
  const [toast, setToast] = useState("");

  useEffect(() => {
    loadUsers();
  }, [reload]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      showToast("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // View tasks for selected user (modal)
  const viewTasks = async (user) => {
    setSelectedUser(user);
    setTaskLoading(true);

    try {
      const res = await api.get(`/users/${user._id}/tasks`);
      setUserTasks(res.data);
    } catch (err) {
      console.error(err);
      showToast("Failed to load tasks");
    } finally {
      setTaskLoading(false);
    }
  };

  const closeTasksModal = () => {
    setSelectedUser(null);
    setUserTasks([]);
  };

  // Delete user
  const deleteUser = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/users/${id}`);
      showToast("User deleted");
      setReload((r) => !r);
    } catch (err) {
      console.error(err);
      showToast("Error deleting user");
    }
  };

  // Open promote modal (asks admin to enter their password)
  const openPromoteModal = (userId) => {
    setPromoteUserId(userId);
    setAdminPassword("");
    setShowPromoteModal(true);
  };

  // Confirm promote (calls backend with admin's password)
  const confirmPromote = async () => {
    if (!adminPassword || adminPassword.trim() === "") {
      showToast("Please enter your password");
      return;
    }

    try {
      const res = await api.put(`/users/${promoteUserId}/promote`, {
        password: adminPassword,
      });

      showToast(res.data?.message || "User promoted");
      setShowPromoteModal(false);
      setPromoteUserId(null);
      setAdminPassword("");
      setReload((r) => !r);
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        "Wrong password. Please enter correct password.";
      showToast(msg);
    }
  };

  // Utility: show toast (auto-hide after 2.2s)
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2200);
  };

  return (
    <div className="card relative">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded shadow-lg animate-fade-in z-50">
          {toast}
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {loading ? (
        <div>Loading users...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-fixed min-w-full">
            <thead className="bg-gray-200 dark:bg-gray-700 dark:text-gray-200">
              <tr>
                <th className="p-2 border dark:border-gray-600">Name</th>
                <th className="p-2 border dark:border-gray-600">Email</th>
                <th className="p-2 border dark:border-gray-600">Role</th>
                <th className="p-2 border dark:border-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u._id}
                  className="text-center border dark:border-gray-700 dark:bg-gray-800"
                >
                  <td className="p-2 border dark:border-gray-700">{u.name}</td>
                  <td className="p-2 border dark:border-gray-700">{u.email}</td>
                  <td className="p-2 border dark:border-gray-700 capitalize">
                    {u.role}
                  </td>
                  <td className="p-2 border dark:border-gray-700 space-x-2">
                    {/* VIEW TASKS BUTTON */}
                    <button
                      onClick={() => viewTasks(u)}
                      className="px-3 py-1 bg-blue-600 text-white rounded"
                    >
                      View Tasks
                    </button>

                    {/* Promote Button */}
                    {u.role !== "admin" && (
                      <button
                        onClick={() => openPromoteModal(u._id)}
                        className="px-3 py-1 bg-green-500 text-white rounded"
                      >
                        Promote
                      </button>
                    )}

                    {/* Delete Button */}
                    <button
                      onClick={() => deleteUser(u._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TASKS MODAL */}
      {selectedUser && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-40"
          onClick={closeTasksModal}
        >
          <div
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-[80%] max-w-3xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-3">
              Tasks by {selectedUser.name}
            </h2>

            {taskLoading ? (
              <div>Loading tasks...</div>
            ) : userTasks.length === 0 ? (
              <div className="text-gray-500 dark:text-gray-300">
                No tasks created yet.
              </div>
            ) : (
              <div className="space-y-3">
                {userTasks.map((task) => (
                  <div
                    key={task._id}
                    className="p-3 border rounded bg-gray-100 dark:bg-gray-700"
                  >
                    <h3 className="font-bold">{task.title}</h3>
                    <p className="text-sm">{task.description}</p>

                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      <p>
                        Created: {new Date(task.createdAt).toLocaleString()}
                      </p>
                      <p>
                        Updated: {new Date(task.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="text-right mt-4">
              <button
                onClick={closeTasksModal}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROMOTE CONFIRMATION MODAL */}
      {showPromoteModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowPromoteModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-3">
              Confirm Promotion (Enter your password)
            </h3>

            <input
              type="password"
              placeholder="Your password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            />

            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => {
                  setShowPromoteModal(false);
                  setPromoteUserId(null);
                }}
                className="px-3 py-1 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>

              <button
                onClick={confirmPromote}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

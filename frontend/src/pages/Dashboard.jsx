import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, createTask, updateTask, deleteTask } from '../store/slices/taskSlice';
import { logout } from '../store/slices/authSlice';

export default function Dashboard() {
  const dispatch = useDispatch();
  const tasksState = useSelector((s) => s.tasks);
  const auth = useSelector((s) => s.auth);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    if (auth.token) dispatch(fetchTasks());
  }, [dispatch, auth.token]);

  const add = async (e) => {
    e.preventDefault();
    if (!title) return;
    try {
      await dispatch(createTask({ title, description: desc })).unwrap();
      setTitle(''); setDesc('');
    } catch (err) {
      alert('Failed to create task');
    }
  };

  const startEdit = (task) => {
    setEditing(task);
    setTitle(task.title); setDesc(task.description || '');
  };

  const saveEdit = async () => {
    try {
      await dispatch(updateTask({ id: editing._id, data: { title, description: desc } })).unwrap();
      setEditing(null); setTitle(''); setDesc('');
    } catch (err) {
      alert('Failed to update task');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this task?')) return;
    try {
      await dispatch(deleteTask(id)).unwrap();
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Hello, {auth.user?.name}</h2>
          <div>
            <button onClick={() => dispatch(logout())} className="px-3 py-1 border rounded">Logout</button>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-2">Tasks</h3>
          {tasksState.tasks.length === 0 ? (
            <div className="text-muted">No tasks yet</div>
          ) : (
            tasksState.tasks.map((task) => (
              <div key={task._id} className="border-b py-2 flex justify-between items-center dark:border-gray-700">
                <div>
                  <div className="font-medium">{task.title}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{task.description}</div>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => startEdit(task)} className="px-2 py-1 border rounded">Edit</button>
                  <button onClick={() => remove(task._id)} className="px-2 py-1 border rounded text-red-600 dark:text-red-300">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-2">{editing ? 'Edit Task' : 'Create Task'}</h3>
        <form onSubmit={editing ? (e => { e.preventDefault(); saveEdit(); }) : add} className="space-y-3">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" />
          <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description" className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"></textarea>
          <div className="flex space-x-2">
            <button className="btn btn-primary">{editing ? 'Save' : 'Create'}</button>
            {editing && <button type="button" onClick={() => { setEditing(null); setTitle(''); setDesc(''); }} className="px-3 py-1 border rounded">Cancel</button>}
          </div>
        </form>
      </div>
    </div>
  );
}

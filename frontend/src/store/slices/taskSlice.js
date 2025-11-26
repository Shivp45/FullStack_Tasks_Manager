import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

const initialState = { tasks: [], status: 'idle', error: null };

export const fetchTasks = createAsyncThunk('tasks/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/tasks');
    return res.data;
  } catch (err) { return rejectWithValue(err.response?.data || err.message); }
});

export const createTask = createAsyncThunk('tasks/create', async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post('/tasks', payload);
    return res.data;
  } catch (err) { return rejectWithValue(err.response?.data || err.message); }
});

export const updateTask = createAsyncThunk('tasks/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/tasks/${id}`, data);
    return res.data;
  } catch (err) { return rejectWithValue(err.response?.data || err.message); }
});

export const deleteTask = createAsyncThunk('tasks/delete', async (id, { rejectWithValue }) => {
  try {
    const res = await api.delete(`/tasks/${id}`);
    return { id, message: res.data.message };
  } catch (err) { return rejectWithValue(err.response?.data || err.message); }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => { state.tasks = action.payload; state.status = 'succeeded'; })
      .addCase(createTask.fulfilled, (state, action) => { state.tasks.unshift(action.payload); })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.map(t => t._id === action.payload._id ? action.payload : t);
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(t => t._id !== action.payload.id);
      });
  }
});

export default taskSlice.reducer;

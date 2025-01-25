// const API_URL = 'http://localhost:5000/api';
const API_URL = 'https://task-social-app.onrender.com/api';

export const taskService = {
  // Create a new task
  createTask: async (taskData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(taskData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },

  // Get all tasks
  getTasks: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/tasks`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },

  // Update task status
  updateTaskStatus: async (taskId, status) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },

  // Delete task
  deleteTask: async (taskId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message);
    }
    return true;
  }
}; 
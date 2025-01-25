import React, { useState } from 'react';
import './TaskForm.css';

const TaskForm = ({ onCreateTask }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onCreateTask(formData);
      setFormData({ title: '', description: '' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-form">
      <h2>Create New Task</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Task Title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <textarea
            placeholder="Task Description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
            disabled={loading}
          />
        </div>
        <button 
          type="submit" 
          className="create-task-btn"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Task'}
        </button>
      </form>
    </div>
  );
};

export default TaskForm; 
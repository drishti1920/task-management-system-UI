import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { taskService } from '../../services/taskService';
import TaskColumn from './TaskColumn';
import TaskForm from './TaskForm';
import DeleteConfirmModal from './DeleteConfirmModal';
import './TaskBoard.css';

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteTask, setDeleteTask] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const fetchedTasks = await taskService.getTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (newTask) => {
    try {
      const createdTask = await taskService.createTask(newTask);
      setTasks([...tasks, createdTask]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMoveTask = async (taskId, newStatus) => {
    try {
      await taskService.updateTaskStatus(taskId, newStatus);
      const updatedTasks = tasks.map(task => 
        task._id === taskId ? { ...task, status: newStatus } : task
      );
      setTasks(updatedTasks);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteClick = (task) => {
    setDeleteTask(task);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await taskService.deleteTask(deleteTask._id);
      setTasks(tasks.filter(task => task._id !== deleteTask._id));
      setShowDeleteModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div className="error-message">{error}</div>;

  const getColumnTasks = (status) => tasks.filter(task => task.status === status);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="task-board">
        <TaskForm onCreateTask={handleCreateTask} />
        
        <div className="columns-container">
          <TaskColumn 
            title="Pending" 
            status="pending"
            tasks={getColumnTasks('pending')} 
            onMoveTask={handleMoveTask}
            onDeleteTask={handleDeleteClick}
          />
          <TaskColumn 
            title="In Progress" 
            status="in-progress"
            tasks={getColumnTasks('in-progress')} 
            onMoveTask={handleMoveTask}
            onDeleteTask={handleDeleteClick}
          />
          <TaskColumn 
            title="Completed" 
            status="completed"
            tasks={getColumnTasks('completed')} 
            onMoveTask={handleMoveTask}
            onDeleteTask={handleDeleteClick}
          />
        </div>

        {showDeleteModal && (
          <DeleteConfirmModal
            task={deleteTask}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setShowDeleteModal(false)}
          />
        )}
      </div>
    </DndProvider>
  );
};

export default TaskBoard; 
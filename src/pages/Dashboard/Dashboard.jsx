import React, { useState, useCallback, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './Dashboard.css';
import Navbar from '../../components/common/Navbar/Navbar';
import { taskService } from '../../services/taskService';
import TaskModal from '../../components/Tasks/TaskModal';

// Task Card Component
const TaskCard = ({ task, columnId, onDelete, moveTask }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK',
    item: { id: task._id, fromColumn: columnId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`task-card ${isDragging ? 'dragging' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <h4>{task.title}</h4>
      <p>{task.description}</p>
      <button 
        className="delete-btn"
        onClick={() => onDelete(columnId, task._id)}
      >
        Delete
      </button>
    </div>
  );
};

// Column Component
const Column = ({ title, tasks, columnId, onDrop, onDeleteTask }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'TASK',
    drop: (item) => onDrop(item.id, item.fromColumn, columnId),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div 
      ref={drop} 
      className={`column ${isOver ? 'drag-over' : ''}`}
    >
      <h3 className="column-title">{title}</h3>
      <div className="task-list">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            columnId={columnId}
            onDelete={onDeleteTask}
          />
        ))}
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const [columns, setColumns] = useState({
    pending: {
      id: 'pending',
      title: 'Pending',
      items: []
    },
    completed: {
      id: 'completed',
      title: 'Completed',
      items: []
    },
    done: {
      id: 'done',
      title: 'Done',
      items: []
    }
  });

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const tasks = await taskService.getTasks();
      // Organize tasks into columns
      const columnData = {
        pending: { id: 'pending', title: 'Pending', items: [] },
        completed: { id: 'completed', title: 'Completed', items: [] },
        done: { id: 'done', title: 'Done', items: [] }
      };

      tasks.forEach(task => {
        switch (task.status) {
          case 'pending':
            columnData.pending.items.push(task);
            break;
          case 'completed':
            columnData.completed.items.push(task);
            break;
          case 'done':
            columnData.done.items.push(task);
            break;
          default:
            columnData.pending.items.push(task);
        }
      });

      setColumns(columnData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const createdTask = await taskService.createTask(taskData);
      setColumns({
        ...columns,
        pending: {
          ...columns.pending,
          items: [...columns.pending.items, createdTask]
        }
      });
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteTask = async (columnId, taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(taskId);
        
        const column = columns[columnId];
        const updatedItems = column.items.filter(item => item._id !== taskId);
        
        setColumns({
          ...columns,
          [columnId]: {
            ...column,
            items: updatedItems
          }
        });
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleDrop = useCallback(async (taskId, sourceColumnId, targetColumnId) => {
    if (sourceColumnId === targetColumnId) return;

    try {
      const statusMap = {
        pending: 'pending',
        completed: 'completed',
        done: 'done'
      };

      await taskService.updateTaskStatus(taskId, statusMap[targetColumnId]);

      setColumns(prev => {
        const sourceColumn = prev[sourceColumnId];
        const targetColumn = prev[targetColumnId];
        const taskToMove = sourceColumn.items.find(item => item._id === taskId);

        return {
          ...prev,
          [sourceColumnId]: {
            ...sourceColumn,
            items: sourceColumn.items.filter(item => item._id !== taskId)
          },
          [targetColumnId]: {
            ...targetColumn,
            items: [...targetColumn.items, taskToMove]
          }
        };
      });
    } catch (err) {
      setError(err.message);
    }
  }, []);

  if (loading) return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div>Loading tasks...</div>
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <DndProvider backend={HTML5Backend}>
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h2>Task Management</h2>
            <button 
              className="add-task-btn"
              onClick={() => setIsModalOpen(true)}
            >
              Create Task
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          <TaskModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleCreateTask}
          />

          <div className="columns-container">
            {Object.values(columns).map((column) => (
              <Column
                key={column.id}
                title={column.title}
                tasks={column.items}
                columnId={column.id}
                onDrop={handleDrop}
                onDeleteTask={handleDeleteTask}
              />
            ))}
          </div>
        </div>
      </DndProvider>
    </>
  );
};

export default Dashboard; 
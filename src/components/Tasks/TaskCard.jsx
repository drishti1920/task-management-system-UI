import React from 'react';
import { useDrag } from 'react-dnd';
import { FaTrash } from 'react-icons/fa';
import './TaskCard.css';

const TaskCard = ({ task, onDelete }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id: task._id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div 
      ref={drag}
      className={`task-card ${isDragging ? 'dragging' : ''}`}
    >
      <div className="task-content">
        <h4>{task.title}</h4>
        <p>{task.description}</p>
      </div>
      <button 
        className="delete-btn"
        onClick={onDelete}
        title="Delete task"
      >
        <FaTrash />
      </button>
    </div>
  );
};

export default TaskCard; 
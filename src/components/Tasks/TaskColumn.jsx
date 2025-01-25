import React from 'react';
import { useDrop } from 'react-dnd';
import TaskCard from './TaskCard';
import './TaskColumn.css';

const TaskColumn = ({ title, status, tasks, onMoveTask, onDeleteTask }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'TASK',
    drop: (item) => {
      onMoveTask(item.id, status);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div 
      ref={drop} 
      className={`task-column ${isOver ? 'drag-over' : ''}`}
    >
      <h3>{title}</h3>
      <div className="task-list">
        {tasks.map((task) => (
          <TaskCard 
            key={task._id}
            task={task}
            onDelete={() => onDeleteTask(task)}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskColumn; 
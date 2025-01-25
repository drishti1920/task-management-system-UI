import React from 'react';
import './DeleteConfirmModal.css';

const DeleteConfirmModal = ({ task, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Delete Task</h3>
        <p>Are you sure you want to delete "{task.title}"?</p>
        <p className="warning-text">This action cannot be undone.</p>
        <div className="modal-actions">
          <button 
            className="cancel-btn"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            className="delete-btn"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal; 
import React, { useState } from 'react';
import { TaskType } from '../../types/Task';
import './TaskCard.scss';

interface TaskCardProps {
  task: TaskType;
  isOverdue: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, isOverdue }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className={`task-card ${isOverdue ? 'overdue' : ''} ${isEditing ? 'editing' : ''}`}>
      {isEditing ? (
        <div>
          <input type="text" defaultValue={task.text} />
          <button onClick={() => setIsEditing(false)}>✔</button>
        </div>
      ) : (
        <div>
          <p>Начало: {new Date(task.startDay).toLocaleDateString()}</p>
          <p>Окончание: {new Date(task.endDay).toLocaleDateString()}</p>
          <p>Описание: {task.text}</p>
          <button onClick={() => setIsEditing(true)}>✏</button>
        </div>
      )}
    </div>
  );
};

export default TaskCard;

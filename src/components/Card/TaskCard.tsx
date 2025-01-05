import React, { useState } from 'react';
import { TaskType } from '../../types/Task';
import './TaskCard.scss';

interface TaskCardProps {
  task: TaskType;
  isOverdue: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, isOverdue }) => {
  const [isEditing, setIsEditing] = useState(false);

  // Функция форматирования даты в формат dd.mm.yyyy
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <div className={`task-card ${isOverdue ? 'overdue' : ''} ${isEditing ? 'editing' : ''}`}>
      {isEditing ? (
        <div>
          <input type="text" defaultValue={task.text} />
          <button onClick={() => setIsEditing(false)}>✔</button>
        </div>
      ) : (
        <div>
          <p>Начало: {formatDate(task.startDay)}</p>
          <p>Окончание: {formatDate(task.endDay)}</p>
          <p>Описание: {task.text}</p>
          <button onClick={() => setIsEditing(true)}>✏</button>
        </div>
      )}
    </div>
  );
};

export default TaskCard;

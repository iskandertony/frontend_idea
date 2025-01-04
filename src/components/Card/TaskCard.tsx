import React from 'react';
import { TaskType } from '../../types/Task';
import './TaskCard.scss';

type TaskCardProps = {
  task: TaskType;
  isOverdue: boolean;
};

const TaskCard: React.FC<TaskCardProps> = ({ task, isOverdue }) => {
  return (
    <div className={`task-card ${isOverdue ? 'overdue' : ''}`}>
      <p>{task.text}</p>
      <span>
        Start: {new Date(task.startDay).toLocaleDateString()} - End: {new Date(task.endDay).toLocaleDateString()}
      </span>
    </div>
  );
};

export default TaskCard;

import React from 'react';
import './TaskSearch.scss';

interface TaskSearchProps {
  onSearch: (query: string) => void;
}

const TaskSearch: React.FC<TaskSearchProps> = ({ onSearch }) => {
  return (
    <div className="task-search">
      <input
        type="text"
        placeholder="&#128269; Search tasks..." // Добавляем иконку прямо в placeholder
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};

export default TaskSearch;

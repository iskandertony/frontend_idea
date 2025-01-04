import React from 'react';
import { Button } from 'antd';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import TaskCard from '../Card/TaskCard';
import SortableTaskCard from '../Card-sort/SortableTaskCard'; // Вынесли в отдельный компонент
import { TaskType } from '../../types/Task';
import './Column.scss';

interface ColumnProps {
  status: TaskType['type'];
  tasks: TaskType[];
  onAddTask: () => void;
}

const Column: React.FC<ColumnProps> = ({ status, tasks, onAddTask }) => {
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <div className="kanban-column" ref={setNodeRef}>
      <h2 className="column-title">
        <span role="img" aria-label="status-icon">
          {status === 'todo' ? '📝' : status === 'in_progress' ? '🚧' : status === 'review' ? '🔍' : '✅'}
        </span>{' '}
        {status.replace('_', ' ').toUpperCase()}
      </h2>
      <SortableContext items={tasks.map((task) => task.id.toString())}>
        <div className="task-list">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <SortableTaskCard key={task.id} task={task} />
            ))
          ) : (
            <div className="empty-placeholder">Drop tasks here</div>
          )}
        </div>
      </SortableContext>
      <Button type="primary" block onClick={onAddTask}>
        + Add Task
      </Button>
    </div>
  );
};

export default Column;

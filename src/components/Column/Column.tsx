import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import SortableTaskCard from '../Card-sort/SortableTaskCard';
import TrashBin from '../Trash-bin/TrashBin';
import { TaskType } from '../../types/Task';
import './Column.scss';

interface ColumnProps {
  status: TaskType['type'];
  tasks: TaskType[];
  onAddTask?: () => void;
  onClearDone?: () => void;
}

const Column: React.FC<ColumnProps> = ({ status, tasks, onAddTask, onClearDone }) => {
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <div className="kanban-column" ref={setNodeRef}>
      <div className="column-header">
        <div className="column-title">{status.replace('_', ' ').toUpperCase()}</div>
        {status === 'done' && onClearDone && <TrashBin onClearDone={onClearDone} />}
        {status === 'todo' && onAddTask && (
          <div className="add-task" onClick={onAddTask}>
            + Добавить
          </div>
        )}
      </div>


      <SortableContext items={tasks.map((task) => task.id.toString())}>
        <div className="task-list">
          {tasks.length > 0 ? (
            tasks.map((task) => <SortableTaskCard key={task.id} task={task} />)
          ) : (
            <div className="empty-placeholder">Drop tasks here</div>
          )}
        </div>
      </SortableContext>
    </div>
  );
};

export default Column;

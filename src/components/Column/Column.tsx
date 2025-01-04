import React from 'react';
import { Button } from 'antd';
import { useSortable } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskCard from '../Card/TaskCard';
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
      <h2 className="column-title">{status.replace('_', ' ').toUpperCase()}</h2>
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

const SortableTaskCard: React.FC<{ task: TaskType }> = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task.id.toString(),
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: transform ? 100 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} isOverdue={task.endDay < Date.now() && task.type !== 'done'} />
    </div>
  );
};

export default Column;

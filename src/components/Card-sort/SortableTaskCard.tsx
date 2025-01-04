import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskCard from '../Card/TaskCard';
import { TaskType } from '../../types/Task';
import './SortableTaskCard.scss'; // Подключим стили

interface SortableTaskCardProps {
  task: TaskType;
}

const SortableTaskCard: React.FC<SortableTaskCardProps> = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id.toString(),
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`sortable-task-card ${isDragging ? 'dragging' : ''}`}
      {...attributes}
      {...listeners}
    >
      <TaskCard task={task} isOverdue={task.endDay < Date.now() && task.type !== 'done'} />
    </div>
  );
};

export default SortableTaskCard;

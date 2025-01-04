import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskCard from '../Card/TaskCard';
import { TaskType } from '../../types/Task';

interface SortableTaskCardProps {
  task: TaskType;
}

const SortableTaskCard: React.FC<SortableTaskCardProps> = ({ task }) => {
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

export default SortableTaskCard;

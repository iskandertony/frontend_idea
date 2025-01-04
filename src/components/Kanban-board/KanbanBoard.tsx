import React, { useState } from 'react';
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import tasksDataRaw from '../../data/tasks.json';
import { TaskType } from '../../types/Task';
import TaskCard from '../Card/TaskCard';
import './KanbanBoard.scss';

const initialColumns: TaskType['type'][] = ['todo', 'in_progress', 'review', 'done'];

const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState<TaskType[]>(tasksDataRaw as TaskType[]);
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);

  const tasksByType = (type: TaskType['type']) => {
    return tasks.filter((task) => task.type === type).sort((a, b) => a.startDay - b.startDay);
  };

  const handleDragStart = (event: any) => {
    const activeTask = tasks.find((task) => task.id.toString() === event.active.id);
    setActiveTask(activeTask || null);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    setActiveTask(null); // Сбрасываем активный элемент

    if (!over) return;

    const activeTask = tasks.find((task) => task.id.toString() === active.id);
    const overTask = tasks.find((task) => task.id.toString() === over.id);

    if (activeTask && overTask && activeTask.type !== overTask.type) {
      activeTask.type = overTask.type as TaskType['type'];
      setTasks([...tasks]);
    }
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="kanban-board">
        {initialColumns.map((status) => (
          <SortableContext
            key={status}
            items={tasksByType(status).map((task) => task.id.toString())}
            strategy={verticalListSortingStrategy}
          >
            <div className="kanban-column">
              <h2 className="column-title">{status.replace('_', ' ').toUpperCase()}</h2>
              <div className="task-list">
                {tasksByType(status).map((task) => (
                  <SortableTaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          </SortableContext>
        ))}
      </div>

      {/* DragOverlay для визуальной обратной связи */}
      <DragOverlay>
        {activeTask ? (
          <div className="drag-overlay">
            <TaskCard task={activeTask} isOverdue={activeTask.endDay < Date.now() && activeTask.type !== 'done'} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

const SortableTaskCard: React.FC<{ task: TaskType }> = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id.toString(),
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1, // Скрываем оригинальную карточку, если она перетаскивается
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="task-card"
    >
      <TaskCard
        task={task}
        isOverdue={task.endDay < Date.now() && task.type !== 'done'}
      />
    </div>
  );
};

export default KanbanBoard;

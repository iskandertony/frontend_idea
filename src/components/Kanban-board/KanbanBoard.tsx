import React, { useState } from 'react';
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core'; // Импортируем useDroppable
import tasksDataRaw from '../../data/tasks.json';
import { TaskType } from '../../types/Task';
import Column from '../Column/Column';
import AddTaskModal from '../Add-task-modal/AddTaskModal';
import TaskCard from '../Card/TaskCard';
import './KanbanBoard.scss';
import { DeleteOutlined } from '@ant-design/icons';

const initialColumns: TaskType['type'][] = ['todo', 'in_progress', 'review', 'done'];

const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState<TaskType[]>(tasksDataRaw as TaskType[]);
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentColumn, setCurrentColumn] = useState<TaskType['type'] | null>(null);

  const tasksByType = (type: TaskType['type']) => {
    return tasks.filter((task) => task.type === type).sort((a, b) => a.startDay - b.startDay);
  };

  const handleDragStart = (event: any) => {
    const activeTask = tasks.find((task) => task.id.toString() === event.active.id);
    setActiveTask(activeTask || null);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    setActiveTask(null);

    if (!over) {
      console.warn('Task was dropped outside of any valid column or trash bin.');
      return;
    }

    if (over.id === 'trash-bin') {
      console.log(`Deleting task ${active.id}...`);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id.toString() !== active.id));
      return;
    }

    let overColumn: TaskType['type'] | undefined = initialColumns.find((col) => col === over.id);

    if (!overColumn) {
      const overTask = tasks.find((task) => task.id.toString() === over.id);
      overColumn = overTask?.type;
    }

    if (!overColumn) {
      console.warn('Task dropped outside of valid column.');
      return;
    }

    const activeTask = tasks.find((task) => task.id.toString() === active.id);
    if (activeTask && overColumn !== activeTask.type) {
      console.log(`Moving task ${activeTask.id} to column ${overColumn}`);
      activeTask.type = overColumn;
      setTasks([...tasks]);
    }
  };

  const handleAddTask = (taskText: string, endDay: string) => {
    if (currentColumn) {
      const newTask: TaskType = {
        id: tasks.length + 1,
        type: currentColumn,
        startDay: Date.now(),
        endDay: new Date(endDay).getTime(),
        text: taskText,
      };
      setTasks([...tasks, newTask]);
    }
    setModalVisible(false);
  };

  const TrashBin: React.FC = () => {
    const { setNodeRef } = useDroppable({ id: 'trash-bin' });

    return (
      <div className="trash-bin" ref={setNodeRef}>
        <DeleteOutlined style={{ fontSize: 48, color: 'red', cursor: 'pointer' }} />
      </div>
    );
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
            <Column
              status={status}
              tasks={tasksByType(status)}
              onAddTask={() => {
                setCurrentColumn(status);
                setModalVisible(true);
              }}
            />
          </SortableContext>
        ))}

        {/* Корзина для удаления */}
        <TrashBin />
      </div>

      <DragOverlay>
        {activeTask ? (
          <TaskCard
            task={activeTask}
            isOverdue={activeTask.endDay < Date.now() && activeTask.type !== 'done'}
          />
        ) : null}
      </DragOverlay>

      <AddTaskModal
        visible={modalVisible}
        onAdd={handleAddTask}
        onCancel={() => setModalVisible(false)}
      />
    </DndContext>
  );
};

export default KanbanBoard;

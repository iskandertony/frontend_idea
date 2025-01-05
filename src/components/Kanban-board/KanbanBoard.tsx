import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import tasksDataRaw from '../../data/tasks.json';
import { TaskType } from '../../types/Task';
import Column from '../Column/Column';
import AddTaskModal from '../Add-task-modal/AddTaskModal';
import SortableTaskCard from '../Card-sort/SortableTaskCard';
import TaskSearch from '../Search/TaskSearch';
import './KanbanBoard.scss';

const initialColumns: TaskType['type'][] = ['todo', 'in_progress', 'review', 'done'];

const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<TaskType[]>([]);
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentColumn, setCurrentColumn] = useState<TaskType['type'] | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Инициализация задач
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    const parsedTasks = savedTasks ? JSON.parse(savedTasks) : null;

    if (parsedTasks && parsedTasks.length > 0) {
      setTasks(parsedTasks);
      setFilteredTasks(parsedTasks);
    } else {
      localStorage.setItem('tasks', JSON.stringify(tasksDataRaw));
      setTasks(tasksDataRaw as TaskType[]);
      setFilteredTasks(tasksDataRaw as TaskType[]);
    }
  }, []);

  // Сохранение задач в localStorage при их изменении
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  // Фильтрация задач
  useEffect(() => {
    if (searchQuery === '') {
      setFilteredTasks(tasks);
      return;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();

    // Проверка на формат даты dd.mm.yyyy
    if (/\d{2}\.\d{2}\.\d{4}/.test(searchQuery)) {
      const [day, month, year] = searchQuery.split('.');
      const queryDate = new Date(`${year}-${month}-${day}`).getTime();

      setFilteredTasks(
        tasks.filter(
          (task) =>
            task.startDay === queryDate ||
            task.endDay === queryDate ||
            task.text.toLowerCase().includes(lowerCaseQuery)
        )
      );
    } else {
      // Фильтрация по описанию
      setFilteredTasks(
        tasks.filter((task) => task.text.toLowerCase().includes(lowerCaseQuery))
      );
    }
  }, [searchQuery, tasks]);

  const tasksByType = (type: TaskType['type']) =>
    filteredTasks.filter((task) => task.type === type).sort((a, b) => a.startDay - b.startDay);

  const handleDragStart = (event: any) => {
    const active = tasks.find((task) => task.id.toString() === event.active.id);
    setActiveTask(active || null);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    setActiveTask(null);

    if (!over) return;

    if (over.id === 'trash-bin') {
      setTasks((prev) => prev.filter((task) => task.id.toString() !== active.id));
      return;
    }

    const overColumn = initialColumns.find((col) => col === over.id) || tasks.find((task) => task.id.toString() === over.id)?.type;
    if (!overColumn) return;

    setTasks((prev) =>
      prev.map((task) =>
        task.id.toString() === active.id ? { ...task, type: overColumn } : task
      )
    );
  };

  const handleAddTask = (taskText: string, endDay: string) => {
    if (!currentColumn) return;

    const newTask: TaskType = {
      id: tasks.length + 1,
      type: currentColumn,
      startDay: Date.now(),
      endDay: new Date(endDay).getTime(),
      text: taskText,
    };

    setTasks((prev) => [...prev, newTask]);
    setModalVisible(false);
  };

  const clearDoneTasks = () => {
    setTasks((prev) => prev.filter((task) => task.type !== 'done'));
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="header">
        <div className="header-title">
          Your tasks
        </div>
        <TaskSearch onSearch={setSearchQuery} />
      </div>

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
              onAddTask={status === 'todo' ? () => {
                setCurrentColumn(status);
                setModalVisible(true);
              } : undefined}
              onClearDone={status === 'done' ? clearDoneTasks : undefined}
            />
          </SortableContext>
        ))}
      </div>

      <DragOverlay>
        {activeTask && <SortableTaskCard task={activeTask} />}
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

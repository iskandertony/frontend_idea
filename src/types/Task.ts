export type TaskType = {
  id: number;
  type: 'todo' | 'in_progress' | 'review' | 'done';
  startDay: number;
  endDay: number;
  text: string;
};

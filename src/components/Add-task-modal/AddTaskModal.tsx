import React, { useState } from 'react';
import { Modal, Input, DatePicker, Form } from 'antd';

interface AddTaskModalProps {
  visible: boolean;
  onAdd: (taskText: string, endDay: string) => void;
  onCancel: () => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ visible, onAdd, onCancel }) => {
  const [taskText, setTaskText] = useState('');
  const [endDay, setEndDay] = useState<string | null>(null);

  const handleAdd = () => {
    if (taskText && endDay) {
      onAdd(taskText, endDay);
      setTaskText('');
      setEndDay(null);
    }
  };

  return (
    <Modal title="Add New Task" visible={visible} onOk={handleAdd} onCancel={onCancel}>
      <Form layout="vertical">
        <Form.Item label="Task Description">
          <Input
            placeholder="Enter task description"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Deadline">
          <DatePicker
            style={{ width: '100%' }}
            onChange={(date, dateString) => setEndDay(Array.isArray(dateString) ? dateString[0] : dateString)}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddTaskModal;

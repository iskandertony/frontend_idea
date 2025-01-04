import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { DeleteOutlined } from '@ant-design/icons';
import './TrashBin.scss';

const TrashBin: React.FC = () => {
  const { setNodeRef } = useDroppable({ id: 'trash-bin' });

  return (
    <div className="trash-bin" ref={setNodeRef}>
      <DeleteOutlined style={{ fontSize: 48, color: 'red', cursor: 'pointer' }} />
    </div>
  );
};

export default TrashBin;

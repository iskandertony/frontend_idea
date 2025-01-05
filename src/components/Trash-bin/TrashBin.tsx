import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { DeleteOutlined } from '@ant-design/icons';
import './TrashBin.scss';

interface TrashBinProps {
  onClearDone: () => void; // Пропс для удаления всех задач в колонке "done"
}

const TrashBin: React.FC<TrashBinProps> = ({ onClearDone }) => {
  const { setNodeRef } = useDroppable({ id: 'trash-bin' });

  return (
    <div className="trash-bin" ref={setNodeRef} onClick={onClearDone}>
      <DeleteOutlined style={{ fontSize: 20, color: 'white', cursor: 'pointer' }} />
    </div>
  );
};

export default TrashBin;

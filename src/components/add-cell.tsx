import './add-cell.css';
import { useActions } from '../hooks/use-actions';

interface AddCellProps {
  nextCellId: string | null;
}

const AddCell: React.FC<AddCellProps> = ({ nextCellId }) => {
  const { insertCellBefore } = useActions();

  return (
    <div>
      <button
        onClick={() =>
          insertCellBefore({
            id: nextCellId,
            type: 'code',
          })
        }
      >
        Code
      </button>
      <button
        onClick={() =>
          insertCellBefore({
            id: nextCellId,
            type: 'text',
          })
        }
      >
        Text
      </button>
    </div>
  );
};

export default AddCell;

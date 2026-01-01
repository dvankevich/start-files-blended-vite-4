// src/components/Todo/Todo.jsx
import Text from '../Text/Text';
import { RiDeleteBinLine, RiEdit2Line } from 'react-icons/ri';
import style from './Todo.module.css';
import { useDispatch } from 'react-redux';
import { deleteTodo } from '../../redux/todoSlice';
import { setCurrentTodo } from '../../redux/todoSlice';

const Todo = ({ id, counter, text }) => {
  const dispatch = useDispatch();

  return (
    <div className={style.box}>
      <Text textAlign="center" marginBottom="20">
        TODO #{counter}
      </Text>
      <Text>{text}</Text>
      <button
        className={style.deleteButton}
        type="button"
        onClick={() => dispatch(deleteTodo(id))}
      >
        <RiDeleteBinLine size={24} />
      </button>
      <button
        className={style.editButton}
        type="button"
        onClick={() => dispatch(setCurrentTodo({ id, text }))}
      >
        <RiEdit2Line size={24} />
      </button>
    </div>
  );
};

export default Todo;

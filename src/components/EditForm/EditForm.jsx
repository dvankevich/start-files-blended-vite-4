// src/components/EditForm/EditForm.jsx
import { RiSaveLine } from 'react-icons/ri';
import { MdOutlineCancel } from 'react-icons/md';
import style from './EditForm.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { editTodo, cancelEdit } from '../../redux/todoSlice';
import { selectCurrentTodo } from '../../redux/selectors';
import { useState } from 'react';

const EditForm = () => {
  const dispatch = useDispatch();
  const currentTodo = useSelector(selectCurrentTodo);
  const [text, setText] = useState(currentTodo?.text || '');

  const handleSubmit = e => {
    e.preventDefault();
    if (text.trim()) {
      dispatch(editTodo({ id: currentTodo.id, text }));
    }
  };

  const handleCancel = () => {
    dispatch(cancelEdit());
  };

  const handleChange = e => {
    setText(e.target.value);
  };

  return (
    <form className={style.form} onSubmit={handleSubmit}>
      <input
        className={style.input}
        placeholder="What do you want to write?"
        name="text"
        required
        value={text}
        onChange={handleChange}
        autoFocus
      />
      <button className={style.submitButton} type="submit">
        <RiSaveLine color="green" size="16px" />
      </button>
      <button className={style.editButton} type="button" onClick={handleCancel}>
        <MdOutlineCancel color="red" size="16px" />
      </button>
    </form>
  );
};

export default EditForm;

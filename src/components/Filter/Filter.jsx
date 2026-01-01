// src/components/Filter/Filter.jsx
import style from './Filter.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter } from '../../redux/filterSlice';
import { selectFilter } from '../../redux/selectors';

const Filter = () => {
  const dispatch = useDispatch();
  const filter = useSelector(selectFilter);

  const handleChange = e => {
    dispatch(setFilter(e.target.value));
  };

  return (
    <input
      className={style.input}
      placeholder="Find it"
      name="filter"
      value={filter}
      onChange={handleChange}
    />
  );
};

export default Filter;

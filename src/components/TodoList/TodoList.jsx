// src/components/TodoList/TodoList.jsx
import Todo from '../Todo/Todo';
import Text from '../Text/Text';
import { useSelector } from 'react-redux';
import Grid from '../Grid/Grid';
import GridItem from '../GridItem/GridItem';
import { selectFilteredTodos } from '../../redux/selectors';

const TodoList = () => {
  const filteredItems = useSelector(selectFilteredTodos);

  if (!filteredItems.length) {
    return <Text textAlign="center">We did not find any todo😯</Text>;
  }

  return (
    <Grid>
      {filteredItems.map((todo, index) => (
        <GridItem key={todo.id}>
          <Todo id={todo.id} counter={index + 1} text={todo.text} />
        </GridItem>
      ))}
    </Grid>
  );
};

export default TodoList;

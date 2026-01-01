// src/App.jsx
import Container from './components/Container/Container';
import Header from './components/Header/Header';
import Section from './components/Section/Section';
import Form from './components/Form/Form';
import TodoList from './components/TodoList/TodoList';
import Filter from './components/Filter/Filter';
import EditForm from './components/EditForm/EditForm';
import { useSelector } from 'react-redux';
import { selectCurrentTodo } from './redux/selectors';

export const App = () => {
  const currentTodo = useSelector(selectCurrentTodo);
  const isEdit = !!currentTodo;
  return (
    <>
      <Header />
      <Section>
        <Container>
          {isEdit ? <EditForm /> : <Form />}
          <Filter />
          <TodoList />
        </Container>
      </Section>
    </>
  );
};

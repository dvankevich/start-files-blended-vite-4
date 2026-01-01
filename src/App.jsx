// src/App.jsx
import Container from './components/Container/Container';
import Header from './components/Header/Header';
import Section from './components/Section/Section';
import Form from './components/Form/Form';
import TodoList from './components/TodoList/TodoList';
// Filter in Step 3, EditForm in Step 4

export const App = () => {
  return (
    <>
      <Header />
      <Section>
        <Container>
          <Form />
          <TodoList />
        </Container>
      </Section>
    </>
  );
};

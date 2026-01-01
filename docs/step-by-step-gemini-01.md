### Step-by-Step Instructions for Refactoring the TODO List App with Redux Toolkit

Below is a detailed, step-by-step guide to refactor the provided starting repository (`dvankevich/start-files-blended-vite-4`) into a fully functional TODO List app using Redux Toolkit. The guide assumes you have the repository cloned locally and are working in a code editor. I'll include code examples for each step, focusing on the key changes. The refactoring will add Redux for state management, persist data in local storage, and implement add, delete, edit, and filter functionalities.

Key assumptions based on the starting code analysis:
- The app is a basic React setup with Vite, using CSS modules and components like `Form`, `EditForm`, `Todo`, `TodoList`, `Filter`, etc.
- Currently, there's no state management; the app just renders a placeholder message.
- We'll integrate Redux into `src/main.jsx` and connect components like `App`, `Form`, `EditForm`, `Filter`, `TodoList`, and `Todo`.
- Use hooks like `useSelector` and `useDispatch` for Redux integration.
- Icons (e.g., `RiDeleteBinLine`, `RiEdit2Line`) are already available via `react-icons`.
- The `counter` prop in `<Todo/>` refers to the todo's index or position (e.g., "TODO #1").
- We'll create a new folder `src/redux` for slices and store.

---

#### **Preparation: Install Dependencies**
Run the following command in the project root to install the required packages:

```bash
npm install @reduxjs/toolkit react-redux redux-persist
```

This adds Redux Toolkit for state management, React-Redux for integration, and Redux-Persist for local storage persistence.

---

#### **Step 1: Set Up the Redux Store and Todo Slice**
- Create a Redux store using `configureStore()` from Redux Toolkit.
- Create a `todoSlice` to manage the `todos` part of the state: `{ todos: { items: [] } }`.
- For now, we'll add placeholders for reducers (add, delete, edit) – we'll implement them in later steps.
- Wrap the app in `Provider` from `react-redux`.

1. Create a new folder `src/redux`.

2. In `src/redux/todoSlice.js`, create the slice:

```jsx
// src/redux/todoSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  // We'll add currentTodo in Step 4
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    // Placeholder reducers – implement in later steps
    addTodo: (state, action) => {
      // To be implemented in Step 2
    },
    deleteTodo: (state, action) => {
      // To be implemented in Step 2
    },
    // editTodo and setCurrentTodo to be added in Step 4
  },
});

export const { addTodo, deleteTodo } = todoSlice.actions;
export const todoReducer = todoSlice.reducer;
```

3. In `src/redux/store.js`, set up the store (basic version; we'll add persistence in Step 2):

```jsx
// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import { todoReducer } from './todoSlice';
// Import filterReducer in Step 3

export const store = configureStore({
  reducer: {
    todos: todoReducer,
    // Add filter in Step 3
  },
});
```

4. Update `src/main.jsx` to wrap the app in `Provider`:

```jsx
// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.jsx';
import 'modern-normalize/modern-normalize.css';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './redux/store'; // Import the store

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
```

---

#### **Step 2: Implement Add, Delete, and Persistence**
- Implement `addTodo` and `deleteTodo` reducers in `todoSlice`.
- For `addTodo`, generate a unique ID (use `nanoid` from Redux Toolkit or a simple timestamp).
- For persistence, use `redux-persist` to save `todos.items` to local storage.
- Connect the `<Form/>` component to dispatch `addTodo`.
- Update `<Todo/>` to dispatch `deleteTodo` on delete button click.
- Update `<TodoList/>` to render a list of `<Todo/>` from Redux state.
- Update `<App/>` to render `<Form/>`, `<TodoList/>`, etc.

1. Install `nanoid` for IDs (optional but recommended):

```bash
npm install nanoid
```

2. Update `src/redux/todoSlice.js` with reducers:

```jsx
// src/redux/todoSlice.js
import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action) => {
      const newTodo = {
        id: nanoid(),
        text: action.payload,
      };
      state.items.push(newTodo);
    },
    deleteTodo: (state, action) => {
      state.items = state.items.filter(todo => todo.id !== action.payload);
    },
    // Edit in Step 4
  },
});

export const { addTodo, deleteTodo } = todoSlice.actions;
export const todoReducer = todoSlice.reducer;
```

3. Update `src/redux/store.js` with persistence (use the provided config link):

```jsx
// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import { todoReducer } from './todoSlice';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Persist config for todos.items
const todosPersistConfig = {
  key: 'todos',
  storage,
  whitelist: ['items'], // Only persist 'items'
};

export const store = configureStore({
  reducer: {
    todos: persistReducer(todosPersistConfig, todoReducer),
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
```

4. Update `src/main.jsx` to include `PersistGate`:

```jsx
// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.jsx';
import 'modern-normalize/modern-normalize.css';
import './index.css';
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);
```

5. Update `src/components/Form/Form.jsx` to dispatch `addTodo`:

```jsx
// src/components/Form/Form.jsx
import { FiSearch } from 'react-icons/fi';
import style from './Form.module.css';
import { useDispatch } from 'react-redux';
import { addTodo } from '../../redux/todoSlice';

const Form = () => {
  const dispatch = useDispatch();

  const handleSubmit = e => {
    e.preventDefault();
    const text = e.target.elements.search.value.trim();
    if (text) {
      dispatch(addTodo(text));
      e.target.reset();
    }
  };

  return (
    <form className={style.form} onSubmit={handleSubmit}>
      <button className={style.button} type="submit">
        <FiSearch size="16px" />
      </button>
      <input
        className={style.input}
        placeholder="What do you want to write?"
        name="search"
        required
        autoFocus
      />
    </form>
  );
};

export default Form;
```

6. Update `src/components/Todo/Todo.jsx` (implement as described; use counter as index + 1):

```jsx
// src/components/Todo/Todo.jsx
import { Text } from 'components';
import { RiDeleteBinLine, RiEdit2Line } from 'react-icons/ri';
import style from './Todo.module.css';
import { useDispatch } from 'react-redux';
import { deleteTodo } from '../../redux/todoSlice';
// setCurrentTodo in Step 4

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
      <button className={style.editButton} type="button">
        {/* onClick for edit in Step 4 */}
        <RiEdit2Line size={24} />
      </button>
    </div>
  );
};

export default Todo;
```

7. Update `src/components/TodoList/TodoList.jsx` to fetch and render todos:

```jsx
// src/components/TodoList/TodoList.jsx
import Todo from '../Todo/Todo';
import Text from '../Text/Text';
import { useSelector } from 'react-redux';
import Grid from '../Grid/Grid';
import GridItem from '../GridItem/GridItem';

const TodoList = () => {
  const items = useSelector(state => state.todos.items); // Update with filter in Step 3

  if (!items.length) {
    return <Text textAlign="center">We did not find any todo😯</Text>;
  }

  return (
    <Grid>
      {items.map((todo, index) => (
        <GridItem key={todo.id}>
          <Todo id={todo.id} counter={index + 1} text={todo.text} />
        </GridItem>
      ))}
    </Grid>
  );
};

export default TodoList;
```

8. Update `src/App.jsx` to render the components:

```jsx
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
```

At this point, you can add and delete todos, and they persist in local storage.

---

#### **Step 3: Implement Filter Slice and Selector**
- Create `filterSlice` for `{ filter: '' }`.
- Add reducer to set filter value.
- Use `createSelector` to compute filtered todos.
- Connect `<Filter/>` to dispatch filter changes.
- Update `<TodoList/>` to use the filtered selector.

1. Create `src/redux/filterSlice.js`:

```jsx
// src/redux/filterSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = '';

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setFilter: (state, action) => action.payload,
  },
});

export const { setFilter } = filterSlice.actions;
export const filterReducer = filterSlice.reducer;
```

2. Update `src/redux/store.js` to include filter (add to reducer object):

```jsx
// src/redux/store.js
// ...existing imports
import { filterReducer } from './filterSlice';

// Inside configureStore:
reducer: {
  todos: persistReducer(todosPersistConfig, todoReducer),
  filter: filterReducer, // No persistence for filter
},
```

3. Create selectors in `src/redux/selectors.js` (new file):

```jsx
// src/redux/selectors.js
import { createSelector } from '@reduxjs/toolkit';

export const selectTodos = state => state.todos.items;
export const selectFilter = state => state.filter;

export const selectFilteredTodos = createSelector(
  [selectTodos, selectFilter],
  (todos, filter) => {
    return todos.filter(todo =>
      todo.text.toLowerCase().includes(filter.toLowerCase()),
    );
  },
);
```

4. Update `src/components/Filter/Filter.jsx` to dispatch `setFilter`:

```jsx
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
```

5. Update `src/components/TodoList/TodoList.jsx` to use filtered selector:

```jsx
// src/components/TodoList/TodoList.jsx
// ...existing imports
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
```

6. Add `<Filter/>` to `src/App.jsx` (after `<Form/>`):

```jsx
// src/App.jsx
// Inside Container:
<Form />
<Filter />
<TodoList />
```

Now, filtering works and uses memoized selectors for performance.

---

#### **Step 4: Implement Edit Functionality**
- Add `currentTodo` to `todos` state.
- Add reducers: `setCurrentTodo`, `editTodo`, `cancelEdit`.
- On edit button click in `<Todo/>`, dispatch `setCurrentTodo`.
- Conditionally render `<EditForm/>` or `<Form/>` in `<App/>` based on `currentTodo`.
- In `<EditForm/>`, use `currentTodo.text` as initial value; on submit, dispatch `editTodo`; on cancel, dispatch `cancelEdit`.

1. Update `src/redux/todoSlice.js`:

```jsx
// src/redux/todoSlice.js
// ...existing
const initialState = {
  items: [],
  currentTodo: null,
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    // ...existing addTodo, deleteTodo
    setCurrentTodo: (state, action) => {
      state.currentTodo = action.payload;
    },
    editTodo: (state, action) => {
      const { id, text } = action.payload;
      const todo = state.items.find(todo => todo.id === id);
      if (todo) {
        todo.text = text;
      }
      state.currentTodo = null;
    },
    cancelEdit: state => {
      state.currentTodo = null;
    },
  },
});

export const { addTodo, deleteTodo, setCurrentTodo, editTodo, cancelEdit } = todoSlice.actions;
```

2. Add to `src/redux/selectors.js`:

```jsx
// src/redux/selectors.js
export const selectCurrentTodo = state => state.todos.currentTodo;
```

3. Update `src/components/Todo/Todo.jsx` for edit button:

```jsx
// src/components/Todo/Todo.jsx
// ...existing
import { setCurrentTodo } from '../../redux/todoSlice';

// Inside component:
<button
  className={style.editButton}
  type="button"
  onClick={() => dispatch(setCurrentTodo({ id, text }))}
>
  <RiEdit2Line size={24} />
</button>
```

4. Update `src/components/EditForm/EditForm.jsx`:

```jsx
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
```

5. Update `src/App.jsx` for conditional rendering:

```jsx
// src/App.jsx
// ...existing imports
import EditForm from './components/EditForm/EditForm';
import { useSelector } from 'react-redux';
import { selectCurrentTodo } from './redux/selectors';

// Inside App:
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
```

---

#### **Final Testing and Cleanup**
- Run `npm run dev` to start the app.
- Test: Add todos (persists on refresh), delete, filter, edit (switches forms, updates state).
- Ensure no console errors; state persists only for `items`.
- Optional: Add date formatting from `src/helpers/formatDate.js` to display timestamps in `<Todo/>` if needed (e.g., add `createdAt` to todos).
- Cleanup: Remove unused placeholders in starting code (e.g., the initial "Create your first todo" message is replaced by `<TodoList/>` logic).

This completes the refactoring. The app now uses Redux Toolkit efficiently with persistence and memoized selectors.
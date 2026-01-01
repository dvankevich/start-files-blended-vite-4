### Розширена структура проекту React + Redux Toolkit з прикладами коду

Нижче наведено повну рекомендовану структуру проекту для вашого TODO List додатку з використанням **feature-based** підходу (найкраща практика Redux Toolkit у 2026 році). Я додав **реальні приклади коду** для кожного ключового файлу, щоб ви могли відразу скопіювати та використати.

```
todo-app/
├── src/
│   ├── app/
│   │   ├── store.ts                  # Налаштування store + персистенція
│   │   └── hooks.ts                  # Типізовані хуки useAppDispatch, useAppSelector
│   │
│   ├── features/
│   │   ├── todos/
│   │   │   ├── components/           # UI-компоненти, специфічні для todos
│   │   │   │   ├── TodoList.tsx
│   │   │   │   ├── TodoItem.tsx
│   │   │   │   ├── TodoForm.tsx
│   │   │   │   └── TodoEditForm.tsx
│   │   │   │
│   │   │   ├── todosSlice.ts         # createSlice + actions + reducers
│   │   │   ├── todosSelectors.ts     # Всі селектори для todos
│   │   │   └── index.ts              # Barrel export (опціонально)
│   │   │
│   │   └── filter/
│   │       ├── components/
│   │       │   └── Filter.tsx
│   │       ├── filterSlice.ts
│   │       └── filterSelectors.ts
│   │
│   ├── components/                   # Загальні UI-компоненти (не залежать від Redux)
│   │   ├── Container/
│   │   ├── Header/
│   │   ├── Section/
│   │   ├── Text/
│   │   └── Grid/
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
```

#### 1. `src/app/store.ts`
```ts
// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
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
import { todosReducer } from '../features/todos/todosSlice';
import { filterReducer } from '../features/filter/filterSlice';

const todosPersistConfig = {
  key: 'todos',
  storage,
  whitelist: ['items'], // зберігаємо тільки масив задач
};

const rootReducer = {
  todos: persistReducer(todosPersistConfig, todosReducer),
  filter: filterReducer,
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

#### 2. `src/app/hooks.ts`
```ts
// src/app/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

#### 3. `src/features/todos/todosSlice.ts`
```ts
// src/features/todos/todosSlice.ts
import { createSlice, nanoid } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Todo {
  id: string;
  text: string;
}

interface TodosState {
  items: Todo[];
  currentTodo: Todo | null;
}

const initialState: TodosState = {
  items: [],
  currentTodo: null,
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      state.items.push({
        id: nanoid(),
        text: action.payload,
      });
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((todo) => todo.id !== action.payload);
    },
    setCurrentTodo: (state, action: PayloadAction<Todo | null>) => {
      state.currentTodo = action.payload;
    },
    editTodo: (state, action: PayloadAction<{ id: string; text: string }>) => {
      const { id, text } = action.payload;
      const todo = state.items.find((t) => t.id === id);
      if (todo) {
        todo.text = text;
      }
      state.currentTodo = null;
    },
    cancelEdit: (state) => {
      state.currentTodo = null;
    },
  },
});

export const {
  addTodo,
  deleteTodo,
  setCurrentTodo,
  editTodo,
  cancelEdit,
} = todosSlice.actions;

export default todosSlice.reducer;
```

#### 4. `src/features/todos/todosSelectors.ts`
```ts
// src/features/todos/todosSelectors.ts
import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

const selectTodosState = (state: RootState) => state.todos;

export const selectTodos = createSelector(
  selectTodosState,
  (todos) => todos.items
);

export const selectCurrentTodo = createSelector(
  selectTodosState,
  (todos) => todos.currentTodo
);

export const selectFilteredTodos = createSelector(
  [selectTodos, (state: RootState) => state.filter],
  (todos, filter) =>
    todos.filter((todo) =>
      todo.text.toLowerCase().includes(filter.toLowerCase())
    )
);
```

#### 5. `src/features/filter/filterSlice.ts`
```ts
// src/features/filter/filterSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const filterSlice = createSlice({
  name: 'filter',
  initialState: '',
  reducers: {
    setFilter: (state, action: PayloadAction<string>) => action.payload,
  },
});

export const { setFilter } = filterSlice.actions;
export default filterSlice.reducer;
```

#### 6. `src/features/todos/components/TodoForm.tsx`
```tsx
// src/features/todos/components/TodoForm.tsx
import { FiSearch } from 'react-icons/fi';
import style from '../../../components/Form/Form.module.css';
import { useAppDispatch } from '../../../app/hooks';
import { addTodo } from '../todosSlice';

export const TodoForm = () => {
  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = e.currentTarget.elements.namedItem('search') as HTMLInputElement;
    if (text.value.trim()) {
      dispatch(addTodo(text.value.trim()));
      e.currentTarget.reset();
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
```

#### 7. `src/features/todos/components/TodoItem.tsx`
```tsx
// src/features/todos/components/TodoItem.tsx
import { Text } from '../../../components/Text/Text';
import { RiDeleteBinLine, RiEdit2Line } from 'react-icons/ri';
import style from '../../../components/Todo/Todo.module.css';
import { useAppDispatch } from '../../../app/hooks';
import { deleteTodo, setCurrentTodo } from '../todosSlice';

interface TodoItemProps {
  id: string;
  text: string;
  counter: number;
}

export const TodoItem = ({ id, text, counter }: TodoItemProps) => {
  const dispatch = useAppDispatch();

  return (
    <div className={style.box}>
      <Text textAlign="center" marginBottom="20">
        TODO #{counter}
      </Text>
      <Text>{text}</Text>
      <button
        className={style.deleteButton}
        onClick={() => dispatch(deleteTodo(id))}
      >
        <RiDeleteBinLine size={24} />
      </button>
      <button
        className={style.editButton}
        onClick={() => dispatch(setCurrentTodo({ id, text }))}
      >
        <RiEdit2Line size={24} />
      </button>
    </div>
  );
};
```

#### 8. `src/features/todos/components/TodoList.tsx`
```tsx
// src/features/todos/components/TodoList.tsx
import { TodoItem } from './TodoItem';
import { Text } from '../../../components/Text/Text';
import { Grid, GridItem } from '../../../components/Grid';
import { useAppSelector } from '../../../app/hooks';
import { selectFilteredTodos } from '../todosSelectors';

export const TodoList = () => {
  const todos = useAppSelector(selectFilteredTodos);

  if (todos.length === 0) {
    return <Text textAlign="center">We did not find any todo😯</Text>;
  }

  return (
    <Grid>
      {todos.map((todo, index) => (
        <GridItem key={todo.id}>
          <TodoItem
            id={todo.id}
            text={todo.text}
            counter={index + 1}
          />
        </GridItem>
      ))}
    </Grid>
  );
};
```

#### 9. `src/App.tsx`
```tsx
// src/App.tsx
import { Container } from './components/Container/Container';
import { Header } from './components/Header/Header';
import { Section } from './components/Section/Section';
import { TodoForm } from './features/todos/components/TodoForm';
import { TodoEditForm } from './features/todos/components/TodoEditForm';
import { Filter } from './features/filter/components/Filter';
import { TodoList } from './features/todos/components/TodoList';
import { useAppSelector } from './app/hooks';
import { selectCurrentTodo } from './features/todos/todosSelectors';

export const App = () => {
  const currentTodo = useAppSelector(selectCurrentTodo);
  const isEditing = !!currentTodo;

  return (
    <>
      <Header />
      <Section>
        <Container>
          {isEditing ? <TodoEditForm /> : <TodoForm />}
          <Filter />
          <TodoList />
        </Container>
      </Section>
    </>
  );
};
```

Ця структура:
- Чітко розділяє логіку стану (features) та UI.
- Легко масштабувати (додати нові фічи як cart, auth тощо).
- Використовує типізовані хуки для кращої безпеки.
- Дотримується всіх найкращих практик Redux Toolkit 2026 року.


### Приклади тестів для Redux Toolkit (RTK) у вашому TODO List додатку

Нижче наведено **повний набір практичних тестів** для ключових частин RTK: слайсів, селекторів та асинхронних дій (thunks). Тести написані з використанням **Jest** та **@reduxjs/toolkit** + **@testing-library/react** для компонентів.

#### Підготовка: Встановлення залежностей для тестів
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @types/jest ts-jest
```

Додайте до `package.json`:
```json
"scripts": {
  "test": "jest"
}
```

Створіть `jest.config.js` (для JS/TS):
```js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|module.css)$': 'identity-obj-proxy',
  },
};
```

`src/setupTests.ts`:
```ts
import '@testing-library/jest-dom';
```

---

### 1. Тести для `todosSlice.ts`

```ts
// src/features/todos/todosSlice.test.ts
import todosReducer, {
  addTodo,
  deleteTodo,
  editTodo,
  setCurrentTodo,
  cancelEdit,
} from './todosSlice';
import type { TodosState } from './todosSlice';

describe('todos slice', () => {
  const initialState: TodosState = {
    items: [],
    currentTodo: null,
  };

  it('should return the initial state', () => {
    expect(todosReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle addTodo', () => {
    const actual = todosReducer(initialState, addTodo('Купити молоко'));
    expect(actual.items).toHaveLength(1);
    expect(actual.items[0].text).toBe('Купити молоко');
    expect(actual.items[0].id).toBeDefined();
  });

  it('should handle deleteTodo', () => {
    const stateWithTodo = todosReducer(initialState, addTodo('Задача 1'));
    const todoId = stateWithTodo.items[0].id;

    const actual = todosReducer(stateWithTodo, deleteTodo(todoId));
    expect(actual.items).toHaveLength(0);
  });

  it('should handle setCurrentTodo', () => {
    const todo = { id: '123', text: 'Редагувати' };
    const actual = todosReducer(initialState, setCurrentTodo(todo));
    expect(actual.currentTodo).toEqual(todo);
  });

  it('should handle editTodo', () => {
    let state = todosReducer(initialState, addTodo('Старий текст'));
    const todoId = state.items[0].id;

    state = todosReducer(state, setCurrentTodo({ id: todoId, text: 'Старий текст' }));
    const actual = todosReducer(state, editTodo({ id: todoId, text: 'Новий текст' }));

    expect(actual.items[0].text).toBe('Новий текст');
    expect(actual.currentTodo).toBeNull();
  });

  it('should handle cancelEdit', () => {
    let state = todosReducer(initialState, addTodo('Задача'));
    const todoId = state.items[0].id;
    state = todosReducer(state, setCurrentTodo({ id: todoId, text: 'Задача' }));

    const actual = todosReducer(state, cancelEdit());
    expect(actual.currentTodo).toBeNull();
  });
});
```

---

### 2. Тести для селекторів (`todosSelectors.ts`)

```ts
// src/features/todos/todosSelectors.test.ts
import { selectFilteredTodos, selectCurrentTodo } from './todosSelectors';
import { RootState } from '../../app/store';

describe('todos selectors', () => {
  const mockState: Partial<RootState> = {
    todos: {
      items: [
        { id: '1', text: 'React' },
        { id: '2', text: 'Redux' },
        { id: '3', text: 'TypeScript' },
      ],
      currentTodo: null,
    },
    filter: 're',
  };

  it('selectFilteredTodos should filter by text', () => {
    const filtered = selectFilteredTodos(mockState as RootState);
    expect(filtered).toHaveLength(2);
    expect(filtered.map(t => t.text)).toEqual(['React', 'Redux']);
  });

  it('selectCurrentTodo should return currentTodo', () => {
    const stateWithCurrent: Partial<RootState> = {
      ...mockState,
      todos: {
        ...mockState.todos!,
        currentTodo: { id: '1', text: 'React' },
      },
    };
    expect(selectCurrentTodo(stateWithCurrent as RootState)).toEqual({
      id: '1',
      text: 'React',
    });
  });
});
```

---

### 3. Тести для асинхронних дій (thunks) — приклад з API

Додайте thunk у `todosThunks.ts`:
```ts
// src/features/todos/todosThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchTodos = createAsyncThunk('todos/fetchAll', async () => {
  // Приклад з mock API
  const response = await fetch('/api/todos');
  return response.json();
});
```

Тест:
```ts
// src/features/todos/todosThunks.test.ts
import { fetchTodos } from './todosThunks';

describe('todos thunks', () => {
  it('fetchTodos fulfilled', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([{ id: '1', text: 'API задача' }]),
      } as Response)
    );

    const result = await fetchTodos()({} as any);
    expect(result.type).toBe('todos/fetchAll/fulfilled');
    expect(result.payload).toEqual([{ id: '1', text: 'API задача' }]);
  });

  it('fetchTodos rejected', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

    const result = await fetchTodos()({} as any);
    expect(result.type).toBe('todos/fetchAll/rejected');
  });
});
```

---

### 4. Тести для компонентів (з React Testing Library)

```tsx
// src/features/todos/components/TodoForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoForm } from './TodoForm';
import { Provider } from 'react-redux';
import { store } from '../../../app/store';

const renderWithProvider = (component: React.ReactElement) => {
  return render(<Provider store={store}>{component}</Provider>);
};

describe('TodoForm', () => {
  it('should dispatch addTodo on submit', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    renderWithProvider(<TodoForm />);

    const input = screen.getByPlaceholderText('What do you want to write?');
    const button = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'Нова задача' } });
    fireEvent.click(button);

    expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({
      type: 'todos/addTodo',
      payload: 'Нова задача',
    }));

    dispatchSpy.mockRestore();
  });
});
```

---

### 5. Тести для TodoList (з моками стану)

```tsx
// src/features/todos/components/TodoList.test.tsx
import { render, screen } from '@testing-library/react';
import { TodoList } from './TodoList';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import todosReducer from '../todosSlice';
import filterReducer from '../../filter/filterSlice';

const mockStore = (preloadedState: any) =>
  configureStore({
    reducer: { todos: todosReducer, filter: filterReducer },
    preloadedState,
  });

describe('TodoList', () => {
  it('shows empty message when no todos', () => {
    const store = mockStore({ todos: { items: [], currentTodo: null }, filter: '' });
    render(
      <Provider store={store}>
        <TodoList />
      </Provider>
    );

    expect(screen.getByText('We did not find any todo😯')).toBeInTheDocument();
  });

  it('renders todos', () => {
    const store = mockStore({
      todos: {
        items: [{ id: '1', text: 'Test task' }],
        currentTodo: null,
      },
      filter: '',
    });

    render(
      <Provider store={store}>
        <TodoList />
      </Provider>
    );

    expect(screen.getByText('TODO #1')).toBeInTheDocument();
    expect(screen.getByText('Test task')).toBeInTheDocument();
  });
});
```

---

### Переваги цих тестів
- **Покриття**: Редюсери, селектори, thunks, компоненти.
- **Ізоляція**: Кожен тест незалежний.
- **Швидкість**: Використовуємо моки та preloadedState.
- **Підтримка**: Легко додавати нові тести при розширенні фіч.

Запустіть тести:
```bash
npm test
```

Ці приклади відповідають найкращим практикам тестування RTK у 2026 році. 
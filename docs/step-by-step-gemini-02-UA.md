### Покрокова Інструкція з Рефакторингу Додатку "TODO List" з Використанням Redux Toolkit

Нижче наведено детальну покрокову інструкцію для рефакторингу наданого стартового репозиторію (`dvankevich/start-files-blended-vite-4`) у повноцінний функціональний додаток "TODO List" з використанням Redux Toolkit. Ця інструкція базується на наданій англійській версії, але є розширеною: я додав пояснення, чому ми використовуємо той чи інший компонент, інструмент або підхід. Це допоможе зрозуміти логіку та найкращі практики. Інструкція припускає, що ви склоновали репозиторій локально та працюєте в редакторі коду (наприклад, VS Code). Ми додамо Redux для керування станом, збережемо дані в local storage та реалізуємо функції додавання, видалення, редагування та фільтрації задач.

**Ключові припущення на основі аналізу стартового коду:**
- Додаток — це базова React-структура на Vite з CSS-модулями та компонентами, такими як `Form` (форма додавання), `EditForm` (форма редагування), `Todo` (елемент задачі), `TodoList` (список задач), `Filter` (фільтр) тощо.
- Наразі немає керування станом; додаток просто рендерить плейсхолдер "Create your first todo".
- Ми інтегруємо Redux у `src/main.jsx` та підключимо компоненти через хуки `useSelector` (для читання стану) та `useDispatch` (для відправки дій). Це робиться, бо Redux забезпечує централізоване керування станом, що полегшує масштабованість та дебагінг.
- Іконки (наприклад, `RiDeleteBinLine`, `RiEdit2Line`) вже доступні через `react-icons`.
- Проп `counter` у `<Todo/>` — це порядковий номер задачі (наприклад, "TODO #1"), який ми генеруємо на основі індексу для зручного відображення.
- Створимо нову папку `src/redux` для слайсів (slices) та стору (store), бо це стандартна організація Redux-коду для кращої модульності.

---

#### **Підготовка: Встановлення Залежностей**
Виконайте наступну команду в корені проекту, щоб встановити необхідні пакети:

```bash
npm install @reduxjs/toolkit react-redux redux-persist nanoid
```

**Пояснення:**
- `@reduxjs/toolkit`: Основна бібліотека для Redux. Вона спрощує створення редюсерів, дій та селекторів, зменшуючи boilerplate-код (наприклад, за допомогою `createSlice`).
- `react-redux`: Інтеграція Redux з React. Дозволяє використовувати хуки як `useSelector` (для доступу до стану) та `useDispatch` (для відправки дій), роблячи компоненти "зв'язаними" зі станом без пропсів.
- `redux-persist`: Для збереження стану в local storage. Це корисно, бо дозволяє задачам зберігатися після перезавантаження сторінки, покращуючи користувацький досвід.
- `nanoid`: Для генерації унікальних ID задач. Це безпечніше, ніж прості лічильники, бо уникає колізій у розподілених системах.

---

#### **Крок 1: Налаштування Redux Store та Todo Slice**
- Створимо Redux store за допомогою `configureStore()` — це центральне сховище стану, яке об'єднує всі редюсери.
- Створимо `todoSlice` для керування частиною стану `todos: { items: [] }`. Слайс — це модуль Redux Toolkit, який поєднує редюсер і дії в один об'єкт для простоти.
- Обгорнемо додаток у `Provider` з `react-redux`, щоб весь React-дерево мало доступ до store.

1. Створіть нову папку `src/redux` (для організації Redux-коду окремо від компонентів).

2. У `src/redux/todoSlice.js` створіть слайс:

```jsx
// src/redux/todoSlice.js
import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  items: [],  // Масив задач
  // Додамо currentTodo на кроці 4 для редагування
};

const todoSlice = createSlice({
  name: 'todos',  // Ім'я слайсу для ідентифікації в Redux DevTools
  initialState,
  reducers: {
    // Плейсхолдери для редюсерів — реалізуємо пізніше
    addTodo: (state, action) => {
      // Буде реалізовано на кроці 2
    },
    deleteTodo: (state, action) => {
      // Буде реалізовано на кроці 2
    },
    // editTodo та setCurrentTodo додамо на кроці 4
  },
});

export const { addTodo, deleteTodo } = todoSlice.actions;  // Експорт дій для диспетчінгу
export const todoReducer = todoSlice.reducer;  // Експорт редюсера для store
```

**Пояснення:** `createSlice` автоматично генерує дії (actions) та редюсер, зменшуючи код. Ми використовуємо `nanoid` для ID, бо це забезпечує унікальність без залежності від порядку.

3. У `src/redux/store.js` налаштуйте store (базова версія; персистенцію додамо на кроці 2):

```jsx
// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import { todoReducer } from './todoSlice';
// Імпорт filterReducer додамо на кроці 3

export const store = configureStore({
  reducer: {
    todos: todoReducer,  // Підключаємо редюсер todos
    // Додамо filter на кроці 3
  },
});
```

**Пояснення:** `configureStore` налаштовує middleware (наприклад, для Redux DevTools) автоматично, роблячи store готовим до використання.

4. Оновіть `src/main.jsx`, щоб обгорнути додаток у `Provider`:

```jsx
// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.jsx';
import 'modern-normalize/modern-normalize.css';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './redux/store';  // Імпорт store

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>  // Надає store всьому додатку
      <App />
    </Provider>
  </React.StrictMode>,
);
```

**Пояснення:** `Provider` робить store доступним для всіх компонентів через контекст, дозволяючи використовувати хуки без пропсів.

---

#### **Крок 2: Реалізація Додавання, Видалення та Персистенції**
- Реалізуємо редюсери `addTodo` та `deleteTodo` у `todoSlice` — вони змінюють стан імутабельно (Redux Toolkit дозволяє це завдяки Immer).
- Для персистенції використовуємо `redux-persist`, щоб зберігати `todos.items` у local storage (тільки items, бо filter тимчасовий).
- Підключимо `<Form/>` для диспетчінгу `addTodo` (форма додавання задачі).
- Оновимо `<Todo/>` для диспетчінгу `deleteTodo` при натисканні кнопки видалення.
- Оновимо `<TodoList/>` для рендерингу списку `<Todo/>` зі стану Redux.
- Оновимо `<App/>` для рендерингу `<Form/>` та `<TodoList/>`.

1. Встановіть `nanoid` (якщо не зробили на підготовці):

```bash
npm install nanoid
```

2. Оновіть `src/redux/todoSlice.js` з редюсерами:

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
      const newTodo = { id: nanoid(), text: action.payload };  // Генеруємо ID та додаємо задачу
      state.items.push(newTodo);
    },
    deleteTodo: (state, action) => {
      state.items = state.items.filter(todo => todo.id !== action.payload);  // Видаляємо за ID
    },
    // Редагування на кроці 4
  },
});

export const { addTodo, deleteTodo } = todoSlice.actions;
export const todoReducer = todoSlice.reducer;
```

**Пояснення:** Редюсери змінюють стан на основі дій. `addTodo` додає нову задачу, `deleteTodo` фільтрує масив — це забезпечує імутабельність без копіювання.

3. Оновіть `src/redux/store.js` з персистенцією:

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

// Конфіг персистенції тільки для items
const todosPersistConfig = {
  key: 'todos',
  storage,
  whitelist: ['items'],  // Зберігаємо тільки масив задач
};

export const store = configureStore({
  reducer: {
    todos: persistReducer(todosPersistConfig, todoReducer),
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {  // Ігноруємо не-серіалізовані дії для персистенції
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);  // Для PersistGate
```

**Пояснення:** `persistReducer` обгортає редюсер для збереження в storage. `whitelist` обмежує, що зберігати, щоб уникнути зайвих даних.

4. Оновіть `src/main.jsx` для додавання `PersistGate`:

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
      <PersistGate loading={null} persistor={persistor}>  // Чекає відновлення стану з storage
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);
```

**Пояснення:** `PersistGate` затримує рендеринг, поки стан не відновиться з local storage, запобігаючи миготінню.

5. Оновіть `src/components/Form/Form.jsx` для диспетчінгу `addTodo`:

```jsx
// src/components/Form/Form.jsx
import { FiSearch } from 'react-icons/fi';
import style from './Form.module.css';
import { useDispatch } from 'react-redux';
import { addTodo } from '../../redux/todoSlice';

const Form = () => {
  const dispatch = useDispatch();  // Хук для відправки дій

  const handleSubmit = e => {
    e.preventDefault();
    const text = e.target.elements.search.value.trim();
    if (text) {
      dispatch(addTodo(text));  // Відправляємо дію з текстом задачі
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

**Пояснення:** `useDispatch` дозволяє компоненту відправляти дії без прямого доступу до store, роблячи код декларативним.

6. Оновіть `src/components/Todo/Todo.jsx` (реалізуйте як описано; counter — індекс + 1):

```jsx
// src/components/Todo/Todo.jsx
import { Text } from 'components';
import { RiDeleteBinLine, RiEdit2Line } from 'react-icons/ri';
import style from './Todo.module.css';
import { useDispatch } from 'react-redux';
import { deleteTodo } from '../../redux/todoSlice';
// setCurrentTodo на кроці 4

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
        {/* onClick для редагування на кроці 4 */}
        <RiEdit2Line size={24} />
      </button>
    </div>
  );
};

export default Todo;
```

**Пояснення:** Компонент `<Todo/>` — це UI-елемент задачі. Ми використовуємо `GridItem` для сітки, бо це забезпечує responsivity. Диспетч видалення оновлює стан глобально.

7. Оновіть `src/components/TodoList/TodoList.jsx` для отримання та рендерингу задач:

```jsx
// src/components/TodoList/TodoList.jsx
import Todo from '../Todo/Todo';
import Text from '../Text/Text';
import { useSelector } from 'react-redux';
import Grid from '../Grid/Grid';
import GridItem from '../GridItem/GridItem';

const TodoList = () => {
  const items = useSelector(state => state.todos.items);  // Хук для читання стану; оновимо з фільтром на кроці 3

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

**Пояснення:** `useSelector` читає стан ефективно (ре-рендерить тільки при змінах). `<Grid>` та `<GridItem>` використовуємо для сіткового layout, бо це робить інтерфейс адаптивним.

8. Оновіть `src/App.jsx` для рендерингу компонентів:

```jsx
// src/App.jsx
import Container from './components/Container/Container';
import Header from './components/Header/Header';
import Section from './components/Section/Section';
import Form from './components/Form/Form';
import TodoList from './components/TodoList/TodoList';
// Filter на кроці 3, EditForm на кроці 4

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

**Пояснення:** `<App/>` — кореневий компонент. Ми використовуємо `<Container>`, `<Section>` та `<Header>` для структури, бо це забезпечує семантичний HTML та стилізацію.

На цьому етапі ви можете додавати та видаляти задачі, і вони зберігаються в local storage.

---

#### **Крок 3: Реалізація Filter Slice та Селектора**
- Створимо `filterSlice` для стану `{ filter: '' }` — це окрема частина стану для фільтра, бо вона незалежна від задач.
- Додамо редюсер для встановлення значення фільтра.
- Використаємо `createSelector` для обчислення відфільтрованих задач (мемоізація для продуктивності).
- Підключимо `<Filter/>` для диспетчінгу змін фільтра.
- Оновимо `<TodoList/>` для використання відфільтрованого селектора.

1. Створіть `src/redux/filterSlice.js`:

```jsx
// src/redux/filterSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = '';  // Початкове значення фільтра — порожній рядок

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setFilter: (state, action) => action.payload,  // Просто встановлюємо нове значення
  },
});

export const { setFilter } = filterSlice.actions;
export const filterReducer = filterSlice.reducer;
```

**Пояснення:** Окремий слайс для фільтра робить стан модульним, дозволяючи легко додавати/видаляти функції.

2. Оновіть `src/redux/store.js`, додавши filter до reducer:

```jsx
// src/redux/store.js
// ...існуючі імпорти
import { filterReducer } from './filterSlice';

// У configureStore:
reducer: {
  todos: persistReducer(todosPersistConfig, todoReducer),
  filter: filterReducer,  // Без персистенції, бо фільтр тимчасовий
},
```

**Пояснення:** Фільтр не персистуємо, бо він залежить від сесії користувача.

3. Створіть селектори в `src/redux/selectors.js` (новий файл):

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

**Пояснення:** `createSelector` мемоізує результат, перераховуючи тільки при змінах вхідних даних, що оптимізує продуктивність.

4. Оновіть `src/components/Filter/Filter.jsx` для диспетчінгу `setFilter`:

```jsx
// src/components/Filter/Filter.jsx
import style from './Filter.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter } from '../../redux/filterSlice';
import { selectFilter } from '../../redux/selectors';

const Filter = () => {
  const dispatch = useDispatch();
  const filter = useSelector(selectFilter);  // Читаємо поточне значення

  const handleChange = e => {
    dispatch(setFilter(e.target.value));  // Оновлюємо при зміні
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

**Пояснення:** Інпут синхронізовано зі станом через `value` та `onChange`, роблячи фільтр реактивним.

5. Оновіть `src/components/TodoList/TodoList.jsx` для використання фільтрованого селектора:

```jsx
// src/components/TodoList/TodoList.jsx
// ...існуючі імпорти
import { selectFilteredTodos } from '../../redux/selectors';

const TodoList = () => {
  const filteredItems = useSelector(selectFilteredTodos);  // Використовуємо мемоізований селектор

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

**Пояснення:** Фільтрований селектор забезпечує, що список оновлюється тільки при релевантних змінах.

6. Додайте `<Filter/>` до `src/App.jsx` (після `<Form/>`):

```jsx
// src/App.jsx
// У Container:
<Form />
<Filter />
<TodoList />
```

Тепер фільтрація працює з мемоізацією для кращої продуктивності.

---

#### **Крок 4: Реалізація Функціоналу Редагування**
- Додамо `currentTodo` до стану `todos` — це тимчасова змінна для поточної задачі в редагуванні.
- Додамо редюсери: `setCurrentTodo` (вибір задачі), `editTodo` (оновлення), `cancelEdit` (скасування).
- При натисканні кнопки редагування в `<Todo/>` диспетчимо `setCurrentTodo`.
- Умовно рендеримо `<EditForm/>` або `<Form/>` в `<App/>` на основі `currentTodo`.
- У `<EditForm/>` використовуємо `currentTodo.text` як початкове значення; при сабміті диспетчимо `editTodo`, при скасуванні — `cancelEdit`.

1. Оновіть `src/redux/todoSlice.js`:

```jsx
// src/redux/todoSlice.js
// ...існуюче
const initialState = {
  items: [],
  currentTodo: null,  // Поточна задача для редагування
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    // ...існуючі addTodo, deleteTodo
    setCurrentTodo: (state, action) => {
      state.currentTodo = action.payload;  // Встановлюємо поточну
    },
    editTodo: (state, action) => {
      const { id, text } = action.payload;
      const todo = state.items.find(todo => todo.id === id);
      if (todo) {
        todo.text = text;  // Оновлюємо текст
      }
      state.currentTodo = null;  // Скидаємо після редагування
    },
    cancelEdit: state => {
      state.currentTodo = null;  // Скасування редагування
    },
  },
});

export const { addTodo, deleteTodo, setCurrentTodo, editTodo, cancelEdit } = todoSlice.actions;
```

**Пояснення:** `currentTodo` — це флаг для режиму редагування, що дозволяє перемикати форми без додаткового стану.

2. Додайте до `src/redux/selectors.js`:

```jsx
// src/redux/selectors.js
export const selectCurrentTodo = state => state.todos.currentTodo;
```

**Пояснення:** Селектор ізолює доступ до `currentTodo`, роблячи код реюзабельним.

3. Оновіть `src/components/Todo/Todo.jsx` для кнопки редагування:

```jsx
// src/components/Todo/Todo.jsx
// ...існуюче
import { setCurrentTodo } from '../../redux/todoSlice';

// У компоненті:
<button
  className={style.editButton}
  type="button"
  onClick={() => dispatch(setCurrentTodo({ id, text }))}  // Передаємо ID та текст
>
  <RiEdit2Line size={24} />
</button>
```

**Пояснення:** Кнопка запускає режим редагування, диспетчуючи поточну задачу.

4. Оновіть `src/components/EditForm/EditForm.jsx`:

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
  const [text, setText] = useState(currentTodo?.text || '');  // Локальний стан для інпута

  const handleSubmit = e => {
    e.preventDefault();
    if (text.trim()) {
      dispatch(editTodo({ id: currentTodo.id, text }));  // Оновлюємо задачу
    }
  };

  const handleCancel = () => {
    dispatch(cancelEdit());  // Скидаємо режим
  };

  const handleChange = e => {
    setText(e.target.value);  // Оновлюємо локальний текст
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

**Пояснення:** Локальний `useState` для інпута, бо Redux не повинен керувати UI-станом (тільки даними). Диспетч при сабміті оновлює глобальний стан.

5. Оновіть `src/App.jsx` для умовного рендерингу:

```jsx
// src/App.jsx
// ...існуючі імпорти
import EditForm from './components/EditForm/EditForm';
import { useSelector } from 'react-redux';
import { selectCurrentTodo } from './redux/selectors';

// У App:
const currentTodo = useSelector(selectCurrentTodo);
const isEdit = !!currentTodo;  // Перевірка режиму редагування

return (
  <>
    <Header />
    <Section>
      <Container>
        {isEdit ? <EditForm /> : <Form />}  // Умовний рендеринг форм
        <Filter />
        <TodoList />
      </Container>
    </Section>
  </>
);
```

**Пояснення:** Умовний рендеринг перемикає форми, роблячи інтерфейс динамічним без додаткових компонентів.

---

#### **Фінальне Тестування та Очищення**
- Запустіть `npm run dev` для старту додатку.
- Тестуйте: Додавайте задачі (зберігаються після перезавантаження), видаляйте, фільтруйте, редагуйте (форми перемикаються, стан оновлюється).
- Перевірте відсутність помилок у консолі; стан зберігається тільки для `items`.
- Опціонально: Додайте форматування дат з `src/helpers/formatDate.js` для відображення часу створення в `<Todo/>` (наприклад, додайте `createdAt: new Date()` до задач у `addTodo`).
- Очищення: Видаліть невикористані плейсхолдери зі стартового коду (наприклад, початкове повідомлення "Create your first todo" замінено логікою `<TodoList/>`).

Ця інструкція завершує рефакторинг. Додаток тепер ефективно використовує Redux Toolkit з персистенцією та мемоізованими селекторами, роблячи його масштабованим та зручним.
### Покрокова Інструкція з Рефакторингу Додатку "TODO List" з Використанням Redux Toolkit (Розширена Версія)

Ця розширена інструкція базується на попередній версії, але містить більше деталей: додаткові пояснення концепцій Redux для початківців, потенційні помилки та їх виправлення, коментарі в коді, рекомендації з дебагінгу, тестування та оптимізації. Ми крок за кроком перетворимо стартовий репозиторій (`dvankevich/start-files-blended-vite-4`) на повноцінний додаток для керування задачами з Redux Toolkit. Redux Toolkit спрощує роботу з Redux, зменшуючи boilerplate-код, і включає вбудовану підтримку імутабельності через Immer.

**Перед початком:**
- Переконайтеся, що у вас встановлений Node.js (версія 14+ рекомендовано) та Git.
- Склоніть репозиторій: `git clone <url репозиторію>`.
- Перейдіть до папки: `cd start-files-blended-vite-4`.
- Встановіть залежності: `npm install` (якщо не зроблено).
- Запустіть додаток: `npm run dev` — перевірте, чи працює базова версія (має показувати "Create your first todo").
- Встановіть Redux-залежності: `npm install @reduxjs/toolkit react-redux redux-persist nanoid`.
  - **Чому nanoid?** Для генерації унікальних ID задач без ризику дублювання (краще, ніж Math.random() або лічильники).
- Якщо виникають помилки з залежностями, перевірте `package.json` на конфлікти версій (наприклад, React 18+ сумісний з Redux Toolkit 1.9+).
- Використовуйте Redux DevTools Extension у браузері (Chrome/Firefox) для дебагінгу стану — воно автоматично інтегрується з `configureStore`.

**Ключові концепції Redux для початківців:**
- **Store:** Центральне сховище стану додатку.
- **Slice:** Модуль, що містить редюсер (функцію, яка змінює стан) та дії (об'єкти, що описують зміни).
- **Дії (Actions):** Об'єкти типу `{ type: 'todos/addTodo', payload: 'Нова задача' }` — генеруються автоматично в slices.
- **Редюсери:** Функції, що приймають поточний стан і дію, повертаючи новий стан (імутабельно).
- **Селектори:** Функції для читання частин стану (з мемоізацією через `createSelector` для продуктивності).
- **Персистенція:** Збереження стану в localStorage, щоб дані не втрачалися при перезавантаженні.
- **Потенційні помилки:** Забути імпортувати хуки, неправильно вказати шляхи, або мутувати стан безпосередньо (Redux Toolkit дозволяє "мутувати" в редюсерах завдяки Immer, але не поза ними).

---

#### **Крок 1: Налаштування Redux Store та Todo Slice**
На цьому кроці ми створюємо основу Redux. Створимо папку `src/redux` для організації (стандартна практика, щоб відокремити логіку стану від UI).

1. Створіть папку `src/redux`.
   - **Чому?** Це робить код модульним: слайси, селектори та store в одному місці, легко імпортувати.

2. У `src/redux/todoSlice.js` створіть слайс для задач:
   ```jsx
   // src/redux/todoSlice.js
   import { createSlice, nanoid } from '@reduxjs/toolkit';  // nanoid для унікальних ID

   // Початковий стан: items — масив задач, currentTodo — для редагування (додамо пізніше)
   const initialState = {
     items: [],  // Тут зберігатимуться задачі: [{ id: 'abc', text: 'Задача 1' }]
   };

   const todoSlice = createSlice({
     name: 'todos',  // Ім'я для Redux DevTools (допомагає в дебагінгу)
     initialState,
     reducers: {  // Редюсери — функції змін стану
       addTodo: (state, action) => {
         // Генеруємо нову задачу з унікальним ID
         const newTodo = { id: nanoid(), text: action.payload };
         state.items.push(newTodo);  // "Мутація" дозволена завдяки Immer
       },
       deleteTodo: (state, action) => {
         // Фільтруємо масив, видаляючи за ID
         state.items = state.items.filter(todo => todo.id !== action.payload);
       },
       // Додамо редюсери для редагування на кроці 4
     },
   });

   // Експорт дій (для dispatch) та редюсера (для store)
   export const { addTodo, deleteTodo } = todoSlice.actions;
   export const todoReducer = todoSlice.reducer;
   ```
   - **Потенційна помилка:** Якщо забули імпортувати `nanoid`, отримаєте помилку "nanoid is not defined". Виправлення: Додайте імпорт.
   - **Дебагінг:** У Redux DevTools перевірте, чи з'являються дії `todos/addTodo`.

3. У `src/redux/store.js` створіть store з персистенцією:
   ```jsx
   // src/redux/store.js
   import { configureStore } from '@reduxjs/toolkit';
   import { todoReducer } from './todoSlice';
   // Додамо filterReducer на кроці 3
   import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
   import storage from 'redux-persist/lib/storage';  // LocalStorage за замовчуванням

   // Конфіг персистенції: зберігаємо тільки 'items' (не весь стан)
   const todosPersistConfig = {
     key: 'todos',  // Ключ в localStorage
     storage,
     whitelist: ['items'],  // Тільки масив задач, бо filter тимчасовий
   };

   export const store = configureStore({
     reducer: {  // Об'єднуємо редюсери
       todos: persistReducer(todosPersistConfig, todoReducer),
       // Додамо filter на кроці 3
     },
     middleware: (getDefaultMiddleware) => getDefaultMiddleware({
       serializableCheck: {  // Ігноруємо не-серіалізовані дії персистенції
         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
       },
     }),
   });

   export const persistor = persistStore(store);  // Для відновлення стану
   ```
   - **Чому персистенція?** Без неї задачі зникають при перезавантаженні, що погіршує UX.
   - **Потенційна помилка:** Якщо whitelist не вказаний, весь стан (включаючи currentTodo) зберігатиметься, що непотрібно. Виправлення: Перевірте localStorage в браузері (F12 > Application > Local Storage).
   - **Оптимізація:** Якщо додаток великий, розгляньте blacklist для виключення полів.

4. Оновіть `src/main.jsx` для інтеграції Redux:
   ```jsx
   // src/main.jsx
   import React from 'react';
   import ReactDOM from 'react-dom/client';
   import { App } from './App.jsx';
   import 'modern-normalize/modern-normalize.css';
   import './index.css';
   import { Provider } from 'react-redux';
   import { PersistGate } from 'redux-persist/integration/react';
   import { store, persistor } from './redux/store';

   ReactDOM.createRoot(document.getElementById('root')).render(
     <React.StrictMode>
       <Provider store={store}>  // Надає store всьому дереву компонентів
         <PersistGate loading={null} persistor={persistor}>  // Чекає відновлення з storage
           <App />
         </PersistGate>
       </Provider>
     </React.StrictMode>,
   );
   ```
   - **Потенційна помилка:** Якщо PersistGate не доданий, стан не відновиться. Виправлення: Перевірте, чи з'являються задачі після перезавантаження.
   - **Дебагінг:** У консолі браузера введіть `localStorage.getItem('persist:todos')` — має показати JSON з items.

---

#### **Крок 2: Підключення Компонентів для Додавання та Видалення**
Тут ми інтегруємо UI з Redux. Використовуємо хуки для читання/зміни стану.

1. Оновіть `src/components/Form/Form.jsx` (додавання задачі):
   ```jsx
   // src/components/Form/Form.jsx
   import { FiSearch } from 'react-icons/fi';
   import style from './Form.module.css';
   import { useDispatch } from 'react-redux';
   import { addTodo } from '../../redux/todoSlice';  // Імпорт дії

   const Form = () => {
     const dispatch = useDispatch();  // Хук для відправки дій до store

     const handleSubmit = e => {
       e.preventDefault();
       const text = e.target.elements.search.value.trim();  // Отримуємо текст з інпута
       if (text) {  // Перевіряємо, чи не порожній
         dispatch(addTodo(text));  // Диспетчимо дію з payload = text
         e.target.reset();  // Очищаємо форму
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
           required  // Вбудована валідація HTML
           autoFocus  // Автофокус для зручності
         />
       </form>
     );
   };

   export default Form;
   ```
   - **Чому useDispatch?** Він абстрагує від прямого виклику store.dispatch, роблячи компонент незалежним.
   - **Потенційна помилка:** Якщо форма не очищається, перевірте `e.target.reset()`. Альтернатива: Використовуйте controlled input з useState для тексту.
   - **Тестування:** Додайте задачу — перевірте в Redux DevTools, чи з'явилася дія addTodo.

2. Оновіть `src/components/Todo/Todo.jsx` (видалення та плейсхолдер для редагування):
   ```jsx
   // src/components/Todo/Todo.jsx
   import { Text } from 'components';
   import { RiDeleteBinLine, RiEdit2Line } from 'react-icons/ri';
   import style from './Todo.module.css';
   import { useDispatch } from 'react-redux';
   import { deleteTodo } from '../../redux/todoSlice';  // Дія видалення
   // Імпорт setCurrentTodo на кроці 4

   const Todo = ({ id, counter, text }) => {  // Пропси: id для ключів, counter для номеру, text для вмісту
     const dispatch = useDispatch();

     return (
       <div className={style.box}>
         <Text textAlign="center" marginBottom="20">
           TODO #{counter}  // Порядковий номер для UX
         </Text>
         <Text>{text}</Text>
         <button
           className={style.deleteButton}
           type="button"
           onClick={() => dispatch(deleteTodo(id))}  // Диспетчимо з payload = id
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
   - **Потенційна помилка:** Якщо кнопка не працює, перевірте імпорт дії. Виправлення: Перезапустіть `npm run dev`.
   - **Оптимізація:** Додайте confirm() для видалення: `if (window.confirm('Видалити?')) dispatch(deleteTodo(id));`.

3. Оновіть `src/components/TodoList/TodoList.jsx` (рендеринг списку):
   ```jsx
   // src/components/TodoList/TodoList.jsx
   import Todo from '../Todo/Todo';
   import Text from '../Text/Text';
   import { useSelector } from 'react-redux';
   import Grid from '../Grid/Grid';
   import GridItem from '../GridItem/GridItem';

   const TodoList = () => {
     const items = useSelector(state => state.todos.items);  // Читаємо масив задач; оновимо з фільтром на кроці 3

     if (!items.length) {
       return <Text textAlign="center">We did not find any todo😯</Text>;  // Плейсхолдер для порожнього списку
     }

     return (
       <Grid>  // Сітка для responsivity
         {items.map((todo, index) => (
           <GridItem key={todo.id}>  // Key для ефективного рендерингу React
             <Todo id={todo.id} counter={index + 1} text={todo.text} />
           </GridItem>
         ))}
       </Grid>
     );
   };

   export default TodoList;
   ```
   - **Чому useSelector?** Він оптимізує ре-рендеринг, підписуючись тільки на зміни todos.items.
   - **Потенційна помилка:** Якщо список не оновлюється, перевірте селектор. Виправлення: Використовуйте memo для Todo, якщо багато елементів.

4. Оновіть `src/App.jsx`:
   ```jsx
   // src/App.jsx
   import Container from './components/Container/Container';
   import Header from './components/Header/Header';
   import Section from './components/Section/Section';
   import Form from './components/Form/Form';
   import TodoList from './components/TodoList/TodoList';
   // Додамо Filter та EditForm пізніше

   export const App = () => {
     return (
       <>
         <Header />  // Шапка для навігації
         <Section>  // Секція для контенту
           <Container>  // Контейнер для центрування
             <Form />  // Форма додавання
             <TodoList />  // Список задач
           </Container>
         </Section>
       </>
     );
   };
   ```
   - **Тестування:** Додайте/видаліть задачі — перевірте персистенцію (F5).

---

#### **Крок 3: Реалізація Filter Slice та Селектора**
Додаємо фільтрацію для пошуку задач.

1. Створіть `src/redux/filterSlice.js`:
   ```jsx
   // src/redux/filterSlice.js
   import { createSlice } from '@reduxjs/toolkit';

   const initialState = '';  // Порожній рядок за замовчуванням

   const filterSlice = createSlice({
     name: 'filter',
     initialState,
     reducers: {
       setFilter: (state, action) => action.payload,  // Оновлюємо значення фільтра
     },
   });

   export const { setFilter } = filterSlice.actions;
   export const filterReducer = filterSlice.reducer;
   ```
   - **Чому окремий слайс?** Фільтр — незалежна частина стану, це дотримується принципу single responsibility.

2. Оновіть `src/redux/store.js`:
   ```jsx
   // Додайте імпорт filterReducer
   import { filterReducer } from './filterSlice';

   // У reducer:
   reducer: {
     todos: persistReducer(todosPersistConfig, todoReducer),
     filter: filterReducer,  // Без персистенції
   },
   ```

3. Створіть `src/redux/selectors.js`:
   ```jsx
   // src/redux/selectors.js
   import { createSelector } from '@reduxjs/toolkit';

   export const selectTodos = state => state.todos.items;
   export const selectFilter = state => state.filter;

   export const selectFilteredTodos = createSelector(
     [selectTodos, selectFilter],
     (todos, filter) => todos.filter(todo => todo.text.toLowerCase().includes(filter.toLowerCase()))  // Case-insensitive фільтр
   );
   ```
   - **Чому createSelector?** Мемоізація: обчислює тільки при змінах todos або filter, економлячи ресурси.
   - **Потенційна помилка:** Якщо фільтр не працює, перевірте lowerCase — для не-англійських символів додайте localeCompare.

4. Оновіть `src/components/Filter/Filter.jsx`:
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
       dispatch(setFilter(e.target.value));  // Оновлюємо при кожній зміні
     };

     return (
       <input
         className={style.input}
         placeholder="Find it"
         name="filter"
         value={filter}  // Controlled input
         onChange={handleChange}
       />
     );
   };

   export default Filter;
   ```
   - **Оптимізація:** Додайте debounce з lodash, якщо фільтр повільний на великому списку: `npm install lodash`, потім `const debouncedChange = useCallback(debounce(handleChange, 300), [])`.

5. Оновіть `src/components/TodoList/TodoList.jsx`:
   ```jsx
   // ...імпорти
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
   - **Тестування:** Введіть текст у фільтр — список повинен оновлюватися динамічно.

6. Додайте `<Filter/>` до `src/App.jsx` після `<Form/>`.

---

#### **Крок 4: Реалізація Функціоналу Редагування**
Додаємо режим редагування з перемиканням форм.

1. Оновіть `src/redux/todoSlice.js` (додайте currentTodo та редюсери):
   ```jsx
   const initialState = {
     items: [],
     currentTodo: null,  // { id: 'abc', text: 'Старий текст' } або null
   };

   reducers: {
     // ...існуючі
     setCurrentTodo: (state, action) => {
       state.currentTodo = action.payload;
     },
     editTodo: (state, action) => {
       const { id, text } = action.payload;
       const todo = state.items.find(todo => todo.id === id);
       if (todo) todo.text = text;
       state.currentTodo = null;
     },
     cancelEdit: state => {
       state.currentTodo = null;
     },
   }

   export const { ..., setCurrentTodo, editTodo, cancelEdit } = todoSlice.actions;
   ```
   - **Потенційна помилка:** Якщо find не знаходить, додайте перевірку: `if (!todo) console.error('Todo not found');`.

2. Додайте до `src/redux/selectors.js`:
   ```jsx
   export const selectCurrentTodo = state => state.todos.currentTodo;
   ```

3. Оновіть `src/components/Todo/Todo.jsx` (кнопка редагування):
   ```jsx
   // Додайте імпорт setCurrentTodo

   <button
     className={style.editButton}
     type="button"
     onClick={() => dispatch(setCurrentTodo({ id, text }))}
   >
     <RiEdit2Line size={24} />
   </button>
   ```

4. Оновіть `src/components/EditForm/EditForm.jsx`:
   ```jsx
   // src/components/EditForm/EditForm.jsx
   import { RiSaveLine } from 'react-icons/ri';
   import { MdOutlineCancel } from 'react-icons/md';
   import style from './EditForm.module.css';
   import { useDispatch, useSelector } from 'react-redux';
   import { editTodo, cancelEdit } from '../../redux/todoSlice';
   import { selectCurrentTodo } from '../../redux/selectors';
   import { useState, useEffect } from 'react';  // Додали useEffect для синхронізації

   const EditForm = () => {
     const dispatch = useDispatch();
     const currentTodo = useSelector(selectCurrentTodo);
     const [text, setText] = useState(currentTodo?.text || '');

     useEffect(() => {  // Синхронізуємо локальний стан з Redux при зміні currentTodo
       setText(currentTodo?.text || '');
     }, [currentTodo]);

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
   - **Чому useEffect?** Для ресинхронізації, якщо currentTodo зміниться ззовні.
   - **Потенційна помилка:** Якщо форма не заповнюється, перевірте useEffect.

5. Оновіть `src/App.jsx` (умовне рендеринг):
   ```jsx
   // Додайте імпорти EditForm та selectCurrentTodo
   import { useSelector } from 'react-redux';

   // У App:
   const currentTodo = useSelector(selectCurrentTodo);
   const isEdit = !!currentTodo;

   <Container>
     {isEdit ? <EditForm /> : <Form />}
     <Filter />
     <TodoList />
   </Container>
   ```
   - **Тестування:** Натисніть редагування — форма повинна з'явитися з текстом задачі.

---

#### **Фінальне Тестування, Дебагінг та Оптимізація**
- **Запуск:** `npm run dev` — відкрийте http://localhost:5173/.
- **Тест-кейси:**
  - Додати задачу: Перевірте Redux DevTools (дію addTodo), localStorage.
  - Видалити: Список оновлюється, дія deleteTodo.
  - Фільтрувати: Введіть частину тексту — тільки релевантні задачі.
  - Редагувати: Натисніть edit, змініть текст, збережіть/скасуйте — перевірте перемикання форм.
  - Персистенція: Перезавантажте сторінку — задачі залишаються.
- **Дебагінг:**
  - Використовуйте console.log в редюсерах/селекторах.
  - Redux DevTools: Переглядайте стан, дії, diff.
  - Якщо помилки: Перевірте імпорти (case-sensitive), перезапустіть сервер.
- **Оптимізація:**
  - Додайте timestamps: У addTodo додайте `createdAt: new Date().toISOString()`, відобразіть у Todo з formatDate.js.
  - Обмежте кількість задач: Якщо >100, додайте пагінацію.
  - Тести: Додайте Jest/RTL: `npm install --save-dev @testing-library/react jest`, тестуйте слайси.
- **Потенційні покращення:** Додайте помилки (toasts з react-toastify), сортування, або API-інтеграцію для серверу.

Ця інструкція максимально детальна для самостійного виконання. Якщо проблеми — перевірте консоль!
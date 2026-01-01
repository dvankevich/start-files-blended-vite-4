// src/redux/todoSlice.js
import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  currentTodo: null,
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
      console.log('state: ', state, 'action: ', action);
    },
    deleteTodo: (state, action) => {
      state.items = state.items.filter(todo => todo.id !== action.payload);
      console.log('state: ', state, 'action: ', action);
    },
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

export const { addTodo, deleteTodo, setCurrentTodo, editTodo, cancelEdit } =
  todoSlice.actions;
export const todoReducer = todoSlice.reducer;

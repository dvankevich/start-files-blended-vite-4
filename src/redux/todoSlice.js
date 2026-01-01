// src/redux/todoSlice.js
import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  // We'll add currentTodo in Step 4
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    // Placeholder reducers - implement in later steps
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
    // editTodo and setCurrentTodo to be added in Step 4
  },
});

export const { addTodo, deleteTodo } = todoSlice.actions;
export const todoReducer = todoSlice.reducer;

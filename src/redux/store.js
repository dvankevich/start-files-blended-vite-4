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
import { filterReducer } from './filterSlice';

// Persist config for todos.items
const todosPersistConfig = {
  key: 'todos',
  storage,
  whitelist: ['items'], // Only persist 'items'
};

export const store = configureStore({
  reducer: {
    todos: persistReducer(todosPersistConfig, todoReducer),
    filter: filterReducer, // No persistence for filter
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

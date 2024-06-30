import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import itemReducer from './slice/itemSlice';
import persistReducer from 'redux-persist/es/persistReducer';
import storage from 'redux-persist/lib/storage';
import persistStore from 'redux-persist/es/persistStore';


const rootReducer = combineReducers({user: userReducer, item: itemReducer})

const persistConfig = {
    key: 'root', 
    storage,
    version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaulMiddleware) =>
    getDefaulMiddleware ({
        serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
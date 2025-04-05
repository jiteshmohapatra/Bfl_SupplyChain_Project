import { applyMiddleware, createStore } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import ReduxPromise from "redux-promise";
import reduxThunk from "redux-thunk";

import rootReducer from "./reducers"; // Make sure the path is correct

// redux-persist configuration
const persistConfig = {
  key: "root",
  storage,
  blacklist: ["indicators", "spinner", "connection", "infoBarVisibility"], // non-persistent reducers
};

// Wrap the rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Apply middleware (do NOT call the middleware functions!)
const middleware = applyMiddleware(ReduxPromise, reduxThunk);

// Create the Redux store with middleware and persisted reducer
const store = createStore(persistedReducer, middleware);

// Create the persistor instance
const persistor = persistStore(store);

// Export store, dispatch, and persistor
export const { dispatch } = store;
export { persistor };
export default store;

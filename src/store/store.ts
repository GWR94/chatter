import thunk from "redux-thunk";
import { combineReducers, compose, applyMiddleware, Store, createStore } from "redux";
import { AppState } from "../interfaces/components.i";
import roomReducer from "../reducers/room.reducer";
import userReducer from "../reducers/user.reducer";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default (): Store => {
  const store: Store<AppState> = createStore(
    combineReducers({
      room: roomReducer,
      user: userReducer,
    }),
    composeEnhancers(applyMiddleware(thunk)),
  );
  return store;
};

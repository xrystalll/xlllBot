import React, {createContext, useReducer} from 'react';
import Reducer from './Reducer';

const initialState = {
  response: [],
  playIndex: 0,
  playing: false,
  time: 0,
  noData: false,
  mini: false
}

const StoreContext = createContext(initialState)

const Store = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, initialState)

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
    )
};

export { Store, StoreContext };

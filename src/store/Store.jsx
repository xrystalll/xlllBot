import { createContext, useReducer } from 'react';
import Reducer from './Reducer';

const langs = ['ru', 'en']
const langFromLS = langs.find(i => i === localStorage.getItem('lang'))
const langFromNL = langs.find(i => i === window.navigator.language)
const lang = langFromLS ? langFromLS : langFromNL ? langFromNL : 'en'

const adminState = ['true', 'false']
const adminFromLS = adminState.find(i => i === localStorage.getItem('admin'))
const admin = adminFromLS ? !!JSON.parse(adminFromLS || false) : false

const initialState = {
  response: [],
  playIndex: 0,
  playing: false,
  time: 0,
  noData: false,
  mini: false,
  lang,
  admin
}

const StoreContext = createContext(initialState)
StoreContext.displayName = 'StoreContext'

const Store = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, initialState)

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  )
};

export { StoreContext };
export default Store;

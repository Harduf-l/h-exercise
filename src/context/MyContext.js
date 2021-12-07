import React, { useReducer, createContext } from "react";
import myReducer from "../reducers/myReducer";

export const myContextObject = createContext();
let initalState = { appData: false, invoiceObj: false };

const MyContext = ({ children }) => {
  const [state, dispatch] = useReducer(myReducer, initalState);

  return (
    <myContextObject.Provider value={{ ...state, dispatch }}>
      {children}
    </myContextObject.Provider>
  );
};

export default MyContext;

import React, { createContext, useState } from 'react';

export const QuestionContext = createContext();

export const QuestionProvider = ({ children }) => {
  const [sets, setSets] = useState([]);

  const addSet = (name) => {
    if (name && !sets.includes(name)) {
      setSets([...sets, name]);
    }
  };

  return (
    <QuestionContext.Provider value={{ sets, addSet }}>
      {children}
    </QuestionContext.Provider>
  );
};

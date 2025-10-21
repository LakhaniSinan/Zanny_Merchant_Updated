import React, {createContext, useState, memo} from 'react';

export const AppContext = createContext();
const AppProvider = props => {
  const [user, setUser] = useState(null);
  const [cartData, setCartData] = useState([]);

  return (
    <AppContext.Provider
      value={{
        user,
        setCartData,
        cartData,
        setUser,
      }}>
      {props.children}
    </AppContext.Provider>
  );
};

export default memo(AppProvider);

import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();

const FAKE_USER = {
  name: "Ahmad",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "/public/mypic.jpg",
};

function AuthProvider({ children }) {
  const initialState = {
    user: null,
    isAuthenticated: false,
  };

  function reducer(state, action) {
    switch (action.type) {
      case "login":
        return { ...state, user: action.payLoad, isAuthenticated: true };
      case "logout":
        return { ...state, user: null, isAuthenticated: false };
      default:
        throw new Error("Unknown Action type");
    }
  }

  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState
  );

  function logIn(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      dispatch({ type: "login", payLoad: FAKE_USER });
    }
  }

  function logOut() {
    dispatch({ type: "logout" });
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("Auth was defined in outside AuthProvider");
  return context;
}
export { AuthProvider, useAuth };

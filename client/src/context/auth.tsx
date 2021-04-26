import React, { createContext, useReducer } from "react";
import jwtDecode from "jwt-decode";

const initialState = {
  user: null,
};

if (localStorage.getItem("jwtToken")) {
  const decodedToken: any = jwtDecode(String(localStorage.getItem("jwtToken")));

  if (decodedToken.exp * 1000 < Date.now()) {
    localStorage.removeItem("jwtToken");
  } else {
    initialState.user = decodedToken;
  }
}

interface ActionProps {
  type: string;
  payload?: any;
}

interface UserDataProps {
  username?: string;
  password?: string;
  token?: string;
}

interface MyContextType {
  user?: any;
  login?: any;
  logout?: any;
}

const AuthContext = createContext({
  user: null,
  login: (userData: UserDataProps) => {},
  logout: () => {},
});

const authReducer = (state: any, action: ActionProps) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};

const AuthProvider = (props: any) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = (userData: UserDataProps) => {
    localStorage.setItem("jwtToken", JSON.stringify(userData.token));
    dispatch({
      type: "LOGIN",
      payload: userData,
    });
  };

  const logout = () => {
    localStorage.removeItem("jwtToken");
    dispatch({
      type: "LOGOUT",
    });
  };

  const val = { user: state.user, login, logout };

  return <AuthContext.Provider value={val as MyContextType} {...props} />;
};

export { AuthContext, AuthProvider };

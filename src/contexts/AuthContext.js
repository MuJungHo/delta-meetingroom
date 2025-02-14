import React, { createContext, useState } from "react";
import { instance } from "../utils/apis";
const AuthContext = createContext();

function AuthProvider(props) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [padToken, setPadToken] = useState(localStorage.getItem('pad-token'));
  const [keep, setKeep] = useState(localStorage.getItem('keep') === "1");

  const padLogin = async (jwtToken) => {
    instance.defaults.headers.common['Authorization'] = jwtToken;
    
    setPadToken(jwtToken);

    localStorage.setItem('pad-token', jwtToken);
  };

  const login = async (jwtToken) => {

    instance.defaults.headers.common['Authorization'] = jwtToken;

    setToken(jwtToken);

    localStorage.setItem('keep', keep ? 1 : 0);

    if (keep) {
      localStorage.setItem('token', jwtToken);
    }
  };

  const logout = () => {

    delete instance.defaults.headers.common["Authorization"];

    setToken(null);

    localStorage.clear()
  };

  const value = {
    token,
    login,
    logout,
    setKeep,
    padLogin,
    padToken,
  };

  return <AuthContext.Provider value={value} {...props} />;
}

export { AuthContext, AuthProvider };
import React, { useContext } from 'react';
import { AuthContext } from "../contexts/AuthContext";
import { Route, Redirect } from "react-router-dom";

function PadPrivateRoute({
  children, ...rest
}) {
  const { padToken } = useContext(AuthContext);
  // console.log('PrivateRoute')
  return (
    <Route
      {...rest}
      render={
        ({ location }) => (
          padToken
            ? (
              children
            ) : (
              <Redirect
                to={{
                  pathname: '/client-login',
                  state: { from: location }
                }}
              />
            ))
      }
    />
  );
}


export default PadPrivateRoute
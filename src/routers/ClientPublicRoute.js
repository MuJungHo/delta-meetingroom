import React, { useContext } from 'react';
import { AuthContext } from "../contexts/AuthContext";
import { Route, Redirect } from "react-router-dom";

function PadPublicRoute({
  children, ...rest
}) {
  const { padToken } = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={
        ({ location }) => (
          padToken
            ? (
              <Redirect
                to={{
                  pathname: '/client',
                  state: { from: location }
                }}
              />
            ) : (
              children
            ))
      }
    />
  );
}

export default PadPublicRoute;
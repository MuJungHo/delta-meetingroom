import React, { useContext } from 'react';
import { AuthContext } from "../contexts/AuthContext";
import { Route, Redirect } from "react-router-dom";
import Layout from '../components/layout/Layout';
function PrivateRoute({
  children, ...rest
}) {
  const { token } = useContext(AuthContext);
  // console.log('PrivateRoute')
  return (
    <Route
      {...rest}
      render={
        ({ location }) => (
          token
            ? (
              <Layout>
                {children}
              </Layout>
            ) : (
              <Redirect
                to={{
                  pathname: '/login',
                  state: { from: location }
                }}
              />
            ))
      }
    />
  );
}


export default PrivateRoute
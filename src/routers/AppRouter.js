import React, {
  // useContext
} from 'react'
import { Switch, HashRouter, Route } from 'react-router-dom';
import ClientPrivateRoute from './ClientPrivateRoute';
import ClientPublicRoute from './ClientPublicRoute';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import routes from './routes'
import Login from "../Views/Login";
import ClientLogin from "../Views/ClientLogin";
import Client from "../Views/Client";


const AppRouter = () => {
  // const { role } = useContext(AuthContext);
  // console.log(role)
  return (
    <HashRouter>
      <Switch>
        <ClientPublicRoute path="/client-login">
          <ClientLogin />
        </ClientPublicRoute>
        <ClientPrivateRoute path="/client">
          <Client />
        </ClientPrivateRoute>
        <PublicRoute path="/login">
          <Login />
        </PublicRoute>
        {
          routes
            // .filter(route => route.roles.includes(role))
            .map(route =>
              <PrivateRoute key={route.path} path={route.path} exact={route.exact}>
                {route.component && <route.component />}
              </PrivateRoute>)
        }
      </Switch>
    </HashRouter>
  )
}
export default AppRouter
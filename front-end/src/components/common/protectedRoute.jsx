import React from "react";
import { Route, Redirect } from "react-router-dom";
import auth from "../../services/authService";

const ProtectedRoute = ({ path, component: Component, render, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!auth.getCurrentUser())
          return (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location },
              }}
            />
          );
        return Component ? <Component {...props} /> : render(props);
      }}
    />
  );
};

export default ProtectedRoute;

export const DeniedRoute = ({
  path,
  component: Component,
  render,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!auth.getCurrentUser() || !auth.getCurrentUser().isAdmin)
          return (
            <Redirect
              to={{
                pathname: "/AccessDenied",
                state: { from: props.location },
              }}
            />
          );
        return Component ? <Component {...props} /> : render(props);
      }}
    />
  );
};

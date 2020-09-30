import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { useAuthenticationContext } from "../AuthenticationContext";

function ProtectedRoute<T extends RouteProps = RouteProps>({
  children,
  ...rest
}: T) {
  const { authenticated } = useAuthenticationContext();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        authenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

export default ProtectedRoute;

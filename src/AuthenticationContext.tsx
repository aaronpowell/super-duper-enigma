import React, { useContext, useEffect, useState } from "react";

type ClientPrincipal = {
  identityProvider: string;
  userId: string;
  userDetails: string;
  userRoles: string[];
};

export type AuthenticationContextType = {
  authenticated: boolean;
  clientPrincipal: ClientPrincipal | undefined;
};

const AuthenticationContext = React.createContext<AuthenticationContextType>({
  authenticated: false,
  clientPrincipal: undefined,
});

const AuthenticationContextProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [clientPrincipal, setClientPrincipal] = useState<ClientPrincipal>();

  useEffect(() => {
    fetch("/.auth/me")
      .then((res) => res.json())
      .then((json) => {
        if (json.clientPrincipal) {
          setAuthenticated(true);
          setClientPrincipal(json.clientPrincipal);
        }
      });
  }, []);

  return (
    <AuthenticationContext.Provider value={{ authenticated, clientPrincipal }}>
      {children}
    </AuthenticationContext.Provider>
  );
};

const useAuthenticationContext = () => useContext(AuthenticationContext);

export {
  AuthenticationContext,
  AuthenticationContextProvider,
  useAuthenticationContext,
};

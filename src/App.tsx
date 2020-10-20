import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HomePage from "./pages/Home";
import "./App.css";
import LoginPage from "./pages/Login";
import ConnectPage from "./pages/Connect";
import CallPage from "./pages/Call";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthenticationContextProvider } from "./AuthenticationContext";
import { CallingContextProvider } from "./hooks/useCallingContext";
import { ActiveCallContextProvider } from "./hooks/useActiveCallContext";
import { UserCallSettingsContextProvider } from "./hooks/useUserCallSettings";
import { loadTheme, initializeIcons } from "@fluentui/react";

loadTheme({});
initializeIcons();

function App() {
  return (
    <AuthenticationContextProvider>
      <Router>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/login" component={LoginPage} />
          <CallingContextProvider>
            <UserCallSettingsContextProvider>
              <ActiveCallContextProvider>
                <ProtectedRoute path="/connect">
                  <ConnectPage />
                </ProtectedRoute>

                <ProtectedRoute path="/call/:groupId">
                  <CallPage />
                </ProtectedRoute>
              </ActiveCallContextProvider>
            </UserCallSettingsContextProvider>
          </CallingContextProvider>
        </Switch>
      </Router>
    </AuthenticationContextProvider>
  );
}

export default App;

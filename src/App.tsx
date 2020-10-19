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
import { CallContextProvider } from "./hooks/useCallContext";

function App() {
  return (
    <div>
      <AuthenticationContextProvider>
        <Router>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/login" component={LoginPage} />
            <CallingContextProvider>
              <CallContextProvider>
                <ProtectedRoute path="/connect">
                  <ConnectPage />
                </ProtectedRoute>

                <ProtectedRoute path="/call">
                  <CallPage />
                </ProtectedRoute>
              </CallContextProvider>
            </CallingContextProvider>
          </Switch>
        </Router>
      </AuthenticationContextProvider>
    </div>
  );
}

export default App;

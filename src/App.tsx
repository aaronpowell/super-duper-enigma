import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HomePage from "./pages/Home";
import "./App.css";
import LoginPage from "./pages/Login";
import ConnectPage from "./pages/Connect";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthenticationContextProvider } from "./AuthenticationContext";

function App() {
  return (
    <div>
      <AuthenticationContextProvider>
        <Router>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/login" component={LoginPage} />
            <ProtectedRoute path="/connect">
              <ConnectPage />
            </ProtectedRoute>
          </Switch>
        </Router>
      </AuthenticationContextProvider>
    </div>
  );
}

export default App;

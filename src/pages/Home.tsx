import React from "react";
import { useHistory } from "react-router-dom";

const HomePage = () => {
  const history = useHistory();
  return (
    <section>
      <h1>Home Page</h1>
      <p>
        Welcome to our awesome video calling application. Let's get started.
      </p>
      <button onClick={() => history.push("/connect")}>Start a call</button>
    </section>
  );
};

export default HomePage;

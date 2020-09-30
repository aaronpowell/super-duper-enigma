import React from "react";

const LoginPage = () => (
  <section>
    <h1>Login</h1>
    <ul>
      <li>
        Login via <a href="/.auth/login/github">GitHub</a>
      </li>
      <li>
        Login via <a href="/.auth/login/twitter">Twitter</a>
      </li>
    </ul>
  </section>
);

export default LoginPage;

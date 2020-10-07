import { useState, useEffect } from "react";

export type TokenResponse = {
  token: string;
  expiresOn: Date;
  communicationUserId: string;
};

const useToken = () => {
  const [token, setToken] = useState("");

  useEffect(() => {
    const run = async () => {
      const res = await fetch("/api/issueToken");
      const tokenResponse: TokenResponse = await res.json();

      setToken(tokenResponse.token);
    };

    run();
  }, []);

  return token;
};

export default useToken;

import { CallClient } from "@azure/communication-calling";
import { AzureCommunicationUserCredential } from "@azure/communication-common";
import React, { useEffect, useState } from "react";

type TokenResponse = {
  token: string;
  expiresOn: Date;
  communicationUserId: string;
};

const ConnectPage = () => {
  const [token, setToken] = useState("");
  const [client, setClient] = useState<CallClient>();

  useEffect(() => {
    const run = async () => {
      const res = await fetch("/api/issueToken");
      const tokenResponse: TokenResponse = await res.json();

      setToken(tokenResponse.token);
    };

    run();
  }, []);

  useEffect(() => {
    const run = async (callClient: CallClient, token: string) => {
      const tokenCredential = new AzureCommunicationUserCredential(token);
      const callAgent = await callClient.createCallAgent(tokenCredential);
      const deviceManager = await callClient.getDeviceManager();

      console.log(deviceManager.getMicrophoneList());
    };

    if (token) {
      const callClient = new CallClient();
      setClient(callClient);
      run(callClient, token);
    }
  }, [token]);

  return <h1>Connect</h1>;
};

export default ConnectPage;

import {
  AudioDeviceInfo,
  CallAgent,
  CallClient,
  DeviceManager,
  VideoDeviceInfo,
} from "@azure/communication-calling";
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
  const [, setCallAgent] = useState<CallAgent>();
  const [, setDeviceManager] = useState<DeviceManager>();
  const [, setCameraList] = useState<VideoDeviceInfo[]>();
  const [, setMicList] = useState<AudioDeviceInfo[]>();

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
      let callAgent: CallAgent | undefined = undefined;
      try {
        callAgent = await callClient.createCallAgent(tokenCredential);
        const deviceManager = await callClient.getDeviceManager();
        const result = await deviceManager.askDevicePermission(true, true);

        setCallAgent(callAgent);
        setDeviceManager(deviceManager);

        if (result.audio) {
          setMicList(deviceManager.getMicrophoneList());
        }

        if (result.video) {
          setCameraList(deviceManager.getCameraList());
        }
      } catch {
        if (callAgent) {
          callAgent.dispose();
        }
      }
    };

    if (token) {
      const callClient = new CallClient();
      setClient(callClient);
      run(callClient, token);
    }
  }, [token]);

  console.log(client);

  return <h1>Connect</h1>;
};

export default ConnectPage;

import {
  AudioDeviceInfo,
  CallAgent,
  CallClient,
  DeviceManager,
  VideoDeviceInfo,
} from "@azure/communication-calling";
import { AzureCommunicationUserCredential } from "@azure/communication-common";
import { useState, useEffect } from "react";

const useCallingDetails = (token?: string) => {
  const [, setClient] = useState<CallClient>();
  const [, setCallAgent] = useState<CallAgent>();
  const [, setDeviceManager] = useState<DeviceManager>();
  const [cameraList, setCameraList] = useState<VideoDeviceInfo[]>();
  const [micList, setMicList] = useState<AudioDeviceInfo[]>();

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

  return { cameraList, micList };
};

export default useCallingDetails;

import {
  AudioDeviceInfo,
  CallAgent,
  CallClient,
  DeviceManager,
  VideoDeviceInfo,
} from "@azure/communication-calling";
import { AzureCommunicationUserCredential } from "@azure/communication-common";
import React, { useState, useEffect, useContext } from "react";
import useToken from "./useToken";
import { v4 as uuid } from "uuid";

export type CallingProps = {
  micList?: AudioDeviceInfo[];
  cameraList?: VideoDeviceInfo[];
  startCall: (
    currentCamera: VideoDeviceInfo,
    currentMic: AudioDeviceInfo
  ) => void;
};

const CallingContext = React.createContext<CallingProps>({
  startCall: (_: VideoDeviceInfo, __: AudioDeviceInfo) => {
    throw new Error("Not implemented");
  },
});

export const CallingContextProvider = (props: {
  children: React.ReactNode;
}) => {
  const token = useToken();
  const [, setClient] = useState<CallClient>();
  const [callAgent, setCallAgent] = useState<CallAgent>();
  const [deviceManager, setDeviceManager] = useState<DeviceManager>();
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

  return (
    <CallingContext.Provider
      value={{
        cameraList,
        micList,
        startCall: (currentCamera, currentMic) => {
          if (deviceManager && callAgent) {
            deviceManager.setMicrophone(currentMic);

            callAgent.join({ groupId: uuid() });
          }
        },
      }}
    >
      {props.children}
    </CallingContext.Provider>
  );
};

export const useCallingContext = () => useContext(CallingContext);

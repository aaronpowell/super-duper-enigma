import {
  AudioDeviceInfo,
  Call,
  VideoDeviceInfo,
} from "@azure/communication-calling";
import React, { useState } from "react";
import { useCallingContext } from "./useCallingContext";
import { v4 as uuid } from "uuid";

type CallContextProps = {
  startCall: (
    currentCamera: VideoDeviceInfo,
    currentMic: AudioDeviceInfo
  ) => void;
};

const CallContext = React.createContext<CallContextProps>({
  startCall: (_: VideoDeviceInfo, __: AudioDeviceInfo) => {
    throw new Error("Not implemented");
  },
});

export const CallContextProvider = (props: { children: React.ReactNode }) => {
  const { deviceManager, callAgent } = useCallingContext();
  const [, setCall] = useState<Call>();
  //   const [, setLocalVideo] = useState();
  return (
    <CallContext.Provider
      value={{
        startCall: (currentCamera, currentMic) => {
          if (deviceManager && callAgent) {
            deviceManager.setMicrophone(currentMic);

            const call = callAgent.join({ groupId: uuid() });

            setCall(call);

            call.on("localVideoStreamsUpdated", (e) => {
              console.log(`localVideoStreamsUpdated`, e);
            });
            call.on("remoteParticipantsUpdated", (e) => {
              console.log("remoteParticipantsUpdated", e);
            });
          }
        },
      }}
    >
      {props.children}
    </CallContext.Provider>
  );
};

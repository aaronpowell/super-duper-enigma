import {
  AudioDeviceInfo,
  Call,
  LocalVideoStream,
  VideoDeviceInfo,
} from "@azure/communication-calling";
import React, { useContext, useState } from "react";
import { useCallingContext } from "./useCallingContext";
import { v4 as uuid } from "uuid";
import { useHistory } from "react-router-dom";

type CallContextProps = {
  startCall: (
    currentCamera: VideoDeviceInfo,
    currentMic: AudioDeviceInfo
  ) => void;
  call?: Call;
};

const CallContext = React.createContext<CallContextProps>({
  startCall: (_: VideoDeviceInfo, __: AudioDeviceInfo) => {
    throw new Error("Not implemented");
  },
});

export const CallContextProvider = (props: { children: React.ReactNode }) => {
  const history = useHistory();
  const { deviceManager, callAgent } = useCallingContext();
  const [call, setCall] = useState<Call>();
  //   const [, setLocalVideo] = useState();
  return (
    <CallContext.Provider
      value={{
        call,
        startCall: (currentCamera, currentMic) => {
          if (deviceManager && callAgent) {
            deviceManager.setMicrophone(currentMic);

            const call = callAgent.join(
              { groupId: uuid() },
              {
                videoOptions: {
                  localVideoStreams: [new LocalVideoStream(currentCamera)],
                },
              }
            );

            setCall(call);

            call.on("localVideoStreamsUpdated", (e) => {
              console.log(`localVideoStreamsUpdated`, e);
            });
            call.on("remoteParticipantsUpdated", (e) => {
              console.log("remoteParticipantsUpdated", e);
            });

            history.push("/call");
          }
        },
      }}
    >
      {props.children}
    </CallContext.Provider>
  );
};

export const useCallContext = () => useContext(CallContext);

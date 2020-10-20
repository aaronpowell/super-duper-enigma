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

type ActiveCallContextProps = {
  startCall: (
    currentCamera: VideoDeviceInfo,
    currentMic: AudioDeviceInfo
  ) => void;
  call?: Call;
};

const ActiveCallContext = React.createContext<ActiveCallContextProps>({
  startCall: (_: VideoDeviceInfo, __: AudioDeviceInfo) => {
    throw new Error("Not implemented");
  },
});

export const ActiveCallContextProvider = (props: { children: React.ReactNode }) => {
  const history = useHistory();
  const { deviceManager, callAgent } = useCallingContext();
  const [call, setCall] = useState<Call>();
  //   const [, setLocalVideo] = useState();
  return (
    <ActiveCallContext.Provider
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
    </ActiveCallContext.Provider>
  );
};

export const useActiveCallContext = () => useContext(ActiveCallContext);

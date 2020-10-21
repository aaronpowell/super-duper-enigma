import {
  Call,
  CallState,
  LocalVideoStream,
} from "@azure/communication-calling";
import React, { useContext, useState } from "react";
import { useCallingContext } from "./useCallingContext";
import { v4 as uuid } from "uuid";
import { useHistory } from "react-router-dom";
import { useUserCallSettingsContext } from "./useUserCallSettings";

type ActiveCallContextProps = {
  startCall: () => void;
  call?: Call;
};

const ActiveCallContext = React.createContext<ActiveCallContextProps>({
  startCall: () => {
    throw new Error("Not implemented");
  },
});

export const ActiveCallContextProvider = (props: {
  children: React.ReactNode;
}) => {
  const history = useHistory();
  const { deviceManager, callAgent } = useCallingContext();
  const { currentCamera, currentMic, name } = useUserCallSettingsContext();
  const [call, setCall] = useState<Call>();
  const [, setCallState] = useState<CallState>();
  //   const [, setLocalVideo] = useState();
  return (
    <ActiveCallContext.Provider
      value={{
        call,
        startCall: () => {
          if (deviceManager && callAgent) {
            callAgent.updateDisplayName(name);
            if (currentMic) {
              deviceManager.setMicrophone(currentMic);
            }

            const groupId = uuid();
            const call = callAgent.join(
              { groupId },
              {
                videoOptions: {
                  localVideoStreams: currentCamera
                    ? [new LocalVideoStream(currentCamera)]
                    : [],
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

            call.on("callStateChanged", () => setCallState(call.state));

            history.push(`/call/${groupId}`);
          }
        },
      }}
    >
      {props.children}
    </ActiveCallContext.Provider>
  );
};

export const useActiveCallContext = () => useContext(ActiveCallContext);

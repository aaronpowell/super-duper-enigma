import {
  Call,
  CallState,
  LocalVideoStream,
  RemoteParticipant,
} from "@azure/communication-calling";
import React, { useContext, useEffect, useState, useCallback } from "react";
import { useCallingContext } from "./useCallingContext";
import { v4 as uuid } from "uuid";
import { useHistory } from "react-router-dom";
import { useUserCallSettingsContext } from "./useUserCallSettings";
import { nie } from "../utils";

type ActiveCallContextProps = {
  startCall: () => void;
  joinCall: (groupId: string) => void;
  call?: Call;
  remoteParticipants: RemoteParticipant[];
  localVideoStreams: LocalVideoStream[];
};

const ActiveCallContext = React.createContext<ActiveCallContextProps>({
  startCall: () => {
    throw new Error("Not implemented");
  },
  joinCall: nie,
  remoteParticipants: [],
  localVideoStreams: [],
});

export const ActiveCallContextProvider = (props: {
  children: React.ReactNode;
}) => {
  const history = useHistory();
  const { deviceManager, callAgent } = useCallingContext();
  const { currentCamera, currentMic, name } = useUserCallSettingsContext();
  const [call, setCall] = useState<Call>();
  const [, setCallState] = useState<CallState>();
  const [localVideoStreams, setLocalVideoStreams] = useState<
    LocalVideoStream[]
  >([]);
  const [remoteParticipants, setRemoteParticipants] = useState<
    RemoteParticipant[]
  >([]);

  const localVideoStreamsUpdated = useCallback(
    (streams: { added: LocalVideoStream[]; removed: LocalVideoStream[] }) => {
      setLocalVideoStreams(streams.added);
    },
    []
  );

  const remoteParticipantsUpdated = useCallback(
    (incomingRemoteParticipants: {
      added: RemoteParticipant[];
      removed: RemoteParticipant[];
    }) => {
      for (const participant of incomingRemoteParticipants.added) {
        participant.on("videoStreamsUpdated", (event) => {
          console.log("videoStreamsUpdate", event);
          // setStreamsToRemove(event.removed);
        });

        participant.on("participantStateChanged", () => {
          switch (participant.state) {
            case "Connected":
              console.log(
                `participant ${participant.displayName} has connected`
              );
              setRemoteParticipants((remoteParticipants) => [
                ...remoteParticipants,
                participant,
              ]);
              break;

            case "Disconnected":
              console.log(
                `participant ${participant.displayName} has disconnected`
              );
              setRemoteParticipants((remoteParticipants) => {
                const index = remoteParticipants.indexOf(participant);
                return remoteParticipants
                  .slice(0, index)
                  .concat(remoteParticipants.slice(index + 1));
              });
              break;
          }
        });

        participant.on("isSpeakingChanged", () => {
          console.log("isSpeakingChanged", participant);
        });

        participant.on("displayNameChanged", () => {
          console.log(`new name: ${participant.displayName}`);
        });
      }
    },
    []
  );

  const callStateChanged = useCallback(() => {
    if (call) {
      setCallState(call.state);
    }
  }, [call]);

  function connectToCall(groupId: string) {
    if (deviceManager && callAgent) {
      callAgent.updateDisplayName(name);
      if (currentMic) {
        deviceManager.setMicrophone(currentMic);
      }

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

      call.on("localVideoStreamsUpdated", localVideoStreamsUpdated);
      call.on("remoteParticipantsUpdated", remoteParticipantsUpdated);
      call.on("callStateChanged", callStateChanged);

      history.push(`/call/${groupId}`);
    }
  }

  useEffect(() => {
    return () => {
      if (call) {
        call.off("localVideoStreamsUpdated", localVideoStreamsUpdated);
        call.off("remoteParticipantsUpdated", remoteParticipantsUpdated);
        call.off("callStateChanged", callStateChanged);
      }
    };
  }, [
    call,
    localVideoStreamsUpdated,
    remoteParticipantsUpdated,
    callStateChanged,
  ]);

  return (
    <ActiveCallContext.Provider
      value={{
        call,
        startCall: () => connectToCall(uuid()),
        joinCall: (groupId) => connectToCall(groupId),
        localVideoStreams,
        remoteParticipants,
      }}
    >
      {props.children}
    </ActiveCallContext.Provider>
  );
};

export const useActiveCallContext = () => useContext(ActiveCallContext);

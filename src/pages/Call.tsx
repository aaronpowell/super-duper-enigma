import {
  LocalVideoStream,
  RemoteVideoStream,
  Renderer,
} from "@azure/communication-calling";
import { Stack, StackItem } from "@fluentui/react";
import React, { useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useActiveCallContext } from "../hooks/useActiveCallContext";

const VideoDisplay = (props: {
  stream: LocalVideoStream | RemoteVideoStream;
}) => {
  const vidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderer = new Renderer(props.stream);

    renderer.createView().then((view) => {
      vidRef.current!.appendChild(view.target);
    });
  }, [props.stream, vidRef]);

  return <div ref={vidRef}></div>;
};

const Call = () => {
  const {
    call,
    localVideoStreams,
    remoteParticipants,
  } = useActiveCallContext();
  const history = useHistory();
  const { groupId } = useParams<{ groupId: string }>();

  if (!call) {
    history.push(`/join/${groupId}`);
    return null;
  }

  return (
    <Stack>
      <h1>Call started!</h1>
      <ul>
        <li>ID: {call.id}</li>
        <li>State: {call.state}</li>
        <li>Muted?: {call.isMicrophoneMuted}</li>
        <li>Identity: {call.callerIdentity}</li>
      </ul>
      <Stack>
        <StackItem>
          <h2>This should be you</h2>
          {localVideoStreams.map((stream) => (
            <VideoDisplay stream={stream} />
          ))}
        </StackItem>
        <Stack>
          <h2>Here's your friends</h2>
          {remoteParticipants.map((participant) =>
            participant.videoStreams.map((stream) => (
              <VideoDisplay stream={stream} />
            ))
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Call;

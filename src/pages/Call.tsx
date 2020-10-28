import {
  LocalVideoStream,
  RemoteVideoStream,
  Renderer,
} from "@azure/communication-calling";
import { Stack, StackItem } from "@fluentui/react";
import React, { useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useActiveCallContext } from "../hooks/useActiveCallContext";
import { useUserCallSettingsContext } from "../hooks/useUserCallSettings";

const VideoDisplay = (props: {
  stream: LocalVideoStream | RemoteVideoStream;
  name?: string;
}) => {
  const vidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderer = new Renderer(props.stream);

    renderer.createView().then((view) => {
      if (vidRef.current) {
        vidRef.current.appendChild(view.target);
      }
    });
  }, [props.stream, props.name, vidRef]);

  return (
    <div className="video-display" ref={vidRef}>
      <span>{props.name}</span>
    </div>
  );
};

const Call = () => {
  const {
    call,
    localVideoStreams,
    remoteParticipants,
  } = useActiveCallContext();
  const history = useHistory();
  const { groupId } = useParams<{ groupId: string }>();
  const { name } = useUserCallSettingsContext();

  if (!call) {
    history.push(`/join/${groupId}`);
    return null;
  }

  console.log("remoteParticipants", remoteParticipants);

  return (
    <Stack>
      <StackItem>
        <h2>This should be you</h2>
        {localVideoStreams.map((stream) => (
          <VideoDisplay
            key={stream.getSource().id}
            stream={stream}
            name={name}
          />
        ))}
      </StackItem>
      <Stack>
        <h2>Here's your friends</h2>
        {remoteParticipants.map((participant) =>
          participant.videoStreams
            .filter((stream) => stream.isAvailable)
            .map((stream) => (
              <VideoDisplay
                key={stream.id}
                stream={stream}
                name={participant.displayName}
              />
            ))
        )}
      </Stack>
    </Stack>
  );
};

export default Call;

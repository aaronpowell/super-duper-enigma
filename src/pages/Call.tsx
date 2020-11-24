import {
  LocalVideoStream,
  RemoteVideoStream,
} from "@azure/communication-calling";
import { Stack, StackItem } from "@fluentui/react";
import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import CallControls from "../components/CallControls";
import VideoDisplay from "../components/VideoDisplay";
import { useActiveCallContext } from "../hooks/useActiveCallContext";
import { useUserCallSettingsContext } from "../hooks/useUserCallSettings";
import { mediaGalleryGridStyle, mediaGalleryStyle } from "../styling";
import { getId } from "../utils";

type VideoParticipant = {
  id: string;
  stream: LocalVideoStream | RemoteVideoStream;
  name: string;
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
  const [gridCol, setGridCol] = useState(1);
  const [gridRow, setGridRow] = useState(1);

  const calculateNumberOfRows = React.useCallback(
    (participants: VideoParticipant[], gridCol: number) =>
      Math.ceil((participants.length + 1) / gridCol),
    []
  );
  const calculateNumberOfColumns = React.useCallback(
    (participants: VideoParticipant[]) =>
      participants && participants.length > 0
        ? Math.ceil(Math.sqrt(participants.length + 1))
        : 1,
    []
  );

  if (!call) {
    history.push(`/join/${groupId}`);
    return null;
  }

  const videoStreams: VideoParticipant[] = [
    ...localVideoStreams.map((stream) => {
      return {
        id: stream.getSource().id,
        stream,
        name,
      };
    }),
    ...remoteParticipants
      .map((participant) => {
        return participant.videoStreams
          .filter((stream) => stream.isAvailable)
          .map((stream) => {
            return {
              id: getId(participant.identifier),
              stream,
              name: participant.displayName || getId(participant.identifier),
            };
          });
      })
      .reduce((arr, streams) => [...arr, ...streams], []),
  ];

  const numberOfColumns = calculateNumberOfColumns(videoStreams);
  if (numberOfColumns !== gridCol) setGridCol(numberOfColumns);
  const numberOfRows = calculateNumberOfRows(videoStreams, gridCol);
  if (numberOfRows !== gridRow) setGridRow(numberOfRows);

  return (
    <Stack horizontalAlign="center" verticalAlign="center">
      <StackItem>
        <CallControls />
      </StackItem>
      <StackItem>
        <Stack horizontal>
          <StackItem grow>
            <div
              className={mediaGalleryGridStyle}
              style={{
                gridTemplateRows: `repeat(${gridRow}, minmax(0, 1fr))`,
                gridTemplateColumns: `repeat(${gridCol}, 1fr)`,
              }}
            >
              {videoStreams.map(({ id, stream, name }) => {
                return (
                  <div key={id} className={mediaGalleryStyle}>
                    <VideoDisplay stream={stream} name={name} />
                  </div>
                );
              })}
            </div>
          </StackItem>
        </Stack>
      </StackItem>
    </Stack>
  );
};

export default Call;

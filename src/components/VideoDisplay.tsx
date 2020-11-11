import {
  LocalVideoStream,
  RemoteVideoStream,
  Renderer,
} from "@azure/communication-calling";
import React, { useEffect, useRef } from "react";
import { localVideoContainerStyle, mediaContainer } from "../styling";

const VideoDisplay = (props: {
  stream: LocalVideoStream | RemoteVideoStream;
  name?: string;
}) => {
  const vidRef = useRef<HTMLDivElement>(null);

  const videoStyle =
    props.stream instanceof LocalVideoStream
      ? localVideoContainerStyle
      : mediaContainer;

  useEffect(() => {
    const renderer = new Renderer(props.stream);

    renderer.createView({ scalingMode: "Crop" }).then((view) => {
      if (vidRef.current) {
        vidRef.current.appendChild(view.target);
      }
    });
  }, [props.stream, props.name, vidRef]);

  return (
    <div className="video-display">
      <div ref={vidRef} className={videoStyle}></div>
      <span>{props.name}</span>
    </div>
  );
};
export default VideoDisplay;

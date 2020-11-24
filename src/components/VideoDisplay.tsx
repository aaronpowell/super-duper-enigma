import {
  LocalVideoStream,
  RemoteVideoStream,
  Renderer,
  RendererView,
} from "@azure/communication-calling";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { localVideoContainerStyle, mediaContainer } from "../styling";

const RemoteVideoDisplay = (props: {
  stream: RemoteVideoStream;
  name?: string;
}) => {
  const vidRef = useRef<HTMLDivElement>(null);
  const [available, setAvailable] = useState(false);

  let renderView: RendererView;

  const toggleAvailability = useCallback(async () => {
    if (props.stream.isAvailable) {
      setAvailable(true);
      const r = new Renderer(props.stream);

      renderView = await r.createView({ scalingMode: "Crop" });
      if (vidRef.current) {
        vidRef.current.appendChild(renderView.target);
      }
    } else {
      setAvailable(false);

      if (renderView) {
        renderView.dispose();
      }
    }
  }, []);

  useEffect(() => {
    props.stream.on("availabilityChanged", toggleAvailability);
    if (props.stream.isAvailable) {
      toggleAvailability();
    }
  }, [props.stream, toggleAvailability]);

  return (
    <div className="video-display">
      <div
        ref={vidRef}
        className={mediaContainer}
        style={{ display: available ? "block" : "none" }}
      ></div>
      <span>{props.name}</span>
    </div>
  );
};

const LocalVideoDisplay = (props: {
  stream: LocalVideoStream;
  name?: string;
}) => {
  const vidRef = useRef<HTMLDivElement>(null);

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
      <div ref={vidRef} className={localVideoContainerStyle}></div>
      <span>{props.name}</span>
    </div>
  );
};

const VideoDisplay = (props: {
  stream: LocalVideoStream | RemoteVideoStream;
  name?: string;
}) => {
  return props.stream instanceof LocalVideoStream ? (
    <LocalVideoDisplay stream={props.stream} name={props.name} />
  ) : (
    <RemoteVideoDisplay stream={props.stream} name={props.name} />
  );
};
export default VideoDisplay;

import {
  LocalVideoStream,
  Renderer,
  VideoDeviceInfo,
} from "@azure/communication-calling";
import { useState, useEffect, useRef } from "react";

const useCameraFeed = () => {
  const [currentCamera, setCurrentCamera] = useState<VideoDeviceInfo>();
  const [vidStream, setVidStream] = useState<LocalVideoStream>();
  const [renderer, setRenderer] = useState<Renderer>();

  const vidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentCamera && !vidStream) {
      const lvs = new LocalVideoStream(currentCamera);
      setVidStream(lvs);
      const renderer = new Renderer(lvs);
      setRenderer(renderer);
      renderer.createView().then(({ target }) => {
        vidRef.current!.appendChild(target);
      });
    } else if (
      currentCamera &&
      vidStream &&
      vidStream.getSource() !== currentCamera
    ) {
      vidStream.switchSource(currentCamera);
    }
  }, [currentCamera, vidStream, vidRef]);

  useEffect(() => {
    return () => {
      if (renderer) {
        renderer.dispose();
      }
    };
  }, [renderer]);

  return { vidRef, setCurrentCamera };
};

export default useCameraFeed;

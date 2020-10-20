import { Renderer } from "@azure/communication-calling";
import React, { useEffect, useRef, useState } from "react";
import { useCallContext } from "../hooks/useCallContext";
import { useCallingContext } from "../hooks/useCallingContext";
import { useUserCallSettingsContext } from "../hooks/useUserCallSettings";

const ConnectPage = () => {
  const { cameraList, micList } = useCallingContext();
  const { startCall } = useCallContext();
  const {
    setCurrentCamera,
    setCurrentMic,
    currentCamera,
    currentMic,
    videoStream,
  } = useUserCallSettingsContext();

  const vidRef = useRef<HTMLDivElement>(null);
  const [renderer, setRenderer] = useState<Renderer>();

  useEffect(() => {
    if (videoStream && !renderer) {
      setRenderer(new Renderer(videoStream));
    }
  }, [videoStream, renderer]);

  useEffect(() => {
    if (renderer) {
      renderer.createView().then((view) => {
        vidRef.current!.appendChild(view.target);
      });
    }

    return () => {
      if (renderer) {
        renderer.dispose();
      }
    };
  }, [renderer, vidRef]);

  return (
    <section>
      <h1>Connect</h1>
      {<section ref={vidRef}></section>}
      <aside>
        {cameraList && cameraList.length && (
          <select
            onChange={(e) =>
              !e.target.value
                ? setCurrentCamera(undefined)
                : setCurrentCamera(
                    cameraList.find((item) => item.id === e.target.value)
                  )
            }
          >
            <option value="">Select a camera...</option>
            {cameraList.map((item) => (
              <option value={item.id} key={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        )}

        {micList && micList.length && (
          <select
            onChange={(e) =>
              !e.target.value
                ? setCurrentMic(undefined)
                : setCurrentMic(
                    micList.find((item) => item.id === e.target.value)
                  )
            }
          >
            <option value="">Select a mic...</option>
            {micList.map((item) => (
              <option value={item.id} key={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        )}
      </aside>
      {currentCamera && currentMic && (
        <section>
          <button onClick={() => startCall(currentCamera, currentMic)}>
            Start Call
          </button>
        </section>
      )}
    </section>
  );
};

export default ConnectPage;

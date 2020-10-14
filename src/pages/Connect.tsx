import React from "react";
import { useCallingContext } from "../hooks/useCallingContext";
import useUserCallSettings from "../hooks/useUserCallSettings";

const ConnectPage = () => {
  const { cameraList, micList, startCall } = useCallingContext();
  const {
    vidRef,
    setCurrentCamera,
    setCurrentMic,
    currentCamera,
    currentMic,
  } = useUserCallSettings();

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

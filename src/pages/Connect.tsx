import React from "react";
import useCallingDetails from "../hooks/useCallingDetails";
import useCameraFeed from "../hooks/useCameraFeed";
import useToken from "../hooks/useToken";

const ConnectPage = () => {
  const token = useToken();
  const { cameraList } = useCallingDetails(token);
  const { vidRef, setCurrentCamera } = useCameraFeed();

  return (
    <div>
      <h1>Connect</h1>
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

      {<div ref={vidRef}></div>}
    </div>
  );
};

export default ConnectPage;

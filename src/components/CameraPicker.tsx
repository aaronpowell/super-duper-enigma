import { Dropdown } from "@fluentui/react";
import React from "react";
import { useCallingContext } from "../hooks/useCallingContext";
import { useUserCallSettingsContext } from "../hooks/useUserCallSettings";

const CameraPicker = () => {
  const { cameraList } = useCallingContext();
  const { setCurrentCamera, currentCamera } = useUserCallSettingsContext();

  if (!cameraList) {
    return null;
  }

  return (
    <Dropdown
      placeholder="Select a camera..."
      options={cameraList.map((item) => ({
        key: item.id,
        text: item.name,
      }))}
      onChange={(_, selectedItem) =>
        !selectedItem
          ? setCurrentCamera(undefined)
          : setCurrentCamera(
              cameraList.find((item) => item.id === selectedItem.key)
            )
      }
      style={{ width: 400 }}
      selectedKey={currentCamera ? currentCamera.id : undefined}
    />
  );
};

export default CameraPicker;

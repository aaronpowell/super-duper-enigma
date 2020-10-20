import { Dropdown } from "@fluentui/react";
import React from "react";
import { useCallingContext } from "../hooks/useCallingContext";
import { useUserCallSettingsContext } from "../hooks/useUserCallSettings";

const MicPicker = () => {
  const { micList } = useCallingContext();
  const { setCurrentMic, currentMic } = useUserCallSettingsContext();

  if (!micList) {
    return null;
  }

  return (
    <Dropdown
      placeholder="Select a mic..."
      options={micList.map((item) => ({
        key: item.id,
        text: item.name,
      }))}
      onChange={(_, selectedItem) =>
        !selectedItem
          ? setCurrentMic(undefined)
          : setCurrentMic(micList.find((item) => item.id === selectedItem.key))
      }
      style={{ width: 400 }}
      selectedKey={currentMic ? currentMic.id : undefined}
    />
  );
};

export default MicPicker;

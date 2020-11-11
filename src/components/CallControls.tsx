import { LocalVideoStream } from "@azure/communication-calling";
import { Stack, Toggle } from "@fluentui/react";
import React, { useState } from "react";
import { useActiveCallContext } from "../hooks/useActiveCallContext";
import { useUserCallSettingsContext } from "../hooks/useUserCallSettings";

const CallControls = () => {
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const { call } = useActiveCallContext();
  const { currentCamera } = useUserCallSettingsContext();

  if (!call) {
    return null;
  }

  return (
    <Stack horizontal>
      <Toggle
        label="Enable Camera"
        onText="Yes"
        offText="No"
        onChange={(_, checked) => {
          setCameraEnabled(checked || false);
          if (!checked) {
            for (const lvs of call.localVideoStreams) {
              if (lvs.getMediaStreamType() === "Video") {
                call.stopVideo(lvs);
              }
            }
          } else if (currentCamera) {
            call.startVideo(new LocalVideoStream(currentCamera));
          }
        }}
        checked={cameraEnabled}
      />
    </Stack>
  );
};

export default CallControls;

import { PrimaryButton, Stack, StackItem } from "@fluentui/react";
import { VideoCameraEmphasisIcon } from "@fluentui/react-northstar";
import React from "react";
import UserCallSettings from "../components/UserCallSettings";
import { useActiveCallContext } from "../hooks/useActiveCallContext";
import { useUserCallSettingsContext } from "../hooks/useUserCallSettings";

const ConnectPage = () => {
  const { startCall } = useActiveCallContext();
  const { currentCamera, currentMic } = useUserCallSettingsContext();

  return (
    <Stack tokens={{ childrenGap: 20 }}>
      <h1>Create a new call</h1>
      <UserCallSettings />
      <StackItem align="center">
        {currentCamera && currentMic && (
          <PrimaryButton onClick={startCall}>
            <VideoCameraEmphasisIcon
              size="medium"
              style={{ paddingRight: "10px" }}
            />
            Start Call
          </PrimaryButton>
        )}
      </StackItem>
    </Stack>
  );
};

export default ConnectPage;

import { PrimaryButton, Stack, StackItem, TextField } from "@fluentui/react";
import { VideoCameraEmphasisIcon } from "@fluentui/react-northstar";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import UserCallSettings from "../components/UserCallSettings";
import { useActiveCallContext } from "../hooks/useActiveCallContext";
import { useUserCallSettingsContext } from "../hooks/useUserCallSettings";

const JoinCall = () => {
  const { joinCall } = useActiveCallContext();
  const params = useParams<{ groupId?: string }>();
  const [groupId, setGroupId] = useState(params.groupId);
  const { currentCamera, currentMic } = useUserCallSettingsContext();

  return (
    <Stack tokens={{ childrenGap: 10 }}>
      <StackItem>
        <h1>Join a call</h1>
        <TextField
          label="Call ID"
          placeholder="Enter call ID"
          value={groupId}
          onChange={(_, value) => setGroupId(value)}
        />
      </StackItem>
      <UserCallSettings />
      <StackItem>
        {currentCamera && currentMic && groupId && (
          <PrimaryButton onClick={() => joinCall(groupId)}>
            <VideoCameraEmphasisIcon
              size="medium"
              style={{ paddingRight: "10px" }}
            />
            Join Call
          </PrimaryButton>
        )}
      </StackItem>
    </Stack>
  );
};

export default JoinCall;

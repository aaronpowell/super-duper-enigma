import { Stack } from "@fluentui/react";
import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { useActiveCallContext } from "../hooks/useActiveCallContext";

const Call = () => {
  const { call } = useActiveCallContext();
  const history = useHistory();
  const { groupId } = useParams<{ groupId: string }>();

  if (!call) {
    history.push(`/join/${groupId}`);
    return null;
  }

  return (
    <Stack>
      <h1>Call started!</h1>
      <ul>
        <li>ID: {call.id}</li>
        <li>State: {call.state}</li>
        <li>Muted?: {call.isMicrophoneMuted}</li>
        <li>Identity: {call.callerIdentity}</li>
      </ul>
    </Stack>
  );
};

export default Call;

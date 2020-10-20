import { Spinner, Stack } from "@fluentui/react";
import React from "react";
import { useActiveCallContext } from "../hooks/useActiveCallContext";

const Call = () => {
  const { call } = useActiveCallContext();

  if (!call) {
    return (
      <Stack>
        <h1>Your call is important to us, please stand by...</h1>
        <Spinner />
      </Stack>
    );
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

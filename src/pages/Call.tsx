import React from "react";
import { useActiveCallContext } from "../hooks/useActiveCallContext";

const Call = () => {
  const { call } = useActiveCallContext();

  if (!call) {
    return <h1>Loading...</h1>;
  }

  return (
    <section>
      <h1>Call started!</h1>
      <ul>
        <li>ID: {call.id}</li>
        <li>State: {call.state}</li>
        <li>Muted?: {call.isMicrophoneMuted}</li>
        <li>Identity: {call.callerIdentity}</li>
      </ul>
    </section>
  );
};

export default Call;

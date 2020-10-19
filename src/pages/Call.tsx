import React from "react";
import { useCallContext } from "../hooks/useCallContext";

const Call = () => {
  const { call } = useCallContext();

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

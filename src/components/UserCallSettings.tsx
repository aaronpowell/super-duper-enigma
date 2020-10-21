import { Renderer } from "@azure/communication-calling";
import { Icon, Stack, StackItem, TextField, Toggle } from "@fluentui/react";
import React, { useEffect, useRef, useState } from "react";
import { useUserCallSettingsContext } from "../hooks/useUserCallSettings";
import CameraPicker from "./CameraPicker";
import MicPicker from "./MicPicker";

const UserCallSettings = () => {
  const {
    setCurrentCamera,
    setCurrentMic,
    setName,
    currentCamera,
    videoStream,
    name,
    setCameraEnabled,
    setMicEnabled,
    cameraEnabled,
    micEnabled,
  } = useUserCallSettingsContext();

  const vidRef = useRef<HTMLDivElement>(null);
  const [renderer, setRenderer] = useState<Renderer>();

  useEffect(() => {
    if (videoStream && !renderer) {
      setRenderer(new Renderer(videoStream));
    }
  }, [videoStream, renderer]);

  useEffect(() => {
    if (renderer) {
      renderer.createView().then((view) => {
        vidRef.current!.appendChild(view.target);
      });
    }

    return () => {
      if (renderer) {
        renderer.dispose();
      }
    };
  }, [renderer, vidRef]);

  return (
    <Stack horizontal tokens={{ childrenGap: 10 }}>
      <StackItem>
        {!currentCamera && (
          <Icon
            iconName="Contact"
            style={{ width: "20rem", height: "15rem", fontSize: "15rem" }}
          />
        )}
        <section
          ref={vidRef}
          style={{
            width: "20rem",
            maxHeight: "15.9375rem",
            transform: "rotateY(180deg)",
            display: currentCamera ? "block" : "none",
          }}
        ></section>
      </StackItem>
      <StackItem>
        <h2>Your Call Info</h2>
        <TextField
          label="Your Name"
          value={name}
          onChange={(_, value) => setName(value || "")}
        />
        <Toggle
          label="Enable Camera"
          onText="Yes"
          offText="No"
          onChange={(_, checked) => {
            setCameraEnabled(checked || false);
            if (!checked) {
              setCurrentCamera(undefined);
            }
          }}
          checked={cameraEnabled}
        />
        {cameraEnabled && <CameraPicker />}

        <Toggle
          label="Enable Mic"
          onText="Yes"
          offText="No"
          onChange={(_, checked) => {
            setMicEnabled(checked || false);
            if (!checked) {
              setCurrentMic(undefined);
            }
          }}
          checked={micEnabled}
        />
        {micEnabled && <MicPicker />}
      </StackItem>
    </Stack>
  );
};

export default UserCallSettings;

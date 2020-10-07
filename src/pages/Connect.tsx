import {
  AudioDeviceInfo,
  CallAgent,
  CallClient,
  DeviceManager,
  LocalVideoStream,
  Renderer,
  VideoDeviceInfo,
} from "@azure/communication-calling";
import { AzureCommunicationUserCredential } from "@azure/communication-common";
import React, { useEffect, useRef, useState } from "react";

type TokenResponse = {
  token: string;
  expiresOn: Date;
  communicationUserId: string;
};

const ConnectPage = () => {
  const [token, setToken] = useState("");
  const [, setClient] = useState<CallClient>();
  const [, setCallAgent] = useState<CallAgent>();
  const [, setDeviceManager] = useState<DeviceManager>();
  const [cameraList, setCameraList] = useState<VideoDeviceInfo[]>();
  const [, setMicList] = useState<AudioDeviceInfo[]>();
  const [currentCamera, setCurrentCamera] = useState<VideoDeviceInfo>();
  const [vidStream, setVidStream] = useState<LocalVideoStream>();
  const [renderer, setRenderer] = useState<Renderer>();

  useEffect(() => {
    const run = async () => {
      const res = await fetch("/api/issueToken");
      const tokenResponse: TokenResponse = await res.json();

      setToken(tokenResponse.token);
    };

    run();
  }, []);

  useEffect(() => {
    const run = async (callClient: CallClient, token: string) => {
      const tokenCredential = new AzureCommunicationUserCredential(token);
      let callAgent: CallAgent | undefined = undefined;
      try {
        callAgent = await callClient.createCallAgent(tokenCredential);
        const deviceManager = await callClient.getDeviceManager();
        const result = await deviceManager.askDevicePermission(true, true);

        setCallAgent(callAgent);
        setDeviceManager(deviceManager);

        if (result.audio) {
          setMicList(deviceManager.getMicrophoneList());
        }

        if (result.video) {
          setCameraList(deviceManager.getCameraList());
        }
      } catch {
        if (callAgent) {
          callAgent.dispose();
        }
      }
    };

    if (token) {
      const callClient = new CallClient();
      setClient(callClient);
      run(callClient, token);
    }
  }, [token]);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentCamera && !vidStream) {
      const lvs = new LocalVideoStream(currentCamera);
      setVidStream(lvs);
      const renderer = new Renderer(lvs);
      setRenderer(renderer);
      renderer.createView().then(({ target }) => {
        ref.current!.appendChild(target);
      });
    } else if (
      currentCamera &&
      vidStream &&
      vidStream.getSource() !== currentCamera
    ) {
      vidStream.switchSource(currentCamera);
    }
  }, [currentCamera, vidStream, ref]);

  useEffect(() => {
    return () => {
      if (renderer) {
        renderer.dispose();
      }
    };
  }, [renderer]);

  return (
    <div>
      <h1>Connect</h1>
      {cameraList && cameraList.length && (
        <select
          onChange={(e) =>
            !e.target.value
              ? setCurrentCamera(undefined)
              : setCurrentCamera(
                  cameraList.find((item) => item.id === e.target.value)
                )
          }
        >
          <option value="">Select a camera...</option>
          {cameraList.map((item) => (
            <option value={item.id} key={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      )}

      {<div ref={ref}></div>}
    </div>
  );
};

export default ConnectPage;

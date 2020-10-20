import {
  AudioDeviceInfo,
  LocalVideoStream,
  VideoDeviceInfo,
} from "@azure/communication-calling";
import React, { useState, useEffect, useContext, createContext } from "react";

export type UserCallSettingsContextType = {
  setCurrentCamera: (camera?: VideoDeviceInfo) => void;
  setCurrentMic: (mic?: AudioDeviceInfo) => void;
  currentCamera?: VideoDeviceInfo;
  currentMic?: AudioDeviceInfo;
  videoStream?: LocalVideoStream;
};

const UserCallSettingsContext = createContext<UserCallSettingsContextType>({
  setCurrentCamera: (_) => {
    throw Error("Not Implemented");
  },
  setCurrentMic: (_) => {
    throw Error("Not Implemented");
  },
});

export const UserCallSettingsContextProvider = (props: {
  children: React.ReactNode;
}) => {
  const [currentCamera, setCurrentCamera] = useState<VideoDeviceInfo>();
  const [currentMic, setCurrentMic] = useState<AudioDeviceInfo>();
  const [videoStream, setVidStream] = useState<LocalVideoStream>();

  useEffect(() => {
    if (currentCamera && !videoStream) {
      const lvs = new LocalVideoStream(currentCamera);
      setVidStream(lvs);
    } else if (
      currentCamera &&
      videoStream &&
      videoStream.getSource() !== currentCamera
    ) {
      videoStream.switchSource(currentCamera);
    }
  }, [currentCamera, videoStream]);

  return (
    <UserCallSettingsContext.Provider
      value={{
        setCurrentCamera,
        setCurrentMic,
        currentCamera,
        currentMic,
        videoStream,
      }}
    >
      {props.children}
    </UserCallSettingsContext.Provider>
  );
};

export const useUserCallSettingsContext = () =>
  useContext(UserCallSettingsContext);

// const useUserCallSettings = () => {
//   const [currentCamera, setCurrentCamera] = useState<VideoDeviceInfo>();
//   const [currentMic, setCurrentMic] = useState<AudioDeviceInfo>();
//   const [vidStream, setVidStream] = useState<LocalVideoStream>();
//   const [renderer, setRenderer] = useState<Renderer>();

//   const vidRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (currentCamera && !vidStream) {
//       const lvs = new LocalVideoStream(currentCamera);
//       setVidStream(lvs);
//       const renderer = new Renderer(lvs);
//       setRenderer(renderer);
//       renderer.createView().then(({ target }) => {
//         vidRef.current!.appendChild(target);
//       });
//     } else if (
//       currentCamera &&
//       vidStream &&
//       vidStream.getSource() !== currentCamera
//     ) {
//       vidStream.switchSource(currentCamera);
//     }
//   }, [currentCamera, vidStream, vidRef]);

//   useEffect(() => {
//     return () => {
//       if (renderer) {
//         renderer.dispose();
//       }
//     };
//   }, [renderer]);

//   return { vidRef, setCurrentCamera, setCurrentMic, currentCamera, currentMic };
// };

// export default useUserCallSettings;

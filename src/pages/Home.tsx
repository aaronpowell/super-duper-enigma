import React from "react";
import { useHistory } from "react-router-dom";
import {
  PrimaryButton,
  DefaultButton,
  Stack,
  StackItem,
} from "@fluentui/react";

const HomePage = () => {
  const history = useHistory();
  return (
    <Stack>
      <StackItem>
        <h1>Home Page</h1>
        <p>
          Welcome to our awesome video calling application. Let's get started.
        </p>
      </StackItem>
      <Stack horizontal tokens={{ childrenGap: 40 }}>
        <StackItem>
          <PrimaryButton
            onClick={() => history.push("/connect")}
            iconProps={{ iconName: "Phone" }}
          >
            Start a call
          </PrimaryButton>
        </StackItem>
        <StackItem>
          <DefaultButton
            onClick={() => history.push("/join")}
            iconProps={{ iconName: "IncomingCall" }}
          >
            Join a call
          </DefaultButton>
        </StackItem>
      </Stack>
    </Stack>
  );
};

export default HomePage;

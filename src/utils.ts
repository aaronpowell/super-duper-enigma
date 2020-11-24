import {
  CallingApplication,
  CommunicationUser,
  isCallingApplication,
  isCommunicationUser,
  isPhoneNumber,
  PhoneNumber,
  UnknownIdentifier,
} from "@azure/communication-common";

export const nie = <T extends unknown>(_: T): void => {
  throw Error("Not Implemented");
};

export const getId = (
  identifier:
    | CommunicationUser
    | CallingApplication
    | UnknownIdentifier
    | PhoneNumber
): string => {
  if (isCommunicationUser(identifier)) {
    return identifier.communicationUserId;
  } else if (isCallingApplication(identifier)) {
    return identifier.callingApplicationId;
  } else if (isPhoneNumber(identifier)) {
    return identifier.phoneNumber;
  } else {
    return identifier.id;
  }
};

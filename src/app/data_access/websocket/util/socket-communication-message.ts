export enum SocketCommunicationMessage {
  SendLocation = 'SEND-LOCATION-USER-CLIENT',
  ReceiveUserLocations = 'SEND-USER-LOCATION-SERVER',
  ReceiveManualInstruction = 'SEND-MANUAL-TRIGGER-SERVER',
  SendManualInstruction = 'SEND-MANUAL-INSTRUCTION-ADMIN-CLIENT',
}

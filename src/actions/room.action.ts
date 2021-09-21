import { Socket } from "socket.io";
import { Message } from "../interfaces/components.i";
import {
  ChangeRoomAction,
  CHANGE_ROOM,
  SET_SOCKET,
  SetSocketAction,
  ADD_MESSAGE,
  AddMessageAction,
  CLEAR_MESSAGES,
  ClearMessagesAction,
  SET_ACTIVE_ROOM,
  SetActiveRoomAction,
  ADD_ROOM,
  AddRoomAction,
  SetActiveUsersAction,
  SET_ACTIVE_USERS,
  MessageType,
} from "../interfaces/actions.i";

export const setActiveRoom = (activeRoom: string): SetActiveRoomAction => ({
  type: SET_ACTIVE_ROOM,
  activeRoom,
});

export const changeRoom = (newRoom: string): ChangeRoomAction => ({
  type: CHANGE_ROOM,
  newRoom,
});

export const addRoom = (name: string): AddRoomAction => ({
  type: ADD_ROOM,
  name,
});

export const setSocket = (socket: Socket): SetSocketAction => ({
  type: SET_SOCKET,
  socket,
});

export const addMessage = ({
  messageType,
  location = false,
  message,
}): AddMessageAction => ({
  type: ADD_MESSAGE,
  messageType,
  location,
  message,
});

export const clearMessages = (): ClearMessagesAction => ({
  type: CLEAR_MESSAGES,
});

export const setActiveUsers = (users: number, room): SetActiveUsersAction => ({
  type: SET_ACTIVE_USERS,
  users,
  room,
});

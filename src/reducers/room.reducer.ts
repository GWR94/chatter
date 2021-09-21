import { RoomsState, RoomProps, MessageProps } from "../interfaces/components.i";
import {
  ChangeRoomAction,
  CHANGE_ROOM,
  SetSocketAction,
  SET_SOCKET,
  AddMessageAction,
  ADD_MESSAGE,
  ClearMessagesAction,
  CLEAR_MESSAGES,
  SET_ACTIVE_ROOM,
  SetActiveRoomAction,
  ADD_ROOM,
  AddRoomAction,
  SET_ACTIVE_USERS,
  SetActiveUsersAction,
} from "../interfaces/actions.i";

type RoomActionsTypes =
  | ChangeRoomAction
  | SetSocketAction
  | AddMessageAction
  | ClearMessagesAction
  | SetActiveRoomAction
  | AddRoomAction
  | SetActiveUsersAction;

const defaultRoomState: RoomsState = {
  socket: null,
  rooms: [
    {
      name: "React & Redux",
      messages: [],
      activeUsers: 0,
    },
    {
      name: "ES6+ JavaScript",
      messages: [],
      activeUsers: 0,
    },
    {
      name: "New Frameworks",
      messages: [],
      activeUsers: 0,
    },
    {
      name: "Discuss",
      messages: [],
      activeUsers: 0,
    },
    {
      name: "Design Ideas",
      messages: [],
      activeUsers: 0,
    },
    {
      name: "Chill Zone",
      messages: [],
      activeUsers: 0,
    },
  ],
  currentRoom: null,
};

export default (state = defaultRoomState, action: RoomActionsTypes): RoomsState => {
  const roomName = state.currentRoom;
  // const currentRoom = state.rooms.find((room): boolean => room.name === roomName);
  switch (action.type) {
    case SET_ACTIVE_ROOM: {
      const { activeRoom } = action;
      return {
        ...state,
        rooms: state.rooms.map(
          (room): RoomProps => {
            if (room.name === activeRoom) {
              return {
                ...room,
                activeUsers: room.activeUsers + 1,
              };
            }
            return room;
          },
        ),
        currentRoom: activeRoom,
      };
    }
    case CHANGE_ROOM: {
      const nextRoom = state.rooms.find((room): boolean => room.name === action.newRoom);
      return {
        ...state,
        rooms: state.rooms.map(
          (room): RoomProps => {
            if (room.name === roomName) {
              return {
                ...room,
                activeUsers: room.activeUsers - 1,
              };
            }
            if (room.name === nextRoom.name) {
              return {
                ...room,
                activeUsers: room.activeUsers + 1,
              };
            }
            return room;
          },
        ),
        currentRoom: action.newRoom,
      };
    }
    case SET_SOCKET:
      return {
        ...state,
        socket: action.socket,
      };
    case ADD_MESSAGE: {
      const roomName = state.currentRoom;
      const currentRoom = state.rooms.find((room): boolean => room.name === roomName);
      const newMessage: MessageProps = {
        type: action.type,
        messageType: action.messageType,
        admin: action.messageType === "message-admin",
        location: action.location,
        message: action.message,
      };
      return {
        ...state,
        rooms: state.rooms.map(
          (room): RoomProps => {
            if (room.name === roomName) {
              return {
                ...room,
                messages: [...room.messages, newMessage],
              };
            }
            return room;
          },
        ),
      };
    }
    case CLEAR_MESSAGES: {
      return {
        ...state,
        rooms: state.rooms.map(
          (room): RoomProps => {
            if (room.name === roomName) {
              return {
                ...room,
                messages: [],
              };
            }
            return room;
          },
        ),
      };
    }
    case SET_ACTIVE_USERS: {
      return {
        ...state,
        rooms: state.rooms.map(
          (room): RoomProps => {
            if (room.name === action.room) {
              return {
                ...room,
                activeUsers: action.users,
              };
            }
            return room;
          },
        ),
      };
    }
    case ADD_ROOM: {
      const newRoom: RoomProps = {
        name: action.name,
        activeUsers: 0,
        messages: [],
      };
      if (state.rooms.findIndex((room): boolean => room.name === newRoom.name) === -1) {
        return {
          ...state,
          rooms: [...state.rooms, newRoom],
          currentRoom: newRoom.name,
        };
      }
      return {
        ...state,
        currentRoom: newRoom.name,
      };
    }
    default:
      return state;
  }
};

import { Socket } from "socket.io";
import { UserProps } from "../utils/interfaces/user.i";

export interface AppState {
  room: RoomsState;
  user: UsersState;
}

export interface UsersState {
  id: string;
  name: string;
  activeRoom: string;
}

export interface LandingState {
  name: string;
  room: string;
  nameError: string;
  roomError: string;
  submitted: boolean;
}

export interface RoomsState {
  socket?: Socket;
  currentRoom: string;
  rooms: RoomProps[];
}

export interface RoomProps {
  name: string;
  messages: MessageProps[];
  activeUsers: number;
}

export interface ChatProps {
  activeRoom: string;
  room?: RoomsState;
  chosenRoom?: string;
  rooms: RoomProps;
  user?: UserProps;
  name?: string;
  socket?: Socket;
  messages?: MessageProps[];
  setSocket?: (socket: Socket) => void;
  setUser?: (user: UserProps) => void;
  addMessage?: (message: MessageProps) => void;
  setActiveRoom?: (activeRoom: string) => void;
}

export interface ChatState {
  socket: Socket;
  currentRoom: string;
  messages: MessageProps[];
}

export interface MessageProps {
  messageType: string;
  message: Message;
  admin?: boolean;
  location?: boolean;
}

export interface Message {
  sender: string;
  createdAt: number;
  text?: string;
  url?: string;
}

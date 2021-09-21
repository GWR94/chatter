import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import uuid from "uuid/v4";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io";
import { CircularProgress } from "@material-ui/core";
import Message from "./Message";
import scrollToElement from "scroll-to-element";
import SideBar from "./SideBar";
import SendMessage from "./SendMessage";
import { ChatProps, RoomsState, UsersState, AppState, Message as MessageInterface, MessageProps } from "../interfaces/components.i";
import * as roomActions from "../actions/room.action";
import * as userActions from "../actions/user.action";
import { generateMessage } from "../utils/message";

const Chat: React.FC<ChatProps> = (): JSX.Element => {
  const dispatch = useDispatch();

  const { rooms } = useSelector(({ room }: AppState): RoomsState => room);
  const { name, activeRoom } = useSelector(({ user }: AppState): UsersState => user);

  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect((): (() => void) => {
    document.title = `${activeRoom} | Chatter`;

    const endpoint =
      process.env.NODE_ENV === "production"
        ? "https://www.james-gower.dev"
        : "http://localhost:5000";

    const socket = io(endpoint);
    setSocket(socket);
    dispatch(roomActions.setSocket(socket));
    dispatch(
      userActions.setUser({
        id: socket.id,
        name,
        activeRoom: activeRoom as string,
      }),
    );
    dispatch(roomActions.setActiveRoom(activeRoom as string));

    socket.on("connect", (): void => {
      socket.emit("join", { name, activeRoom }, (size): void => {
        dispatch(roomActions.setActiveUsers(size, activeRoom));
      });
    });

    socket.on("disconnect", (): void => {
      console.log("leaving");
      socket.emit("leaveRoom", { activeRoom, name });
    });

    const scrollToBottom = (): void => {
      const messages = document.getElementById("messages");
      if (messages) {
        messages.scrollTop = messages.scrollHeight;
      }
    };

    socket.on("newMessage", (message): void => {
      dispatch(roomActions.addMessage({ messageType: "message", message }));
      scrollToBottom();
    });

    socket.on("newMessageSent", (message): void => {
      dispatch(roomActions.addMessage({ messageType: "message-sent", message }));
      scrollToBottom();
    });

    socket.on("newMessageAdmin", (message): void => {
      dispatch(roomActions.addMessage({ messageType: "message-admin", message }));
      scrollToBottom();
    });

    socket.on("newLocationMessage", (message): void => {
      dispatch(
        roomActions.addMessage({ messageType: "message", location: true, message }),
      );
      scrollToBottom();
    });

    socket.on("newLocationMessageSent", (message): void => {
      dispatch(
        roomActions.addMessage({ messageType: "message-sent", location: true, message }),
      );
      scrollToBottom();
    });

    return (): void => {
      socket.emit("disconnect", (): void => {
        socket.leaveAll();
        console.log("Disconnected from server");
      });
    };
  }, []);


  const messages: MessageProps[] = activeRoom
    ? rooms.find((room): boolean => room.name === activeRoom)?.messages as MessageProps[]
    : [];

  return socket !== null ? (
    <div className="chat__container">
      {messages && <SideBar />}
      <div className="chat__main">
        <div id="messages" className="chat__messages">
          {
            messages?.length > 0 &&
            messages.map((message): JSX.Element => <Message {...message} key={uuid()} />)}
        </div>
        <SendMessage />
      </div>
    </div>
  ) : (
    <CircularProgress />
  );
};

export default Chat;

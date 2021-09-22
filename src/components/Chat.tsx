import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import uuid from "uuid/v4";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io";
import { CircularProgress } from "@material-ui/core";
import Message from "./Message";
import SideBar from "./SideBar";
import SendMessage from "./SendMessage";
import { ChatProps, RoomsState, UsersState, AppState, MessageProps } from "../interfaces/components.i";
import * as roomActions from "../actions/room.action";
import * as userActions from "../actions/user.action";

const Chat: React.FC<ChatProps> = (): JSX.Element => {
  const dispatch = useDispatch();

  const { rooms } = useSelector(({ room }: AppState): RoomsState => room);
  const { name, activeRoom } = useSelector(({ user }: AppState): UsersState => user);

  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect((): (() => void) => {
    document.title = `${activeRoom} | Chatter`;
    // retrieve endpoint based on NODE_ENV
    const endpoint =
      process.env.NODE_ENV === "production"
        ? "https://node-chatter-app.herokuapp.com/"
        : "http://localhost:5000";

    const socket = io(endpoint);
    // set socket into store and state
    setSocket(socket);
    dispatch(roomActions.setSocket(socket));
    // set user into store with room
    dispatch(
      userActions.setUser({
        id: socket.id,
        name,
        activeRoom: activeRoom as string,
      }),
    );
    // dispatch room action to show 
    dispatch(roomActions.setActiveRoom(activeRoom as string));
    // connect to socket
    socket.on("connect", (): void => {
      socket.emit("join", { name, activeRoom }, (size): void => {
        // update active users based on room size
        dispatch(roomActions.setActiveUsers(size, activeRoom));
      });
    });
    // emit event when user disconnects
    socket.on("disconnect", (): void => {
      console.log("leaving");
      socket.emit("leaveRoom", { activeRoom, name });
    });
    // function to scroll to bottom of page when message is sent
    const scrollToBottom = (): void => {
      const messages = document.getElementById("messages");
      if (messages) {
        messages.scrollTop = messages.scrollHeight;
      }
    };
    // emit event when another message is received
    socket.on("newMessage", (message): void => {
      dispatch(roomActions.addMessage({ messageType: "message", message }));
      scrollToBottom();
    });
    // emit event when current user sends a message
    socket.on("newMessageSent", (message): void => {
      dispatch(roomActions.addMessage({ messageType: "message-sent", message }));
      scrollToBottom();
    });
    // emit event when admin sends message
    socket.on("newMessageAdmin", (message): void => {
      dispatch(roomActions.addMessage({ messageType: "message-admin", message }));
      scrollToBottom();
    });
    // emit event when location message is received
    socket.on("newLocationMessage", (message): void => {
      dispatch(
        roomActions.addMessage({ messageType: "message", location: true, message }),
      );
      scrollToBottom();
    });
    // emit event when user sends location message
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

  // retrieve messages from current room
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

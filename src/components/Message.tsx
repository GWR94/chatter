import React from "react";
import dayjs from "dayjs";
import { Typography } from "@material-ui/core";
import { MessageProps } from "../interfaces/components.i";

const Message: React.FC<MessageProps> = ({
  messageType,
  message,
  admin,
  location,
}): JSX.Element => {
  const { sender, createdAt, text, url } = message;
  const formattedTime = dayjs(createdAt).format("h:mm a");

  return (
    <div className={messageType}>
      <div className="message__title--container">
        <div className="message__title">
          {admin && <i className="message__icon fas fa-lock" />}
          <Typography className="message__title--text">{sender}</Typography>
        </div>
        <Typography className="message__timestamp">{formattedTime}</Typography>
      </div>
      <div className="message__body">
        {location ? (
          <a
            href={url}
            target="_blank noopener noreferrer"
            className="message__text--location"
          >
            My current location
          </a>
        ) : (
          <Typography className="message__text">{text}</Typography>
        )}
      </div>
    </div>
  );
};

export default Message;

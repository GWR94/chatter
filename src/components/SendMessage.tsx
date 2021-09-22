import { Button, OutlinedInput, TextField, useMediaQuery } from "@material-ui/core";
import React, { useState, ChangeEvent } from "react";
import { useSelector } from "react-redux";
import { Socket } from "socket.io";
import { AppState } from "../interfaces/components.i";
import { openSnackbar } from "../utils/components/Notifier";
import createBreakpoints from "@material-ui/core/styles/createBreakpoints";
import { LocationOnOutlined, MessageOutlined, SendOutlined } from "@material-ui/icons";

const breakpoints = createBreakpoints({});
const SendMessage = (): JSX.Element => {
  const mobile = useMediaQuery(breakpoints.only("xs"));

  const [text, setText] = useState("");
  const socket = useSelector(({ room }: AppState): Socket => room.socket);

  const onTextSubmit = (e): void => {
    e.preventDefault();
    socket.emit(
      "createMessage",
      {
        text,
      },
      (): void => {
        setText("");
      },
    );
  };

  const onLocationPress = (): void => {
    if (!navigator.geolocation) {
      return openSnackbar({
        message: "Location services not available.",
        severity: "error",
      });
    }

    return navigator.geolocation.getCurrentPosition(
      (position): void => {
        socket.emit("createLocationMessage", {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (): void => {
        openSnackbar({
          message: "Unable to retrieve location, please try again.",
          severity: "warning",
        });
      },
    );
  };

  return (
    <div className="send__container">
      <form className="send__form" onSubmit={(e): void => onTextSubmit(e)}>
        <OutlinedInput
          onChange={(e: ChangeEvent<HTMLInputElement>): void => setText(e.target.value)}
          value={text}
          name="message"
          classes={{
            root: "send__input",
          }}
          style={{ marginLeft: 3 }}
          fullWidth
          placeholder="Enter message..."
          endAdornment={<LocationOnOutlined onClick={onLocationPress} />}
        />
        <Button
          className="button__chatter"
          type="submit"
          color="primary"
          onClick={(e): void => onTextSubmit(e)}
        >
          Send
        </Button>
        {/* <Button
          className="button__chatter button__location"
          id="send-location"
          onClick={onLocationPress}
          type="button"
        >
          {!mobile ? "Send Location" : <SendOutlined />}
        </Button> */}
      </form>
    </div>
  );
};

export default SendMessage;

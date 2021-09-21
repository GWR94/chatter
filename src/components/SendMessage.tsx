import { Button, TextField } from "@material-ui/core";
import React, { useState, ChangeEvent } from "react";
import { useSelector } from "react-redux";
import { Socket } from "socket.io";
import { AppState } from "../interfaces/components.i";
import { openSnackbar } from "../utils/components/Notifier";

const SendMessage = (): JSX.Element => {
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
    const locationButton = document.getElementById("send-location") as HTMLButtonElement;

    if (!navigator.geolocation) {
      return openSnackbar({
        message: "Location services not available.",
        severity: "error",
      });
    }

    locationButton.disabled = true;
    locationButton.innerText = "Sending Location...";

    return navigator.geolocation.getCurrentPosition(
      (position): void => {
        locationButton.disabled = false;
        locationButton.innerText = "Send Location";
        socket.emit("createLocationMessage", {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (): void => {
        locationButton.disabled = false;
        locationButton.innerText = "Send Location";
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
        <TextField
          onChange={(e: ChangeEvent<HTMLInputElement>): void => setText(e.target.value)}
          value={text}
          name="message"
          variant="outlined"
          className="send__input"
          fullWidth
          placeholder="Message"
        />
        <Button
          className="button__chatter"
          type="submit"
          color="primary"
          onClick={(e): void => onTextSubmit(e)}
        >
          Send
        </Button>
        <Button
          className="button__chatter button__location"
          id="send-location"
          onClick={onLocationPress}
          type="button"
        >
          Send Location
        </Button>
      </form>
    </div>
  );
};

export default SendMessage;

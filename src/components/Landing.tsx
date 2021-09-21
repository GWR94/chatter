import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Paper, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import * as userActions from "../actions/user.action";
import * as roomActions from "../actions/room.action";
import Chat from "./Chat";
import { isRealString } from "../utils/validation";
import { AppState, LandingState, RoomsState } from "../interfaces/components.i";
import { RoomProps } from "../utils/interfaces/room.i";

const options = [
  {
    title: "React & Redux",
    group: "Programming",
  },
  {
    title: "TypeScript & ES6+ JS",
    group: "Programming",
  },
  {
    title: "Design Ideas",
    group: "Programming",
  },
  {
    title: "Chill Zone",
    group: "Relax",
  },
  {
    title: "Sports",
    group: "Relax",
  },
  {
    title: "Discussions",
    group: "Relax",
  },
];

const Landing: React.FC = (): JSX.Element => {
  const [state, setState] = useState<LandingState>({
    name: "",
    room: "",
    nameError: "",
    roomError: "",
    submitted: false,
  });

  const rooms = useSelector(({ room }: AppState): RoomProps[] => room.rooms);

  const checkRoom = (room: string): boolean => {
    console.log(rooms);
  };

  const dispatch = useDispatch();

  /*
    Open dropdown for room change on firing
  */
  const onSubmit = (): void => {
    const { name, room } = state;
    checkRoom(room);
    /*
      Check if name & room are valid strings. If they are, then set relevant state 
      to match the strings, and set submitted state to true.
    */
    if (isRealString(name) && isRealString(room)) {
      dispatch(roomActions.addRoom(room));
      dispatch(userActions.setUser({ id: null, name, activeRoom: room }));
      setState({ ...state, submitted: true });
    } else if (!isRealString(name)) {
      setState({ ...state, nameError: "Please enter a valid name" });
    }
    /*
        If either of the strings are not valid, then set the relevant error state
        to true, and show the relevant error.
      */
  };

  /*
    Change the room state to the value which has been typed/clicked on in the dropdown menu
    or room text field.
  */
  const onRoomChange = (e, value: { title: string; group: string }): void => {
    setState({ ...state, room: value.title, roomError: "" });
  };

  /*
    Change the name state to the value which has been typed in the name text field.
  */
  const onNameChange = (e): void => {
    setState({ ...state, name: e.target.value, nameError: "" });
  };

  document.title = "Join | Chatter";
  const { submitted, room, nameError, roomError, name } = state;
  /*
      If the user has not tried to connect to a room, the landing page will be shown t
      allow the user to choose a room.
    */

  if (!submitted) {
    return (
      <div className="landing__chat-container">
        <Paper className="landing__form" elevation={4}>
          <h3 className="landing__title">Join a Chat</h3>
          <TextField
            id="nameInput"
            value={name}
            label="Name"
            variant="outlined"
            placeholder="Enter your name"
            helperText={nameError}
            error={!!nameError}
            onChange={onNameChange}
          />
          <Autocomplete
            id="roomInput"
            options={options}
            freeSolo
            onChange={onRoomChange}
            groupBy={(option): string => option.group}
            getOptionLabel={(option): string => option.title}
            renderInput={(params): JSX.Element => (
              <TextField
                {...params}
                helperText={roomError}
                error={!!roomError}
                value={room}
                onChange={(e) => setState({ ...state, room: e.target.value })}
                label="Room Name"
                variant="outlined"
                placeholder="Pick a room"
              />
            )}
          />
          <Button color="primary" onClick={onSubmit}>
            Join {room}
          </Button>
        </Paper>
        {/* Below are the error tooltips which fire when there is an error in the form input */}
        {/* <Tooltip placement="top" isOpen={nameError} target="nameInput">
            Please insert a valid display name.
          </Tooltip>
          <Tooltip placement="bottom" isOpen={roomError} target="roomInput">
            Please insert a valid room name
          </Tooltip> */}
      </div>
    );
  }
  /*
      If the user has submitted a room to enter and a username, then the Chat component
      will be rendered.
    */
  return <Chat />;
};

export default Landing;

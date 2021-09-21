import React, { useEffect, useState, FC } from "react";
import uuid from "uuid/v4";
import { useSelector, useDispatch } from "react-redux";
import Badge from "@material-ui/core/Badge";
import { Typography } from "@material-ui/core";
import { Input, Button, InputGroup, InputGroupAddon } from "reactstrap";
import * as userActions from "../actions/user.action";
import * as roomActions from "../actions/room.action";
import { AppState, RoomsState, UsersState } from "../interfaces/components.i";

const SideBar: FC = (): JSX.Element => {
  const [users, setUsers] = useState([]);
  const [newRoom, setNewRoom] = useState("");
  const [isOpen, setOpen] = useState(true);

  const { name, activeRoom } = useSelector(({ user }: AppState): UsersState => user);
  const { rooms, socket } = useSelector(({ room }: AppState): RoomsState => room);

  const dispatch = useDispatch();

  const onChangeRoom = (newRoom: string): void => {
    // socket.leave(activeRoom);
    socket.emit("leaveRoom", { activeRoom, name });
    dispatch(roomActions.clearMessages());
    dispatch(
      userActions.setUser({
        id: socket.id,
        name,
        activeRoom: newRoom,
      }),
    );
    dispatch(roomActions.changeRoom(newRoom));
    socket.emit("join", { name, activeRoom: newRoom });
  };

  const onCreateRoom = (): void => {
    dispatch(roomActions.addRoom(newRoom));
    onChangeRoom(newRoom);
    setNewRoom("");
  };

  const handleSidebarVisibility = (): void => {
    const sidebar = document.getElementById("sidebar");
    setOpen(!isOpen);
    sidebar.style.width = isOpen ? "300px" : "0px";
  };

  useEffect((): void => {
    socket.on("updateUserList", (usersArr, room): void => {
      dispatch(roomActions.setActiveUsers(usersArr.length, room));
      setUsers(usersArr);
    });

    socket.on("leaveRoom", () => {
      console.log(socket.id);
    });
  }, []);

  return (
    <div className="sidebar__outer-container">
      <div className="sidebar__icon-container">
        <i
          className="fas fa-arrows-alt-h sidebar__icon"
          onClick={handleSidebarVisibility}
          role="button"
          tabIndex={0}
        />
      </div>
      <div className="sidebar__container" id="sidebar">
        <div className="sidebar__header">Chatter</div>
        <Typography className="sidebar__title">Users</Typography>
        <div className="sidebar__users-container">
          {users.map(
            (user): JSX.Element => (
              <div className="sidebar__user" key={uuid()}>
                {user}
              </div>
            ),
          )}
        </div>
        <div className="sidebar__rooms-container">
          <h3 className="sidebar__title">Rooms</h3>
          <div className="sidebar__users-container">
            {rooms.map(
              (room): JSX.Element => (
                <Badge
                  badgeContent={room.activeUsers}
                  color="secondary"
                  className="sidebar__badge"
                >
                  <div
                    className="sidebar__user"
                    tabIndex={0}
                    role="button"
                    key={room.name}
                    onClick={(): void => onChangeRoom(room.name)}
                  >
                    {room.name}
                  </div>
                </Badge>
              ),
            )}
          </div>
        </div>
        <div className="sidebar__users-container">
          <h4 className="sidebar__create-title">Create Room</h4>
          <InputGroup>
            <Input
              placeholder="Room name..."
              value={newRoom}
              onChange={(e): void => setNewRoom(e.target.value)}
            />
            <InputGroupAddon addonType="append">
              <Button color="primary" onClick={onCreateRoom}>
                Create
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </div>
    </div>
  );
};

export default SideBar;

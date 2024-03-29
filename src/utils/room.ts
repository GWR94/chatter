export class Room {
  public name: string;
  public activeUsers: number;
  public constructor(name) {
    this.name = name;
    this.activeUsers = 0;
  }
}

export class Rooms {
  public rooms: Room[];
  public roomsArr = [
    "React & Redux",
    "ES6+ JavaScript",
    "New Frameworks",
    "Discuss",
    "Design Ideas",
    "Chill Zone",
  ];

  public constructor() {
    this.rooms = [];
    this.roomsArr.forEach((room): number => this.rooms.push(new Room(room)));
  }

  public addRoom(room: string): void {
    this.rooms.push(new Room(room));
  }

  public getRoomSize(room): number {
    return this.rooms[room].activeUsers;
  }

  public addActiveUser(room): void {
    this.rooms[room].activeUsers += 1;
  }

  public removeActiveUser(room): void {
    this.rooms[room].activeUsers -= 1;
  }
}

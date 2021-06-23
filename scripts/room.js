class Room {
  constructor(roomNumber, neighbours, specialRoom) {
    this.roomNumber = roomNumber;
    this.neighbours = neighbours
    this.specialRoom = specialRoom
    this.doorRadius = 30
    this.doors = []

    this.enemiesDefeated = roomNumber == 45 || specialRoom === 'reward' || specialRoom === 'lucky' // true se a sala for a inicial, 45 ou lucky ou reward

    switch (specialRoom) {
      case 'reward':
        this.item = new Item(specialRoom)
        break
      case 'lucky':
        this.item = new Item(specialRoom)
        break
      case 'boss':
        this.bossDefeated = false
        this.doors.push({location: 'nextLevel', x: game.wall.width + this.doorRadius, y: game.wall.height + this.doorRadius})
        break
      default:
        this.item = null
    }

    this.createDoors()
  }

  createDoors() {
    let door;
    for (let [key, value] of Object.entries(this.neighbours)) {
      if (value) {
        switch (key) {
          case 'top':
            door = {
              location: key,
              x: canvas.width / 2 - this.doorRadius / 2,
              y: game.wall.height / 2 + this.doorRadius,
            }
            break;
          case 'right':
            door = {
              location: key,
              x: canvas.width - this.doorRadius / 2 - game.wall.width / 2,
              y: canvas.height / 2 - this.doorRadius / 2,
            }
            break;
          case 'down':
            door = {
              location: key,
              x: canvas.width / 2 - this.doorRadius / 2,
              y: canvas.height - game.wall.height / 2 - this.doorRadius / 2,
            }
            break;
          case 'left':
            door = {
              location: key,
              x: game.wall.width,
              y: canvas.height / 2 - this.doorRadius / 2,
            }
            break;
        }
        this.doors.push(door)
      }
    }
  }

  drawDoors() {
    for (let door of this.doors) {
      if (door.location === 'nextLevel' && this.bossDefeated) {
        context.fillStyle = "green";
        context.beginPath();
        context.arc(door.x, door.y, this.doorRadius, 0, 2 * Math.PI);
        context.fill();
      } else {
        context.fillStyle = "blue";
        context.beginPath();
        context.arc(door.x, door.y, this.doorRadius, 0, 2 * Math.PI);
        context.fill();
      }
    }
  }
}
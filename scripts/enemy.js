let enemyCounter = 0

class Enemy {
  constructor(type, level) {
    this.type = type;
    this.id = ++enemyCounter;

    switch (type) {
      case 'alien':
        this.color = 'red'
        this.hp = 5 * level
        this.movementSpeed = 1;
        this.safeDistance = 50; // Distância que vai manter do player
        this.attack = {
          damage: 1,
          speed: 5,
          ammount: 1,
          range: 200,
          current: [],
          radius: 3,
        }
        this.width = 20;
        this.height = 40;
        this.perception = {
          radius: 20
        }
        // Para o sprite
        this.image = random(2) ? document.querySelector('#enemyRedRight') : document.querySelector('#enemyBlueRight')
        this.frames = 3
        this.index = 1
        this.counter = 0
        this.iterations = 5
        break
      case 'boss':
        this.color = 'green'
        this.hp = 25 * level;
        this.movementSpeed = 2;
        this.safeDistance = 10; // Distância que vai manter do player
        this.attack = {
          damage: 2,
          speed: 7,
          ammount: 1,
          range: 300,
          current: [],
          radius: 4,
        }
        this.width = 40;
        this.height = 60;
        this.perception = {
          radius: 20
        }
        // Para o sprite
        this.image = document.querySelector('#bossRight')
        this.frames = 9
        this.index = 1
        this.counter = 0
        this.iterations = 15
        break
      case 'finalBoss':
        this.color = 'yellow'
        this.hp = 100;
        this.movementSpeed = 2;
        this.safeDistance = 10; // Distância que vai manter do player
        this.attack = {
          damage: 2,
          speed: 7,
          ammount: 1,
          range: 300,
          current: [],
          radius: 4,
        }
        this.width = 30;
        this.height = 50;
        this.perception = {
          radius: 20
        }
        break
    }

    // Para o som
    this.laserSound = new Som(document.querySelector("#laserSound"));

    this.x = this.randomPosition('x');
    this.y = this.randomPosition('y');
    this.center = {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2
    }

    if (this.type === 'finalBoss') {
      this.points = 250
    } else {
      this.points = this.hp * 2 * level
    }
  }

  randomPosition(axis) {
    let operation = random(2) ? '-' : '+'; // Probabilidade de ser 50% +
    let position;
    let enemyHere;

    switch (axis) {
      case 'x':
        do {
          position = eval(`${ canvas.width } / 2 ${ operation } ${ random(canvas.width / 2) } `)
          enemyHere = false;

          for (let i in game.enemies) { // Garante que não há inimidos em cima uns dos outros
            if (position >= game.enemies[i].x - game.securityRange.x - this.width && position <= game.enemies[i].x + game.enemies[i].width + game.securityRange.x) {
              enemyHere = true;
            }
          }
        } while(
          // Para criar dentro do canvas e meter dentro de 1 dos 4 quadrantes
          position < game.wall.width // Para não sair pela esquerda
          || position + this.width > canvas.width - game.wall.width // Para não sair pela direita
          || position >= game.player.x - game.securityRange.x - this.width && position <= game.player.x + game.player.width + game.securityRange.x // Para não ficar em cima do jogador e ainda ter o raio de segurança
          || enemyHere
          )
        break;
      case 'y':
        do {
          position = eval(`${ canvas.height } / 2 ${ operation } ${ random(canvas.height / 2) } `)
          enemyHere = false;

          for (let i in game.enemies) { // Garante que não há inimidos em cima uns dos outros
            if (position >= game.enemies[i].y - game.securityRange.y - this.height && position <= game.enemies[i].y + game.enemies[i].height + game.securityRange.y) {
              enemyHere = true;
            }
          }
        } while(
          // Para criar dentro do canvas e meter dentro de 1 dos 4 quadrantes
          position < game.wall.height // Para não sair por cima
          || position + this.height > canvas.height - game.wall.height // Para não sair por baixo
          || position >= game.player.y - game.securityRange.y - this.height && position <= game.player.y + game.player.height + game.securityRange.y // Para não ficar em cima do jogador
        )
        break;
    }

    return position;
  }

  // MOVIMENTOS
  movement() {
    if (this.playerInPerception()) {
      if ((this.center.x === game.player.center.x - this.safeDistance || this.center.x === game.player.center.x + this.safeDistance)
        && (this.center.y === game.player.center.y - this.safeDistance || this.center.y === game.player.center.y + this.safeDistance)
        || this.center.x === game.player.center.x
        || this.center.y === game.player.center.y
      ) {
        // Jogador na linha de visão
        this.fire(); // Dispara na direção do jogador
        return
      }
      if (this.center.x > game.player.center.x) { // inimigo está à esquerda do jogador
        game.isInsideMap('moveLeft', this.x, this.y, this.width, this.height) && this.moveLeft(); // Verifica se está dentro do mapa e anda para a esquerda
        if (this.center.y > game.player.center.y) { // inimigo está abaixo do jogador
          game.isInsideMap('moveUp', this.x, this.y, this.width, this.height) && this.moveUp(); // Verifica se está dentro do mapa e anda para a cima
        } else { // inimigo está acima do jogador
          game.isInsideMap('moveDown', this.x, this.y, this.width, this.height) && this.moveDown(); // Verifica se está dentro do mapa e anda para a baixo
        }
      } else { // inimigo está à esquerda do jogador
        game.isInsideMap('moveRight', this.x, this.y, this.width, this.height) && this.moveRight(); // Verifica se está dentro do mapa e anda para a direita
        if (this.center.y > game.player.center.y) { // inimigo está abaixo do jogador
          game.isInsideMap('moveUp', this.x, this.y, this.width, this.height) && this.moveUp(); // Verifica se está dentro do mapa e anda para a cima
        } else { // inimigo está acima do jogador
          game.isInsideMap('moveDown', this.x, this.y, this.width, this.height) && this.moveDown(); // Verifica se está dentro do mapa e anda para a baixo
        }
      }
    }
  }

  playerInPerception() {
    // TODO: tratar da percepção do inimigo
    return true
  }

  moveUp() {
      this.y -= this.movementSpeed;
      this.setCenter()
  }

  moveDown() {
      this.y += this.movementSpeed;
      this.setCenter()
  }

  moveLeft() {
      this.x -= this.movementSpeed;
      this.setCenter()
  }

  moveRight() {
      this.x += this.movementSpeed;
      this.setCenter()
  }

  // TIROS
  fire() {
    switch (true) {
      case this.x < game.player.x:
        // Dispara para a direita
        this.fireRight()
        break;
      case this.x > game.player.x:
        // Dispara para a esquerda
        this.fireLeft()
        break;
      case this.y < game.player.y:
        // Dispara para a baixo
        this.fireDown()
        break;
        case this.y > game.player.y:
        // Dispara para cima
        this.fireUp()
        break;
      default:
        return false;
    }
  }

  fireUp() {
    if (this.attack.current.length < this.attack.ammount) {
        this.attack.current.push({
            direction: 'UP',
            x: this.center.x,
            y: this.center.y,
            initialX: this.center.x,
            initialY: this.center.y
        })

        this.laserSound.reproduz(true)
    }
  }

  fireDown() {
      if (this.attack.current.length < this.attack.ammount) {
          this.attack.current.push({
              direction: 'DOWN',
              x: this.center.x,
              y: this.center.y,
              initialX: this.center.x,
              initialY: this.center.y
          })

          this.laserSound.reproduz(true)
      }
  }

  fireLeft() {
      if (this.attack.current.length < this.attack.ammount) {
          this.attack.current.push({
              direction: 'LEFT',
              x: this.center.x,
              y: this.center.y,
              initialX: this.center.x,
              initialY: this.center.y
          })

          this.laserSound.reproduz(true)
      }
  }

  fireRight() {
      if (this.attack.current.length < this.attack.ammount) {
          this.attack.current.push({
              direction: 'RIGHT',
              x: this.center.x,
              y: this.center.y,
              initialX: this.center.x,
              initialY: this.center.y
          });

          this.laserSound.reproduz(true)
      }
  }
  // FIM TIROS

  setCenter() {
    this.center.x = this.x + this.width / 2;
    this.center.y = this.y + this.height / 2;
  }
  // FIM MOVIMENTOS

  draw() {
      context.drawImage(this.image, this.image.width / this.frames * this.index, 0, this.image.width / this.frames, this.image.height, this.x, this.y, this.width, this.height)

      if (++this.counter % this.iterations == 0) {
        if (++this.index >= this.frames) {
          this.index = 0;
        }
      }
  }
}
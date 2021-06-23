class Item {
  constructor(itemType) {
    switch (itemType) {
      case 'reward':
        this.color = 'white'
        this.bonus = 2 // +2 de ataque
        this.points = 10
        this.image = document.querySelector('#itemReward')
        this.width = 40
        this.height = 40
        break
      case 'lucky':
        this.image = document.querySelector('#itemLucky')
        this.width = 40
        this.height = 60
        this.color = 'black'
        this.points = 50
        if (random(2)) {
          this.bonus = {
            life: 5,
            type: 'good'
          }
        } else {
          this.bonus = {
            life: 5,
            type: 'bad'
          }
        }
        break
    }

    this.catched = false
    this.x = this.randomPosition('x');
    this.y = this.randomPosition('y');
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

  draw() {
    //context.fillStyle = this.color;
    //context.fillRect(this.x, this.y, this.width, this.height);

    context.drawImage(this.image, 0, 0, this.image.width, this.image.height, this.x, this.y, this.width, this.height)
}
}
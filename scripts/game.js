class Game {
    constructor(playerType, playerName) {
        // variáveis utilizadas para o jogo
        this.keyMap = {};
        this.securityRange = { // Para evitar que o jogador e inimigos comecem demasiado próximos
            x: 10,
            y: 5
        };
        this.endGame = false
        // Para o som
        this.levelMusic = document.querySelector("#level1")
        this.playingMusic = false

        // variáveis utilizadas para o mapa
        this.map;
        this.level = 1; // Nível inicial
        this.wall = {
            width: 50,
            height: 50
        };
        this.itemRoom = false

        // variáveis utilizadas para o jogador
        this.player = new Player(playerType, playerName);

        // variáveis utilizadas para o inimigo
        this.enemies = [];
    }

    // Inicializa o jogo
    begin() {
        // criar mapa
        this.map = new Map(this.level);

        // Inicializa o mapa
        this.map.start();
    }

    // Função para controlar o jogo
    play() {
        if (this.playingMusic) {
            this.levelMusic.pause()
        } else {
            this.levelMusic.play()
        }
        // Faz update ao mapa enquanto ele não estiver totalmente carregado
        this.map.update();

        // Limpa o canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Simula a sala
        context.fillStyle = "grey"; // cor da sala enquanto não há imagem TO DO
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Desenha as portas e item (caso haja)
        if (this.map.rooms.length) {
            let room = this.map.rooms.find( r => r.roomNumber == this.map.currentRoom )
            if (room.enemiesDefeated) {
                room && room.drawDoors() // Desenha portas
                this.itemRoom && !room.item.catched && room.item.draw() // Desenha item
                this.catchItem(room) // Vê se apanha o item
                this.enterDoor(room) // Vê se entra na porta
            }
        }

        // Desenha o jogador
        this.player.draw();

        // Vai desenhar todos os inimigos
        for (let i = 0; i < this.enemies.length; i++) {
            this.enemies[i].draw();
        }

        // Move o jogador
        this.player.movement()

        // Vai andar com todos os inimigos
        for (let i = 0; i < this.enemies.length; i++) {
            this.enemies[i].movement();
        }

        // Trata da iteração de todas as balas
        this.bullets()

        this.checkEndGame()

        return !this.endGame
    }

    // COLISÕES
    collisions(elType = 'block', elType2 = 'block') {
        if (elType === elType2) {
            if (elType === 'block') {
                this.blockCollision();
            } else {
                this.circleCollision();
            }
        } else {
            this.blockWithCircleCollision();
        }
    }

    enemiesCollision(id){
        let currentEnemy = this.enemies.find( e => e.id === id); // Procura em enemies pelo enemy atual

        for (let i in this.enemies) {
            if (this.enemies[i].id != id) {
                return this.blockCollision({
                    x: currentEnemy.x,
                    y: currentEnemy.y,
                    width: currentEnemy.width,
                    height: currentEnemy.height,
                }, {
                    x: this.enemies[i].x,
                    y: this.enemies[i].y,
                    width: this.enemies[i].width,
                    height: this.enemies[i].height,
                })
            }
        }
    }

    blockCollision(block1, block2) { // Cada 1 é um objeto com x, y, width e height
        return (block1.x < block2.x + block2.width &&
                block1.x + block1.width > block2.x &&
                block1.y < block2.y + block2.height &&
                block1.y + block1.height > block2.y)
    }

    circleCollision(circle1, circle2) { // Cada 1 é um objeto com radius, x e y
        let dx = circle1.x - circle2.x;
        let dy = circle1.y - circle2.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        return distance < circle1.radius + circle2.radius
    }

    blockWithCircleCollision(block, circle) { // block tem de ter x, y, width e height e o circle tem de ter radius, x e y
        let dx = Math.abs(circle.x - (block.x + block.width / 2));
        let dy = Math.abs(circle.y - (block.y + block.height / 2));

        if (dx > circle.radius + block.width / 2) return false;
        if (dy > circle.radius + block.height / 2) return false;

        if (dx <= block.width) return true;
        if (dy <= block.height) return true;

        dx -= block.width;;
        dy -= block.height;

        return (dx * dx + dy * dy <= circle.radius * circle.radius);
    }
    // FIM COLISÕES

    // BALAS
    bullets(){
        this.bulletsPlayer(); // Movimenta as balas do jogador
        this.bulletsEnemies(); // Movimenta as balas do inimigo

        this.drawBullets();
    }

    bulletsPlayer() {
        // BALAS DO JOGADOR
        for (let i = 0; i < this.player.attack.current.length; i++) { // Percorre todas as balas do jogador
            if (this.bulletOutOfRange(this.player.attack.current[i], this.player, i)) return // Verifica se a bala ainda está no range do ataque
            if (this.bulletHit(this.player.attack.current[i], this.player, i)) return // Verifica se a bala atingiu alguém

            switch (this.player.attack.current[i].direction) {
                case 'UP':
                    this.player.attack.current[i].y -= this.player.attack.speed // Faz a bala andar
                    break;
                case 'DOWN':
                    this.player.attack.current[i].y += this.player.attack.speed // Faz a bala andar
                    break;
                case 'RIGHT':
                    this.player.attack.current[i].x += this.player.attack.speed // Faz a bala andar
                    break;
                case 'LEFT':
                    this.player.attack.current[i].x -= this.player.attack.speed // Faz a bala andar
                    break;
                default:
                    return;
            }
        }
    }

    bulletsEnemies() {
        // TODO: disparar balas dos inimigos
        for (let enemy of this.enemies) { // Percorre todos os inimigos
            for (let i = 0; i < enemy.attack.current.length; i++) { // Percorre todas as balas do jogador
                if (this.bulletOutOfRange(enemy.attack.current[i], enemy, i)) return // Verifica se a bala ainda está no range do ataque
                if (this.bulletHit(enemy.attack.current[i], enemy, i)) return // Verifica se a bala atingiu alguém

                switch (enemy.attack.current[i].direction) {
                    case 'UP':
                        enemy.attack.current[i].y -= enemy.attack.speed // Faz a bala andar
                        break;
                    case 'DOWN':
                        enemy.attack.current[i].y += enemy.attack.speed // Faz a bala andar
                        break;
                    case 'RIGHT':
                        enemy.attack.current[i].x += enemy.attack.speed // Faz a bala andar
                        break;
                    case 'LEFT':
                        enemy.attack.current[i].x -= enemy.attack.speed // Faz a bala andar
                        break;
                    default:
                        return;
                }
            }
        }
    }

    bulletHit(bullet, entity, index) {
        if (entity.type) { // Inimigo
            if (this.blockWithCircleCollision({ x: this.player.x, y: this.player.y, width: this.player.width, height: this.player.height }, { radius: entity.attack.radius, x: bullet.x, y: bullet.y, })) {
                this.damageHit(this.player, entity);
                return this.removeBullet(entity, index)
            }
        } else { // Player
            for (let enemy of this.enemies) { // Para cada bala percorre todos os inimigos para ver se atingiu algum
                if (this.blockWithCircleCollision({ x: enemy.x, y: enemy.y, width: enemy.width, height: enemy.height }, { radius: entity.attack.radius, x: bullet.x, y: bullet.y, })) {
                    this.damageHit(enemy, entity, this.enemies.indexOf(enemy));
                    return this.removeBullet(entity, index)
                }
            }
        }

        // TODO: Ver se a bala atingiu a parede

        return false
    }

    bulletOutOfRange(bullet, entity, index) {
        switch (bullet.direction) {
            case 'UP':
                if (bullet.y <= bullet.initialY - entity.attack.range) {
                    return this.removeBullet(entity, index)
                }
                break;
            case 'DOWN':
                if (bullet.y >= bullet.initialY + entity.attack.range) {
                    return this.removeBullet(entity, index)
                }
                break;
            case 'RIGHT':
                if (bullet.x >= bullet.initialX + entity.attack.range) {
                    return this.removeBullet(entity, index)
                }
                break;
            case 'LEFT':
                if (bullet.x <= bullet.initialX - entity.attack.range) {
                    return this.removeBullet(entity, index)
                }
                break;
            default:
                return false;
        }

        return false;
    }

    removeBullet(entity, index) {
        return entity.attack.current.splice(index, 1)
    }

    drawBullets() {
        // Desenha balas do johador
        for (let i = 0; i < this.player.attack.current.length; i++) { // Percorre todas as balas
            context.fillStyle = "red";
            context.beginPath();
            context.arc(this.player.attack.current[i].x, this.player.attack.current[i].y, this.player.attack.radius, 0, 2 * Math.PI);
            context.fill();
        }

        for (let enemy of this.enemies) {
            for (let i = 0; i < enemy.attack.current.length; i++) { // Percorre todas as balas
                context.fillStyle = "blue";
                context.beginPath();
                context.arc(enemy.attack.current[i].x, enemy.attack.current[i].y, enemy.attack.radius, 0, 2 * Math.PI);
                context.fill();
            }
        }

        // Desnha balas dos inimigos
        // TODO: Desenhar balas dos inimigos
    }
    // FIM BALAS

    // TRATA DO DANO
    damageHit(damagedEntity, entity, enemyIndex = -1) {
        damagedEntity.hp -= entity.attack.damage

        if (damagedEntity.hp <= 0) { // Morre
            if (damagedEntity.type) { // Inimigo
                return this.removeEnemy(enemyIndex)
            } else { // Jogador
                this.playersDeath()
            }
        }
    }
    // FIM TRATA DO DANO

    // MORTES
    removeEnemy(index) {
        let room = this.map.rooms.find( r => r.roomNumber === this.map.currentRoom)

        if (this.enemies[index].type === 'boss') {
            room.bossDefeated = true

            if (this.level === 3) this.checkEndGame(true)
        }

        this.player.score += this.enemies[index].points

        this.enemies.splice(index, 1)

        room.enemiesDefeated = this.enemies.length ? false : true
    }

    playersDeath() {
        // TODO: Tratar da morte do jogador
        //console.log('MORRESTE')
    }
    // FIM MORTES

    // Verifica se algo está dentro do mapa
    isInsideMap(moveAction, objectX, objectY, objectWidth, objectHeight) {
        switch (moveAction) {
            case "moveUp":
                if (objectY <= 0) {
                    return false;
                } else {
                    return true;
                }
                break;
            case "moveDown":
                if (objectY + objectHeight >= canvas.height) {
                    return false;
                } else {
                    return true;
                }
                break;
            case "moveLeft":
                if (objectX <= 0) {
                    return false;
                } else {
                    return true;
                }
                break;
            case "moveRight":
                if (objectX + objectWidth >= canvas.width) {
                    return false;
                } else {
                    return true;
                }
                break;
            default:
                console.log("Nome do movimento errado");
                console.error(moveAction);
        }
    }

    catchItem(room) {
        if (!room.item) return

        let playerBlock = {
            x: this.player.x,
            y: this.player.y,
            width: this.player.width,
            height: this.player.height,
        }

        let itemBlock = {
            x: room.item.x,
            y: room.item.y,
            width: room.item.width,
            height: room.item.height,
        }

        if (this.blockCollision(playerBlock, itemBlock) && !room.item.catched) { // Apanha item
            switch (room.specialRoom) {
                case 'reward':
                    this.player.attack.damage += room.item.bonus
                    break
                case 'lucky':
                    if (room.item.bonus.type === 'good') {
                        this.player.hp += room.item.bonus.life
                    } else {
                        this.player.hp -= room.item.bonus.life
                    }
                    break
            }

            this.player.score += room.item.points
            room.item.catched = true // Remove o item de jogo
        }
    }

    enterDoor(room) {
        let playerBlock = {
            x: this.player.x,
            y: this.player.y,
            width: this.player.width,
            height: this.player.height,
        }
        let doorCircle

        for (let door of room.doors) {
            doorCircle = {
                radius: room.doorRadius,
                x: door.x,
                y: door.y,
            }

            if (this.blockWithCircleCollision(playerBlock, doorCircle)) {
                switch (door.location) {
                    case 'top':
                        this.map.currentRoom = eval(` ${ this.map.currentRoom } - 10 `)
                        break
                    case 'right':
                        this.map.currentRoom = eval(` ${ this.map.currentRoom } + 1 `)
                        break
                    case 'down':
                        this.map.currentRoom = eval(` ${ this.map.currentRoom } + 10 `)
                        break
                    case 'left':
                        this.map.currentRoom = eval(` ${ this.map.currentRoom } - 1 `)
                        break
                    case 'nextLevel':
                        if (this.level === 3) {
                            // TODO: final boss
                        } else {
                            this.level++
                            this.currentRoom = '45'
                            this.map = null
                            this.begin()
                        }
                        return
                }

                this.map.currentRoom += '' // Convert to string

                this.changeRoom()
            }
        }
    }

    changeRoom() {
        let newRoom = game.map.rooms.find( r => r.roomNumber === game.map.currentRoom)

        switch (newRoom.specialRoom) {
            case 'reward':
                this.itemRoom = true
                break
            case 'lucky':
                this.itemRoom = true
                break
            case 'boss':
                this.createBoss('boss')
                this.itemRoom = false
                break
            default:
                this.createEnemies() // Cria inimigos
                this.itemRoom = false
        }

        // Limpa as teclas que estão a ser clicadas para evitar que o boneco ande sozinho enquanto muda de sala
        for (let [key, value] of Object.entries(game.keyMap)) {
            game.keyMap[key] = false
        }

        // Posiciona o jogador novamente ao centro
        this.player.x = canvas.width / 2;
        this.player.y = canvas.height / 2 - 10;
        this.player.setCenter();
    }

    createEnemies() {
        let room = this.map.rooms.find( r => r.roomNumber == this.map.currentRoom )

        if (!room.enemiesDefeated) { // Se ainda não derrotou os inimigos
            for (let i = 0; i < 2 * this.level; i++) {
                this.enemies.push(new Enemy('alien', this.level))
            }
        }
    }

    createBoss(bossType) {
        this.enemies.push(new Enemy(bossType, this.level))
    }

    checkEndGame(win = false) {
        if (this.player.hp <= 0) {
            document.querySelector('#finalScore').innerHTML = this.player.score
            this.addToHistory()

            openMenuFinal();
        }

        if (win) {
            document.querySelector('#finalMessage').innerHTML = 'GANHASTE'
            document.querySelector('#finalScore').innerHTML = this.player.score + (this.player.hp * 100) / 10
            this.addToHistory()

            playWinVideo()
        }
    }

    addToHistory() {
        let gameHistory = JSON.parse(localStorage.getItem('gameHistory') || '[]')

        let newScore = {
            player: this.player.name,
            score: this.player.score
        }

        if (!gameHistory.length) { // Primeiro score
            gameHistory.push(newScore)
        }

        for (let i = 0; i < gameHistory.length; i++) { // Vê se é melhor que alguém
            if (gameHistory[i].player.score < this.player.score) {
                gameHistory.splice(i, 0, newScore)
            }
        }

        if (gameHistory.length >= 10) {
            gameHistory.pop() // Só guarda o top 10
        } else {
            gameHistory.push(newScore)
        }

        localStorage.setItem('gameHistory', JSON.stringify(gameHistory))

        this.endGame = true
    }
}
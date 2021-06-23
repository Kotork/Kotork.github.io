class Map {
    constructor(level) {
        this.level = level;
        this.started = false;
        this.placedSpecial = null;
        this.floorplan = null;
        this.floorplanCount = null;
        this.cellQueue = null;
        this.endRooms = null;
        this.maxRooms = 15;
        this.minRooms = 7;
        this.bossRoom = null;
        this.rewardRoom = null;
        this.luckyRoom = null;
        this.rooms = [];
        this.currentRoom = '45';
    }

    // Escolhe uma sala aleatória do array de salas sem saída
    popRandomEndRoom() {
        // index é uma posição aleatória do array de salas sem saída
        let index = Math.floor(Math.random() * this.endRooms.length);

        // vai buscar a sala na posiçao index
        let room = this.endRooms[index];

        // Remove essa sala do array de salas sem saída
        this.endRooms.splice(index, 1);

        return room;
    }

    // Inicializa o mapa
    start() {
        this.started = true;
        this.placedSpecial = false;

        this.floorplan = [];
        // Inicializa o array floorplan a 0, mete todas as salas a 0
        for(var i = 0; i <= 100; i++) {
            this.floorplan[i] = 0;
        }

        this.floorplanCount = 0;
        this.cellQueue = [];
        this.endRooms = [];

        this.visit(45); // 45 porque é o centro do mapa e é a sala onde se começa o jogo
    }

    // Faz updates ao mapa até estar totalmente finalizado
    update() {
        if (this.started){
            // Valida todas as salas do array e verifica se está tudo ok
            if (this.cellQueue.length > 0) {
                let i = this.cellQueue.shift();
                let x = i % 10;
                let created = false;

                if (x > 1) created = created | this.visit(i - 1);
                if (x < 9) created = created | this.visit(i + 1);
                if (i > 20) created = created | this.visit(i - 10);
                if (i < 70) created = created | this.visit(i + 10);
                if (!created) this.endRooms.push(i);
            } else if (!this.placedSpecial) {  // Caso as salas estejam todas ok, então vai colocar as salas especiais
                if (this.floorplanCount < this.minRooms) {
                    this.start.apply(this); // Reinicia o mapa
                    return;
                }

                this.placedSpecial = true;
                this.bossRoom = this.endRooms.pop();

                this.rewardRoom = this.popRandomEndRoom();
                this.luckyRoom = this.popRandomEndRoom();

                if (!this.rewardRoom || !this.luckyRoom) {
                    this.start.apply(this); // Reinicia o mapa
                    return;
                }

                this.started = false;
            }
        } else {
            // Mapa Iniciado, vai criar as salas
            if (!this.rooms.length) {
                let neighbours
                let specialRoom

                for (let i in this.floorplan) {
                    if (this.floorplan[i]) {
                        neighbours = {
                            top: this.floorplan[+i - 10],
                            right: this.floorplan[+i + 1],
                            down: this.floorplan[+i + 10],
                            left: this.floorplan[+i - 1],
                        }

                        switch (true) {
                            case this.bossRoom == i:
                                specialRoom = 'boss'
                                break
                            case this.rewardRoom == i:
                                specialRoom = 'reward'
                                break
                            case this.luckyRoom == i:
                                specialRoom = 'lucky'
                                break
                            default:
                                specialRoom = null
                        }

                        this.rooms.push(new Room(i, neighbours, specialRoom))
                    }
                }
            }
        }
    }

    ncount(i) {
        return this.floorplan[i-10] + this.floorplan[i-1] + this.floorplan[i+1] + this.floorplan[i+10];
    }

    // Valida a sala e se estiver ok cria a sala adicionando-a ao array cellQueue
    visit(room) {
        if (this.floorplan[room]) {
            return false;
        }

        let neighbours = this.ncount(room);

        if (neighbours > 1) {
            return false;
        }

        if (this.floorplanCount >= this.maxRooms) {
            return false;
        }

        if (Math.random() < 0.5 && room != 45) {
            return false;
        }

        this.cellQueue.push(room);
        this.floorplan[room] = 1;
        this.floorplanCount += 1;

        return true;
    }
}
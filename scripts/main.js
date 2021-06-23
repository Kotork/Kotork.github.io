var canvas, context;
var game;

function iniatialize() {
    openMenuInitial()
}

function playInitialVideo() {
    let video = document.querySelector('#initialVideo')

    video.classList.remove('d-none')
    video.play()
}

// Inicializa tudo (animação, menu, jogo, etc)
function startGame() {
    document.querySelector('#initialVideo').classList.add('d-none')

    let playerType = document.querySelector('#identity1').classList.contains('active') ? 1 : 2
    let playerName = document.querySelector('#playerName').value

    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    // Cria o jogo
    game = new Game(playerType, playerName);

    // Inicializa o jogo
    game.begin();

    // Começa o jogo
    playGame()
}

// Gere o jogo
function playGame() {
    if (!game.play()) {
        game = null
        return
    }

    // Garante que a função jogo é executada cerca de 60x por segundo de forma estável
    requestAnimationFrame(playGame);
}
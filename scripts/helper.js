function random(n) {
  return Math.floor(Math.random() * n)
}

function openMenuInitial() {
  document.querySelector('#buttonOpenMenuInitial').click()
}

function openMenuPaused() {
  document.querySelector('#buttonOpenMenuPaused').click()
}

function openMenuFinal() {
  showHistory()
  document.querySelector('#buttonOpenMenuFinal').click()
}

function endMidGame() {
  game.endGame = true
}

function playWinVideo() {
  document.querySelector('#finalVideo').classList.add('d-none')
}

function selectPlayer(identity) {
  var identity1 = document.querySelector('#identity1');
  var identity2 = document.querySelector('#identity2');

  if (identity === 'identity1') {
    identity1.classList.add("active");
    identity2.classList.remove("active");
  } else {
    identity1.classList.remove("active");
    identity2.classList.add("active");
  }
}

function musicControls() {
  if (game.playingMusic) {
    game.playingMusic = false
    document.querySelector('#soundButtonActiveInitial').classList.remove('d-none')
    document.querySelector('#soundButtonActiveFinal').classList.remove('d-none')
    document.querySelector('#soundButtonActivePaused').classList.remove('d-none')
    document.querySelector('#soundButtonInactiveInitial').classList.add('d-none')
    document.querySelector('#soundButtonInactiveFinal').classList.add('d-none')
    document.querySelector('#soundButtonInactivePaused').classList.add('d-none')
  } else {
    game.playingMusic = true
    document.querySelector('#soundButtonActiveInitial').classList.add('d-none')
    document.querySelector('#soundButtonActiveFinal').classList.add('d-none')
    document.querySelector('#soundButtonActivePaused').classList.add('d-none')
    document.querySelector('#soundButtonInactiveInitial').classList.remove('d-none')
    document.querySelector('#soundButtonInactiveFinal').classList.remove('d-none')
    document.querySelector('#soundButtonInactivePaused').classList.remove('d-none')
  }
}

function showHistory() {
  let gameHistory = JSON.parse(localStorage.getItem('gameHistory') || '[]')
  let historyTable = document.querySelector('#gameHistory')


  for (let i = 0; i < gameHistory.length; i++) {
    historyTable.innerHTML += `<tr>
      <th scope="row">${ i + 1 }</th>
      <td>
        ${ gameHistory[i].player }
      </td>
      <td>
        ${ gameHistory[i].score }
      </td>
    </tr>`
  }
}

onkeydown = onkeyup = function(e){
  if (game) {
    game.keyMap[e.keyCode] = e.type == 'keydown'; // adiciona o evento ao objeto keyMap = {68: true}
  }
}
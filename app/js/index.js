var points = document.querySelectorAll('.gamefield__point');
var round = 1;

class Player {
  constructor(name, turn) {
    this.name = name;
    this.score = 0;
    this.turn = turn;
    this.picks = "";
    this.realName = "player";
  }

  updatePicks() {
    var result = '';
    [].forEach.call(document.querySelectorAll('#' + this.name), function(item) {
      result += item.getAttribute('data-index');
    });
    result = [].sort.call(result.split(''), ((a, b) => a - b));
    this.picks = result.join("");
  }

}
var player1 = new Player("player1", true);
var player2 = new Player("player2", false);


onStart();
onReset();

function onStart() {
  var start = document.querySelector('.start');
  start.addEventListener('click', function() {
    var name1 = prompt("Player 1 name: ", "John");
    setName(name1, document.querySelector('#info-player1'));
    player1.realName = name1;
    var name2 = prompt("Player 2 name: ", "Layla");
    setName(name2, document.querySelector('#info-player2'));
    player2.realName = name2;
    document.getElementById('info-player1').classList.add('player_red-active');
    start.classList.add('btn-inactive');
    document.querySelector('.reset').classList.remove('btn-inactive');
    showRound();
    initGame();
  })
}

function onReset() {
  var reset = document.querySelector('.reset');
  reset.addEventListener('click', function() {
    document.querySelector('.player ');
    resetScore(player1, true);
    resetScore(player2, true);
    resetGame();
    round = 1;
    showRound();
  })
}

function setName(name, player) {
  var nameElem = document.createTextNode('' + name);
  player.querySelector('.player__name').appendChild(nameElem);
}

function initGame() {
  [].forEach.call(points, function(point) {
    point.addEventListener('click', function() {
      var pointValue = document.createElement('i');
      if (player1.turn) {
        pointValue.classList.add('fas', 'fa-times');
        point.id = player1.name;
      } else {
        pointValue.classList.add('far', 'fa-circle');
        point.id = player2.name;
      }
      setActiveShield(100);
      setActiveBG();
      appendingPointValue(point, pointValue);
      setTimeout(function() {
        checkWinner()
      }, 200);
    })
  })
}

function setActiveShield(timeout){
  var shield = document.querySelector('.shield');
  shield.classList.add('shield-active');
  setTimeout(function(){shield.classList.remove('shield-active')}, timeout);
}

function setActiveBG() {
  if (!player1.turn) {
    document.getElementById('info-player1').classList.add('player_red-active');
    document.getElementById('info-player2').classList.remove('player_blue-active');
  } else {
    document.getElementById('info-player2').classList.add('player_blue-active');
    document.getElementById('info-player1').classList.remove('player_red-active');
  }
}

function appendingPointValue(target, elem) {
  if (!target.firstChild) {
    target.appendChild(elem);
    if (player1.turn) {
      player1.turn = false;
      player2.turn = true;
    } else {
      player2.turn = false;
      player1.turn = true;
    }
  } else {
    target.classList.add('gamefield__point_wrong');
    setTimeout(function(){
      target.classList.remove('gamefield__point_wrong');
    }, 1000);
  }
}

function checkWinner() {

  player1.updatePicks();
  player2.updatePicks();
  if (!(onWin(player1) || onWin(player2))) {
    if ((document.querySelectorAll('#player1').length + document.querySelectorAll('#player2').length) == 9) {
      showFair();
      round++;
      resetGame();
    }
  }
}

function onWin(player) {
  var winingLines = ['123', '147', '159', '258', '357', '369', '456', '789'];
  var exit = false;
  label1:
    for(var i = 0; i < winingLines.length; i++) {
      for (var j = 0; j < winingLines[i].length; j++) {
        if (player.picks.includes(winingLines[i][j])) {
          exit = true;

        } else {
          exit = false;
          break;
        }
      }
      if(winScenario(player, exit, winingLines[i])){
        round++;
        break label1;
      }
    }

  return 0;
}

function resetScore(player, full) {
  var scoreField;
  var scoreValue;
  if (full) {
    scoreField = document.querySelector('#info-' + player.name).querySelector('.player__score');
    scoreField.removeChild(scoreField.firstChild);
    scoreValue = document.createTextNode("0");
    player.score = 0;
    scoreField.appendChild(scoreValue);
  } else {
    scoreField = document.querySelector('#info-' + player.name).querySelector('.player__score');
    scoreField.removeChild(scoreField.firstChild);
    scoreValue = document.createTextNode("" + player.score);
    scoreField.appendChild(scoreValue);
  }
}

function winScenario(player, exit, line) {
  if (exit) {
    var lineArray = line.split('');
    lineArray.forEach(function(index) {
      points[index - 1].classList.add('gamefield__point_winner');
    });
    player.score += 1;
    resetScore(player);
    resetGame();
    setTimeout(function(){
        showRound();
    }, 2200);
    return exit;
  }
  return false;
}

function resetGame() {
  [].forEach.call(points, function(point) {
    if ([].includes.call(point.classList, 'gamefield__point_winner')) {
      setActiveShield(2000);
      setTimeout(function() {
        if (point.firstChild) {
          point.removeChild(point.firstChild);
          point.removeAttribute('id');
        }
        point.classList.remove('gamefield__point_winner');
      }, 2000);
    } else
    if (point.firstChild) {
      point.removeChild(point.firstChild);
      point.removeAttribute('id');
    }

  });
}

function showRound(){
  var roundField = document.querySelector('.round-counter');
  if(roundField.firstChild){
    roundField.removeChild(roundField.firstChild);
  }
  var roundValue = document.createTextNode("round " + round);
  roundField.appendChild(roundValue);
}

function showFair(){
  var fairTitle = document.querySelector('.fair-attention');
  fairTitle.classList.add('fair-attention_animate');
  setTimeout(function(){
    fairTitle.classList.remove('fair-attention_animate');
  }, 2000);
  round++;
  showRound();
}
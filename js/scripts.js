var playerTurn;
var turnNumber = 0;
var board = [[],[],[]];

var newBoard = function() {
  for(var i=0; i<3; i++) {
    for(var j=0; j<3; j++) {
      board[i][j] = new Space(i, j);
    }
  }
}
newBoard();

function Space(x, y) {
  this.x = x;
  this.y = y;
  this.token = "";
}

Space.prototype.getAdjacent = function(horiz, vert) {
  if(-1 < this.x+horiz && this.x+horiz < 3 &&  -1 < this.y+vert && this.y+vert < 3) {
    return(board[this.x+horiz][this.y+vert]);
  } else {
    return false;
  }
}
Space.prototype.isSame = function(space) {
  if(this.token===space.token && typeof space != "boolean") {
    return true;
  } else {
    return false;
  }
}

function Player(name, token) {
  this.name = name;
  this.token = token;
  this.ai = false;
}

var aiTurn = function() {
  if(playerTurn.ai) {
    while(true) {
      var x = Math.floor(Math.random() * 3);
      var y = Math.floor(Math.random() * 3);
      if(board[x][y].token==="") {
        $("[name='" + x.toString() + "-" + y.toString() + "']").append("<img class='token' src='img/" + playerTurn.token + ".png' alt='Letter'>");
        var message = playerTurn.name + " wins!";
        if(playerTurn.placeToken(x, y)) {
          if(isDraw) {
            var message = "It's a draw!"
            isDraw = false;
          }
          $("p#result").text(message);
          $(".col-xs-4").empty();
        }
        return x.toString() + "-" + y.toString()
        break;
      }
    }
  } else {
    return "";
  }
}

var isDraw = false;
Player.prototype.placeToken = function(x, y) {
  var gameOver = false;
  if(board[x][y].token==="") {
    turnNumber ++;

    var endGame = function(draw){
      gameOver = true;
      newBoard();
      turnNumber = 0;
    }

    var currentSpace = board[x][y];
    currentSpace.token = this.token;

    for(var b=-1; b<2; b+=2) {
      var a = 0;
      if(currentSpace.isSame(currentSpace.getAdjacent(a,b))) {
        if(currentSpace.isSame(currentSpace.getAdjacent(a,-1*b))) {
          endGame(false);
        } else if(currentSpace.isSame(currentSpace.getAdjacent(a*2,b*2))) {
          endGame(false);
        }
      }
    }
    for(var a=-1; a<2; a+=2) {
      var b = 0;
      if(currentSpace.isSame(currentSpace.getAdjacent(a,b))) {
        if(currentSpace.isSame(currentSpace.getAdjacent(-1*a,b))) {
          endGame(false);
        } else if(currentSpace.isSame(currentSpace.getAdjacent(a*2,b*2))) {
          endGame(false);
        }
      }
    }
    for(var a=-1; a<2; a+=2) {
      for(var b=-1; b<2; b+=2) {
        if(currentSpace.isSame(currentSpace.getAdjacent(a,b))) {
          if(currentSpace.isSame(currentSpace.getAdjacent(-1*a,-1*b))) {
            endGame(false);
          } else if(currentSpace.isSame(currentSpace.getAdjacent(a*2,b*2))) {
            endGame(false);
          }
        }
      }
    }
    if(playerTurn === players[0]) {
      playerTurn = players[1];
    } else {
      playerTurn = players[0];
    }

    if(turnNumber===9 && !gameOver) {
      endGame(true);
      isDraw = true;
    }
  }
  return gameOver;
}


var players=[];
$(document).ready(function() {
  $(".player-form").submit(function(event) {
    event.preventDefault();
    var newPlayer = new Player($("input#name").val(), $("#token").val());
    $("input#name").val("");
    players.push(newPlayer);
    if (newPlayer.token === "X") {
      $("#token").val("O");
      playerTurn = newPlayer;
    } else {
      $("#token").val("X");
    }
    $("#token").attr('disabled', 'disabled');
    if (players.length === 2) {
      $(".player-form").hide();
      $(".board").show();
    }
    if (typeof playerTurn === "undefined") {
      playerTurn = players[1];
    }
    aiTurn();
  });

  $(".col-xs-4").click(function() {
    var inputId = $(this).attr('name');
    var x = parseInt(inputId.slice(0,1));
    var y = parseInt(inputId.slice(2,3));
    if(board[x][y].token==="") {
      $(this).append("<img class='token' src='img/" + playerTurn.token + ".png' alt='Letter'>");
      var message = playerTurn.name + " wins!";
      if(playerTurn.placeToken(x,y)) {
        if(isDraw) {
          var message = "It's a draw!"
          isDraw = false;
        }
        $("p#result").text(message);
        var start = new Date().getTime();
        $(".col-xs-4").empty();
      }
    }
    aiTurn();
  });
});

// var one = new Player("P1", "X");
// var two = new Player("P2", "O");
// var playerTurn = one;
// playerTurn.placeToken(2,0,playerTurn.token);
// playerTurn.placeToken(0,0,playerTurn.token);
// playerTurn.placeToken(0,2,playerTurn.token);

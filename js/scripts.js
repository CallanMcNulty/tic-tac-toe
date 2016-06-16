var playerTurn;
var turnNumber = 0;
var gameOver = false;
var isDraw = false;
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

Player.prototype.placeToken = function(x, y) {
  //debugger;
  if(board[x][y].token!="") {
    return false;
  }
  var currentSpace = board[x][y];
  currentSpace.token = this.token;

  for(var b=-1; b<2; b+=2) {
    var a = 0;
    if(currentSpace.isSame(currentSpace.getAdjacent(a,b))) {
      if(currentSpace.isSame(currentSpace.getAdjacent(a,-1*b))) {
        gameOver = true;
      } else if(currentSpace.isSame(currentSpace.getAdjacent(a*2,b*2))) {
        gameOver = true;
      }
    }
  }
  for(var a=-1; a<2; a+=2) {
    var b = 0;
    if(currentSpace.isSame(currentSpace.getAdjacent(a,b))) {
      if(currentSpace.isSame(currentSpace.getAdjacent(-1*a,b))) {
        gameOver = true;
      } else if(currentSpace.isSame(currentSpace.getAdjacent(a*2,b*2))) {
        gameOver = true;
      }
    }
  }
  for(var a=-1; a<2; a+=2) {
    for(var b=-1; b<2; b+=2) {
      if(currentSpace.isSame(currentSpace.getAdjacent(a,b))) {
        if(currentSpace.isSame(currentSpace.getAdjacent(-1*a,-1*b))) {
          gameOver = true;
        } else if(currentSpace.isSame(currentSpace.getAdjacent(a*2,b*2))) {
          gameOver = true;
        }
      }
    }
  }
  return true;
}

var aiTurn = function() {
  var x;
  var y;
  if(turnNumber===0) {
    x = 0;
    y = 0;
  } else if(turnNumber===2) {
    if(board[2][2].token!="") {
      x = 2;
      y = 0;
    } else if(board[2][0].token!="") {
      x = 0;
      y = 2;
    } else if(board[0][2].token!="") {
      x = 2;
      y = 0;
    } else if(board[1][1].token==="") {
      x = 1;
      y = 1;
    } else {
      x = 2;
      y = 2;
    }
  } else if(turnNumber===4){
    if(board[1][1].token!="" && board[1][1].token!=playerTurn.token) {
      for(var i=0; i<3; i++) {
        for(var j=0; j<3; j++) {
          var possiblity = board[i][j].token;
          if(possiblity!="" && possiblity!=playerTurn.token && !(i===0 && j===0) && board[((i-1)*-1)+1][((j-1)*-1)+1].token==="") {
            x = ((i-1)*-1)+1;
            y = ((j-1)*-1)+1;
          }
        }
      }
    }
    if(board[2][0].token===playerTurn.token) {
      if(board[1][0].token==="") {
        x = 1;
        y = 0;
      } else if(board[0][2].token==="") {
        x = 0;
        y = 2;
      } else {
        x = 2;
        y = 2;
      }
    } else if(board[2][2].token==="") {
      x = 2;
      y = 2;
    } else if(board[2][2].token!=playerTurn.token) {
      if((board[1][2].token!="" && board[1][2].token!=playerTurn.token) || (board[1][0].token!="" && board[1][0].token!=playerTurn.token)){
        x = 0;
        y = 2;
      } else {
        x = 2;
        y = 0;
      }
    }
  } else if(turnNumber===6) {
    if((board[1][1].token!="" && board[1][1].token!=playerTurn.token)&&(board[2][2].token===playerTurn.token)) {
      for(var i=0; i<3; i++) {
        for(var j=0; j<3; j++) {
          var possiblity = board[i][j].token;
          if(possiblity!="" && possiblity!=playerTurn.token && !(i===0 && j===0) && board[((i-1)*-1)+1][((j-1)*-1)+1].token==="") {
            x = ((i-1)*-1)+1;
            y = ((j-1)*-1)+1;
          }
        }
      }
      for(var i=0; i<3; i++) {
        for(var j=0; j<3; j++) {
          var possiblity = board[i][j].token;
          if(possiblity!="" && possiblity===playerTurn.token) {
            if(j===1) {
              if(i===0 && board[i][2].token==="") {
                x = i;
                y = 2;
              } else if(board[i][0].token==="") {
                x = i;
                y = 0;
              }
            } else if (i===1) {
              if(j===0 && board[2][j].token==="") {
                x = 2;
                y = j;
              } else if(board[0][j].token==="") {
                x = 0;
                y = j;
              }
            }
          }
        }
      }
    } else if(board[1][1].token==="") {
      x = 1;
      y = 1;
    } else if(board[0][2].token===playerTurn.token) {
      if(board[2][2].token===playerTurn.token && board[1][2].token==="") {
        x = 1;
        y = 2;
      } else if(board[0][1].token==="") {
        x = 0;
        y = 1;
      } else if(board[2][0].token==="") {
        x = 2;
        y = 0;
      }
    } else if(board[2][0].token===playerTurn.token) {
      if(board[2][2].token===playerTurn.token && board[2][1].token==="") {
        x = 2;
        y = 1;
      } else if(board[1][0].token==="") {
        x = 1;
        y = 0;
      } else if(board[0][2].token==="") {
        x = 0;
        y = 2;
      }
    }
  } else if(turnNumber===8){
    for(var i=0; i<3; i++) {
      for(var j=0; j<3; j++) {
        var possiblity = board[i][j].token;
        if(possiblity!="" && possiblity!=playerTurn.token && !(i===0 && j===0) && board[((i-1)*-1)+1][((j-1)*-1)+1].token==="") {
          x = ((i-1)*-1)+1;
          y = ((j-1)*-1)+1;
        }
      }
    }
    for(var i=0; i<3; i++) {
      for(var j=0; j<3; j++) {
        var possiblity = board[i][j].token;
        if(possiblity!="" && possiblity===playerTurn.token) {
          if(j===1) {
            if(i===0 && board[i][2].token==="") {
              x = i;
              y = 2;
            } else if(board[i][0].token==="") {
              x = i;
              y = 0;
            }
          } else if (i===1) {
            if(j===0 && board[2][j].token==="") {
              x = 2;
              y = j;
            } else if(board[0][j].token==="") {
              x = 0;
              y = j;
            }
          }
        }
      }
    }
  } else {
    for(var i=0; i<3; i++) {
      for(var j=0; j<3; j++) {
        if(board[i][j].token==="") {
          x = i;
          y = j;
        }
      }
    }
    // while(true) {
    //   var x = Math.floor(Math.random() * 3);
    //   var y = Math.floor(Math.random() * 3);
    //   if(playerTurn.placeToken(x,y)) {
    //     return [x,y];
    //   }
    // }
  }
  if(playerTurn.placeToken(x,y)) {
    return [x,y];
  }
}

var humanTurn = function(x, y) {
  if(playerTurn.placeToken(x, y)) {
    return true;
  } else {
    return false;
  }
}


var takeTurn = function(x, y) {
  var successfulTurn = false;
  if(playerTurn.ai) {
    var aiCoords = aiTurn();
    if(aiCoords.length>0) {
      x = aiCoords[0];
      y = aiCoords[1];
      successfulTurn = true;
    }
  } else {
    successfulTurn = humanTurn(x, y);
  }
  if(successfulTurn) {
    $("[name='"+x.toString()+"-"+y.toString()+"']").append("<img class='token' src='img/" + playerTurn.token + ".png' alt='Letter'>");
    turnNumber ++;
    if(turnNumber===9 && !gameOver) {
      isDraw = true;
      gameOver = true;
    }
    if(gameOver) {
      turnNumber = 0;
      gameOver = false;
      if(isDraw) {
        isDraw = false;
        return "It's a draw.";
      } else {
        return playerTurn.name + " wins!";
      }
    } else {
      if(playerTurn === players[0]) {
        playerTurn = players[1];
      } else {
        playerTurn = players[0];
      }
      return "";
    }
  }
}
var players=[];
$(document).ready(function() {
  var checkAI = function() {
    if(playerTurn.ai) {
      message = takeTurn();
      if(message) {
        $("p#result").text(message);
        $("#new-game").show();
      }
    }
  }
  $(".player-form").submit(function(event) {
    event.preventDefault();
    var newPlayer = new Player($("input#name").val(), $("#token").val());
    if($("#ai").val()==="AI") {
      newPlayer.ai = true;
    }
    $("input#name").val("");
    players.push(newPlayer);
    if (newPlayer.token === "X") {
      $("#token").val("O");
      playerTurn = newPlayer;
    } else {
      $("#token").val("X");
    }
    $("#token").attr('disabled', 'disabled');
    if (typeof playerTurn === "undefined") {
      playerTurn = players[1];
    }
    if (players.length === 2) {
      $(".player-form").hide();
      $(".board").show();
      checkAI();
    }
  });
  $(".col-xs-4").click(function() {
    if($("#result").text()==="") {
      var inputId = $(this).attr('name');
      var x = parseInt(inputId.slice(0,1));
      var y = parseInt(inputId.slice(2,3));
      var message = takeTurn(x, y);
      if(message) {
        $("p#result").text(message);
        $("#new-game").show();
      }
      checkAI();
    }
  });
  $("#new-game").click(function() {
    $(".col-xs-4").empty();
    newBoard();
    $("#new-game").hide();
    $("p#result").text("");
    checkAI();
  });
});

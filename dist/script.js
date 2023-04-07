const displayController = (() => {
  const renderMessage = (message) => {
    document.getElementById("message").innerHTML = message;
  };
  return {
    renderMessage,
  };
})();

const Gameboard = (() => {
  let gameboard = ["", "", "", "", "", "", "", "", ""];
  const render = () => {
    let boardHTML = "";
    gameboard.forEach((square, index) => {
      boardHTML += `  <div 
    class="square border-solid border-2 border-gray-600 h-24 md:h-40 text-4xl font-bold flex justify-center items-center" id=square-${index}
  >
    ${square}
  </div>`;
    });
    document.querySelector("#gameboard").innerHTML = boardHTML;
    const squares = document.querySelectorAll(".square");
    squares.forEach((sq) => {
      sq.addEventListener("click", (e) => {
        Game.handleClick(e);
      });
    });
  };
  const update = (index, value) => {
    gameboard[index] = value;
    render();
  };
  const getGameboard = () => gameboard;
  return {
    render,
    update,
    getGameboard,
  };
})();

const createPlayer = (name, mark) => {
  return {
    name,
    mark,
  };
};

const Game = (() => {
  let players = [];
  let currentPlayerIndex;
  let gameOver;
  const start = () => {
    players = [
      createPlayer(document.getElementById("player1").value, "X"),
      createPlayer(document.getElementById("player2").value, "O"),
    ];
    // console.log(players);
    currentPlayerIndex = 0;
    gameOver = false;
    Gameboard.render();
  };
  const handleClick = (event) => {
    if (gameOver) {
      return;
    }
    let index = parseInt(event.target.id.split("-")[1]);
    if (Gameboard.getGameboard()[index] !== "") return;
    Gameboard.update(index, players[currentPlayerIndex].mark);

    if (
      checkForwin(Gameboard.getGameboard(), players[currentPlayerIndex].mark)
    ) {
      gameOver = true;
      displayController.renderMessage(
        `${players[currentPlayerIndex].name} won!`
      );
      //alert(`${players[currentPlayerIndex].name} won!`);
    } else if (checkForTie(Gameboard.getGameboard())) {
      gameOver = true;
      displayController.renderMessage("Its a Draw.");
    }

    currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
  };

  const restart = () => {
    for (let i = 0; i < 9; i++) {
      Gameboard.update(i, "");
    }
    Gameboard.render();
    gameOver = false;
    displayController.renderMessage("");
  };

  return {
    start,
    handleClick,
    restart,
  };
})();

function checkForwin(board) {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return true;
    }
  }
  return false;
}

function checkForTie(board) {
  return board.every((cell) => cell !== "");
}
function alertMessage(player) {
  alert(`Fill up the name for ${player}`);
}

document.getElementById("restart-button").addEventListener("click", () => {
  Game.restart();
});

const player1 = document.getElementById("player1");
const player2 = document.getElementById("player2");

document.getElementById("start-button").addEventListener("click", () => {
  if (player1.value === "") {
    alertMessage("player1");
    return;
  } else if (player2.value === "") {
    alertMessage("player2");
    return;
  } else {
    Game.start();
  }
});

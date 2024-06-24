let players = [];
let initialLetter = "";
let isFirstMove = true;
let currentWord = '';
let lastPlayer = '';

// Função para buscar os jogadores
async function fetchPlayers() {
    try {
        const response = await fetch('http://localhost:8080/players');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        players = await response.json();
        displayPlayers(players);
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

// Função para exibir os jogadores na tela
function displayPlayers(players) {
    const playersList = document.getElementById('players-list');
    playersList.innerHTML = '';
    players.forEach(player => {
        const listItem = document.createElement('li');
        listItem.textContent = `${player.name} (Points: ${player.points}) (${player.turn})`;
        playersList.appendChild(listItem);
    });
}

// Função para buscar a letra inicial
async function fetchInitialLetter() {
    try {
        const response = await fetch('http://localhost:8080/word/initialLetter');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        currentWord = await response.text();
        displayWord(currentWord);
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

// Função para exibir a letra inicial na tela
function displayWord(word) {
    const wordElement = document.getElementById('word-initial-letter');
    wordElement.textContent = `${word}`;
}

// Função para fazer a primeira jogada
async function makeFirstMove() {
    const newLetter = prompt("Enter a new letter:");
    if (newLetter === null) {
        return;
    }

    const side = prompt("Enter the side (LEFT or RIGHT):").toUpperCase();
    if (side !== 'LEFT' && side !== 'RIGHT') {
        alert('Invalid side. Please enter LEFT or RIGHT.');
        return;
    }

    const player = players[0]; // Jogador 0 (Player 1)
    console.log(player);
    const move = {
        playerOption: {
            player: player,
            letter: newLetter,
            side: side,
            option: "ADD_NEW_LETTER"
        },
        word: {
            content: currentWord
        }
    };

    try {
        const response = await fetch('http://localhost:8080/game/addNewLetter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(move)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const updatedMove = await response.json();
        currentWord = updatedMove.word.content
        document.getElementById('word-initial-letter').textContent = currentWord;
        displayWord(currentWord);
        lastPlayer = updatedMove.playerOption.player;
        fetchPlayers();
    } catch (error) {
        console.error('Fetch error:', error);
        alert('Error adding new letter.');
    }
}

// Função para adicionar uma nova letra
function promptAddLetter() {
    if (isFirstMove) {
        makeFirstMove();
        isFirstMove = false;
    } else {
        const newLetter = prompt("Enter a new letter:");
        if (newLetter === null) {
            return;
        }

        const side = prompt("Enter the side (LEFT or RIGHT):").toUpperCase();
        if (side !== 'LEFT' && side !== 'RIGHT') {
            alert('Invalid side. Please enter LEFT or RIGHT.');
            return;
        }

        const move = {
            playerOption: {
                player: lastPlayer,
                letter: newLetter,
                side: side,
                option: "ADD_NEW_LETTER"
            },
            word: {
                content: currentWord
            }
        };

        fetch('http://localhost:8080/game/addNewLetter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(move)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(updatedMove => {
                currentWord = updatedMove.word.content;
                // Atualiza a palavra na tela com o conteúdo retornado
                document.getElementById('word-initial-letter').textContent = currentWord;
                lastPlayer = updatedMove.playerOption.player;
                fetchPlayers();
                displayWord(currentWord)
            })
            .catch(error => {
                console.error('Fetch error:', error);
                alert('Error adding new letter.');
            });
    }
}

// Chamada inicial para buscar jogadores e a letra inicial ao carregar a página
window.onload = function () {
    fetchPlayers();
    fetchInitialLetter();
};

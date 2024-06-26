let players = [];
let initialLetter = "";
let isFirstMove = true;
let currentWord = '';
let lastPlayer = '';
let meaning= '';

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

        // Cria o conteúdo textual do item da lista
        const textContent = document.createTextNode(`${player.name} (Points: ${player.points}) `);

        // Cria o elemento span para o círculo colorido
        const circle = document.createElement('span');
        circle.className = player.turn ? 'green-circle' : 'red-circle';

        // Adiciona o conteúdo textual e o círculo ao item da lista
        listItem.appendChild(textContent);
        listItem.appendChild(circle);

        // Adiciona o item da lista ao elemento ul
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

// Função para exibir a palavara na tela
function displayWord(word) {
    const wordElement = document.getElementById('word-initial-letter');
    wordElement.textContent = `${word}`;
}

// Função para exibir o significado e a palavra
function displayWordAndMeaning(word) {
    const maxMeaningLength = 200;
    const wordElement = document.getElementById('word-meaning');
    wordElement.textContent = `${word.content}`;

    const meaningElement = document.getElementById('word-meaning');
    meaningElement.textContent = truncateText(word.meaning, maxMeaningLength);
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
                console.log(updatedMove)
                if (updatedMove.word.exits) {
                    currentWord = updatedMove.word;
                    document.getElementById('word-initial-letter').textContent = currentWord.content;
                    document.getElementById('word-meaning').textContent = currentWord.meaning;
                    // lastPlayer = updatedMove.playerOption.player;
                    // fetchPlayers();
                    displayWordAndMeaning(currentWord);
                } else {
                    currentWord = updatedMove.word.content;
                    document.getElementById('word-initial-letter').textContent = currentWord;
                    lastPlayer = updatedMove.playerOption.player;
                    fetchPlayers();
                    displayWord(currentWord)
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                alert('Error adding new letter.');
            });
    }
}

//Restringir quantidade de caracteres do significado (meaning)
function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
}

// Chamada inicial para buscar jogadores e a letra inicial ao carregar a página
window.onload = function () {
    fetchPlayers();
    fetchInitialLetter();
};

let players = [];
let initialLetter = "";
let isFirstMove = true;
let currentWord = '';
let meaning = '';

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
        const textContent = document.createTextNode(`${player.name} (Points: ${player.points}) `);
        const circle = document.createElement('span');
        circle.className = player.turn ? 'green-circle' : 'red-circle';
        listItem.appendChild(textContent);
        listItem.appendChild(circle);
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

// Função para exibir a palavaa na tela
function displayWord(word) {
    const wordElement = document.getElementById('word-initial-letter');
    wordElement.textContent = `${word}`;
}

// Função para exibir o significado e a palavra
function displayWordAndMeaning() {
    const maxMeaningLength = 200;
    const wordElement = document.getElementById('word-meaning');
    wordElement.textContent = `${word.content}`;

    const meaningElement = document.getElementById('word-meaning');
    meaningElement.textContent = truncateText(word.meaning, maxMeaningLength);

    const overlay = document.getElementById('overlay');
    overlay.style.display = 'block';

    overlay.addEventListener('click', () => {
        location.reload();
    });
}


//Restringir quantidade de caracteres do significado (meaning)
function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
}

function validatePlayersPoints() {
    var loser = '';
    var winner = '';
    if(players[0].points > players[1].points && players[1].points == 0){
        loser = players[1];
        winner = players[0];
        displayGameResult();
    }else if (players[1].points > players[0].points && players[0].points == 0){
        loser = players[0];
        winner = players[1];
        displayGameResult("The game is over");
    }
}

function displayGameResult(message) {
    const modal = document.getElementById('game-result-modal');
    const messageElement = document.getElementById('game-result-message');

    messageElement.textContent = message;
    modal.style.display = 'block';
}


function closeModal() {
    const modal = document.getElementById('game-result-modal');
    modal.style.display = 'none';
}

function exitGame() {
    window.close(); // Fecha a janela do navegador
}
// Chamada inicial para buscar jogadores e a letra inicial ao carregar a página
window.onload = async function () {
    await fetchPlayers();
    fetchInitialLetter();
    validatePlayersPoints();
};

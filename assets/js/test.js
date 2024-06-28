let players = [];
let initialLetter = "";
let isFirstMove = true;
let currentWord = '';
let meaning = '';
' '
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

// Função para exibir a palavara na tela
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

    // Mostra o overlay
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'block';

    // Adiciona o evento de clique para recarregar a página
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


// Chamada inicial para buscar jogadores e a letra inicial ao carregar a página
window.onload = function () {
    fetchPlayers();
    fetchInitialLetter();
};

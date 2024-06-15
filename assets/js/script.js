// js/script.js

async function fetchPlayers() {
    try {
        const response = await fetch('http://localhost:8080/players');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const players = await response.json();
        displayPlayers(players);
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

function displayPlayers(players) {
    const playersList = document.getElementById('players-list');
    playersList.innerHTML = '';
    players.forEach(player => {
        const li = document.createElement('li');
        li.textContent = `${player.name} Points: ${player.points}`;
        playersList.appendChild(li);
    });
}

async function fetchWord() {
    try {
        const response = await fetch('http://localhost:8080/word/initialLetter');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const word = await response.text();
        displayWord(word);
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

function displayWord(word) {
    const wordElement = document.getElementById('word-initial-letter');
    wordElement.textContent = `${word}`;
}

document.addEventListener("DOMContentLoaded", function () {
    fetchPlayers();
    fetchWord();
});



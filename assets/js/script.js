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
        li.textContent = `${player.name} Points: ${player.points} Turn ${player.turn}`;
        playersList.appendChild(li);
    });
}

async function fetchInitialLetter() {
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

function promptAddLetter() {
    const newLetter = prompt("Enter a new letter:");
    
    if (newLetter === null) {
        return;
    }
    const side = prompt("Enter the side (LEFT or RIGHT):").toUpperCase();
    
    if (side !== 'LEFT' && side !== 'RIGHT') {
        alert('Invalid side. Please enter LEFT or RIGHT.');
        return;
    }

    const requestBody = {
        letter: newLetter,
        side: side
    };

    fetch('/addNewLetter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
        displayWord(data);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        alert('Error adding new letter.');
    });
    
}


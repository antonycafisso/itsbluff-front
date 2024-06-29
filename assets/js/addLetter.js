window.lastPlayer = '';

// Função para fazer a primeira jogada
async function makeFirstMove() {
    const newLetter = prompt("Enter a new letter:");
    if (!newLetter || newLetter.length !== 1 || !/^[a-zA-Z]$/.test(newLetter)) {
        alert('Please enter a single letter.');
        return;
    }

    const side = prompt("Enter the side (LEFT or RIGHT):").toUpperCase();
    if (side !== 'LEFT' && side !== 'RIGHT') {
        alert('Invalid side. Please enter LEFT or RIGHT.');
        return;
    }

    const player = players[0]; // Jogador 0 (Player 1)
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
        window.lastPlayer = updatedMove.playerOption.player;
        console.log(lastPlayer)
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
        if (!newLetter || newLetter.length !== 1 || !/^[a-zA-Z]$/.test(newLetter)) {
            alert('Please enter a single letter.');
            return;
        }

        const side = prompt("Enter the side (LEFT or RIGHT):").toUpperCase();
        if (side !== 'LEFT' && side !== 'RIGHT') {
            alert('Invalid side. Please enter LEFT or RIGHT.');
            return;
        }

        const move = {
            playerOption: {
                player: window.lastPlayer,
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
                console.log(updatedMove.word);
                if (updatedMove.word.exits) {
                    currentWord = updatedMove.word;
                    document.getElementById('word-initial-letter').textContent = currentWord.content;
                    document.getElementById('word-meaning').textContent = currentWord.meaning;
                    window.lastPlayer = updatedMove.playerOption.player;
                    fetchPlayers();
                    displayWordAndMeaning(currentWord);
                } else {
                    currentWord = updatedMove.word.content;
                    document.getElementById('word-initial-letter').textContent = currentWord;
                    window.lastPlayer = updatedMove.playerOption.player;
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

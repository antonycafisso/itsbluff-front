function promptChallengeBluff() {
    const isBluff = prompt("Is it a bluff? YES / NOT").trim().toUpperCase();
    if (isBluff !== 'YES' && isBluff !== 'NOT') {
        alert('Please enter a valid response: YES or NOT');
    }
    handledChanllengeBluff(isBluff);
}

function handledChanllengeBluff(answer) {
    if (answer == 'NOT' || answer == 'not') {
        const playerWord = prompt("Enter the word");
        const move = {
            playerOption: {
                player: window.lastPlayer,
                letter: null,
                side: null,
                option: "IT_IS_A_BLUFF"
            },
            word: {
                content: playerWord
            }
        }
        console.log(move)
        fetchChallenge(move);
        return;
    } else { /* Caso seja inserido qlq resposta diferente de não, ou seja, caso o jogador esteja blefando */
        const moveReturn = fetchChallengeFail(CreateJsonWordNotExists())
        console.log(moveReturn);
        displayWordAndMeaningBluff();
    }
}

function CreateJsonWordNotExists() {
    if (window.lastPlayer.id == 1) {
        const swapPlayer = {
            "playerOption": {
                "player": {
                    "id": 1,
                    "name": null,
                    "turn": null,
                    "points": null
                },
                "letter": null,
                "side": null,
                "option": null
            },
            "word": {
                "content": "0"
            }
        }
        console.log(swapPlayer);
        return swapPlayer;
    }
    const swapPlayer = {
        "playerOption": {
            "player": {
                "id": 2,
                "name": null,
                "turn": null,
                "points": null
            },
            "letter": null,
            "side": null,
            "option": null
        },
        "word": {
            "content": "0"
        }
    }
    return swapPlayer;
}

async function fetchChallenge(move) {
    try {
        const response = await fetch('http://localhost:8080/game/challenge', {
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
    } catch (error) {
        console.error('Fetch error:', error);
        alert('Error to challenge.');
    }
}

async function fetchChallengeFail(move) {
    try {
        const response = await fetch('http://localhost:8080/game/challenge', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(move)
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
            .then(updatedMove => {
                window.lastPlayer = updatedMove.playerOption.player;
                fetchPlayers();
                overlay.addEventListener('click', () => {
                    location.reload();
                });
            })
    } catch (error) {
        console.error('Fetch error:', error);
        alert('Error to challenge.');
    }
}

function displayWordAndMeaningBluff() {
    const maxMeaningLength = 200;
    const wordElement = document.getElementById('word-meaning');
    const initialLetterElement = document.getElementById('word-initial-letter');

    // Definindo os textos desejados diretamente
    wordElement.textContent = "-";
    initialLetterElement.textContent = "WORD NOT FOUND";

    // Mostra o overlay
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'block';

    // Adiciona o evento de clique para recarregar a página
    overlay.addEventListener('click', () => {
        location.reload();
    });
}

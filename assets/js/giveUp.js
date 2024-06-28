function promptGiveUp() {
    const isConfirmed = confirm("Are you sure you want to give up?");
    if(isConfirmed){
        fetchGiveUp();
        const overlay = document.getElementById('overlay');
        overlay.style.display = 'block';
    
        overlay.addEventListener('click', () => {
            location.reload();
        });
    }
}

function fetchGiveUp() {
    const move = {
        playerOption: {
            player: window.lastPlayer,
            letter: null,
            side: null,
            option: "GIVE_UP"
        }
    };

    fetch('http://localhost:8080/game/giveup', {
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
        }).then(updatedMove => {
            window.lastPlayer = updatedMove.playerOption.player;
            fetchPlayers();
        })
}
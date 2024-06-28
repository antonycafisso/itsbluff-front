```markdown
# Its Bluff - Frontend

## Visão Geral

Its Bluff é um jogo interativo onde os jogadores podem aprimorar o vocabulário em inglês. Este repositório contém o frontend da aplicação,
responsável pela interface do usuário e pela interação com o backend. 

Para maiores detalhes sobre a lógica do  jogo acesse o repositório que contém o backend:  https://github.com/antonycafisso/itsbluff-game

## Tecnologias Utilizadas

- HTML
- CSS
- JavaScript

## Configuração do Ambiente

### Pré-requisitos

- Navegador web moderno (Google Chrome, Mozilla Firefox, etc.)

### Instalação

1. Clone o repositório:

   ```sh
   git clone https://github.com/seu-usuario/its-bluff-frontend.git
   cd its-bluff-frontend

    Abra o arquivo index.html no seu navegador.

### Estrutura de Arquivos

    index.html - Arquivo principal HTML.
    style.css - Arquivo CSS para estilos da da página inicial.
    Arquivos .js - Diferentes arquivos responsáveis pela interação com o usuário e acesso a lógica presente no backend.

### Funcionalidades Principais

    Adicionar Letras: Permite aos jogadores adicionar letras à palavra atual.
    Acusar blefer: Confirma se o adversário blefou a respeito da palavra na tela.
    Desistir: O jogador prefere desistir ao arriscar adicionar uma nova letra a palavra ou  acusar blefe.
    Validar Palavras: Valida as palavras usando uma API de dicionário.
    Gerenciar Turnos: Indica de qual jogador é vez.
    Placar: Exibe a pontuação dos jogadores.

Interação com o Backend
Exemplos de Funções

    Adicionar Letra:

    javascript

function promptAddLetter() {
    const newLetter = prompt("Enter a new letter:");
    if (newLetter === null || newLetter.length !== 1) {
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
        document.getElementById('word-initial-letter').textContent = currentWord;
        lastPlayer = updatedMove.playerOption.player;
        fetchPlayers();
        displayWord(currentWord);
    })
    .catch(error => {
        console.error('Fetch error:', error);
        alert('Error adding new letter.');
    });
}

Exibir Palavra e Significado:

javascript

    function displayWordAndMeaning(word) {
        const maxMeaningLength = 200;
        const wordElement = document.getElementById('word-meaning');
        wordElement.textContent = `${word.content}`;

        const meaningElement = document.getElementById('word-meaning');
        meaningElement.textContent = truncateText(word.meaning, maxMeaningLength);
    }

Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

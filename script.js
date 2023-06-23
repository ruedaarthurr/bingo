const cardsContainer = document.getElementById('cards-container');
const addCardButton = document.getElementById('add-card');
const startGameButton = document.getElementById('start-game');
const pickedNumberDisplay = document.getElementById('picked-number');
const resetGameButton = document.getElementById('reset-game');
const previousNumbersDisplay = document.getElementById('previous-numbers');

let gameInterval = undefined

let pickedNumbers = [];

function generateCard() {
    const numbers = [];
    while (numbers.length < 24) {
        const number = pickNumber();
        if (!numbers.includes(number)) {
            numbers.push(number);
        }
    }
    numbers.sort((a, b) => a - b);
    const cardMatrix = Array(5).fill(null).map(() => Array(5).fill(null));
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            if (i === 2 && j === 2) {
                cardMatrix[i][j] = 'X';
                continue;
            }
            cardMatrix[i][j] = numbers.pop();
        }
    }
    const card = {
        matrix: cardMatrix,
        html: document.createElement('div'),
    };
    card.html.classList.add('card');
    card.matrix.forEach(row => {
        const rowElement = document.createElement('div');
        row.forEach(number => {
            const numberElement = document.createElement('div');
            numberElement.classList.add('number');
            if (number !== null) {
                numberElement.textContent = number;
            }
            rowElement.appendChild(numberElement);
        });
        card.html.appendChild(rowElement);
    });
    return card;
}
function checkWin(card) {

    for (let i = 0; i < 5; i++) {
        if (card.matrix[i].every(n => n === null || pickedNumbers.includes(n))) {
            return true;
        }
    }
    for (let i = 0; i < 5; i++) {
        if (card.matrix.every(row => row[i] === null || pickedNumbers.includes(row[i]))) {
            return true;
        }
    }
    if (card.matrix.every((row, i) => row[i] === null || pickedNumbers.includes(row[i]))) {
        return true;
    }
    if (card.matrix.every((row, i) => row[4 - i] === null || pickedNumbers.includes(row[4 - i]))) {
        return true;
    }

    return false;
}
function addCard() {
    const card = generateCard();
    cardsContainer.appendChild(card.html);
    startGameButton.disabled = false;
}
function pickNumber() {
    return Math.ceil(Math.random() * 75);
}
function startGame() {
    addCardButton.disabled = true;
    startGameButton.disabled = true;
    let vencedores = 0
    gameInterval = setInterval(() => {
        let number = -1;
        do {
            number = pickNumber();
        } while (pickedNumbers.includes(number));  
        pickedNumbers.push(number);
        previousNumbersDisplay.innerHTML += `<p>${number}</p>\n`;
        pickedNumberDisplay.textContent = `Número sorteado: ${number}`;
        for (let card of document.querySelectorAll('.card')) {
            for (let cardNumber of Array.from(card.querySelectorAll('.number'))) {
                if (cardNumber.textContent === `${number}` || cardNumber.textContent === 'X') {
                    cardNumber.classList.add('picked');
                }
            }
        }
        const cards = Array.from(cardsContainer.children).map(cardElement => {
            const rows = Array.from(cardElement.children);
            return {
                matrix: Array(5).fill(null).map((_, columnIndex) => 
                    rows.map(rowElement => Number(rowElement.children[columnIndex].textContent) || null)
                ),
                html: cardElement,
            };
        });
        
        for (let card of cards) {
            if (checkWin(card)) {
                clearInterval(gameInterval);
                vencedores++;
                pickedNumberDisplay.textContent = `Temos ${vencedores} vencedor${vencedores > 1 ? "es" : ""}!`;
                card.html.classList.add('winner');
                break;
            }
        }
    }, 500);
}
function resetGame() {
    pickedNumbers = [];
    cardsContainer.innerHTML = '';
    addCardButton.disabled = false;
    startGameButton.disabled = true;
    pickedNumberDisplay.textContent = '';
    previousNumbersDisplay.textContent = '';
    if (gameInterval != undefined) clearInterval(gameInterval);
}
addCardButton.addEventListener('click', () => { for(let i = 0; i < 1; i++) addCard() });
resetGameButton.addEventListener('click', resetGame);
startGameButton.addEventListener('click', startGame);
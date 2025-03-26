document.addEventListener("DOMContentLoaded", () => {
    const gameContainer = document.querySelector(".game-container");
    const cardCountSelect = document.getElementById("cardCount");
    const difficultySelect = document.getElementById("difficulty");
    const startGameButton = document.getElementById("startGame");
    const movesCounter = document.getElementById("movesCounter");
    const popup = document.getElementById("popup");
    const popupMessage = document.getElementById("popup-message");
    const restartGameButton = document.getElementById("restartGame");

    let images = Array.from({ length: 22 }, (_, i) => `cards/img${i + 1}.jpg`);

    let gameImages = [];
    let firstCard = null, secondCard = null, lockBoard = false;
    let movesLeft = 0;
    let matchedPairs = 0;
    let totalPairs = 0;

    function shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    function createCard(image) {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.image = image;
        card.addEventListener("click", flipCard);
        return card;
    }

    function flipCard() {
        if (lockBoard || this === firstCard) return;
        this.style.backgroundImage = `url('${this.dataset.image}')`;
        this.classList.add("flipped");

        if (!firstCard) {
            firstCard = this;
            return;
        }

        secondCard = this;
        lockBoard = true;
        movesLeft--;
        updateMovesCounter();
        checkMatch();
    }

    function checkMatch() {
        if (firstCard.dataset.image === secondCard.dataset.image) {
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            matchedPairs++;

            if (matchedPairs === totalPairs) {
                showPopup("🎉 Вы выиграли! Хотите сыграть еще раз?");
            }

            resetBoard();
        } else {
            setTimeout(() => {
                firstCard.style.backgroundImage = "";
                secondCard.style.backgroundImage = "";
                firstCard.classList.remove("flipped");
                secondCard.classList.remove("flipped");
                resetBoard();
            }, 1000);
        }

        if (movesLeft === 0 && matchedPairs < totalPairs) {
            showPopup("😢 Вы проиграли! Хотите попробовать снова?");
        }
    }

    function resetBoard() {
        firstCard = null;
        secondCard = null;
        lockBoard = false;
    }

    function updateMovesCounter() {
        movesCounter.textContent = `Осталось ходов: ${movesLeft}`;
    }

    function showPopup(message) {
        popupMessage.textContent = message;
        popup.style.display = "flex";
    }

    function hidePopup() {
        popup.style.display = "none";
        initGame();
    }

    function setGridColumns(cardCount) {
        const columns = {
            12: "repeat(4, 120px)",
            20: "repeat(5, 120px)",
            32: "repeat(8, 120px)",
            44: "repeat(11, 120px)"
        };
        gameContainer.style.gridTemplateColumns = columns[cardCount] || "repeat(4, 120px)";
    }

    function setMovesLimit(cardCount, difficulty) {
        totalPairs = cardCount / 2;

        if (difficulty === "easy") {
            movesLeft = "∞";
        } else if (difficulty === "medium") {
            movesLeft = totalPairs * 3;
        } else if (difficulty === "hard") {
            movesLeft = totalPairs * 2;
        }

        updateMovesCounter();
    }

    function initGame() {
        let cardCount = parseInt(cardCountSelect.value);
        let difficulty = difficultySelect.value;
        matchedPairs = 0;

        gameImages = shuffle(images).slice(0, cardCount / 2);
        gameImages = [...gameImages, ...gameImages]; 
        shuffle(gameImages);

        gameContainer.innerHTML = "";
        popup.style.display = "none";

        setGridColumns(cardCount);
        setMovesLimit(cardCount, difficulty);

        gameImages.forEach(img => {
            gameContainer.appendChild(createCard(img));
        });
    }

    startGameButton.addEventListener("click", initGame);
    restartGameButton.addEventListener("click", hidePopup);
});

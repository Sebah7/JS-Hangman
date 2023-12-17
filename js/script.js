// Object Of Words + Categories
const maxWrongAttempts = 6;
let gameOver = false;
let randomTitleCategory;
let lettersAndSpace, guessSpans, wrongAttempts;

const words = {
  programming: [
    { word: "JavaScript", hint: "Scripting language for web pages" },
    { word: "TypeScript", hint: "Superset of JavaScript" }
  ],
  movies: [
    {word: "Titanic", hint: "Hit the Ice berg and sunk"},
    {word: "Gone girl", hint: "Wife disappears, husband gets in trouble"},
    {word: "Avatar", hint: "Blue skinned beings"}
  ],
  animals: [
    { word: "Octopus", hint: "has two hearts" },
    { word: "Elephant", hint: "scared of ants" },
    { word: "Flamingo", hint: "is pink" },
    { word: "Giraffe", hint: "has a long neck" }
  ]
}

// To get the random categories (programming, animals or movies)
randomTitleCategory = Object.keys(words)[Math.floor(Math.random() * Object.keys(words).length)];

// To get random word and hint from the chosen random category
const { word: randomWord, hint: randomHint } = words[randomTitleCategory][Math.floor(Math.random() * words[randomTitleCategory].length)];

// Category Tip
document.querySelector(".game-info .category span").innerHTML = randomTitleCategory;

// Letters Guess
let lettersGuessContainer = document.querySelector(".letters-guess");

// Word To Array
lettersAndSpace = Array.from(randomWord);

lettersAndSpace.forEach(letter => {

  let emptySpan = document.createElement("span");

  // If Letter Is Space
  if (letter === ' ') {
    emptySpan.className = 'with-space';
  }

  lettersGuessContainer.appendChild(emptySpan);
});

// Guess Spans
guessSpans = document.querySelectorAll(".letters-guess span");

wrongAttempts = 0;

let theDraw = document.querySelector(".hangman-draw");

// Clicking On Letters
document.addEventListener("click", (e) => {
  if (!gameOver && e.target.className === 'letter-box') {
    e.target.classList.add("clicked");

    const theClickedLetter = e.target.innerHTML.toUpperCase();
    let correctGuess = false;

    guessSpans.forEach((span, spanIndex) => {
      const wordLetter = Array.from(randomWord.toUpperCase())[spanIndex];

      if (theClickedLetter === wordLetter) {
        span.innerHTML = theClickedLetter;
        correctGuess = true;
      }
    });

    if (!correctGuess) {
      wrongAttempts++;
      theDraw.classList.add(`wrong-${wrongAttempts}`);
      document.getElementById("fail").play();

      if (wrongAttempts === maxWrongAttempts) {
        endGame();
      }
    } else {
      document.getElementById("success").play();
    }

    const isWordGuessed = Array.from(randomWord.toUpperCase()).every((letter, index) => {
      return guessSpans[index].innerHTML === letter || letter === ' ';
    });

    if (isWordGuessed) {
      endGame();
    }
  }
});

// End Game
function endGame() {

  // Check if all letters have been guessed
  const isWordGuessed = Array.from(randomWord.toUpperCase()).every((letter, index) => {
    return guessSpans[index].innerHTML === letter || letter === ' ';
  });

  // Create Popup Div
  let div = document.createElement("div");

   // Add Class On Div
   div.className = 'popup';

  // Create Text
  let divText;

  if (isWordGuessed) {
    divText = document.createTextNode(`Congratulations! You Win! The word is ${randomWord}`);
  } else {
    divText = document.createTextNode(`Game Over! The word was ${randomWord}`);
  }

  // Append Text To Div
  div.appendChild(divText);

    // Play Again
    let playAgainButton = document.createElement("button");
    playAgainButton.innerHTML = "Play Again";
    playAgainButton.addEventListener("click", resetGame);
    div.appendChild(playAgainButton);

  // Append To The Body
  document.body.appendChild(div);

}
  // Hint Button
let hintButton = document.getElementById("hintBtn");

// Hint Display
let hintDisplay = document.getElementById("hintDisplay");

let maxHints = 1;

let hintsUsed = 0;

hintButton.addEventListener("click", () => {
  if (hintsUsed < maxHints) {

    hintDisplay.textContent = `Hint: ${randomHint}`;

    hintsUsed++;
  } else {
    hintDisplay.textContent = "No more hints available!";
  }
});

  document.querySelector(".container").classList.add("game-over");

  document.getElementById("play-again").addEventListener("click", resetGame);

// Reset Game
function resetGame() {
  // Reload the page
  location.reload();
}

// keyboard input
document.addEventListener("keydown", (e) => {
  if (gameOver) {
    return;
  }

  // Check if the pressed key is a letter
  const isLetter = /^[a-zA-Z]$/.test(e.key);

  if (isLetter) {
    const theClickedLetter = e.key.toUpperCase();

    let theStatus = false;

    let theChosenWord = Array.from(randomWord.toUpperCase());

    theChosenWord.forEach((wordLetter, WordIndex) => {
      if (theClickedLetter == wordLetter) {
        theStatus = true;
        guessSpans.forEach((span, spanIndex) => {
          if (WordIndex === spanIndex) {
            span.innerHTML = theClickedLetter;
          }
        });
      }
    });

    // If Letter Is Wrong
    if (theStatus !== true) {
      wrongAttempts++;

      theDraw.classList.add(`wrong-${wrongAttempts}`);

      if (wrongAttempts === maxWrongAttempts) {
        endGame();
      }
    }

    // Apply clicked style to the corresponding letter box
    const letterBox = document.querySelector(`.keyboard .letter-box[data-key="${theClickedLetter}"]`);
    if (letterBox) {
      letterBox.classList.add('clicked');

    }
  }
});


let isMuted = false;

// Mute Button
let muteButton = document.getElementById("muteButton");

muteButton.addEventListener("click", () => {
  isMuted = !isMuted;

  // Toggle mute state
  document.getElementById("success").muted = isMuted;
  document.getElementById("fail").muted = isMuted;
});

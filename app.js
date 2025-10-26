/**
 * Variable Declarations from top to bottom of index.html
 */
const movesText = document.querySelector(".moves");
const restart = document.querySelector(".restart");
const deck = document.querySelector(".deck");
const cardList = document.querySelectorAll(".deck li");
const starList = document.querySelectorAll(".stars li");
const modal = document.querySelector(".modal-background");
const ALL_PAIRS = 8;

let openCardList = [];
let moves = 0;
let clockIsOff = true;
let time = 0;
let timerId;
let pairs = 0;

/**
*CREDIT: https://matthewcranford.com/memory-game-walkthrough-part-1-setup/
*A lot of the concepts that you see in my program were based on Matthew Cranfords walkthroughs 1-8
*However, you will notice, that I put my own twists and wrote my own code too
*/


/**
 * Start of Game
 */

document.addEventListener("load", resetCards);


//removes any existing classes ('match open show')
//and resets them all to the default: ('card')
function resetCards() {
  //accesses each card in cardList
  for (card of cardList) {
    card.classList = "card";
  }
}
//the purpose of freshGameboard()
//is to hide all displayed cards at the start of the game
resetCards();

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


function shuffleCardList() {
  //turns deck of cards into an array so that it can be passed as an argument to the shuffle function
  const cardsToShuffle = Array.from(document.querySelectorAll(".deck li"));  
  const shuffledCards = shuffle(cardsToShuffle);
  //each card that was shuffled will be added to the deck (no new cards are added existing ones are just shuffled around)
  for (card of shuffledCards) {
    deck.appendChild(card);
  }
}
shuffleCardList();

//the card that is clicked will not count (won't be flipped over, added into openCardList etc...if these conditions are not met)
function clickIsAcceptable(clickedCard) {
  return (
    clickedCard.classList.contains("card") &&
    !clickedCard.classList.contains("match") &&
    openCardList.length < 2 &&
    !openCardList.includes(clickedCard)
  );
}

function openCard(clickedCard) {
  clickedCard.classList.add("open");
  clickedCard.classList.add("show");
}

function addOpenCard(clickedCard) {
  openCardList.push(clickedCard);
  console.log(openCardList);
}

function addMatchClass() {
  openCardList[0].classList.add("match"); //adds a match class to the first card added to openCardList -> [0]
  openCardList[1].classList.add("match"); //adds a match class to the second card added to openCardList -> [1]
}

function unOpenCard(card) {
  card.classList.remove("open");
  card.classList.remove("show");
}

//CHECK FOR MATCH
function checkForMatch() {
  if (
    openCardList[0].lastElementChild.className ===
    openCardList[1].lastElementChild.className
  ) {
    addMatchClass();
    console.log("MATCH");
    openCardList = [];
    pairs++;
  } else {
    setTimeout(() => {
      unOpenCard(openCardList[0]);
      unOpenCard(openCardList[1]);
      console.log("NO MATCH");
      openCardList = [];
    }, 1000);
  }
}

function addMoves() {
  moves++;
  movesText.innerHTML = moves;
}

function calculateScore() {
  if (moves === 16 || moves === 24) {
    hideStar();
  }
}

function hideStar() {
  const stars = document.querySelectorAll(".stars li");
  for (star of stars) {
    if (star.style.display !== "none") {
      star.style.display = "none";
      break;
    }
  }
}

function startTimer() {
  timerId = setInterval(() => {
    time++;
    displayTimer();
    console.log(time);
  }, 1000);
}

function displayTimer() {
  const timer = document.querySelector(".timer");
  let minutes = Math.floor(time / 60);
  let seconds = time % 60;
  seconds < 10
    ? (timer.innerHTML = `${minutes}:0${seconds}`)
    : (timer.innerHTML = `${minutes}:${seconds}`);
  console.log(timer);
}

function stopTimer() {
  clearInterval(timerId);
}

//Shows the popup modal by targeting .modal-background and changing visibility to visible and opacity to 1
function showModal() {
  modal.style.visibility = "visible";
  modal.style.opacity = "1";
}

//Hides the popup modal by targeting .modal-background and changing visibility to hidden and opacity to 0
function hideModal() {
  modal.style.visibility = "hidden";
  modal.style.opacity = "0";
}

function getStars() {
  let starCount = 0;
  for (star of starList) {
    if (star.style.display !== "none") {
      starCount++;
    }
  }
  console.log(starCount);
  return starCount;
}

function printModalStats() {
  const timeStat = document.querySelector(".modal-time");
  const timerTime = document.querySelector(".timer").innerHTML;
  const moveStat = document.querySelector(".modal-moves");
  const starStat = document.querySelector(".modal-stars");
  const stars = getStars();

  timeStat.innerHTML = ` Time: ${timerTime}`;
  moveStat.innerHTML = `Moves: ${moves}`;
  starStat.innerHTML = `Stars: ${stars}`;
}

function resetMoves() {
  moves = 0;
  movesText.innerHTML = moves;
}

function resetPairCount() {
  pairs = 0;
}

function resetTimeAndTimer() {
  time = 0;
  clockIsOff = true;
  stopTimer();
  displayTimer();
}

function resetStars() {
  stars = 0;
  for (star of starList) {
    star.style.display = "inline";
  }
}

function resetGame() {
  resetCards();
  shuffleCardList();
  resetMoves();
  resetPairCount();
  resetTimeAndTimer();
  resetStars();
}

function replayGame() {
  hideModal();
  resetGame();
}

function cancelGame() {
  hideModal();
  resetGame();
}

function endGame() {
  stopTimer();
  printModalStats();
  showModal();
}

deck.addEventListener("click", event => {
  const clickedCard = event.target;
  if (clickIsAcceptable(clickedCard)) {
    if (clockIsOff) {
      startTimer();
      clockIsOff = false;
    }
    //shows card by adding open/show classes to clicked cards classList
    openCard(clickedCard);
    //adds 2 clicked cards to openCardList[]
    addOpenCard(clickedCard);
    if (openCardList.length === 2) {
      checkForMatch();
      addMoves();
      calculateScore();
      console.log("2 cards!");
    }
    if (pairs === ALL_PAIRS) {
      endGame();
    }
  }
});

restart.addEventListener("click", replayGame);
document.querySelector('.modal-replay').addEventListener("click", replayGame);
document.querySelector('.modal-cancel').addEventListener('click', cancelGame);
document.querySelector('.close-button').addEventListener('click', cancelGame);


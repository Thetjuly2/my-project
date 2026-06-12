var num_of_icons_in_row = 8;
var candies_arr = [];
var candy_imgs = [
  "url(../IMG/imgs/1.png)",
  "url(../IMG/imgs/2.png)",
  "url(../IMG/imgs/3.png)",
  "url(../IMG/imgs/4.png)",
  "url(../IMG/imgs/5.png)",
  "url(../IMG/imgs/6.png)",
];  

var candyDraggedImg;
var candyDroppedOnImg;
var candyDraggedId;
var candyDroppedOnId;
var score = 0;
var counter = 0;

var game_board = document.querySelector(".game_board");
var scoreDisplay = document.getElementById("score");
var timerDisplay = document.getElementById("timer");
var startscreen = document.querySelector(".start-screen");
//var startscreen = document.querySelector('.result-screen');

//first wait half second to load
setTimeout(function () {
  counter = 0;
  reset();
}, 500);

function reset() {
  score = 0;
  scoreDisplay.innerHTML = score;
  counter = 0;
}

//to display the timer
var timer2 = setInterval(function () {
  timerDisplay.innerHTML = 100 - counter;
  counter++;
}, 1000);

function newGame() {
  reset();
  startscreen.style.opacity = 0;
  setTimeout(function () {
    startscreen.style.height = 0;
  }, 1000);
}

function startBoard() {
  for (var i = 0; i < num_of_icons_in_row * num_of_icons_in_row; i++) {
    var square = document.createElement("div");
    square.setAttribute("draggable", true);
    square.setAttribute("id", i);
    var random_candy = Math.floor(Math.random() * candy_imgs.length);
    square.style.backgroundImage = candy_imgs[random_candy];
    game_board.appendChild(square);
    candies_arr.push(square);
  }
}
startBoard();

for (var i = 0; i < candies_arr.length; i++) {
  candies_arr[i].addEventListener("dragstart", dragStart);
  candies_arr[i].addEventListener("dragend", dragEnd);
  candies_arr[i].addEventListener("dragover", dragOver);
  candies_arr[i].addEventListener("dragenter", dragEnter);
  candies_arr[i].addEventListener("drageleave", dragLeave);
  candies_arr[i].addEventListener("drop", dragDrop);
}

//getting the element dragged
function dragStart() {
  candyDraggedImg = this.style.backgroundImage;
  candyDraggedId = parseInt(this.id);
}
//when entering another element
function dragEnter(e) {
  e.preventDefault();
}
//which element Iam over
function dragOver(e) {
  e.preventDefault();
}
function dragLeave() {
  this.style.backgroundImage = "";
  console.log(this.id + "leave");
}
//the element where it is dropped
function dragDrop() {
  candyDroppedOnImg = this.style.backgroundImage;
  candyDroppedOnId = parseInt(this.id);
  //switch the dragged and dropped elements' colors
  this.style.backgroundImage = candyDraggedImg;
  candies_arr[candyDraggedId].style.backgroundImage = candyDroppedOnImg;
  console.log(this.id + "drop");
}
function dragEnd() {
  console.log(this.id + "end");
  //the elements up , down, left, right
  var validMoves = [
    candyDraggedId - 1,
    candyDraggedId - num_of_icons_in_row,
    candyDraggedId + 1,
    candyDraggedId + num_of_icons_in_row,
  ];
  var isvalidMove = validMoves.includes(candyDroppedOnId);

  //if the id of the replaced square is not null and it is a valid move
  if (candyDroppedOnId && isvalidMove) {
    //reset the golabla variable to null
    candyDroppedOnId = null;
  }
  //if the id of the replaced square is not null and it is not a valid move
  else if (candyDroppedOnId && !isvalidMove) {
    candies_arr[candyDroppedOnId].style.backgroundImage = candyDroppedOnImg;
    candies_arr[candyDraggedId].style.backgroundImage = candyDraggedImg;
  } else candies_arr[candyDraggedId].style.backgroundImage = candyDraggedImg;
}

//to fill the gap
function squareDown() {
  for (i = 0; i < 56; i++) {
    //if the square below has no image
    if (candies_arr[i + num_of_icons_in_row].style.backgroundImage === "") {
      //give it the image of the upper one
      candies_arr[i + num_of_icons_in_row].style.backgroundImage =
        candies_arr[i].style.backgroundImage;
      //and delete the image of the upper one
      candies_arr[i].style.backgroundImage = "";

      
    }

    //if the square has no image and it is in the first row then generate random candies
    var firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
    var isFirstRow = firstRow.includes(i);
    if (isFirstRow && candies_arr[i].style.backgroundImage === "") {
      var random_candy = Math.floor(Math.random() * candy_imgs.length);
      console.log(random_candy + " " + i);
      candies_arr[i].style.backgroundImage = candy_imgs[random_candy];
    }
  }
}

//for row of Four
function checkFourInRow() {
  //0 to 60 as 61 and 62 and 63 don't have 4 items after them
  for (i = 0; i < 61; i++) {
    var rowOfFour = [i, i + 1, i + 2, i + 3];
    var candy_img_check = candies_arr[i].style.backgroundImage; //the color to check for
    var isBlank = candies_arr[i].style.backgroundImage === ""; //check if the square has no image

    //these are the not valid elements to check in each row for example row one from 0->7
    //at 5 and 6 and 7 there will be no 4 items ater and it will continue in the second row
    var notValid = [
      5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53,
      54, 55,
    ];
    if (notValid.includes(i)) continue;

    if (
      candies_arr[rowOfFour[0]].style.backgroundImage === candy_img_check &&
      candies_arr[rowOfFour[1]].style.backgroundImage === candy_img_check &&
      candies_arr[rowOfFour[2]].style.backgroundImage === candy_img_check &&
      candies_arr[rowOfFour[3]].style.backgroundImage === candy_img_check &&
      !isBlank
    ) {
      score += 4;
      scoreDisplay.innerHTML = score;
      for (var i in rowOfFour) {
        candies_arr[rowOfFour[i]].style.backgroundImage = "";
      }
    }
  }
}
checkFourInRow();

//for column of Four
function checkFourInColumn() {
  for (i = 0; i < 40; i++) {
    var columnOfFour = [
      i,
      i + num_of_icons_in_row,
      i + num_of_icons_in_row * 2,
      i + num_of_icons_in_row * 3,
    ];
    var candy_img_check = candies_arr[i].style.backgroundImage;
    var isBlank = candies_arr[i].style.backgroundImage === "";

    if (
      candies_arr[columnOfFour[0]].style.backgroundImage === candy_img_check &&
      candies_arr[columnOfFour[1]].style.backgroundImage === candy_img_check &&
      candies_arr[columnOfFour[2]].style.backgroundImage === candy_img_check &&
      candies_arr[columnOfFour[3]].style.backgroundImage === candy_img_check &&
      !isBlank
    ) {
      score += 4;
      scoreDisplay.innerHTML = score;
      for (var i in columnOfFour) {
        candies_arr[columnOfFour[i]].style.backgroundImage = "";
      }
    }
  }
}
checkFourInColumn();

//for row of Three
function checkThreeInRow() {
  for (i = 0; i < 62; i++) {
    var rowOfThree = [i, i + 1, i + 2];
    var candy_img_check = candies_arr[i].style.backgroundImage;
    var isBlank = candies_arr[i].style.backgroundImage === "";

    var notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55];
    if (notValid.includes(i)) continue;

    if (
      candies_arr[rowOfThree[0]].style.backgroundImage === candy_img_check &&
      candies_arr[rowOfThree[1]].style.backgroundImage === candy_img_check &&
      candies_arr[rowOfThree[2]].style.backgroundImage === candy_img_check &&
      !isBlank
    ) {
      score += 3;
      scoreDisplay.innerHTML = score;
      for (var i in rowOfThree) {
        candies_arr[rowOfThree[i]].style.backgroundImage = "";
      }
    }
  }
}
checkThreeInRow();

//for column of Three
function checkThreeInCoumn() {
  for (i = 0; i < 48; i++) {
    var columnOfThree = [
      i,
      i + num_of_icons_in_row,
      i + num_of_icons_in_row * 2,
    ];
    var candy_img_check = candies_arr[i].style.backgroundImage;
    var isBlank = candies_arr[i].style.backgroundImage === "";

    if (
      candies_arr[columnOfThree[0]].style.backgroundImage === candy_img_check &&
      candies_arr[columnOfThree[1]].style.backgroundImage === candy_img_check &&
      candies_arr[columnOfThree[2]].style.backgroundImage === candy_img_check &&
      !isBlank
    ) {
      score += 3;
      scoreDisplay.innerHTML = score;
      for (var i in columnOfThree) {
        candies_arr[columnOfThree[i]].style.backgroundImage = "";
      }
    }
  }
}
checkThreeInCoumn();

var timer = setInterval(function () {
  checkFourInRow();
  checkFourInColumn();
  checkThreeInRow();
  checkThreeInCoumn();
  squareDown();
}, 200);

var isfirstwin = true;
var isfirstlose = true;
var timer3 = setInterval(function () {
  var result = document.getElementById("welcome");
  if (score >= 100 && counter < 100) {
    result.innerHTML = "You Win!";
    startscreen.style.opacity = 1;
    startscreen.style.height = "100%";
    isfirstwin = false;
  } else if (
    counter > 100 &&
    result.innerHTML == "You Win!" &&
    startscreen.style.opacity == 1
  ) {
    result.innerHTML = "You Win!";
  } else if (counter > 100 && startscreen.style.opacity == 0) {
    result.innerHTML = "Game Over!";
    startscreen.style.opacity = 1;
    startscreen.style.height = "100%";
  } else if (counter > 100 && !isfirstwin) {
    result.innerHTML = "Game Over!";
    startscreen.style.opacity = 1;
    startscreen.style.height = "100%";
  }
}, 100);

// var timer = setInterval(function(){
//   checkFourInRow();
//   checkFourInColumn();
//   checkThreeInRow();
//   checkThreeInCoumn();
//   squareDown();
//   var result = document.getElementById("welcome");
//   if(score>100 && counter<100){
//     result.innerHTML ="You Win!";
//     startscreen.style.opacity = 1;
//     startscreen.style.height = "100%";
//     clearInterval(timer);
//   } else if(counter>100)
//   {
//     result.innerHTML ="Game Over!";
//     startscreen.style.opacity = 1;
//     startscreen.style.height = "100%";
//     clearInterval(timer);
//   }
// }, 200);

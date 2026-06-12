$(".parent").slideDown(3000);
var inputs = document.querySelector(".inputs");

var typing = document.querySelector(".typing");

var reg = /^[A-Za-z]+$/;
var randomkey;
var wrongalpha = [],
  correctalpha = [],
  maxguess;
function randomword() {
  var randomobj = wordList[Math.floor(Math.random() * wordList.length)];
  randomkey = randomobj.word;

  maxguess = 8;
  wrongalpha = [];
  correctalpha = [];
  $(".hint span").text(randomobj.hint);
  $(".wrong-letters span").text(wrongalpha);
  $(".guess-left span").text(maxguess);

  var html = "";
  for (var i = 0; i < randomkey.length; i++) {
    html += `<input type="text" disabled >`;
  }

  inputs.innerHTML = html;
}
randomword();

function initgame(e) {
  var key = e.target.value;
  if (
    key.match(reg) &&
    !wrongalpha.includes(key) &&
    !correctalpha.includes(key)
  ) {
    if (randomkey.includes(key)) {
      for (var i = 0; i < randomkey.length; i++) {
        if (randomkey[i] == key) {
          correctalpha.push(key);
          inputs.querySelectorAll("input")[i].value = key;
        }
      }
    } else {
      maxguess--;
      wrongalpha.push(key);
    }
    $(".guess-left span").text(maxguess);
    $(".wrong-letters span").text(wrongalpha);
  }
  typing.value = "";
  setTimeout(function () {
    if (correctalpha.length == randomkey.length) {
      alert("congratulations you found the word " + randomkey.toUpperCase());
      randomword();
    } else if (maxguess < 1) {
      alert("game over");
      for (var i = 0; i < randomkey.length; i++) {
        inputs.querySelectorAll("input")[i].value = randomkey[i];
      }
    }
  });
}

$(".reset-btn").click(function () {
  randomword();
});

inputs.addEventListener("click", function () {
  $(".typing").focus();
}); //phones

$(".typing").on("input", initgame);

$(document).keydown(function () {
  $(".typing").focus();
});

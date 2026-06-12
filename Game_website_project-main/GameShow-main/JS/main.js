//handling clicking on piano white keys

$(function () {
  $(".wrapper").hide();
  $(".wrapper").show("drop", 3000);
  var pianoKeys = document.querySelectorAll(".black-key  , .white-key ");
  console.log(pianoKeys);
  var letterMatrix = [
    "A",
    "W",
    "S",
    "E",
    "D",
    "F",
    "T",
    "G",
    "Y",
    "H",
    "U",
    "J",
    "K",
    "O",
    "L",
    "P",
    ";",
  ];

  var tone = new Audio("../tunes/a.wav");

  for (let i in pianoKeys) {
    //hide keys => default mode
    $(`.${pianoKeys[i].className} span`).hide();

    //handling click mouse events
    pianoKeys[i].onclick = function () {
      //use dataset instead of value in list
      console.log(pianoKeys[i].dataset.key);
      $(this).fadeTo(0, 0.8);
      $(this).fadeTo(300, 1);
      //tone handling
      tone.src = `../tunes/${pianoKeys[i].dataset.key}.wav`;
      tone.play();
    };
    //handling keyboard events

    document.body.onkeydown = function (e) {
      console.log(e.key);
      for (let i = 0; i < letterMatrix.length; i++) {
        if (e.key == letterMatrix[i].toLocaleLowerCase()) {
          //error interruption !!!

          $(pianoKeys[i]).fadeTo(0, 0.8);
          $(pianoKeys[i]).fadeTo(300, 1);
          tone.src = `../tunes/${e.key}.wav`;
          tone.play();
        }
      }
    };
  }

  var counter = 1;
  //show keys button handling
  $(".checkbox input").on("click", function () {
    if (counter == 1) {
      $(".checkbox input").css({ "background-color": "rgb(160, 16, 16)" });
      counter += 1;
      $(`.white-key span`).show(500);
      $(`.black-key span`).show(500);
    } else if (counter == 2) {
      $(".checkbox input").css({ "background-color": "white" });
      counter = 1;
      $(`.white-key span`).hide(500);
      $(`.black-key span`).hide(500);
    }
  });

  //volume slider handling
  document
    .querySelector(".volume-slider input")
    .addEventListener("input", function () {
      tone.volume = this.value;
    });
  setTimeout(function () {
    $(".checkbox input").trigger("click");
  }, 3000);
  setTimeout(function () {
    $(".wrapper").css({ "box-shadow": "10px 10px 10px rgb(176, 16, 16)" });
  }, 4000);
});

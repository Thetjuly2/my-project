//background variables
var randomGrass = 100, grassClass = "grass";
var randomBalls = 10, ballClass = "ball";
var score = 0;

var soundBall = new Audio("../assets/coin.mp3");

//player variables
var speed = 1.6;
var player =$(".player")[0];
//associative array to handle the walk of the player
var playerPos = {
    x: 0,
    y:0
}
var playerVelocity = {
    x: 0,
    y:0
}
var player_start_position = {
    x: window.innerWidth/2,
    y:window.innerHeight/2
}
//=================================END OF VARIABLES SECTION=========================================

function start() {
    //generate elements of the game
    generateRandomElements(grassClass, randomGrass);
    generateRandomElements(ballClass, randomBalls);
    // make the player to stand in the middle of the page
    playerPos.x=player_start_position.x
    playerPos.y=player_start_position.y
} 


function update()
{
    
    playerAnimate();  // to animate the arm , leg movement
    // setInterval to animate the walk
  var timer =  setInterval(() => {
        
        if (playerPos.x <=0 )
        {
            playerPos.x=5 ;
           
        }
        else if (playerPos.x >= window.innerWidth)
        {
            playerPos.x = window.innerWidth - 60;
        }
        else if (playerPos.y <= 0  )
        {
            playerPos.y=5;
        }
        else if (playerPos.y >= window.innerHeight)
        {
            playerPos.y = window.innerHeight -100;
        }
        else {
          playerPos.x += playerVelocity.x;
        playerPos.y += playerVelocity.y;  
        }
        player.style.left = playerPos.x+"px";
        player.style.top = playerPos.y + "px";
         
         checkCollision();
      
    },5);
}
//=============================== START OF SECTION EVENTS HANDLERS ================================================
// handling keyBoard Events on the player
document.body.addEventListener("keydown", function (e) {
    if (e.key == 'ArrowUp') //change the player velocity
    {
        playerVelocity.y = -1 * speed;
        player.style.backgroundImage="url(../assets/player_front.png)" ;  
        }
  

    else if (e.key == 'ArrowDown')
    {
        playerVelocity.y = 1 * speed;  
        player.style.backgroundImage="url(../assets/player_back.png)" ;  

    }
    
    else if (e.key == 'ArrowRight')
    {
        playerVelocity.x = 1 * speed;
        player.style.backgroundImage="url(../assets/player_right.png)" ;  

    }

    else if (e.key == 'ArrowLeft')
    {
        playerVelocity.x = -1 * speed;
        player.style.backgroundImage="url(../assets/player_left.png)" ;  

    }

})

document.body.addEventListener("keyup", function (e) {

    playerVelocity.x = 0;
    playerVelocity.y = 0;

})

//=============================== END OF SECTION EVENTS HANDLERS ================================================


function generateRandomElements(classname, elementCount)
{
    for (let index = 0; index < elementCount; index++) {
        var Element = document.createElement('div');
        Element.classList.add(classname)
        Element.style.left = Math.random() * 100 + '%';
        Element.style.top = Math.random() * 100 + '%';
        document.body.append(Element);
        
    }
}

//=============================== START OF SECTION COLLISIONS ================================================
let balls = document.querySelectorAll(".ball") //collection of ball Div
function checkCollision()
{
    let balls = document.querySelectorAll(".ball") //collection of ball Div
    for (let i in balls)
    {
        if (collision(balls[i],player))
        {
            balls[i].style.left = Math.random() *100  +"%";
            balls[i].style.top = Math.random() *100 +"%";
            soundBall.play();       
            score += 10;
            $(".score").html("score :"+score);
            if (score == 100) {
                alert("Congratulations, you have won!")
                window.location.reload();
            }
        }    
    }
}


function collision(div1, div2) {

    /*
    The Element.getBoundingClientRect() method returns a DOMRect object providing information 
    about the size of an element and its position relative to the viewport.
     */
    var x1 = div1.getBoundingClientRect().left;
    var y1 = div1.getBoundingClientRect().top;
    /*
    clientHeight : gets the inner height of the element
    clientWidth : gets the inner width of the element
    */
    var h1 = div1.clientHeight;
    var w1 = div1.clientWidth;
    /*
    get the total width and height
    */
    var b1 = y1 + h1;
    var r1 = x1 + w1;
  
    var x2 = div2.getBoundingClientRect().left;
    var y2 = div2.getBoundingClientRect().top;
    var h2 = div2.clientHeight;
    var w2 = div2.clientWidth;
    var b2 = y2 + h2;
    var r2 = x2 + w2;
  
    if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
    return true;
}
  
//=============================== END OF SECTION COLLISIONS ================================================

function playerAnimate()// how to animate the player
{
setInterval(function () {  $(".player").css({ "background-position-x": "0px" });
}  
,100)
setInterval(function () { $(".player").css({ "background-position-x": "74px" });
},200)
setInterval(function () { $(".player").css({ "background-position-x": "148px" });
},300)  
    }

//================================= RUN THE GAME ================================================
start();
update();

const greenSound = new Audio("./sounds/green.mp3"); 
const redSound = new Audio("./sounds/red.mp3");
const yellowSound = new Audio("./sounds/yellow.mp3"); 
const blueSound = new Audio("./sounds/blue.mp3");
const startSound = new Audio("./sounds/game-start.mp3");
const loseSound = new Audio("./sounds/game-end.mp3");

var userChose= "";
let userArray=[];
let pcArray=[];
var gameStart = false;
var gameLevel = 0;
var clickOrTap = "ontouchstart" in window || window.navigator.maxTouchPoints ? "touchstart" : "click";

if ("ontouchstart" in window || window.navigator.maxTouchPoints) {
    $("h1").html("Tap to start");
    $("h2").html("Tap anywhere to restart");
}

$(document).on(clickOrTap +" keydown",start);
function start(){ 
    if (gameStart===false) {
        gameStart=true;
        judge();
        $("h1").html("Level "+ gameLevel);
        $("h2").stop()
        $("h2").css("opacity", "0");
        $(document).off(clickOrTap+" keydown");
        startSound.play();
    }
}

function judge(){
    switch (equalityCheck()) {
        case "idle":
            gameLevel++;
            pc();
            console.log("idle")
            break;
    
        case "notEqual":
            $("h1").css("opacity", 0);
            $("h1").html("Game over! </br> You've reached Level "+ (gameLevel-1) + "!");
            $("h1").animate({ opacity: 100}, 10000);
            setTimeout(function(){
            $("h2").animate({ opacity: 100}, 15000);
            $(document).on(clickOrTap+" keydown",start);
            },1000);
            userArray.length = 0
            pcArray.length = 0
            gameLevel=0;
            gameStart=false;
            console.log("notEqual")
            loseSound.play();
            break;  

        case "inProgress":
            console.log("inProgress")
            break;

        case "equal":
            setTimeout (function(){
            gameLevel++;
            console.log("equal")
            userArray.length = 0
            $("h1").html("Level "+ gameLevel);
            pc(); } ,200)
            break;            
    }
}
   
function pressAnimation(color){ // global animation for a push of a button, wether it's from the user or pc
    
    $("."+color).addClass("pressed");
    switch (color) {
        case "green":
            greenSound.cloneNode().play();
            break;
        case "blue":
            blueSound.cloneNode().play();
            break;  
        case "yellow":
            yellowSound.cloneNode().play();
            break;
        case "red":
            redSound.cloneNode().play();
            break;                            
    }
    setTimeout(function() {
        $("."+color).removeClass("pressed");
    }, 150);
}

function pc(){
    pcChose = Math.floor(Math.random()*4+1)
    switch (pcChose) {
        case 1:
            pcChose= "green";
            pcArray.push(pcChose);
            break;
        
        case 2:
            pcChose= "blue";
            pcArray.push(pcChose);
            break;
        
        case 3:
            pcChose= "yellow";
            pcArray.push(pcChose);
            break;
        
        case 4:
            pcChose="red";
            pcArray.push(pcChose);
            break;
    }
    for (let i = 0; i < pcArray.length; i++) { //animate the whole sequence
        setTimeout(function() {
          pressAnimation(pcArray[i]);
        }, (i + 1) * 500);
      }

    setTimeout(() => { // A timer calling the userListener function only after the pc's presentation is done. *CHECKED and WORKING
        $(".btn").on(clickOrTap, user);
        $(document).on("keydown", user);
    }, (pcArray.length+0.2)*500);
}

function user(event){
    //Listen for mouse clicks and run input
    if (event.type==="click"||event.type=== "touchstart") {
        userChose= (event.target.id); 
        input();
    }

    switch (event.key) {
        case "ArrowUp":
            userChose= "green";
            input();
            break;
    
        case "ArrowRight":
            userChose= "blue";
            input();
            break;
    
        case "ArrowDown":
            userChose= "yellow";
            input();
            break;
    
        case "ArrowLeft":
            userChose="red";
            input();
            break;
    }
}

function input(){  // take user input and perform 1. animation 2. insert into user's array
    switch (userChose) {
        case "green":
            pressAnimation("green");
            userArray.push(userChose);
            console.log("pushed g");
            break;

        case "blue":
            pressAnimation("blue");
            userArray.push(userChose);
            console.log("pushed b");
            break;

        case "yellow":
            pressAnimation("yellow");
            userArray.push(userChose);
            console.log("pushed y");
            break;

        case "red":
            pressAnimation("red");
            userArray.push(userChose);
            console.log("pushed r");
            break;
    }
    judge();
}

function equalityCheck() {     // Check for equality between User and Pc
    let status;
    
    if (userArray.length === pcArray.length && userArray.every((val, index) => val === pcArray[index])) {
        $(".btn").off(clickOrTap);
        $(document).off("keydown");
        status = "equal"; // Update status to "equal" if arrays are completely equal
        console.log(userArray);
      } 
      else {
        status = "inProgress"; // Update status to "inProgress" if arrays are partially equal
        console.log(userArray);
      }
     if (userArray.length===0){
        status = "idle";
     }

    for (let i = 0; i < userArray.length; i++) {
      if (userArray[i] !== pcArray[i]) {
        $(".btn").off(clickOrTap);
        $(document).off("keydown");
        status = "notEqual"; // Update status to "notEqual" if arrays are not equal
        console.log(userArray);
      } 
    }
    return status; // Return the final status value
  }

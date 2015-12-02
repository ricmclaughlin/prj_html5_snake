$(document).ready(function(){
  var canvas = $('#canvas')[0];
  var context = canvas.getContext("2d");
  var width = canvas.width;
  var height = canvas.height;
  var cellWidth = 15;
  var direction = "right";
  var food;
  var score;
  var speed = 130;
  var color = "green";

  var snake;

  function init(){
    create_snake();
    create_food();
    score = 0;
    direction = "right";
    if (typeof game_loop != "undefined") clearInterval(game_loop);
    game_loop = setInterval(paint, speed);
  }

  init();

  function create_snake (){
    var length = 5;
    snake = [];
    for (var i = length - 1; i >= 0; i--) {
      snake.push({x: i, y: 0});
    };
  }

  function create_food (){
    food = {
      x:Math.round(Math.random()* (width - cellWidth)/ cellWidth),
      y:Math.round(Math.random()* (height - cellWidth)/ cellWidth),
    };
  }

  function paint (){
    var nx = snake[0].x;
    var ny = snake[0].y;
    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);
    context.strokeStyle = "white";
    context.strokeRect(0, 0, width, height);
    
    if (direction === "right") nx++;
    else if(direction === "left") nx--;
    else if(direction === "up") ny--;
    else if(direction === "down") ny++;

    if(nx == -1 || nx == width/cellWidth || ny == -1 || ny == height/cellWidth || check_collison(nx, ny, snake)){
      // init();
      //alert(score);
      $('#final_score').html(score);
      $('#overlay').fadeIn(300);
      return;
    }

    if (nx === food.x && ny === food.y) {
      var tail = {x: nx, y: ny};
      score++;
      create_food();

    } else {
      var tail = snake.pop();
      tail.x = nx;
      tail.y = ny;
    }
    snake.unshift(tail);

    for(var i = 0; i <snake.length; i ++) {
      var c = snake[i];
      paint_cell(c.x, c.y);
    }

    paint_cell(food.x, food.y);

    check_score(score);


    $('#score').html("Your Score: " + score)
  }

  function paint_cell(x, y) {
    context.fillStyle = color;
    context.fillRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
    context.strokeStyle = "white";
    context.strokeRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
  }

  function check_collison(x, y, array){
    for(var i = 0; i< array.length; i++){
      if(array[i].x == x && array[i].y == y)
        return true;
    }
    return false;
  }

  function check_score (score) {
    if (localStorage.getItem('highscore') == null){
      localStorage.setItem('highscore', score);
    } else {
      if (score >= localStorage.getItem('highscore')){
        localStorage.setItem('highscore', score);
      }
    }
    $('#highscore').html("High Score: " + localStorage.highscore);
  }
  
  $(document).keydown(function(e){
    var key = e.which;
    if(key == "37" && direction != "right") direction = "left";
    else if (key == "38" && direction != "down") direction = "up";
    else if (key == "39" && direction != "left") direction = "right";
    else if (key == "40" && direction != "up") direction = "down";
  });
});
function resetScore(){
  localStorage.highscore = 0;
  var highscorediv = document.getElementById('highscore');
  highscorediv.innerHTML = "High Score: 0";
}

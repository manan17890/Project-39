var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score;
var gameover , gameend;
var restart , restarticon;


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png"); 
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  gameend = loadImage("gameOver.png");
  restarticon = loadImage("restart.png")
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(windowWidth - 1220,windowHeight - 200,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.8;
  
  ground = createSprite(windowWidth ,windowHeight - 40,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameover = createSprite(windowWidth/2 , windowHeight/2 -50 , 50 , 50);
  gameover.addImage("over",gameend);
  gameover.scale= 1.8;
  gameover.visible=false;
  
  restart = createSprite( windowWidth/2 , windowHeight/2 +25 , 20 , 20);
  restart.addImage("playagain", restarticon);
  restart.scale=0.7;
  restart.visible=false;
  
  invisibleGround = createSprite(windowWidth - 1190,windowHeight - 30,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  
  score = 0;
}

function draw() {
  background(180);
  
  textSize(25);
  text("Score: "+ score, windowWidth - 150 ,windowHeight -580);
  
 
  trex.setCollider("circle", 0 ,-10 , 55);
  
  
  if (gameState==PLAY){
  //move the ground
    ground.velocityX = -7;
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if (ground.x < 180){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(mousePressedOver(trex) && trex.y >= windowHeight - 100) {
        trex.velocityY = -15;
    }
    
    gameover.visible=false;
    restart.visible=false;
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();

    camera.position.x = displayWidth/2;
    camera.position.y = displayHeight/2 -80;
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }

  }   
    
  else if (gameState === END) {
      ground.velocityX = 0;
     trex.changeAnimation("collided",trex_collided);
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     gameover.visible=true;
     restart.visible=true;
     
     obstaclesGroup.setLifetimeEach(-1);
     cloudsGroup.setLifetimeEach(-1);
     
     if (mousePressedOver(restart)){
       
       reset();
    
     }
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  
  
  drawSprites();
}

function spawnObstacles(){
  
 if (frameCount % 60 === 0){
   var obstacle = createSprite(windowWidth - 10, windowHeight - 60,10,40);
   obstacle.velocityX = -7;
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.7;
    obstacle.lifetime = 1000;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {

  //write code here to spawn the clouds
   if (frameCount % 60 === 0) {
     cloud = createSprite(windowWidth - 10,windowHeight - 500,40,10);
    cloud.y = Math.round(random(10,400));
    cloud.addImage(cloudImage);
    cloud.scale = 0.7;
    cloud.velocityX = -4;
    
     //assign lifetime to the variable
    cloud.lifetime = 1000;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    
  }
}
function reset(){
  
  gameState = PLAY;
  gameover.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
  score = 0;
 
  
}

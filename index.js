/** @type {HTMLCanvasElement} */
const canvas=document.getElementById("canva1");
const ctx=canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const canvaCollision=document.getElementById("canvaCollision");
const ctxcanvaCollision=canvaCollision.getContext("2d");
canvaCollision.width = window.innerWidth;
canvaCollision.height = window.innerHeight;



let timeToNextRaven=0;
let ravenInterval=500;
let lastTime=0;
let score=0;
let gameOver=false;
let ravens=[];
let explosions=[];
let particles =[];
let gameSpeed=10;
const backgroundLayer1=new Image();
backgroundLayer1.src="back.jpg";


class Raven{
    constructor(){
        this.spriteWidth=245.75;
        this.spriteHeight=163.5;
        this.sizeModifier=Math.random()*0.5+0.2;

        this.width=this.spriteWidth*this.sizeModifier;
        this.height=this.spriteHeight*this.sizeModifier;
        this.x=canvas.width;
        this.y=Math.random()*(canvas.height-this.height);
        this.directionX=Math.random()*4+1;
        this.directionY=Math.random()*5-2.5;
        this.markerForDeletion=false;
        this.image=new Image();
        this.image.src="flyy.png";
      this.frame=3;
      this.minFrame=0;
      this.timeFlap=0;
      this.flapInterval=50;
      this.randomColors=[Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255)];
      this.color='rgb('+this.randomColors[0]+','+this.randomColors[1]+','+this.randomColors[2]+')';
      this.hasTrail=Math.random()>0.5;
    }

    update(deltatime){
        if(this.y<0 || this.y > canvas.height-this.height){
            this.directionY=this.directionY*-1;
        }
        this.x-=this.directionX;
        this.y+=this.directionY;
        if(this.x<0 -this.width) this.markerForDeletion=true;
        this.timeFlap+=deltatime;
        if(this.timeFlap>this.flapInterval){
           
        if(this.frame<=this.minFrame) this.frame=3;
        else this.frame--;
        this.timeFlap=0; 

        if(this.hasTrail){
            particles.push(new Particle(this.x,this.y,this.width,this.color));

    particles.push(new Particle(this.x,this.y,this.width,this.color));
 
 
        }
      
        }
if(this.x<-this.width/2) gameOver=true;
     
    }

    draw(){
       ctxcanvaCollision.fillStyle=this.color;
        ctxcanvaCollision.fillRect(this.x,this.y,this.width,this.height);
ctx.drawImage(this.image,this.frame*this.spriteWidth,0,this.spriteWidth,
    this.spriteHeight,this.x,this.y,this.width,this.height);
    }
}

class Explosion{
    constructor(x,y,size){
        this.spriteWidth=200;
        this.spriteHeight=179;
        this.width=this.spriteWidth*0.6;
        this.height=this.spriteHeight*0.6;
        this.x=x-this.width/2;
        this.y=y-this.height/2;
        this.size=size;
        this.image=new Image();
        this.image.src='boom.png';
        this.frame=0;
        this.timer=0;
        this.sound=new Audio();
        this.sound.src="hyed.mp3";
        this.frameInt=100;
        this.markerForDeletion=false;
    }

    update(deltatime){
        if(this.frame===0){
            this.sound.play();
        }
        this.timer+=deltatime;
        if(this.timer > this.frameInt){
            this.frame++;
            this.timer=0;
            if(this.frame>5) this.markerForDeletion=true;
        }
    
    }

    draw(){
        ctx.drawImage(this.image,this.frame*this.spriteWidth,0,this.spriteWidth,this.spriteHeight,this.x,this.y,this.size,this.size);
    }
}

class Particle{
    constructor(x,y,size,color){
        this.size=size;
        this.x=x+this.size/2+Math.random()*50-25;
        this.y=y+this.size/3+Math.random()*50-25;
     
        this.color=color;
        this.radius=Math.random() *this.size/10;
        this.maxRadius=Math.random()*20+35;
        this.markedFoeDeletion=false;
        this.speedX=Math.random()*1;
        this.color=color;
    }

    update(){
        this.x+=this.speedX;
        this.radius+=0.3;
        if(this.radius>this.maxRadius-20) this.markedFoeDeletion=true;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha=1-this.radius/this.maxRadius;
        const spikes = 5;
        const outerRadius = this.radius;
        const innerRadius = this.radius / 2;
        let rot = Math.PI / 2 * 3;
        let x = this.x;
        let y = this.y;
        const step = Math.PI / spikes;
    
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = this.x + Math.cos(rot) * outerRadius;
            y = this.y + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;
    
            x = this.x + Math.cos(rot) * innerRadius;
            y = this.y + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(this.x, this.y - outerRadius);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
    
}

class Layer{
    constructor(image,speedModifier){
       
        this.width=canvas.width;
        this.height=canvas.height;
        this.x=0;
        this.y=0;
        this.image=image;
        this.speedModifier=speedModifier;
        this.speed=gameSpeed*this.speedModifier;
    }

    update(){
        this.speed=gameSpeed*this.speedModifier;
        if(this.x >= this.width){
            this.x=0;
        }
        // if(this.x2 <= -this.width){
        //     this.x2=this.width+this.x-this.speed;
        // }
        this.x=Math.floor(this.x+this.speed);
        //this.x2=Math.floor(this.x2-this.speed);
    }

    draw(){
        ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
        ctx.drawImage(this.image,this.x-this.width,this.y,this.width,this.height);
    }
}

function drawScore(){
    ctx.font = '40px monocpace ';
    ctx.fillStyle="aqua";
    ctx.fillText("Score : " +score,5,45);
    ctx.fillStyle="black";
    ctx.fillText("Score : " +score,4,44);
}

function drawGameover(){
    ctx.textAlign="center";
    ctx.fillStyle="white";
    ctx.fillText("GAME OVER - SCORE : "+score,canvas.width/2,canvas.height/2-2);
    ctx.fillStyle="tomato";
    ctx.fillText("GAME OVER - SCORE : "+score,canvas.width/2,canvas.height/2);

}

window.addEventListener('click',event=>{
    const detectPixelColor=ctxcanvaCollision.getImageData(event.x,event.y,1,1); 
    console.log(detectPixelColor);
    const pc=detectPixelColor.data;
    ravens.forEach(raven=>{
        if(raven.randomColors[0]=== pc[0] && raven.randomColors[1]=== pc[1] && raven.randomColors[2]=== pc[2]){
            raven.markerForDeletion=true;
            score++;
            explosions.push(new Explosion(raven.x,raven.y,raven.width));
        }
    })
})
const layer1=new Layer(backgroundLayer1,0.5);
function animate(timestamp){
ctx.clearRect(0,0,canvas.width,canvas.height);
ctxcanvaCollision.clearRect(0,0,canvas.width,canvas.height);
layer1.update();
layer1.draw();
let deltatime=timestamp-lastTime;
lastTime=timestamp;
timeToNextRaven+=deltatime;
if(timeToNextRaven>ravenInterval){
    ravens.push(new Raven());
    timeToNextRaven=0;

     ravens.sort((a,b)=>{
        return a.y-b.y;
    })
}

drawScore();
[...particles,...ravens,...explosions].forEach(obj=>obj.update(deltatime));
[...particles,...ravens,...explosions].forEach(obj=>obj.draw());
ravens=ravens.filter(raven=> !raven.markerForDeletion);
explosions=explosions.filter(explo=> !explo.markerForDeletion);
particles=particles.filter(part=> !part.markedFoeDeletion);
if(!gameOver)requestAnimationFrame(animate);
else drawGameover();
}

animate(0);

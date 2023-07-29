const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particleArray = [];
let adjustX = Math.floor(canvas.width * 0.00945)
let adjustY = Math.floor(canvas.height * 0.0345)
let startColor = [128, 0, 0];
let endColor = [51, 51, 0]; 

let mouse = {
    x: null,
    y: null,
    radius: Math.floor((canvas.height/90) * (canvas.width/90))
}

window.addEventListener('mousemove',
function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
})

class Particle {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.size = 2;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 40) + 5; 
    }
    draw(){
        let interpolationFactor = this.x / canvas.width;
        let colorR = Math.round(startColor[0] + interpolationFactor * (endColor[0] - startColor[0]));
        let colorG = Math.round(startColor[1] + interpolationFactor * (endColor[1] - startColor[1]));
        let colorB = Math.round(startColor[2] + interpolationFactor * (endColor[2] - startColor[2]));

        ctx.fillStyle = `rgba(${colorR}, ${colorG}, ${colorB})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
    update(){
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;
        
        if (distance < mouse.radius) {
            this.x -= directionX;
            this.y -= directionY;
        } else {
            if (this.x !== this.baseX){
                let dx = this.x - this.baseX;
                this.x -= dx/10
            }
            if (this.y !== this.baseY){
                let dy = this.y - this.baseY;
                this.y -= dy/10
            }
        }
    }
}

function init() {
    particleArray = [];
    
    if (canvas.width < 920) {
        adjustX = Math.floor(canvas.width * 0.0285)
        adjustY = Math.floor(canvas.height * 0.0125)
        let fontSize = Math.max(Math.floor((canvas.width) * 0.032), 32);
        ctx.font = `${fontSize}px Georgia`;
        ctx.fillText('JS', 0, 24)
    } else {
        adjustX = Math.floor(canvas.width * 0.00945)
        adjustY = Math.floor(canvas.height * 0.0295)
        let fontSize = Math.max(Math.floor((canvas.width) * 0.016), 16);
        ctx.font = `${fontSize}px Georgia`;
        ctx.fillText('JavaScript', 0, 16)
    }
    
    let textCoordinates = ctx.getImageData(0, 0, canvas.width, canvas.height)

    for (let y = 0, y2 = textCoordinates.height; y < y2; y++){
        for(let x = 0, x2 = textCoordinates.width; x < x2; x++){
            if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3]  > 128){
                let positionX = x + adjustX;
                let positionY = y + adjustY;
                
                particleArray.push(new Particle(positionX * 10, positionY * 10))
            }
        }
    }
}

init();

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (let i = 0; i < particleArray.length; i++){
        particleArray[i].draw();
        particleArray[i].update();
    }
    connect();
    requestAnimationFrame(animate);
}
animate();

function connect(){
    let opacityValue;
    for (let a = 0; a < particleArray.length; a++){
        for (let b = a; b < particleArray.length; b++){
            let dx = particleArray[a].x - particleArray[b].x;
            let dy = particleArray[a].y - particleArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy)
            
            opacityValue = 1 - (distance/20);

            let interpolationFactor = particleArray[a].x / canvas.width;
            let colorR = Math.round(startColor[0] + interpolationFactor * (endColor[0] - startColor[0]));
            let colorG = Math.round(startColor[1] + interpolationFactor * (endColor[1] - startColor[1]));
            let colorB = Math.round(startColor[2] + interpolationFactor * (endColor[2] - startColor[2]));

            ctx.strokeStyle = `rgba(${colorR}, ${colorG}, ${colorB}, ${opacityValue})`;

            if (distance < 20){
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(particleArray[a].x, particleArray[a].y)
                ctx.lineTo(particleArray[b].x, particleArray[b].y)
                ctx.stroke();
            }
        }
    }
}

window.addEventListener('resize',
function(){
    canvas.width = this.innerWidth;
    canvas.height = this.innerHeight;
    init();
})
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 0.7;

let dust = 100, fear = 10, fragnetShards = 5, superTokens = 1;
const balloons = [], darts = [];

function spawnBalloon() {
    const types = ['common', 'rare', 'legendary', 'fragnet'];
    const type = types[Math.floor(Math.random() * types.length)];
    balloons.push({
        x: Math.random() * canvas.width,
        y: canvas.height + 50,
        radius: 30,
        type: type,
        health: 100,
        speed: 1 + Math.random() * 2
    });
}

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    darts.push({
        x: canvas.width / 2,
        y: canvas.height - 50,
        targetX: x,
        targetY: y,
        speed: 15
    });
});

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    balloons.forEach((balloon, i) => {
        balloon.y -= balloon.speed;
        ctx.fillStyle = balloon.type === 'common' ? '#FF6B6B' : 
                        balloon.type === 'rare' ? '#4ECDC4' : 
                        balloon.type === 'fragnet' ? '#8A2BE2' : '#FFD166';
        ctx.beginPath();
        ctx.arc(balloon.x, balloon.y, balloon.radius, 0, Math.PI * 2);
        ctx.fill();
        if (balloon.y < -50) balloons.splice(i, 1);
    });
    
    darts.forEach((dart, i) => {
        const dx = dart.targetX - dart.x;
        const dy = dart.targetY - dart.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < dart.speed) {
            balloons.forEach((balloon, bi) => {
                const dist = Math.sqrt(Math.pow(dart.targetX - balloon.x, 2) + Math.pow(dart.targetY - balloon.y, 2));
                if (dist < balloon.radius) {
                    balloons.splice(bi, 1);
                    if (balloon.type !== 'fragnet') dust += 10, fear += 1;
                    else fragnetShards += 3;
                    console.log(`POP! Dust: ${dust}, Fear: ${fear}, Shards: ${fragnetShards}`);
                }
            });
            darts.splice(i, 1);
        } else {
            dart.x += (dx / distance) * dart.speed;
            dart.y += (dy / distance) * dart.speed;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(dart.x, dart.y, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    });
    
    requestAnimationFrame(gameLoop);
}

setInterval(spawnBalloon, 1500);
gameLoop();
setInterval(() => {
    document.getElementById('walletBtn').innerHTML = `DUST: ${dust} | FEAR: ${fear} | 💜: ${fragnetShards}`;
}, 1000);

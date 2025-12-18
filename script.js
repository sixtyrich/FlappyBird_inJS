// ================== VARIABILI ==================
let move_speed = 3, gravity = 0.5;
let bird = document.querySelector('.bird');
let img = document.getElementById('bird-1');

let sound_point = new Audio('sounds effect/point.mp3');
let sound_die = new Audio('sounds effect/die.mp3');

let bg_music = new Audio('sounds effect/bg.mp3');
bg_music.loop = true; 
bg_music.volume = 0.4;

let menu = document.getElementById('menu');
let playBtn = document.getElementById('playBtn');
let muteBtn = document.getElementById('muteBtn');

let lastScoreSpan = document.getElementById('lastScore');
let menuBird = document.getElementById('menu-bird');
let prevSkinBtn = document.getElementById('prevSkin');
let nextSkinBtn = document.getElementById('nextSkin');

let skins = ['images/bird.png','images/bird1.png','images/bird2.png'];
let currentSkin = 0;
let isMuted = false;

let score_val = document.querySelector('.score_val');
let score_title = document.querySelector('.score_title');

let bird_props, bird_dy = 0;
let game_state = 'Start';
bird.style.display = 'none';

// ================== FUNZIONI ==================
function updateSkin() {
    menuBird.src = skins[currentSkin];
    img.src = skins[currentSkin];
}

prevSkinBtn.addEventListener('click', () => {
    currentSkin = (currentSkin - 1 + skins.length) % skins.length;
    updateSkin();
});
nextSkinBtn.addEventListener('click', () => {
    currentSkin = (currentSkin + 1) % skins.length;
    updateSkin();
});

muteBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    bg_music.muted = isMuted;
    muteBtn.textContent = isMuted ? "🎵 Musica: OFF" : "🎵 Musica: ON";
});

// ================== START GAME ==================
function startGame() {
    document.querySelectorAll('.pipe_sprite').forEach(e=>e.remove());
    menu.style.display = 'none';
    bird.style.display = 'block';
    bird.style.top = '40vh';
    bird_dy = 0;
    bird_props = bird.getBoundingClientRect();
    score_val.innerHTML = '0';
    score_title.innerHTML = 'Score : ';
    game_state = 'Play';
    document.querySelector('.score').style.display = 'block';
    if(!isMuted){ bg_music.currentTime=0; bg_music.play(); }
    play();
}

playBtn.addEventListener('click', startGame);

// ================== TASTI + MOUSE ==================
document.addEventListener('keydown', e=>{
    if((e.code==='Space'||e.key===' ') && game_state==='Play'){
        bird_dy = -7.6;
        img.src = skins[currentSkin].replace('.png','-2.png');
    }
});

document.addEventListener('keyup', e=>{
    if((e.code==='Space'||e.key===' ') && game_state==='Play'){
        img.src = skins[currentSkin];
    }
});

document.addEventListener('mousedown', e=>{
    if(game_state==='Play'){
        bird_dy = -7.6;
        img.src = skins[currentSkin].replace('.png','-2.png');
    }
});

document.addEventListener('mouseup', e=>{
    if(game_state==='Play'){
        img.src = skins[currentSkin];
    }
});

// ================== GAME LOOP ==================
function play() {
    function move() {
    if(game_state!=='Play') return;

    document.querySelectorAll('.pipe_sprite').forEach(pipe=>{
        let pipe_props = pipe.getBoundingClientRect();
        bird_props = bird.getBoundingClientRect();
        let beforeHeight = pipe_props.height * 0.1;
        let afterHeight = pipe_props.height * 0.1;

        let pipe_top = pipe_props.top - beforeHeight;
        let pipe_bottom = pipe_props.bottom + afterHeight;
        if(
            bird_props.left < pipe_props.right &&
            bird_props.right > pipe_props.left &&
            bird_props.top < pipe_bottom &&
            bird_props.bottom > pipe_top
        ){
            endGame();
            return;
        }
        if(pipe_props.right < bird_props.left && pipe_props.right + move_speed >= bird_props.left && pipe.increase_score==='1'){
            score_val.innerHTML = Number(score_val.innerHTML)+1;
            pipe.increase_score='0';
            sound_point.play();
        }
        pipe.style.left = pipe_props.left - move_speed + 'px';
        if(pipe_props.right <= 0){ pipe.remove(); }
    });

    requestAnimationFrame(move);
}

    function apply_gravity() {
        if(game_state!=='Play') return;
        bird_dy += gravity;
        bird.style.top = bird_props.top + bird_dy + 'px';
        bird_props = bird.getBoundingClientRect();

        let background_rect = document.querySelector('.background').getBoundingClientRect();
        if(bird_props.top<=0 || bird_props.bottom>=background_rect.bottom){
            endGame();
            return;
        }
        requestAnimationFrame(apply_gravity);
    }

    let pipe_seperation = 0;
    let pipe_gap = 35;

    function create_pipe() {
        if(game_state!=='Play') return;
        if(pipe_seperation>115){
            pipe_seperation=0;
            let pipe_posi = Math.floor(Math.random()*43)+8;
            let pipe_top = document.createElement('div');
            pipe_top.className='pipe_sprite';
            pipe_top.style.top = pipe_posi-70+'vh';
            pipe_top.style.left = '100vw';
            let pipe_bottom = document.createElement('div');
            pipe_bottom.className='pipe_sprite';
            pipe_bottom.style.top = pipe_posi+pipe_gap+'vh';
            pipe_bottom.style.left = '100vw';
            pipe_bottom.increase_score='1';
            document.body.appendChild(pipe_top);
            document.body.appendChild(pipe_bottom);
        }
        pipe_seperation++;
        requestAnimationFrame(create_pipe);
    }

    move();
    apply_gravity();
    create_pipe();
}

// ================== GAME OVER ==================
function endGame() {
    game_state='End';
    sound_die.play();
    bg_music.pause();
    bg_music.currentTime=0;
    bird.style.display='none';
    menu.style.display='flex';
    document.querySelector('.score').style.display = 'none';
    lastScoreSpan.textContent = score_val.innerHTML;
}



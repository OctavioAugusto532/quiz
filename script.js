const questions = [
    { q: "Em Cyberpunk 2077, qual personagem famoso fica preso na mente do V por causa do chip Relic?", opts: ["Johnny Silverhand", "Adam Smasher", "Morgan Blackhand", "Jackie Welles"], a: 0 },
    { q: "Em Dark Souls 1, qual dupla de chefes o jogador enfrenta em Anor Londo?", opts: ["Ornstein e Smough", "Gwyn e Artorias", "Nito e Seath", "Gargoyles e Quelaag"], a: 0 },
    { q: "Em Red Dead Redemption 2, qual doença Arthur Morgan descobre ter durante a história?", opts: ["Tuberculose", "Febre amarela", "Pneumonia", "Cólera"], a: 0 },
    { q: "Em Persona 4, qual é o nome do Persona inicial do protagonista Yu Narukami?", opts: ["Izanagi", "Thanatos", "Arsene", "Orpheus"], a: 0 },
    { q: "Em The Last of Us, qual é o nome do irmão de Joel?", opts: ["Tommy", "Bill", "Henry", "David"], a: 0 },
    { q: "Em Elden Ring, qual personagem aparece logo no início oferecendo o acordo que permite ao jogador subir de nível?", opts: ["Melina", "Ranni", "Fia", "Renna"], a: 0 },
    { q: "Em Sekiro: Shadows Die Twice, qual boss aparece no topo do Castelo Ashina em um dos combates mais importantes do jogo?", opts: ["Genichiro Ashina", "Owl", "Isshin Ashina", "Lady Butterfly"], a: 0 },
    { q: "Em Fallout New Vegas, qual personagem atira no Courier logo no começo do jogo?", opts: ["Benny", "Mr House", "Caesar", "Yes Man"], a: 0 },
    { q: "Em Mortal Kombat, qual personagem é conhecido pela frase 'Get over here!'?", opts: ["Scorpion", "Sub-Zero", "Liu Kang", "Raiden"], a: 0 },
    { q: "Em Resident Evil 4, qual é o objetivo principal de Leon no início do jogo?", opts: ["Resgatar Ashley Graham", "Capturar Albert Wesker", "Destruir a Umbrella", "Salvar Jill Valentine"], a: 0 }
];

const prizes = ["1.000", "2.000", "5.000", "10.000", "20.000", "40.000", "80.000", "160.000", "320.000", "1.000.000"];

let idx = 0;
let locked = false;
let winnings = "0";
let skipsLeft = 3; 

const qEl = document.getElementById("question");
const optEl = document.getElementById("options");
const status = document.getElementById("status");
const ladder = document.getElementById("ladder");
const victory = document.getElementById("victory");
const defeat = document.getElementById("defeat");
const victoryMsg = document.getElementById("victoryMsg");
const defeatMsg = document.getElementById("defeatMsg");


const fiftyBtn = document.getElementById("fiftyBtn");
const skipBtn = document.getElementById("skipBtn");
const askBtn = document.getElementById("askBtn");

function init() {
    idx = 0;
    winnings = "0";
    skipsLeft = 3;
    

    victory.style.display = "none";
    defeat.style.display = "none";
    status.innerText = "Boa sorte!";
    

    fiftyBtn.disabled = false;
    askBtn.disabled = false;
    updateSkipText();

    renderLadder();
    renderQuestion();
}

function renderLadder() {
    ladder.innerHTML = "";
    for (let i = prizes.length - 1; i >= 0; i--) {
        let d = document.createElement("div");
        d.className = "level";
        d.innerText = (i + 1) + " - R$ " + prizes[i];
        if (i === idx) d.classList.add("active");
        ladder.appendChild(d);
    }
}

function renderQuestion() {
    locked = false;
    let q = questions[idx];

    if (!q) {
        win();
        return;
    }

    qEl.innerText = "Pergunta " + (idx + 1) + ": " + q.q;
    optEl.innerHTML = "";

    let optionsArray = q.opts.map((text, i) => ({ text, isCorrect: i === q.a }));
    optionsArray.sort(() => Math.random() - 0.5); 

    optionsArray.forEach((opt) => {
        let b = document.createElement("button");
        b.className = "opt";
        b.innerText = opt.text;
        b.onclick = () => answer(opt.isCorrect, b);
        optEl.appendChild(b);
    });

    renderLadder();
}

function answer(isCorrect, btn) {
    if (locked) return;
    locked = true;

    if (isCorrect) {
        btn.style.backgroundColor = "#27ae60"; 
        btn.style.color = "white";
        winnings = prizes[idx];
        status.innerText = "Correto! Você ganhou R$ " + winnings;

        setTimeout(() => {
            idx++;
            renderQuestion();
        }, 1000);
    } else {
        btn.style.backgroundColor = "#c0392b"; 
        status.innerText = "Que pena, você errou!";
        setTimeout(lose, 800);
    }
}

skipBtn.onclick = () => {
    if (skipsLeft > 0 && !locked) {
        skipsLeft--;
        updateSkipText();
        idx++;
        renderQuestion();
    }
};

function updateSkipText() {
    skipBtn.innerText = `Pular (${skipsLeft})`;
    if (skipsLeft === 0) skipBtn.disabled = true;
}


fiftyBtn.onclick = () => {
    if (locked) return;
    const q = questions[idx];
    const buttons = Array.from(optEl.querySelectorAll("button"));
    let removed = 0;

    buttons.forEach(btn => {
        
        if (btn.innerText !== q.opts[q.a] && removed < 2) {
            btn.style.visibility = "hidden";
            removed++;
        }
    });
    fiftyBtn.disabled = true;
};


askBtn.onclick = () => {
    const q = questions[idx];
    alert("Dica: A resposta correta é '" + q.opts[q.a] + "'"); 
    askBtn.disabled = true;
};


document.getElementById("stopBtn").onclick = () => {
    if (idx === 0) {
        alert("Você ainda não ganhou nada!");
    } else {
        defeatMsg.innerText = "Você parou e levou R$ " + prizes[idx - 1];
        defeat.style.display = "flex";
    }
};

function lose() {
    let finalPrize = idx === 0 ? "0" : prizes[Math.max(0, idx - 1)];
    defeatMsg.innerText = "Fim de jogo! Você sai com R$ " + finalPrize;
    defeat.style.display = "flex";
}

function win() {
    victoryMsg.innerText = "INCRÍVEL! Você ganhou o prêmio máximo de R$ 1.000.000!";
    victory.style.display = "flex";
}

document.getElementById("restartBtn").onclick = init;

init();
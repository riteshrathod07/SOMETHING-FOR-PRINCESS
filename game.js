const $ = (id) => document.getElementById(id);

const welcome = $("welcome");
const game = $("game");
const ending = $("ending");
const player = $("player");
const worldItems = $("worldItems");
const messageBox = $("messageBox");

const levels = [
  {
    name: "The Starlight Garden",
    mission: "Collect 3 little stars to discover your first surprise.",
    items: ["⭐", "🦋", "🌸"],
    icon: "💌",
    title: "A Little Truth About You",
    message:
      "Princess,teko pata hai? 🥹✨\n\nTu na bs dikhati hai.lekin daddy jante hai na unki princess kinni pyari hai bhaiii.\n\nDadddy hamesha apni princesss ko aise hi loved feel karayege yk dadddy loves you alot babygirl. ♡"
  },
  {
    name: "The Floating Islands",
    mission: "Explore the sky and collect 3 magical treasures.",
    items: ["💎", "🪷", "🌙"],
    icon: "🌌",
    title: "You Make My World Beautiful",
    message:
      "Agar meri life me tu na hoti na toh woh beautiful hi na hoti yaar. 🌙\n\nI enjoy every single moment of my life with you thank you for being so sweet with me.\n\nLife isn't beautiful,but being with you makes it beautiful. 🥰"
  },
  {
    name: "The Memory Forest",
    mission: "Find the hidden memories glowing in this enchanted forest.",
    items: ["🍄", "🧸", "🦋"],
    icon: "🧸",
    title: "Our Little Memories",
    message:
      "Babygirl do you remember first time on call jb tune rone ka cute act kiyaa tha. 🥹❤️\n\nthe very first time jb tu meri princess banii thi ,I still cherish these memoriesss i love you alot baygirll.\n\nYou are a very special part of my life, Princess. ♡"
  },
  {
    name: "The Rain of Stars",
    mission: "Collect the last 3 stars. A little message is waiting for you.",
    items: ["✨", "🌟", "💫"],
    icon: "🥺",
    title: "I'm Sorry, Meri Jaan",
    message:
      "Princess,agar kal ki baat teko abtk hurt kr rhi ho , toh I'm genuinely sorry. 🥺❤️\n\nMain woh wapis toh ni le sktaa lekin teko fir se smile toh kara skta hu naa.\n\nIsliye chal ab udas mt ho daddy lovesss you more than anything else aap daddy ki nanhi si jaan ho naa.\n\nToh chalo kaho daddy i love you so much aur smilee karoo toh.\n\nYou matter the most to me my dear princesss. 🫂"
  }
];

let levelIndex = 0;
let score = 0;
let playerPosition = 12;
let collected = 0;
let locked = false;

function showScreen(screen) {
  [welcome, game, ending].forEach(s => s.classList.add("hidden"));
  screen.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function createStars() {
  const container = $("stars");
  for (let i = 0; i < 32; i++) {
    const star = document.createElement("span");
    star.textContent = Math.random() > 0.5 ? "✦" : "·";
    star.style.position = "absolute";
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.color = "#dce4ff";
    star.style.opacity = 0.2 + Math.random() * 0.6;
    star.style.fontSize = 8 + Math.random() * 12 + "px";
    container.appendChild(star);
  }
}

function loadLevel() {
  locked = false;
  collected = 0;
  playerPosition = 12;

  const level = levels[levelIndex];

  $("levelText").textContent = `LEVEL ${levelIndex + 1} / ${levels.length}`;
  $("score").textContent = score;
  $("progress").style.width = (levelIndex / levels.length * 100) + "%";
  $("levelName").textContent = level.name;
  $("mission").textContent = level.mission;

  player.style.left = playerPosition + "%";
  player.style.bottom = "65px";
  player.style.transform = "scaleX(1)";
  worldItems.innerHTML = "";
  messageBox.classList.add("hidden");

  const positions = [25, 53, 80];

  level.items.forEach((emoji, index) => {
    const item = document.createElement("span");
    item.className = "collectible";
    item.textContent = emoji;
    item.style.left = positions[index] + "%";
    item.style.top = [42, 25, 48][index] + "%";
    item.setAttribute("role", "button");
    item.setAttribute("tabindex", "0");
    item.setAttribute("aria-label", "Collect " + emoji);

    item.addEventListener("click", () => collectItem(item));
    item.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        collectItem(item);
      }
    });

    worldItems.appendChild(item);
  });
}

function collectItem(item) {
  if (locked || item.classList.contains("collected")) return;

  item.classList.add("collected");
  item.style.visibility = "hidden";
  score += 10;
  collected++;

  $("score").textContent = score;

  if (collected === 3) {
    locked = true;
    $("progress").style.width =
      ((levelIndex + 1) / levels.length * 100) + "%";

    setTimeout(showMessage, 350);
  }
}

function showMessage() {
  const level = levels[levelIndex];

  $("messageIcon").textContent = level.icon;
  $("messageTitle").textContent = level.title;
  $("messageText").textContent = level.message;

  messageBox.classList.remove("hidden");
  $("nextBtn").textContent =
    levelIndex === levels.length - 1
      ? "One last surprise awaits ✨"
      : "Continue the adventure →";

  messageBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function move(direction) {
  if (locked || game.classList.contains("hidden")) return;

  playerPosition = Math.max(3, Math.min(88, playerPosition + direction * 7));
  player.style.left = playerPosition + "%";
  player.style.transform = direction < 0 ? "scaleX(-1)" : "scaleX(1)";

  // Automatically collect nearby treasures.
  document.querySelectorAll(".collectible:not(.collected)").forEach(item => {
    const itemPosition = parseFloat(item.style.left);
    if (Math.abs(itemPosition - playerPosition) < 9) {
      collectItem(item);
    }
  });
}

function jump() {
  if (locked || game.classList.contains("hidden")) return;

  player.style.bottom = "115px";
  setTimeout(() => {
    player.style.bottom = "65px";
  }, 350);
}

$("startBtn").addEventListener("click", () => {
  showScreen(game);
  loadLevel();
});

$("leftBtn").addEventListener("click", () => move(-1));
$("rightBtn").addEventListener("click", () => move(1));
$("jumpBtn").addEventListener("click", jump);

$("nextBtn").addEventListener("click", () => {
  if (levelIndex < levels.length - 1) {
    levelIndex++;
    loadLevel();
  } else {
    showScreen(ending);
  }
});

$("hugBtn").addEventListener("click", () => {
  $("hugText").textContent =
    "Tightest  hug ever! 🫂❤️ Imagine me holding you close, " +
    "with all the warmth and love this little universe can hold. " +
    "You deserve the world, happiness and so many reasons to smile. i love you babygirl ♡";

  $("hugBtn").textContent = "Hug delivered! ❤️";
  $("hugBtn").disabled = true;
  $("hugBtn").style.opacity = "0.8";

  for (let i = 0; i < 16; i++) {
    const heart = document.createElement("span");
    heart.textContent = ["♡", "✨", "♥", "✦"][i % 4];
    heart.style.position = "fixed";
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.bottom = "-20px";
    heart.style.fontSize = 20 + Math.random() * 20 + "px";
    heart.style.color = "#dbe4ff";
    heart.style.pointerEvents = "none";
    heart.style.zIndex = "10";
    document.body.appendChild(heart);

    const animation = heart.animate([
      { transform: "translateY(0) rotate(0deg)", opacity: 1 },
      { transform: `translateY(-100vh) rotate(${Math.random() * 180}deg)`, opacity: 0 }
    ], {
      duration: 2200 + Math.random() * 1800,
      easing: "ease-out"
    });

    animation.onfinish = () => heart.remove();
  }
});

$("restartBtn").addEventListener("click", () => {
  levelIndex = 0;
  score = 0;
  $("hugText").textContent = "";
  $("hugBtn").disabled = false;
  $("hugBtn").textContent = "Come here, meri jaan 🫂";
  $("hugBtn").style.opacity = "1";
  showScreen(welcome);
});

createStars();
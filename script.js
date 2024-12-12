const canvas = document.getElementById("treeCanvas");
const ctx = canvas.getContext("2d");
const treeWidthInput = document.getElementById("treeWidth");
const treeHeightInput = document.getElementById("treeHeight");
const applySettingsButton = document.getElementById("applySettings");
const saveProgramButton = document.getElementById("saveProgram");
const loadProgramButton = document.getElementById("loadProgram");

let leds = []; // Массив светодиодов

// Функция для отрисовки ёлки
function drawTree() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#008000";
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(0, canvas.height);
  ctx.lineTo(canvas.width, canvas.height);
  ctx.closePath();
  ctx.fill();

  // Отрисовка светодиодов
  leds.forEach(led => {
    ctx.fillStyle = led.color;
    ctx.beginPath();
    ctx.arc(led.x, led.y, 10, 0, Math.PI * 2); // Размер светодиодов
    ctx.fill();
  });
}

// Событие: применение настроек
applySettingsButton.addEventListener("click", () => {
  canvas.width = parseInt(treeWidthInput.value);
  canvas.height = parseInt(treeHeightInput.value);
  drawTree();
});

// Событие: сохранить программу
saveProgramButton.addEventListener("click", async () => {
  const program = {
    width: canvas.width,
    height: canvas.height,
    leds: leds
  };
  await saveToGitHub(program);
});

// Событие: загрузить программу
loadProgramButton.addEventListener("click", async () => {
  const program = await loadFromGitHub();
  if (program) {
    canvas.width = program.width;
    canvas.height = program.height;
    leds = program.leds;
    drawTree();
  }
});

// Функция сохранения данных в GitHub
async function saveToGitHub(data) {
  const token = "ВАШ_GITHUB_TOKEN"; // Личный токен GitHub
  const repo = "ВАШ_РЕПОЗИТОРИЙ";
  const path = "tree_program.json";
  const content = btoa(JSON.stringify(data, null, 2)); // Преобразование в base64

  const response = await fetch(https://api.github.com/repos/${repo}/contents/${path}, {
    method: "PUT",
    headers: {
      "Authorization": token ${token},
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "Update tree program",
      content: content,
      branch: "main"
    })
  });

  if (response.ok) {
    alert("Программа сохранена!");
  } else {
    alert("Ошибка сохранения!");
  }
}

// Функция загрузки данных из GitHub
async function loadFromGitHub() {
  const repo = "ВАШ_РЕПОЗИТОРИЙ";
  const path = "tree_program.json";

  const response = await fetch(https://api.github.com/repos/${repo}/contents/${path});
  if (response.ok) {
    const data = await response.json();
    const content = atob(data.content);
    return JSON.parse(content);
  } else {
    alert("Ошибка загрузки!");
    return null;
  }
}

// Инициализация
drawTree();

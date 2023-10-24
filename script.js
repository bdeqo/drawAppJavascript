const canvas = document.querySelector("canvas");
botoesFerramentas = document.querySelectorAll(".ferramenta");
preenchimento = document.querySelector("#preenchimento");
barraRolagem = document.querySelector("#barra-rolagem");
cores = document.querySelectorAll(".cores .opcao");
colorPicker = document.querySelector("#color-picker");
limparTela = document.querySelector(".limpar-tela");
salvarImagem = document.querySelector(".salvar-imagem");
ctx = canvas.getContext("2d");

let mouseX,
  mouseY,
  snapshot,
  desenhoAtivo = false,
  pincelWidth = 5;
(selectedTool = "pincel"), (selectedColor = "#000");

const setCanvasBackground = () => {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = selectedColor;
};

window.addEventListener("load", () => {
  //define a altura e largura do canvas.. offsetwidth/height retorna uma largura/altura viável de um elemento
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvasBackground();
});

const drawning = (e) => {
  if (!desenhoAtivo) return;
  ctx.putImageData(snapshot, 0, 0);
  if (selectedTool === "pincel" || selectedTool === "borracha") {
    ctx.strokeStyle = selectedTool === "borracha" ? "#fff" : selectedColor;
    ctx.lineTo(e.offsetX, e.offsetY); // cria uma linha de acordo com o cursor do mouse
    ctx.stroke(); //preenche a linha com cor
  } else if (selectedTool === "retangulo") {
    drawRect(e);
  } else if (selectedTool === "circulo") {
    drawCircle(e);
  } else if (selectedTool === "triangulo") {
    drawTriangle(e);
  }
};

const startDraw = (e) => {
  desenhoAtivo = true;
  mouseX = e.offsetX; //passa o valor de x da posição do mouse
  mouseY = e.offsetY; //passa o valor de y na posição do mouse
  ctx.beginPath();
  ctx.lineWidth = pincelWidth;
  ctx.strokeStyle = selectedColor;
  ctx.fillStyle = selectedColor;
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

botoesFerramentas.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".opcoes .active").classList.remove("active");
    btn.classList.add("active");
    selectedTool = btn.id;
  });
});

const drawRect = (e) => {
  if (!preenchimento.checked) {
    return ctx.strokeRect(
      e.offsetX,
      e.offsetY,
      mouseX - e.offsetX,
      mouseY - e.offsetY
    );
  }
  ctx.fillRect(e.offsetX, e.offsetY, mouseX - e.offsetX, mouseY - e.offsetY);
};

const drawCircle = (e) => {
  ctx.beginPath();
  let radius = Math.sqrt(
    Math.pow(mouseX - e.offsetX, 2) + Math.pow(mouseY - e.offsetY, 2)
  );
  ctx.arc(mouseX, mouseY, radius, 0, 2 * Math.PI);
  preenchimento.checked ? ctx.fill() : ctx.stroke();
};

const drawTriangle = (e) => {
  ctx.beginPath();
  ctx.moveTo(mouseX, mouseY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.lineTo(mouseX * 2 - e.offsetX, e.offsetY);
  ctx.closePath();
  preenchimento.checked ? ctx.fill() : ctx.stroke();
};

barraRolagem.addEventListener(
  "change",
  () => (pincelWidth = barraRolagem.value)
);

cores.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".opcoes .selected").classList.remove("selected");
    btn.classList.add("selected");
    selectedColor = window
      .getComputedStyle(btn)
      .getPropertyValue("background-color");
  });
});

colorPicker.addEventListener("change", () => {
  colorPicker.parentElement.style.background = colorPicker.value;
  colorPicker.parentElement.click();
});

limparTela.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setCanvasBackground();
});

salvarImagem.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = `${Date.now()}.jpg`;
  link.href = canvas.toDataURL();
  link.click();
});

canvas.addEventListener("mousemove", drawning);
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mouseup", () => (desenhoAtivo = false));

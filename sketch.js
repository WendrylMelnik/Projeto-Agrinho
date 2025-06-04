let musicoX, musicoY;
let alturaDivisao = 200;
let notasCampo = [];
let notasCidade = [];
let notasColetadas = [];
let pontoHarmoniaX, pontoHarmoniaY;
let raioHarmonia = 50;
let melodia = 0;
// Remova melodiaMaximaPorNivel daqui, pois será calculada
let nivelAtual = 1;
let quantidadeNotasPorNivel = 5;
let estadoJogo = "jogando";
let tempoMensagemNivel = 0;

function setup() {
  createCanvas(600, 400);
  musicoX = width / 2;
  musicoY = height / 2;
  pontoHarmoniaX = width / 2;
  pontoHarmoniaY = height / 2;
  iniciarNivel(nivelAtual);
  textAlign(CENTER, CENTER);
  textSize(16);
}

function draw() {
  background(220);

  fill(100, 200, 100);
  rect(0, alturaDivisao, width, height - alturaDivisao);

  fill(150);
  rect(0, 0, width, alturaDivisao);

  desenharPontoHarmonia();

  musicoX = mouseX;
  musicoY = mouseY;
  fill(255, 0, 0);
  ellipse(musicoX, musicoY, 20, 30);

  for (let i = 0; i < notasColetadas.length; i++) {
    fill(notasColetadas[i].cor);
    ellipse(musicoX - 10 + i * 10, musicoY - 20, 10, 15);
  }

  desenharCampo();
  desenharCidade();

  if (estadoJogo === "jogando") {
    coletarNotas();
    harmonizarNotas();
  }

  desenharBarraMelodia();
  exibirMensagensJogo();
}

// --- Funções de Nível e Inicialização ---

function iniciarNivel(nivel) {
  melodia = 0;
  notasColetadas = [];

  // Define a melodia máxima necessária para o nível atual
  // Exemplo: Nível 1 = 50, Nível 2 = 75, Nível 3 = 100
  // Você pode ajustar a fórmula conforme a dificuldade desejada
  let melodiaNecessaria = 50 + (nivel - 1) * 25; // Aumenta em 25 a cada nível

  // Atualiza a barra de melodia com a nova melodia máxima
  // Podemos passar isso como um parâmetro para a função, ou usar uma variável global
  // Para este exemplo, manteremos como variável global que é calculada dinamicamente
  // Não precisamos de uma variável global 'melodiaMaximaPorNivel' fixa, mas sim calculá-la

  let numNotas = quantidadeNotasPorNivel + (nivel - 1) * 2;

  notasCampo = [];
  for (let i = 0; i < numNotas; i++) {
    notasCampo.push({
      x: random(50, width - 50),
      y: random(alturaDivisao + 20, height - 20),
      tipo: "campo",
      cor: color(0, 255, 0),
      coletada: false,
    });
  }

  notasCidade = [];
  for (let i = 0; i < numNotas; i++) {
    notasCidade.push({
      x: random(50, width - 50),
      y: random(20, alturaDivisao - 20),
      tipo: "cidade",
      cor: color(0, 0, 255),
      coletada: false,
    });
  }

  estadoJogo = "jogando";
}

// --- Funções de Desenho ---

function desenharPontoHarmonia() {
  fill(255, 255, 0, 150);
  ellipse(pontoHarmoniaX, pontoHarmoniaY, raioHarmonia * 2, raioHarmonia * 2);
  fill(0);
  textSize(16);
  text("Harmonia", pontoHarmoniaX, pontoHarmoniaY - 10);
  textSize(12);
  text(`Nível ${nivelAtual}`, pontoHarmoniaX, pontoHarmoniaY + 10);
}

function desenharCampo() {
  for (let nota of notasCampo) {
    if (!nota.coletada) {
      fill(nota.cor);
      ellipse(nota.x, nota.y, 10, 15);
    }
  }
}

function desenharCidade() {
  for (let nota of notasCidade) {
    if (!nota.coletada) {
      fill(nota.cor);
      rect(nota.x - 5, nota.y - 10, 10, 20);
    }
  }
}

function desenharBarraMelodia() {
  // Calcula a melodia máxima para o nível atual
  let melodiaMaximaParaBarra = 50 + (nivelAtual - 1) * 25;

  fill(200);
  rect(20, 20, 150, 20);
  fill(0, 255, 0);
  let larguraMelodia = map(melodia, 0, melodiaMaximaParaBarra, 0, 150);
  rect(20, 20, constrain(larguraMelodia, 0, 150), 20);
  fill(0);
  textSize(12);
  textAlign(LEFT, CENTER);
  text("Melodia: " + floor(melodia) + "/" + melodiaMaximaParaBarra, 25, 30);
}

// --- Lógica do Jogo ---

function coletarNotas() {
  for (let i = notasCampo.length - 1; i >= 0; i--) {
    let distancia = dist(musicoX, musicoY, notasCampo[i].x, notasCampo[i].y);
    if (distancia < 20 && !notasCampo[i].coletada) {
      notasCampo[i].coletada = true;
      notasColetadas.push(notasCampo[i]);
      notasCampo.splice(i, 1);
      break;
    }
  }

  for (let i = notasCidade.length - 1; i >= 0; i--) {
    let distancia = dist(musicoX, musicoY, notasCidade[i].x, notasCidade[i].y);
    if (distancia < 20 && !notasCidade[i].coletada) {
      notasCidade[i].coletada = true;
      notasColetadas.push(notasCidade[i]);
      notasCidade.splice(i, 1);
      break;
    }
  }
}

function harmonizarNotas() {
  let distanciaHarmonia = dist(
    musicoX,
    musicoY,
    pontoHarmoniaX,
    pontoHarmoniaY
  );
  if (distanciaHarmonia < raioHarmonia && notasColetadas.length > 0) {
    let notasCampoColetadas = notasColetadas.filter(
      (nota) => nota.tipo === "campo"
    ).length;
    let notasCidadeColetadas = notasColetadas.filter(
      (nota) => nota.tipo === "cidade"
    ).length;

    if (notasCampoColetadas > 0 && notasCidadeColetadas > 0) {
      melodia += (notasCampoColetadas + notasCidadeColetadas) * 2;
      notasColetadas = [];

      // Calcula a melodia máxima para o nível atual para a verificação
      let melodiaMaximaParaNivel = 50 + (nivelAtual - 1) * 25;

      if (melodia >= melodiaMaximaParaNivel) {
        nivelAtual++;
        estadoJogo = "nivelConcluido";
        tempoMensagemNivel = millis();
      } else {
        reiniciarNotasNoNivel();
      }
    }
  }
}

function reiniciarNotasNoNivel() {
  // Quantidade total de notas para o nível atual
  let totalNotasNivel = quantidadeNotasPorNivel + (nivelAtual - 1) * 2;

  // Conta as notas de campo e cidade que ainda estão no jogo (não coletadas)
  let notasCampoExistentes = notasCampo.length;
  let notasCidadeExistentes = notasCidade.length;

  // Adiciona novas notas até atingir o total necessário para o nível
  for (let i = 0; i < totalNotasNivel - notasCampoExistentes; i++) {
    notasCampo.push({
      x: random(50, width - 50),
      y: random(alturaDivisao + 20, height - 20),
      tipo: "campo",
      cor: color(0, 255, 0),
      coletada: false,
    });
  }
  for (let i = 0; i < totalNotasNivel - notasCidadeExistentes; i++) {
    notasCidade.push({
      x: random(50, width - 50),
      y: random(20, alturaDivisao - 20),
      tipo: "cidade",
      cor: color(0, 0, 255),
      coletada: false,
    });
  }
}

// --- Funções de Mensagens e Estados ---

function exibirMensagensJogo() {
  textSize(24);
  fill(0);

  if (estadoJogo === "nivelConcluido") {
    text(`Nível ${nivelAtual - 1} Concluído!`, width / 2, height / 2 - 30);
    text("Preparando próximo nível...", width / 2, height / 2 + 10);
    if (millis() - tempoMensagemNivel > 2000) {
      if (nivelAtual <= 5) {
        // Aumentei o número de níveis para demonstrar
        iniciarNivel(nivelAtual);
      } else {
        estadoJogo = "fimDeJogo";
      }
    }
  } else if (estadoJogo === "fimDeJogo") {
    textSize(32);
    fill(0, 150, 0);
    text("Melodia da União Completa!", width / 2, height / 2 - 30);
    textSize(24);
    text(
      `Você harmonizou ${nivelAtual - 1} níveis!`,
      width / 2,
      height / 2 + 10
    );
    noLoop();
  } else {
    textSize(14);
    fill(0);
    textAlign(LEFT, TOP);
    text("Colete notas verdes (campo) e azuis (cidade).", 20, height - 40);
    text("Leve-as para o centro para criar harmonia!", 20, height - 20);
  }
}

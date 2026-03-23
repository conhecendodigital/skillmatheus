'use strict';
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// ─── PATHS ────────────────────────────────────────────────────────────────────
const PRINTS_DIR = path.join(__dirname, 'prints');
const OUTPUT_PDF = path.join(__dirname, 'diagnostico-omatheus.ai-2026-03-19-v2.pdf');

// ─── PALETTE ──────────────────────────────────────────────────────────────────
const C = {
  black:   '#000000',
  bg:      '#0d1117',
  border:  '#1e293b',
  blue:    '#0ea5e9',
  blueDark:'#0284c7',
  white:   '#FFFFFF',
  slate:   '#94a3b8',
  green:   '#34d399',
  yellow:  '#f59e0b',
  red:     '#ef4444',
  reel:    '#8b5cf6',
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const POSTS_RECENTES = [
  {
    img: 'post_recente_1.png',
    tipo: 'Foto/Texto',
    data: '15 mar 2026',
    legenda: 'Ninguém te lembrou hoje, mas eu te digo: você é uma pessoa maravilhosa...',
    likes: 831, comments: 6,
    cta: 'Sem CTA',
    gancho: 'P1: Identificação + Revelação',
    gatilho: 'Identificação',
    forte: 'Alto like ratio. Toca em vulnerabilidade.',
    fraco: 'Sem CTA. Não converte em produto.',
    categoria: 'Motivacional',
  },
  {
    img: 'post_recente_2.png',
    tipo: 'Carrossel',
    data: '13 mar 2026',
    legenda: 'O problema da sua foto de perfil não é a câmera. Você só não usa ISSO.',
    likes: 521, comments: 314,
    cta: 'Comenta CHAVE',
    gancho: 'P2: Provocação + Afirmação Polêmica',
    gatilho: 'Curiosidade + Revelação',
    forte: '314 comentários! CTA CHAVE gerando leads qualificados.',
    fraco: 'Baixo like comparado aos motivacionais.',
    categoria: 'IA / Prático',
  },
  {
    img: 'post_recente_3.png',
    tipo: 'Foto/Texto',
    data: '10 mar 2026',
    legenda: 'Nunca iremos agradar todo mundo. Então foque em ser melhor a cada dia...',
    likes: 2400, comments: 8,
    cta: 'Sem CTA',
    gancho: 'P3: Reflexão Polêmica',
    gatilho: 'Identificação',
    forte: 'Maior like do período. Frase curta, direta.',
    fraco: 'Zero conversão de produto. Sem CTA.',
    categoria: 'Motivacional',
  },
  {
    img: 'post_recente_4.png',
    tipo: 'Carrossel',
    data: '10 mar 2026',
    legenda: 'POSTAR POR POSTAR NÃO TRAZ SEGUIDORES. Post bonito sem estratégia é só barulho.',
    likes: 409, comments: 266,
    cta: 'Comenta ALCANCE',
    gancho: 'P2: Provocação + Afirmação Polêmica',
    gatilho: 'Provocação',
    forte: '266 comentários com CTA ativo. Capa polêmica eficaz.',
    fraco: 'CTA "ALCANCE" não mapeia direto pra produto da escada.',
    categoria: 'Estratégia IG',
  },
  {
    img: 'post_recente_5.png',
    tipo: 'Foto/Texto',
    data: '07 mar 2026',
    legenda: 'A receita da vida é essa: Oração, processo e paciência.',
    likes: 200, comments: 0,
    cta: 'Sem CTA',
    gancho: 'P1: Identificação + Revelação',
    gatilho: 'Fé + Identificação',
    forte: 'Conexão com audiência de fé.',
    fraco: 'Menor performance. Zero conversão.',
    categoria: 'Motivacional / Fé',
  },
];

const POSTS_ENGAJAMENTO = [
  {
    img: 'post_recente_3.png',
    tipo: 'Foto/Texto',
    data: '10 mar 2026',
    legenda: 'Nunca iremos agradar todo mundo. Então foque em ser melhor a cada dia...',
    likes: 2400, comments: 8,
    cta: 'Sem CTA',
    destaque: 'MAIOR LIKE do período recente',
    categoria: 'Motivacional',
  },
  {
    img: 'post_engajamento_1.png',
    tipo: 'Reel (fixado)',
    data: '07 ago 2025',
    legenda: 'Aba anônima não te esconde de nada! Se você acha que dá pra esconder o que pesquisa...',
    likes: 2300, comments: 28,
    cta: 'Segue @omatheus.ai',
    destaque: 'REEL FIXADO — Tech/Segurança viral',
    categoria: 'Tech / Segurança',
  },
  {
    img: 'post_engajamento_2.png',
    tipo: 'Foto/Texto',
    data: '04 mar 2026',
    legenda: 'Toda vez que choveu, Deus fez parar. Lembre disso na próxima tempestade.',
    likes: 695, comments: 4,
    cta: 'Sem CTA',
    destaque: '3º maior like — Fé e resiliência',
    categoria: 'Motivacional / Fé',
  },
  {
    img: 'post_recente_1.png',
    tipo: 'Foto/Texto',
    data: '15 mar 2026',
    legenda: 'Ninguém te lembrou hoje, mas eu te digo: você é uma pessoa maravilhosa...',
    likes: 831, comments: 6,
    cta: 'Sem CTA',
    destaque: '831 likes em 3 dias — ritmo acelerado',
    categoria: 'Motivacional',
  },
  {
    img: 'post_recente_2.png',
    tipo: 'Carrossel',
    data: '13 mar 2026',
    legenda: 'O problema da sua foto de perfil não é a câmera. Você só não usa ISSO.',
    likes: 521, comments: 314,
    cta: 'Comenta CHAVE',
    destaque: 'MAIOR COMENTÁRIOS — 314 leads CHAVE',
    categoria: 'IA / Prático',
  },
];

const FORMATOS = [
  {
    nome: 'Casal Problema/Solução',
    desc: 'Thaís aparece confusa com um problema real. Matheus resolve de forma simples.',
    porque: 'Maior viral do perfil. Dinâmica de casal gera identificação imediata.',
    adaptar: 'Thaís pergunta sobre IA → Matheus mostra o prompt → resultado impressionante.',
    usa: true,
  },
  {
    nome: 'Isso vs. Aquilo',
    desc: 'Prompt ruim vs. Prompt bom. Antes vs. Depois da IA.',
    porque: 'Contraste visual imediato. Demonstra valor sem precisar explicar.',
    adaptar: 'Mostrar legenda gerada por IA sem contexto vs. com prompt estratégico.',
    usa: false,
  },
  {
    nome: 'Recurso Escondido',
    desc: 'Função que 99% não usa, truque pouco conhecido, segredo de ferramenta.',
    porque: 'Gatilho de curiosidade máximo. "Por que ninguém me contou isso?"',
    adaptar: 'Funções escondidas do ChatGPT, Claude, Canva, Instagram.',
    usa: true,
  },
  {
    nome: 'Os 3 Caminhos',
    desc: 'Amador / Intermediário / Estrategista. Três formas de fazer a mesma coisa.',
    porque: 'Audiência se posiciona e quer subir de nível. Alto salvamento.',
    adaptar: 'Iniciante usa IA assim → Avançado usa assim → Estrategista usa assim.',
    usa: false,
  },
  {
    nome: 'Rotina Comparativa',
    desc: 'Antes vs. Depois da IA na rotina de criação de conteúdo.',
    porque: 'Mostra processo real. Vulnerabilidade estratégica que conecta.',
    adaptar: 'Antes: 4h criando um post. Depois com IA: 45 min. Mostrar tela.',
    usa: false,
  },
  {
    nome: 'Analogia Pop',
    desc: 'Referência cultural, série, filme, música para explicar conceito de IA.',
    porque: 'Transforma abstrato em concreto. Comentários de identificação explodem.',
    adaptar: '"IA é tipo o JARVIS do Homem de Ferro. Você manda, ela executa."',
    usa: false,
  },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function imgPath(name) {
  return path.join(PRINTS_DIR, name);
}

function imgExists(name) {
  return fs.existsSync(imgPath(name));
}

// Draw a filled rectangle helper
function rect(doc, x, y, w, h, color, radius = 0) {
  doc.save().roundedRect(x, y, w, h, radius).fill(color).restore();
}

// Draw a rectangle border helper
function rectBorder(doc, x, y, w, h, color, lw = 1, radius = 0) {
  doc.save().roundedRect(x, y, w, h, radius).strokeColor(color).lineWidth(lw).stroke().restore();
}

// Draw section header (label + title)
function sectionHeader(doc, x, y, label, title, color = C.blue) {
  doc.font('Helvetica').fontSize(9).fillColor(color)
     .text(label.toUpperCase(), x, y, { characterSpacing: 2 });
  doc.font('Helvetica-Bold').fontSize(20).fillColor(C.white)
     .text(title, x, y + 16);
  return y + 16 + 28; // returns new Y after header
}

// Draw a card background
function card(doc, x, y, w, h, borderColor = C.border) {
  rect(doc, x, y, w, h, C.bg, 6);
  rectBorder(doc, x, y, w, h, borderColor, 1, 6);
}

// Draw metric box
function metricBox(doc, x, y, w, label, value, color = C.blue) {
  card(doc, x, y, w, 55, color);
  doc.font('Helvetica').fontSize(8).fillColor(C.slate)
     .text(label.toUpperCase(), x + 8, y + 8, { width: w - 16, characterSpacing: 1 });
  doc.font('Helvetica-Bold').fontSize(16).fillColor(color)
     .text(value, x + 8, y + 22, { width: w - 16 });
}

// Draw horizontal bar chart
function barChart(doc, x, y, label, current, target, maxW = 300) {
  const currentW = Math.min((current / 100) * maxW, maxW);
  const targetW = Math.min((target / 100) * maxW, maxW);
  const h = 14;
  // background
  rect(doc, x, y, maxW, h, C.border, 3);
  // current bar (blue)
  if (currentW > 0) rect(doc, x, y, currentW, h, C.blue, 3);
  // target line (green)
  if (targetW > 0) {
    doc.save().strokeColor(C.green).lineWidth(2)
       .moveTo(x + targetW, y - 3).lineTo(x + targetW, y + h + 3).stroke().restore();
  }
  // labels
  doc.font('Helvetica').fontSize(9).fillColor(C.white)
     .text(label, x, y - 14, { width: 180 });
  doc.font('Helvetica-Bold').fontSize(9).fillColor(C.blue)
     .text(`${current}%`, x + maxW + 6, y, { width: 40 });
  doc.font('Helvetica').fontSize(8).fillColor(C.green)
     .text(`meta: ${target}%`, x + maxW + 6, y + 10, { width: 60 });
}

// Embed image with fallback
function embedImg(doc, name, x, y, w, h) {
  if (imgExists(name)) {
    try {
      doc.image(imgPath(name), x, y, { width: w, height: h, cover: [w, h] });
      return;
    } catch (e) { /* fall through to placeholder */ }
  }
  // placeholder
  rect(doc, x, y, w, h, C.bg, 4);
  rectBorder(doc, x, y, w, h, C.slate, 1, 4);
  doc.font('Helvetica').fontSize(8).fillColor(C.slate)
     .text('Screenshot\ndo post', x + 4, y + h / 2 - 10, { width: w - 8, align: 'center' });
}

// Add a new page with black background
function newPage(doc) {
  doc.addPage();
  rect(doc, 0, 0, doc.page.width, doc.page.height, C.black);
}

// Semaforo dot
function dot(doc, x, y, color) {
  doc.save().circle(x, y, 5).fill(color).restore();
}

// ─── DOCUMENT ─────────────────────────────────────────────────────────────────
const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 0, bottom: 0, left: 0, right: 0 },
  info: {
    Title: 'Diagnóstico de Perfil com IA — @omatheus.ai',
    Author: 'Matheus Soares | omatheus.ai',
    Subject: 'Diagnóstico completo do perfil Instagram @omatheus.ai',
    CreationDate: new Date('2026-03-19'),
  },
});

doc.pipe(fs.createWriteStream(OUTPUT_PDF));

const PW = doc.page.width;   // 595
const PH = doc.page.height;  // 842
const PAD = 40;

// ═══════════════════════════════════════════════════════════════════════════════
// PÁGINA 1 — CAPA
// ═══════════════════════════════════════════════════════════════════════════════
rect(doc, 0, 0, PW, PH, C.black);

// Top gradient band
rect(doc, 0, 0, PW, 220, C.blue);
rect(doc, 0, 160, PW, 80, '#0c2a3e'); // fade

// Profile photo centered in the blue band
const profileImg = 'perfil_principal.png';
const pImgW = 280;
const pImgX = (PW - pImgW) / 2;
if (imgExists(profileImg)) {
  try { doc.image(imgPath(profileImg), pImgX, 20, { width: pImgW }); } catch(e) {}
}

// Overlay for readability
rect(doc, 0, 180, PW, 50, C.black);

// Score circle (top right)
doc.save().circle(PW - 60, 60, 36).fill(C.black).restore();
rectBorder(doc, PW - 96, 24, 72, 72, C.blue, 2, 36);
doc.font('Helvetica-Bold').fontSize(18).fillColor(C.blue).text('7.4', PW - 88, 48, { width: 56, align: 'center' });
doc.font('Helvetica').fontSize(7).fillColor(C.slate).text('/10', PW - 88, 66, { width: 56, align: 'center' });

// Title block
const titleY = 235;
doc.font('Helvetica-Bold').fontSize(26).fillColor(C.white)
   .text('DIAGNÓSTICO DE PERFIL COM IA', PAD, titleY, { width: PW - PAD * 2, align: 'center' });

doc.font('Helvetica-Bold').fontSize(16).fillColor(C.blue)
   .text('@omatheus.ai', PAD, titleY + 38, { width: PW - PAD * 2, align: 'center' });

doc.font('Helvetica').fontSize(10).fillColor(C.slate)
   .text('19 de março de 2026', PAD, titleY + 64, { width: PW - PAD * 2, align: 'center' });

// Divider
doc.save().strokeColor(C.border).lineWidth(1)
   .moveTo(PAD, titleY + 90).lineTo(PW - PAD, titleY + 90).stroke().restore();

// 4 key metrics
const mY = titleY + 110;
const mW = (PW - PAD * 2 - 18) / 4;
const mData = [
  { label: 'Seguidores', val: '424k', color: C.blue },
  { label: 'Posts', val: '549', color: C.slate },
  { label: 'Engajamento', val: '~3.2%', color: C.yellow },
  { label: 'Score Geral', val: '7.4/10', color: C.green },
];
mData.forEach((m, i) => {
  metricBox(doc, PAD + i * (mW + 6), mY, mW, m.label, m.val, m.color);
});

// Summary text box
const sumY = mY + 75;
card(doc, PAD, sumY, PW - PAD * 2, 120, C.blue);
doc.font('Helvetica-Bold').fontSize(11).fillColor(C.blue)
   .text('VISÃO GERAL DO DIAGNÓSTICO', PAD + 12, sumY + 12);
doc.font('Helvetica').fontSize(10).fillColor(C.white)
   .text(
     'Tu tens um perfil com potencial enorme, mas tá deixando dinheiro na mesa. ' +
     'O engajamento qualificado existe (314 comentários num carrossel de IA!), mas o mix de conteúdo ' +
     'tá desequilibrado: muita motivação sem CTA e pouco conteúdo de IA com conversão. ' +
     'O funil existe mas tem vazamentos claros. Esse diagnóstico vai te mostrar exatamente onde tá perdendo e o que fazer.',
     PAD + 12, sumY + 30, { width: PW - PAD * 2 - 24 }
   );

// Footer
rect(doc, 0, PH - 36, PW, 36, C.bg);
doc.font('Helvetica').fontSize(9).fillColor(C.slate)
   .text('Por Matheus Soares · @omatheus.ai · Documento Confidencial', PAD, PH - 22, { width: PW - PAD * 2, align: 'center' });

// ═══════════════════════════════════════════════════════════════════════════════
// PÁGINA 2 — VISÃO GERAL DO PERFIL
// ═══════════════════════════════════════════════════════════════════════════════
newPage(doc);

let y = PAD;
y = sectionHeader(doc, PAD, y, 'Perfil Completo', 'Visão Geral do Perfil');

// Profile image left
const profW = 200;
const profH = 140;
embedImg(doc, 'perfil_principal.png', PAD, y, profW, profH);

// Metrics right
const mRX = PAD + profW + 16;
const mRW = (PW - PAD - mRX - PAD) / 2 - 4;
const metrics = [
  { label: 'Seguidores', val: '424.246', color: C.blue },
  { label: 'Posts Total', val: '549', color: C.slate },
  { label: 'Seguindo', val: '297', color: C.slate },
  { label: 'Eng. médio (like)', val: '~0.6%', color: C.yellow },
];
metrics.forEach((m, i) => {
  const mx = mRX + (i % 2) * (mRW + 8);
  const my = y + Math.floor(i / 2) * 64;
  metricBox(doc, mx, my, mRW, m.label, m.val, m.color);
});

y += profH + 16;

// Bio atual
card(doc, PAD, y, PW - PAD * 2, 70, C.blue);
doc.font('Helvetica-Bold').fontSize(9).fillColor(C.blue)
   .text('BIO ATUAL', PAD + 12, y + 10, { characterSpacing: 1 });
doc.font('Helvetica').fontSize(10).fillColor(C.white)
   .text(
     'Matheus Soares | IA e Tech\n' +
     'Mostro como usar IA para criar conteúdo que gera autoridade e clientes.\n' +
     '+50 MILHÕES DE VIEWS SEM PAGAR UM REAL EM...\n' +
     'obancodeprompts.omatheusai.com.br',
     PAD + 12, y + 24, { width: PW - PAD * 2 - 24 }
   );

y += 86;

// Destaques
doc.font('Helvetica-Bold').fontSize(10).fillColor(C.white).text('Destaques dos Stories:', PAD, y);
const destaques = ['Processo', 'Essência', 'Obras', 'Trajetória', 'Vida'];
destaques.forEach((d, i) => {
  const dx = PAD + i * 98;
  card(doc, dx, y + 18, 88, 28, C.border);
  doc.font('Helvetica').fontSize(9).fillColor(C.slate)
     .text(d, dx + 4, y + 26, { width: 80, align: 'center' });
});

y += 62;

// Semáforo
doc.font('Helvetica-Bold').fontSize(10).fillColor(C.white).text('Diagnóstico Rápido:', PAD, y);
y += 20;
const semaforos = [
  { label: 'Bio (clara e direta)', color: C.yellow, note: 'Pode melhorar o CTA' },
  { label: 'Mix de Conteúdo', color: C.red, note: 'Só 17% de IA (meta: 40%)' },
  { label: 'CTAs nos Posts', color: C.red, note: 'Inconsistentes — vários sem CTA' },
  { label: 'Posicionamento', color: C.green, note: 'Claro e consistente' },
  { label: 'Engajamento Qualificado', color: C.green, note: 'Posts de IA com 12% eng' },
  { label: 'Funil de Vendas', color: C.yellow, note: 'Vazamentos no meio/fundo' },
];
semaforos.forEach((s, i) => {
  const sx = PAD + (i % 2) * ((PW - PAD * 2) / 2 + 4);
  const sy2 = y + Math.floor(i / 2) * 30;
  dot(doc, sx + 6, sy2 + 6, s.color);
  doc.font('Helvetica-Bold').fontSize(9).fillColor(C.white)
     .text(s.label, sx + 18, sy2 - 1, { width: 160 });
  doc.font('Helvetica').fontSize(8).fillColor(C.slate)
     .text(s.note, sx + 18, sy2 + 10, { width: 160 });
});

y += Math.ceil(semaforos.length / 2) * 30 + 16;

// Link in bio note
card(doc, PAD, y, PW - PAD * 2, 40, C.border);
doc.font('Helvetica').fontSize(9).fillColor(C.slate)
   .text('Link na bio:', PAD + 12, y + 10);
doc.font('Helvetica-Bold').fontSize(9).fillColor(C.blue)
   .text('obancodeprompts.omatheusai.com.br', PAD + 70, y + 10);
doc.font('Helvetica').fontSize(9).fillColor(C.yellow)
   .text('ALERTA: O link leva pro banco de prompts, não pra oferta principal. Tu tá perdendo conversão aqui.', PAD + 12, y + 22, { width: PW - PAD * 2 - 24 });

// Footer
rect(doc, 0, PH - 36, PW, 36, C.bg);
doc.font('Helvetica').fontSize(8).fillColor(C.slate)
   .text('Diagnóstico @omatheus.ai · 19/03/2026 · Página 2', PAD, PH - 22, { width: PW - PAD * 2, align: 'center' });

// ═══════════════════════════════════════════════════════════════════════════════
// PÁGINA 3 — ANÁLISE DA BIO
// ═══════════════════════════════════════════════════════════════════════════════
newPage(doc);

y = PAD;
y = sectionHeader(doc, PAD, y, 'Análise Detalhada', 'Análise da Bio');

// Bio atual em destaque
card(doc, PAD, y, PW - PAD * 2, 90, C.blue);
doc.font('Helvetica-Bold').fontSize(9).fillColor(C.blue)
   .text('BIO ATUAL (como aparece no perfil)', PAD + 12, y + 10, { characterSpacing: 1 });
const bioLines = [
  { line: 'Matheus Soares | IA e Tech', nota: 'OK — nome + nicho claro', cor: C.green },
  { line: 'Mostro como usar IA para criar conteúdo que gera autoridade e clientes.', nota: 'BOM — proposta de valor presente', cor: C.green },
  { line: '+50 MILHÕES DE VIEWS SEM PAGAR UM REAL EM...', nota: 'PROBLEMA — truncada, perde impacto', cor: C.red },
  { line: 'obancodeprompts.omatheusai.com.br', nota: 'ALERTA — link não leva pra oferta principal', cor: C.yellow },
];
let bioY = y + 24;
bioLines.forEach((bl) => {
  doc.font('Helvetica').fontSize(9).fillColor(C.white)
     .text(`"${bl.line.substring(0, 50)}${bl.line.length > 50 ? '...' : ''}"`, PAD + 12, bioY, { width: 240 });
  dot(doc, PAD + 260, bioY + 5, bl.cor);
  doc.font('Helvetica').fontSize(8).fillColor(bl.cor)
     .text(bl.nota, PAD + 270, bioY + 2, { width: PW - PAD * 2 - 280 });
  bioY += 14;
});

y += 106;

// Score bar
doc.font('Helvetica-Bold').fontSize(10).fillColor(C.white).text('Score da Bio Atual:', PAD, y);
const bioScore = 58;
const bioBarW = 300;
rect(doc, PAD, y + 18, bioBarW, 12, C.border, 4);
rect(doc, PAD, y + 18, (bioScore / 100) * bioBarW, 12, C.yellow, 4);
doc.font('Helvetica-Bold').fontSize(10).fillColor(C.yellow).text(`${bioScore}/100`, PAD + bioBarW + 8, y + 16);
doc.font('Helvetica').fontSize(8).fillColor(C.slate).text('Funcional mas pode ser muito melhor', PAD, y + 34);

y += 56;

// Análise linha por linha
doc.font('Helvetica-Bold').fontSize(11).fillColor(C.white).text('Diagnóstico linha por linha:', PAD, y);
y += 18;

const bioAnalysis = [
  {
    linha: 1, texto: 'Matheus Soares | IA e Tech',
    analise: 'Nome + nicho: tá certo. "IA e Tech" é claro. Mantém.',
    nota: 9, cor: C.green,
  },
  {
    linha: 2, texto: 'Mostro como usar IA para criar conteúdo...',
    analise: 'Proposta de valor OK mas genérica. Falta "pra quem" e "resultado específico".',
    nota: 6, cor: C.yellow,
  },
  {
    linha: 3, texto: '+50 MILHÕES DE VIEWS SEM PAGAR UM REAL EM...',
    analise: 'CRÍTICO: Tá cortando a prova social! "EM..." não termina. Perde 100% do impacto.',
    nota: 3, cor: C.red,
  },
  {
    linha: 4, texto: 'obancodeprompts.omatheusai.com.br',
    analise: 'O link certo seria pra CHAVE AI ou Diagnóstico. Banco de prompts não vende produto.',
    nota: 4, cor: C.red,
  },
];

bioAnalysis.forEach((ba) => {
  card(doc, PAD, y, PW - PAD * 2, 52, ba.cor);
  doc.font('Helvetica-Bold').fontSize(8).fillColor(C.slate)
     .text(`LINHA ${ba.linha}`, PAD + 10, y + 8, { characterSpacing: 1 });
  doc.font('Helvetica-Bold').fontSize(9).fillColor(C.white)
     .text(`"${ba.texto}"`, PAD + 10, y + 19, { width: PW - PAD * 2 - 80 });
  doc.font('Helvetica').fontSize(8).fillColor(C.slate)
     .text(ba.analise, PAD + 10, y + 31, { width: PW - PAD * 2 - 80 });
  // nota
  doc.font('Helvetica-Bold').fontSize(14).fillColor(ba.cor)
     .text(`${ba.nota}/10`, PW - PAD - 50, y + 17, { width: 50, align: 'right' });
  y += 60;
});

y += 8;
doc.font('Helvetica-Bold').fontSize(11).fillColor(C.white).text('3 Versões Sugeridas de Bio:', PAD, y);
y += 18;

const bioVersions = [
  {
    versao: 'V1 — DIRETA (fundo de funil)',
    texto: 'Matheus Soares | IA e Tech\nEnsino a usar IA pra criar conteúdo que atrai clientes.\n+50 MILHÕES DE VIEWS SEM PAGAR UM REAL EM ADS\nQuero tu aqui 👇 comenta CHAVE',
  },
  {
    versao: 'V2 — AUTORIDADE (prova social forte)',
    texto: 'Matheus Soares | IA e Tech\nDo nordeste pra +50 milhões de views com IA.\nTe ensino a usar IA pra criar conteúdo e atrair clientes.\n🔑 Tua Chave AI tá aqui 👇',
  },
  {
    versao: 'V3 — CONVERSÃO DIRETA',
    texto: 'Matheus Soares | IA e Tech\n+50M views • IA pra criadores\nComenta CHAVE no meu último post 👇',
  },
];

bioVersions.forEach((bv) => {
  if (y > 720) { newPage(doc); y = PAD; }
  card(doc, PAD, y, PW - PAD * 2, 68, C.blue);
  doc.font('Helvetica-Bold').fontSize(8).fillColor(C.blue)
     .text(bv.versao, PAD + 10, y + 8, { characterSpacing: 1 });
  doc.font('Helvetica').fontSize(9).fillColor(C.white)
     .text(bv.texto, PAD + 10, y + 20, { width: PW - PAD * 2 - 20 });
  y += 76;
});

// Footer
rect(doc, 0, PH - 36, PW, 36, C.bg);
doc.font('Helvetica').fontSize(8).fillColor(C.slate)
   .text('Diagnóstico @omatheus.ai · 19/03/2026 · Página 3', PAD, PH - 22, { width: PW - PAD * 2, align: 'center' });

// ═══════════════════════════════════════════════════════════════════════════════
// PÁGINAS 4-5 — 5 ÚLTIMAS POSTAGENS
// ═══════════════════════════════════════════════════════════════════════════════
newPage(doc);
y = PAD;
y = sectionHeader(doc, PAD, y, 'Análise dos Posts', 'Os 5 Posts Mais Recentes');

doc.font('Helvetica').fontSize(9).fillColor(C.slate)
   .text('Últimos posts publicados — análise de gancho, formato e performance', PAD, y);
y += 20;

POSTS_RECENTES.forEach((p, idx) => {
  if (y + 130 > PH - 50) { newPage(doc); y = PAD; }

  const cardH = 118;
  card(doc, PAD, y, PW - PAD * 2, cardH, C.border);

  // Post image
  const imgW = 90; const imgH = 90;
  embedImg(doc, p.img, PAD + 8, y + 14, imgW, imgH);

  // Content
  const cx = PAD + imgW + 18;
  const cw = PW - PAD * 2 - imgW - 28;

  // Header row
  doc.font('Helvetica-Bold').fontSize(10).fillColor(C.white)
     .text(`#${idx + 1} — ${p.tipo}`, cx, y + 10, { width: cw - 80 });
  doc.font('Helvetica').fontSize(8).fillColor(C.slate)
     .text(p.data, cx + cw - 75, y + 12, { width: 74, align: 'right' });

  // Category badge
  const catColor = p.categoria.includes('IA') ? C.blue : p.categoria.includes('Estratégia') ? C.reel : C.yellow;
  rect(doc, cx, y + 26, 90, 14, catColor, 4);
  doc.font('Helvetica').fontSize(7).fillColor(C.black)
     .text(p.categoria, cx + 2, y + 30, { width: 86, align: 'center' });

  // Metrics
  doc.font('Helvetica-Bold').fontSize(9).fillColor(C.blue)
     .text(`♥ ${p.likes.toLocaleString('pt-BR')}`, cx + 96, y + 26);
  doc.font('Helvetica-Bold').fontSize(9).fillColor(C.slate)
     .text(`💬 ${p.comments}`, cx + 140, y + 26);

  // Legenda
  doc.font('Helvetica').fontSize(8).fillColor(C.white)
     .text(`"${p.legenda}"`, cx, y + 46, { width: cw, lineGap: 1 });

  // CTA
  const ctaColor = p.cta === 'Sem CTA' ? C.red : C.green;
  doc.font('Helvetica-Bold').fontSize(8).fillColor(ctaColor)
     .text(`CTA: ${p.cta}`, cx, y + 68);

  // Gancho
  doc.font('Helvetica').fontSize(8).fillColor(C.slate)
     .text(`Gancho: ${p.gancho}`, cx + 110, y + 68, { width: cw - 110 });

  // Forte/Fraco
  doc.font('Helvetica').fontSize(7).fillColor(C.green)
     .text(`+ ${p.forte}`, cx, y + 84, { width: cw / 2 - 4, lineGap: 1 });
  doc.font('Helvetica').fontSize(7).fillColor(C.red)
     .text(`- ${p.fraco}`, cx + cw / 2, y + 84, { width: cw / 2, lineGap: 1 });

  y += cardH + 10;
});

// Footer
rect(doc, 0, PH - 36, PW, 36, C.bg);
doc.font('Helvetica').fontSize(8).fillColor(C.slate)
   .text('Diagnóstico @omatheus.ai · 19/03/2026 · Páginas 4–5', PAD, PH - 22, { width: PW - PAD * 2, align: 'center' });

// ═══════════════════════════════════════════════════════════════════════════════
// PÁGINAS 6-7 — 5 POSTS COM MAIS ENGAJAMENTO
// ═══════════════════════════════════════════════════════════════════════════════
newPage(doc);
y = PAD;
y = sectionHeader(doc, PAD, y, 'Maior Engajamento', 'Posts com Maior Engajamento', C.green);

doc.font('Helvetica').fontSize(9).fillColor(C.slate)
   .text('Os posts com maior impacto no perfil — isso aqui é o padrão que tá funcionando', PAD, y);
y += 20;

POSTS_ENGAJAMENTO.forEach((p, idx) => {
  if (y + 120 > PH - 50) { newPage(doc); y = PAD; }

  const cardH = 110;
  card(doc, PAD, y, PW - PAD * 2, cardH, C.green);

  // rank badge
  rect(doc, PAD + 8, y + 8, 28, 28, C.green, 4);
  doc.font('Helvetica-Bold').fontSize(14).fillColor(C.black)
     .text(`${idx + 1}`, PAD + 8, y + 13, { width: 28, align: 'center' });

  // Post image
  const imgW = 85; const imgH = 85;
  embedImg(doc, p.img, PAD + 44, y + 12, imgW, imgH);

  // Content
  const cx = PAD + 44 + imgW + 14;
  const cw = PW - PAD * 2 - 44 - imgW - 24;

  doc.font('Helvetica-Bold').fontSize(10).fillColor(C.white)
     .text(p.tipo, cx, y + 10, { width: cw - 80 });
  doc.font('Helvetica').fontSize(8).fillColor(C.slate)
     .text(p.data, cx + cw - 75, y + 12, { width: 74, align: 'right' });

  // Destaque badge
  rect(doc, cx, y + 26, Math.min(cw, 200), 14, C.green, 4);
  doc.font('Helvetica-Bold').fontSize(7).fillColor(C.black)
     .text(p.destaque, cx + 2, y + 30, { width: 196 });

  // Metrics large
  doc.font('Helvetica-Bold').fontSize(14).fillColor(C.green)
     .text(`♥ ${p.likes.toLocaleString('pt-BR')}`, cx, y + 46);
  doc.font('Helvetica-Bold').fontSize(14).fillColor(C.slate)
     .text(`💬 ${p.comments}`, cx + 90, y + 46);

  // Legenda
  doc.font('Helvetica').fontSize(8).fillColor(C.white)
     .text(`"${p.legenda.substring(0, 80)}..."`, cx, y + 68, { width: cw });

  // CTA
  const ctaColor = p.cta === 'Sem CTA' ? C.red : C.green;
  doc.font('Helvetica-Bold').fontSize(8).fillColor(ctaColor)
     .text(`CTA: ${p.cta}`, cx, y + 88);
  doc.font('Helvetica').fontSize(8).fillColor(C.slate)
     .text(p.categoria, cx + 110, y + 88);

  y += cardH + 10;
});

// Insight card
if (y + 80 > PH - 50) { newPage(doc); y = PAD; }
y += 8;
card(doc, PAD, y, PW - PAD * 2, 80, C.green);
doc.font('Helvetica-Bold').fontSize(11).fillColor(C.green)
   .text('INSIGHT: O QUE ESSES POSTS TÊM EM COMUM', PAD + 12, y + 10);
doc.font('Helvetica').fontSize(9).fillColor(C.white)
   .text(
     '1. FRASES CURTAS de impacto — sem parágrafos longos no início.\n' +
     '2. EMOÇÃO REAL — motivacional ou revelação prática (tech/IA).\n' +
     '3. Os de maior LIKE são motivacionais (viralidade emocional).\n' +
     '4. Os de maior COMENTÁRIO são de IA com CTA claro (conversão real).\n' +
     'CONCLUSÃO: Usa motivacional pra atrair alcance + IA com CTA pra converter. Isso é o funil.',
     PAD + 12, y + 26, { width: PW - PAD * 2 - 24 }
   );

// Footer
rect(doc, 0, PH - 36, PW, 36, C.bg);
doc.font('Helvetica').fontSize(8).fillColor(C.slate)
   .text('Diagnóstico @omatheus.ai · 19/03/2026 · Páginas 6–7', PAD, PH - 22, { width: PW - PAD * 2, align: 'center' });

// ═══════════════════════════════════════════════════════════════════════════════
// PÁGINA 8 — MIX DE CONTEÚDO
// ═══════════════════════════════════════════════════════════════════════════════
newPage(doc);
y = PAD;
y = sectionHeader(doc, PAD, y, 'Distribuição de Conteúdo', 'Análise do Mix de Conteúdo');

// Explanation
card(doc, PAD, y, PW - PAD * 2, 46, C.border);
doc.font('Helvetica').fontSize(9).fillColor(C.white)
   .text(
     'Vi que tu tás postando muito mais motivacional do que IA. O problema não é a qualidade do conteúdo — ' +
     'é que o conteúdo que converte (IA/prático) representa só 17% do mix atual. ' +
     'A meta é 40%. Isso aqui tá custando vendas.',
     PAD + 12, y + 10, { width: PW - PAD * 2 - 24 }
   );
y += 62;

// Charts
doc.font('Helvetica-Bold').fontSize(10).fillColor(C.white).text('Mix Atual vs. Meta:', PAD, y);
y += 18;

const mixData = [
  { label: 'IA / Criação de Conteúdo', atual: 17, meta: 40 },
  { label: 'Motivacional / Fé', atual: 35, meta: 10 },
  { label: 'Tecnologia / Segurança', atual: 28, meta: 25 },
  { label: 'Estratégia Instagram', atual: 12, meta: 15 },
  { label: 'Pessoal / Família', atual: 8, meta: 10 },
];

const barMaxW = 280;
mixData.forEach((m) => {
  barChart(doc, PAD, y, m.label, m.atual, m.meta, barMaxW);
  y += 38;
});

// Legend
doc.save().strokeColor(C.blue).lineWidth(6).moveTo(PAD, y + 4).lineTo(PAD + 20, y + 4).stroke().restore();
doc.font('Helvetica').fontSize(8).fillColor(C.blue).text('= Atual', PAD + 24, y);
doc.save().strokeColor(C.green).lineWidth(2).moveTo(PAD + 80, y + 4).lineTo(PAD + 100, y + 4).stroke().restore();
doc.font('Helvetica').fontSize(8).fillColor(C.green).text('= Meta', PAD + 104, y);

y += 24;

// Analysis boxes
const issues = [
  { emoji: '🔴', texto: 'IA/Criação com 17% quando deveria ser 40% — GAP de 23 pontos', cor: C.red },
  { emoji: '🔴', texto: 'Motivacional com 35% quando deveria ser 10% — tá inflado', cor: C.red },
  { emoji: '🟢', texto: 'Tech/Segurança em 28% — quase no alvo, mantém', cor: C.green },
  { emoji: '🟡', texto: 'Estratégia IG e Pessoal/Família — perto da meta, OK', cor: C.yellow },
];

doc.font('Helvetica-Bold').fontSize(10).fillColor(C.white).text('O que tá fora do lugar:', PAD, y);
y += 18;

issues.forEach((iss) => {
  card(doc, PAD, y, PW - PAD * 2, 30, iss.cor);
  doc.font('Helvetica').fontSize(9).fillColor(C.white)
     .text(`${iss.emoji}  ${iss.texto}`, PAD + 12, y + 10, { width: PW - PAD * 2 - 24 });
  y += 38;
});

y += 8;
card(doc, PAD, y, PW - PAD * 2, 60, C.blue);
doc.font('Helvetica-Bold').fontSize(10).fillColor(C.blue)
   .text('PLANO DE AJUSTE DO MIX', PAD + 12, y + 10);
doc.font('Helvetica').fontSize(9).fillColor(C.white)
   .text(
     'A cada 5 posts: 2 IA/Prático (CHAVE ou DIAGNÓSTICO) + 1 Tech/Segurança + 1 Motivacional + 1 Estratégia.\n' +
     'Transição gradual: 17% → 25% → 40% de IA. Não precisa trocar tudo amanhã.',
     PAD + 12, y + 26, { width: PW - PAD * 2 - 24 }
   );

// Footer
rect(doc, 0, PH - 36, PW, 36, C.bg);
doc.font('Helvetica').fontSize(8).fillColor(C.slate)
   .text('Diagnóstico @omatheus.ai · 19/03/2026 · Página 8', PAD, PH - 22, { width: PW - PAD * 2, align: 'center' });

// ═══════════════════════════════════════════════════════════════════════════════
// PÁGINA 9 — ANÁLISE DOS GANCHOS
// ═══════════════════════════════════════════════════════════════════════════════
newPage(doc);
y = PAD;
y = sectionHeader(doc, PAD, y, 'Padrões de Gancho', 'Análise dos Ganchos');

// Tabela de ganchos
const tableHeaders = ['Post', 'Gancho', 'Gatilho', 'Performance'];
const tableW = PW - PAD * 2;
const colW = [80, 160, 120, 130];

// Header row
card(doc, PAD, y, tableW, 20, C.blue);
let cx2 = PAD;
tableHeaders.forEach((h, i) => {
  doc.font('Helvetica-Bold').fontSize(8).fillColor(C.black)
     .text(h, cx2 + 4, y + 6, { width: colW[i] - 8 });
  cx2 += colW[i];
});
y += 22;

const ganchodata = [
  ['#1 Motivacional Mar 15', 'Identificação + Revelação', 'Identificação', '831 ♥ / 6 💬'],
  ['#2 Foto Perfil Mar 13', 'Provocação Polêmica', 'Curiosidade + Revelação', '521 ♥ / 314 💬 ★'],
  ['#3 Motivacional Mar 10', 'Reflexão Polêmica', 'Identificação', '2.4k ♥ / 8 💬 ★'],
  ['#4 Carrossel Mar 10', 'Provocação + Afirmação', 'Provocação', '409 ♥ / 266 💬'],
  ['#5 Fé Mar 07', 'Identificação', 'Fé + Identificação', '200 ♥ / 0 💬'],
];

ganchodata.forEach((row, ri) => {
  const isHigh = row[3].includes('★');
  const rowBg = isHigh ? '#0a2a1a' : C.bg;
  card(doc, PAD, y, tableW, 22, isHigh ? C.green : C.border);
  rect(doc, PAD + 1, y + 1, tableW - 2, 20, rowBg, 5);
  let cx3 = PAD;
  row.forEach((cell, ci) => {
    const isPerf = ci === 3;
    doc.font(isHigh ? 'Helvetica-Bold' : 'Helvetica').fontSize(8)
       .fillColor(isPerf && isHigh ? C.green : C.white)
       .text(cell, cx3 + 4, y + 7, { width: colW[ci] - 8 });
    cx3 += colW[ci];
  });
  y += 24;
});

y += 16;

// Padrões mais usados
doc.font('Helvetica-Bold').fontSize(11).fillColor(C.white)
   .text('3 Padrões Mais Usados:', PAD, y);
y += 18;

const padroes = [
  {
    nome: 'P1: Identificação + Revelação',
    uso: '40%',
    resultado: 'Bom alcance, menor conversão',
    cor: C.yellow,
  },
  {
    nome: 'P2: Provocação + Afirmação Polêmica',
    uso: '40%',
    resultado: 'Melhor combinação: alcance + conversão',
    cor: C.green,
  },
  {
    nome: 'P3: Reflexão Polêmica',
    uso: '20%',
    resultado: 'Viral mas sem direção comercial',
    cor: C.blue,
  },
];

padroes.forEach((p) => {
  card(doc, PAD, y, PW - PAD * 2, 40, p.cor);
  doc.font('Helvetica-Bold').fontSize(10).fillColor(p.cor)
     .text(p.nome, PAD + 12, y + 8, { width: 280 });
  doc.font('Helvetica-Bold').fontSize(9).fillColor(C.white)
     .text(`Uso: ${p.uso}`, PAD + 12, y + 24);
  doc.font('Helvetica').fontSize(9).fillColor(C.slate)
     .text(p.resultado, PAD + 80, y + 24, { width: PW - PAD * 2 - 100 });
  y += 48;
});

y += 8;
doc.font('Helvetica-Bold').fontSize(10).fillColor(C.white)
   .text('Recomendação:', PAD, y);
y += 16;
card(doc, PAD, y, PW - PAD * 2, 30, C.green);
doc.font('Helvetica').fontSize(9).fillColor(C.white)
   .text('Usa mais P2 (Provocação) nos posts de IA — é o padrão com melhor relação alcance + conversão no teu perfil.', PAD + 12, y + 10, { width: PW - PAD * 2 - 24 });
y += 38;

// Ganchos prontos
doc.font('Helvetica-Bold').fontSize(10).fillColor(C.white)
   .text('3 Ganchos Prontos pra Testar:', PAD, y);
y += 16;
const ganchosReady = [
  '"Tu acha que sabe usar o ChatGPT. Mas eu garanto que tu tá deixando 80% do poder pra trás."',
  '"O Instagram tá te escondendo de propósito — e eu vou te mostrar como reverter isso com 1 comando."',
  '"Depois de 50 milhões de views, descobri que o problema nunca foi a câmera. Foi o prompt."',
];
ganchosReady.forEach((g, i) => {
  card(doc, PAD, y, PW - PAD * 2, 30, C.blue);
  doc.font('Helvetica').fontSize(9).fillColor(C.white)
     .text(g, PAD + 12, y + 10, { width: PW - PAD * 2 - 24 });
  y += 38;
});

// Footer
rect(doc, 0, PH - 36, PW, 36, C.bg);
doc.font('Helvetica').fontSize(8).fillColor(C.slate)
   .text('Diagnóstico @omatheus.ai · 19/03/2026 · Página 9', PAD, PH - 22, { width: PW - PAD * 2, align: 'center' });

// ═══════════════════════════════════════════════════════════════════════════════
// PÁGINA 10 — FUNIL
// ═══════════════════════════════════════════════════════════════════════════════
newPage(doc);
y = PAD;
y = sectionHeader(doc, PAD, y, 'Mapeamento do Funil', 'Diagnóstico do Funil de Vendas');

// Funil visual
const funnelSteps = [
  { label: 'TOPO — ALCANCE', val: '~1.5M contas/40 posts', color: C.blue, w: 460, note: 'Tech/Segurança e Motivacional funcionam bem' },
  { label: 'MEIO — ENGAJAMENTO QUALIFICADO', val: '~3.2% média', color: C.yellow, w: 380, note: '12% nos posts de IA — muito acima da média' },
  { label: 'FUNDO — CTAs ATIVOS', val: 'CHAVE, ALCANCE, CRESCER, MAPA...', color: C.red, w: 300, note: 'PROBLEMA: múltiplos CTAs diferentes confundem' },
  { label: 'CONVERSÃO — VENDAS', val: '~7 compras/100k alcance', color: C.red, w: 200, note: 'Meta: 50+ compras. Tá 7x abaixo do potencial' },
];

const funnelX = (PW - 460) / 2;
funnelSteps.forEach((step, i) => {
  const fw = step.w;
  const fx = (PW - fw) / 2;
  rect(doc, fx, y, fw, 32, step.color, 4);
  doc.font('Helvetica-Bold').fontSize(8).fillColor(C.black)
     .text(step.label, fx + 8, y + 6, { width: fw - 16 });
  doc.font('Helvetica').fontSize(7).fillColor(C.black)
     .text(step.val, fx + 8, y + 18, { width: fw - 16 });
  // Arrow down
  if (i < funnelSteps.length - 1) {
    doc.save().strokeColor(C.slate).lineWidth(1)
       .moveTo(PW / 2, y + 32).lineTo(PW / 2, y + 40).stroke()
       .moveTo(PW / 2 - 5, y + 37).lineTo(PW / 2, y + 42).lineTo(PW / 2 + 5, y + 37).stroke()
       .restore();
  }
  // Side note
  doc.font('Helvetica').fontSize(8).fillColor(C.slate)
     .text(`→ ${step.note}`, fx + fw + 8, y + 10, { width: PW - fx - fw - PAD - 8 });
  y += 48;
});

y += 16;

// Vazamentos
doc.font('Helvetica-Bold').fontSize(11).fillColor(C.white).text('Onde o funil tá VAZANDO:', PAD, y);
y += 18;

const vazamentos = [
  {
    nivel: 'MEIO → FUNDO',
    problema: 'Posts motivacionais sem CTA atraem alcance mas não direcionam pra produto',
    solucao: 'Adicionar CTA sutil no fim de todo motivacional: "Comenta CHAVE se quer aprender com IA"',
    urgencia: C.red,
  },
  {
    nivel: 'FUNDO → CONVERSÃO',
    problema: 'CTAs espalhados (CHAVE, ALCANCE, CRESCER, MAPA, SISTEMA) confundem o lead',
    solucao: 'Unificar em 2 CTAs principais: CHAVE (curso) e DIAGNÓSTICO (análise). Um por período.',
    urgencia: C.red,
  },
  {
    nivel: 'CONVERSÃO → RECOMPRA',
    problema: 'Link na bio não leva pra oferta. Banco de prompts não converte em produto',
    solucao: 'Trocar link para página de vendas CHAVE AI ou para página do DIAGNÓSTICO',
    urgencia: C.yellow,
  },
];

vazamentos.forEach((v) => {
  if (y + 72 > PH - 50) { newPage(doc); y = PAD; }
  card(doc, PAD, y, PW - PAD * 2, 64, v.urgencia);
  doc.font('Helvetica-Bold').fontSize(9).fillColor(v.urgencia)
     .text(v.nivel, PAD + 12, y + 8, { characterSpacing: 1 });
  doc.font('Helvetica-Bold').fontSize(8).fillColor(C.red).text('Problema: ', PAD + 12, y + 22);
  doc.font('Helvetica').fontSize(8).fillColor(C.white)
     .text(v.problema, PAD + 68, y + 22, { width: PW - PAD * 2 - 80 });
  doc.font('Helvetica-Bold').fontSize(8).fillColor(C.green).text('Solução: ', PAD + 12, y + 40);
  doc.font('Helvetica').fontSize(8).fillColor(C.white)
     .text(v.solucao, PAD + 62, y + 40, { width: PW - PAD * 2 - 74 });
  y += 72;
});

// Footer
rect(doc, 0, PH - 36, PW, 36, C.bg);
doc.font('Helvetica').fontSize(8).fillColor(C.slate)
   .text('Diagnóstico @omatheus.ai · 19/03/2026 · Página 10', PAD, PH - 22, { width: PW - PAD * 2, align: 'center' });

// ═══════════════════════════════════════════════════════════════════════════════
// PÁGINA 11 — FORMATOS PARA TESTAR
// ═══════════════════════════════════════════════════════════════════════════════
newPage(doc);
y = PAD;
y = sectionHeader(doc, PAD, y, 'Formatos Validados', 'Formatos que Podem Explodir no Teu Nicho');

doc.font('Helvetica').fontSize(9).fillColor(C.slate)
   .text('Não é pra copiar. É pra estudar o formato e adaptar pro teu nicho.', PAD, y);
y += 20;

FORMATOS.forEach((f) => {
  if (y + 100 > PH - 50) { newPage(doc); y = PAD; }

  const fH = 90;
  const borderCol = f.usa ? C.green : C.border;
  card(doc, PAD, y, PW - PAD * 2, fH, borderCol);

  // Status badge
  const badgeColor = f.usa ? C.green : C.blue;
  const badgeText = f.usa ? '✓ JÁ USAS' : '→ TESTAR';
  rect(doc, PAD + 8, y + 8, 70, 16, badgeColor, 4);
  doc.font('Helvetica-Bold').fontSize(7).fillColor(C.black)
     .text(badgeText, PAD + 8, y + 12, { width: 70, align: 'center' });

  doc.font('Helvetica-Bold').fontSize(10).fillColor(C.white)
     .text(f.nome, PAD + 86, y + 8, { width: PW - PAD * 2 - 100 });

  doc.font('Helvetica').fontSize(8).fillColor(C.slate)
     .text(f.desc, PAD + 12, y + 30, { width: PW - PAD * 2 - 24 });

  doc.font('Helvetica-Bold').fontSize(8).fillColor(C.blue).text('Por que funciona: ', PAD + 12, y + 46);
  doc.font('Helvetica').fontSize(8).fillColor(C.white)
     .text(f.porque, PAD + 105, y + 46, { width: PW - PAD * 2 - 120 });

  doc.font('Helvetica-Bold').fontSize(8).fillColor(C.green).text('Como adaptar: ', PAD + 12, y + 62);
  doc.font('Helvetica').fontSize(8).fillColor(C.white)
     .text(f.adaptar, PAD + 95, y + 62, { width: PW - PAD * 2 - 107 });

  doc.font('Helvetica').fontSize(7).fillColor(C.slate)
     .text(`Fonte: Protocolo @omatheus.ai / Formatos Validados`, PAD + 12, y + 78);

  y += fH + 10;
});

// Footer
rect(doc, 0, PH - 36, PW, 36, C.bg);
doc.font('Helvetica').fontSize(8).fillColor(C.slate)
   .text('Diagnóstico @omatheus.ai · 19/03/2026 · Página 11', PAD, PH - 22, { width: PW - PAD * 2, align: 'center' });

// ═══════════════════════════════════════════════════════════════════════════════
// PÁGINA 12 — PLANO DE AÇÃO 4 SEMANAS
// ═══════════════════════════════════════════════════════════════════════════════
newPage(doc);
y = PAD;
y = sectionHeader(doc, PAD, y, 'Plano de Ação', 'Plano de Ação — 4 Semanas');

const semanas = [
  {
    sem: 'SEMANA 1 — Fundação',
    cor: C.red,
    acoes: [
      'Dia 1: Atualizar bio com Versão 1 sugerida (CTA CHAVE no final)',
      'Dia 2: Trocar link na bio → página de vendas da CHAVE AI',
      'Dia 3: Publicar carrossel IA com CTA CHAVE (formato Foto Perfil)',
      'Dia 4-7: Standardizar CTAs — só CHAVE e DIAGNÓSTICO por 30 dias',
    ],
  },
  {
    sem: 'SEMANA 2 — Criação com Estratégia',
    cor: C.yellow,
    acoes: [
      'Criar 2 Reels no formato "Casal Problema/Solução" (Thaís + Matheus)',
      'Criar 1 carrossel "Isso vs. Aquilo" — prompt ruim vs. bom',
      'Adicionar CTA sutil em 1 post motivacional: "comenta CHAVE"',
      'Documentar processo real: mostrar erros e bastidores de criação',
    ],
  },
  {
    sem: 'SEMANA 3 — Aceleração',
    cor: C.blue,
    acoes: [
      'Lançar carrossel "Os 3 Caminhos" (Amador/Intermediário/Estrategista)',
      'Criar Reel "Recurso Escondido" com função pouco conhecida do ChatGPT',
      'Postar 1 conteúdo de Segurança Digital (manter 25% da meta)',
      'Stories: mostrar resultados de alunos que comentaram CHAVE',
    ],
  },
  {
    sem: 'SEMANA 4 — Conversão',
    cor: C.green,
    acoes: [
      'Criar conteúdo direto sobre Diagnóstico de Perfil (CTA DIAGNÓSTICO)',
      'Live ou Stories mostrando análise real de perfil de seguidor',
      'Revisar métricas: % IA no mix, comentários CHAVE, conversões',
      'Ajustar mix e replanejar próximas 4 semanas',
    ],
  },
];

semanas.forEach((sem) => {
  if (y + 90 > PH - 50) { newPage(doc); y = PAD; }
  card(doc, PAD, y, PW - PAD * 2, 84, sem.cor);
  doc.font('Helvetica-Bold').fontSize(10).fillColor(sem.cor)
     .text(sem.sem, PAD + 12, y + 10);
  sem.acoes.forEach((acao, i) => {
    doc.font('Helvetica').fontSize(8).fillColor(C.white)
       .text(`${['①','②','③','④'][i]} ${acao}`, PAD + 12, y + 26 + i * 14, { width: PW - PAD * 2 - 24 });
  });
  y += 92;
});

// Footer
rect(doc, 0, PH - 36, PW, 36, C.bg);
doc.font('Helvetica').fontSize(8).fillColor(C.slate)
   .text('Diagnóstico @omatheus.ai · 19/03/2026 · Página 12', PAD, PH - 22, { width: PW - PAD * 2, align: 'center' });

// ═══════════════════════════════════════════════════════════════════════════════
// PÁGINA 13 — PRÓXIMOS PASSOS
// ═══════════════════════════════════════════════════════════════════════════════
newPage(doc);
y = PAD;
y = sectionHeader(doc, PAD, y, 'Finalização', 'Próximos Passos — Esta Semana');

// 3 ações imediatas
const acoes = [
  {
    num: '01',
    prioridade: 'URGENTE',
    acao: 'Consertar a bio HOJE',
    detalhe: 'A linha 3 tá cortada e o link não leva pra produto. São 5 minutos de ajuste que podem mudar o jogo imediatamente. Pega a Versão 1 sugerida aqui no PDF e implementa.',
    cor: C.red,
  },
  {
    num: '02',
    prioridade: 'IMPORTANTE',
    acao: 'Padronizar CTAs nos próximos 3 posts',
    detalhe: 'Para de usar ALCANCE, CRESCER e SISTEMA alternado. Define 1 CTA por semana: CHAVE ou DIAGNÓSTICO. Isso vai concentrar o lead flow e aumentar a conversão.',
    cor: C.yellow,
  },
  {
    num: '03',
    prioridade: 'OPORTUNIDADE',
    acao: 'Criar carrossel IA no formato "Isso vs. Aquilo"',
    detalhe: 'Esse formato ainda não foi testado no teu perfil e tem alta taxa de salvamento. Cria um mostrando prompt ruim vs. prompt certo pra resultado de foto. CTA: CHAVE.',
    cor: C.blue,
  },
];

acoes.forEach((a) => {
  card(doc, PAD, y, PW - PAD * 2, 90, a.cor);
  // number badge
  rect(doc, PAD + 8, y + 20, 36, 36, a.cor, 4);
  doc.font('Helvetica-Bold').fontSize(18).fillColor(C.black)
     .text(a.num, PAD + 8, y + 26, { width: 36, align: 'center' });
  // priority
  doc.font('Helvetica-Bold').fontSize(8).fillColor(a.cor)
     .text(a.prioridade, PAD + 52, y + 10, { characterSpacing: 2 });
  // action
  doc.font('Helvetica-Bold').fontSize(11).fillColor(C.white)
     .text(a.acao, PAD + 52, y + 22);
  // detail
  doc.font('Helvetica').fontSize(8).fillColor(C.slate)
     .text(a.detalhe, PAD + 52, y + 40, { width: PW - PAD * 2 - 64 });
  y += 98;
});

y += 12;

// Upsell sutil
card(doc, PAD, y, PW - PAD * 2, 100, C.blue);
doc.font('Helvetica-Bold').fontSize(11).fillColor(C.blue)
   .text('Quer ir além com acompanhamento?', PAD + 16, y + 12);
doc.font('Helvetica').fontSize(9).fillColor(C.white)
   .text(
     'Se tu quiser implementar isso mais rápido e com alguém do lado apontando o caminho, ' +
     'o próximo passo natural é um dos dois:',
     PAD + 16, y + 30, { width: PW - PAD * 2 - 32 }
   );

// Options
const opts = [
  { label: 'Chave AI — R$497', desc: 'Curso completo 5 módulos + ferramenta Escritório de IA. Aprende o sistema todo.', cor: C.blue },
  { label: '2 Encontros comigo — R$297', desc: 'Vai ponto a ponto nesse diagnóstico comigo ao vivo. Implementação guiada.', cor: C.green },
];

opts.forEach((o, i) => {
  const ox = PAD + 16 + i * ((PW - PAD * 2 - 32) / 2 + 4);
  const ow = (PW - PAD * 2 - 40) / 2;
  rect(doc, ox, y + 56, ow, 32, i === 0 ? C.blueDark : '#0a2a1a', 4);
  doc.font('Helvetica-Bold').fontSize(9).fillColor(o.cor).text(o.label, ox + 6, y + 60, { width: ow - 12 });
  doc.font('Helvetica').fontSize(7).fillColor(C.white).text(o.desc, ox + 6, y + 72, { width: ow - 12 });
});

y += 112;

// Closing
if (y + 50 > PH - 50) { newPage(doc); y = PAD; }
doc.font('Helvetica').fontSize(9).fillColor(C.slate)
   .text(
     'Esse diagnóstico foi feito com base nos dados reais do teu perfil. ' +
     'O potencial tá aqui — a execução é tua.',
     PAD, y, { width: PW - PAD * 2, align: 'center' }
   );
y += 20;
doc.font('Helvetica-Bold').fontSize(12).fillColor(C.blue)
   .text('Qualquer dúvida, comenta DIAGNÓSTICO no último post ou me manda no direct.', PAD, y, { width: PW - PAD * 2, align: 'center' });

// Footer final
rect(doc, 0, PH - 36, PW, 36, C.bg);
doc.font('Helvetica').fontSize(8).fillColor(C.slate)
   .text('Diagnóstico @omatheus.ai · 19/03/2026 · Página 13 — FIM', PAD, PH - 22, { width: PW - PAD * 2, align: 'center' });

// ─── FINALIZE ─────────────────────────────────────────────────────────────────
doc.end();
console.log('PDF gerado com sucesso:', OUTPUT_PDF);

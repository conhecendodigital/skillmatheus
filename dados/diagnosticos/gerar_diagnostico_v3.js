'use strict';

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// ─────────────────────────────────────────────
// CONSTANTES GLOBAIS
// ─────────────────────────────────────────────
const PAGE_WIDTH  = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN      = 40;
const CW          = PAGE_WIDTH - MARGIN * 2;   // content width = 515.28

const PRINTS = path.join(__dirname, 'prints');
const OUTPUT  = path.join(__dirname, 'diagnostico-omatheus.ai-2026-03-19-v3.pdf');

// Paleta
const C = {
  bg        : '#000000',
  card      : '#0d1117',
  border    : '#1e293b',
  blue      : '#0ea5e9',
  blue2     : '#1e40af',
  green     : '#22c55e',
  yellow    : '#eab308',
  red       : '#ef4444',
  white     : '#ffffff',
  slate300  : '#cbd5e1',
  slate400  : '#94a3b8',
  slate500  : '#64748b',
  slate600  : '#475569',
  orange    : '#f97316',
};

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

/** Verifica espaço e adiciona nova página se necessário. Retorna novo Y. */
function checkY(doc, y, needed = 80) {
  if (y + needed > PAGE_HEIGHT - MARGIN) {
    doc.addPage();
    return MARGIN + 10;
  }
  return y;
}

/** Retângulo arredondado como card. */
function drawCard(doc, x, y, w, h, opts = {}) {
  const { bg = C.card, border = C.border, radius = 8 } = opts;
  doc.save()
     .roundedRect(x, y, w, h, radius)
     .fillAndStroke(bg, border)
     .restore();
}

/** Label azul minúsculas + espaçamento. */
function labelText(doc, x, y, text) {
  doc.font('Helvetica-Bold').fontSize(9).fillColor(C.blue)
     .text(text.toUpperCase(), x, y, { characterSpacing: 1.5 });
  return y + 18;
}

/** Título branco grande. */
function titleText(doc, x, y, text, size = 22) {
  doc.font('Helvetica-Bold').fontSize(size).fillColor(C.white)
     .text(text, x, y, { width: CW });
  return y + size + 10;
}

/** Linha divisória. */
function divider(doc, y, color = C.border) {
  doc.save().moveTo(MARGIN, y).lineTo(MARGIN + CW, y)
     .strokeColor(color).lineWidth(0.5).stroke().restore();
  return y + 12;
}

/** Barra de progresso horizontal. */
function progressBar(doc, x, y, w, pct, colorFill = C.blue, label = '', sublabel = '') {
  const h = 10;
  const barW = w * 0.65;
  // fundo
  doc.roundedRect(x, y, barW, h, 3).fill(C.border);
  // preenchimento
  if (pct > 0) {
    doc.roundedRect(x, y, barW * Math.min(pct, 1), h, 3).fill(colorFill);
  }
  if (label) {
    doc.font('Helvetica').fontSize(9).fillColor(C.slate300)
       .text(label, x + barW + 8, y - 1, { width: 100 });
  }
  if (sublabel) {
    doc.font('Helvetica').fontSize(8).fillColor(C.slate500)
       .text(sublabel, x + barW + 8, y + 10, { width: 100 });
  }
  return y + h + 6;
}

/** Círculo com texto centralizado. */
function scoreCircle(doc, cx, cy, r, mainText, subText) {
  // anel externo
  doc.circle(cx, cy, r + 4).fill('#0ea5e930');
  doc.circle(cx, cy, r).fill(C.card).stroke(C.blue);
  doc.font('Helvetica-Bold').fontSize(28).fillColor(C.white);
  const tw = doc.widthOfString(mainText);
  doc.text(mainText, cx - tw / 2, cy - 20, { lineBreak: false });
  doc.font('Helvetica').fontSize(12).fillColor(C.slate400);
  const sw = doc.widthOfString(subText);
  doc.text(subText, cx - sw / 2, cy + 10, { lineBreak: false });
}

/** Tag/badge pequena. */
function badge(doc, x, y, text, color = C.blue) {
  const pad = 6;
  doc.font('Helvetica-Bold').fontSize(8);
  const tw = doc.widthOfString(text);
  const bw = tw + pad * 2;
  const bh = 16;
  doc.roundedRect(x, y, bw, bh, 3).fill(color + '33');
  doc.font('Helvetica-Bold').fontSize(8).fillColor(color)
     .text(text, x + pad, y + 4, { lineBreak: false });
  return x + bw + 6;
}

/** Tenta embutir imagem com fallback para placeholder. */
function tryImage(doc, imgPath, x, y, w, h, opts = {}) {
  if (fs.existsSync(imgPath)) {
    try {
      doc.image(imgPath, x, y, { width: w, height: h, ...opts });
      return true;
    } catch (e) { /* fall through */ }
  }
  // placeholder cinza
  doc.save()
     .roundedRect(x, y, w, h, 6)
     .fill(C.border)
     .restore();
  doc.font('Helvetica').fontSize(9).fillColor(C.slate500)
     .text('[imagem]', x, y + h / 2 - 6, { width: w, align: 'center' });
  return false;
}

// ─────────────────────────────────────────────
// INIT DOC
// ─────────────────────────────────────────────
const doc = new PDFDocument({ size: 'A4', margin: 0, autoFirstPage: false });
const stream = fs.createWriteStream(OUTPUT);
doc.pipe(stream);

// fundo preto em TODAS as páginas
doc.on('pageAdded', () => {
  doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT).fill(C.bg);
});

// ═══════════════════════════════════════════════════════════════
// PÁGINA 1 — CAPA
// ═══════════════════════════════════════════════════════════════
doc.addPage();

// Banner azul no topo
const bannerH = 200;
doc.save()
   .rect(0, 0, PAGE_WIDTH, bannerH)
   .fill(C.blue2);
// Acento azul claro na parte inferior do banner
doc.rect(0, bannerH - 4, PAGE_WIDTH, 4).fill(C.blue);
doc.restore();

// Título no banner
doc.font('Helvetica-Bold').fontSize(11).fillColor(C.blue + 'cc')
   .text('ANÁLISE COMPLETA DE PERFIL', MARGIN, 38, { width: CW, align: 'center', characterSpacing: 2 });
doc.font('Helvetica-Bold').fontSize(26).fillColor(C.white)
   .text('DIAGNÓSTICO DE\nPERFIL COM IA', MARGIN, 58, { width: CW, align: 'center', lineGap: 4 });
doc.font('Helvetica').fontSize(11).fillColor(C.slate300)
   .text('Análise estratégica baseada em dados reais', MARGIN, 140, { width: CW, align: 'center' });

// Foto do perfil centralizada
const imgW = 240, imgH = 160;
const imgX = (PAGE_WIDTH - imgW) / 2;
const imgY = bannerH + 28;
drawCard(doc, imgX - 4, imgY - 4, imgW + 8, imgH + 8, { bg: C.card, border: C.blue, radius: 10 });
tryImage(doc, path.join(PRINTS, 'perfil_principal.png'), imgX, imgY, imgW, imgH, { cover: [imgW, imgH] });

// Handle e data
let y = imgY + imgH + 16;
doc.font('Helvetica-Bold').fontSize(18).fillColor(C.blue)
   .text('@omatheus.ai', MARGIN, y, { width: CW, align: 'center' });
y += 24;
doc.font('Helvetica').fontSize(10).fillColor(C.slate400)
   .text('19 de março de 2026', MARGIN, y, { width: CW, align: 'center' });
y += 30;

// Score
scoreCircle(doc, PAGE_WIDTH / 2, y + 50, 46, '7.4', '/10');
y += 100;

doc.font('Helvetica').fontSize(9).fillColor(C.slate500)
   .text('Score geral do perfil', MARGIN, y, { width: CW, align: 'center' });
y += 40;

divider(doc, y, C.slate600);
y += 12;
doc.font('Helvetica').fontSize(9).fillColor(C.slate500)
   .text('Por Matheus Soares · @omatheus.ai', MARGIN, y, { width: CW, align: 'center' });

// ═══════════════════════════════════════════════════════════════
// PÁGINA 2 — VISÃO GERAL
// ═══════════════════════════════════════════════════════════════
doc.addPage();
y = MARGIN;

y = labelText(doc, MARGIN, y, 'Visão Geral do Perfil');
y = titleText(doc, MARGIN, y, 'O que o perfil comunica hoje', 20);
y = divider(doc, y);

// 4 mini-cards de métricas lado a lado
const metricCards = [
  { label: 'Seguidores', value: '424.247' },
  { label: 'Posts',      value: '549' },
  { label: 'Engajamento', value: '~2-5%' },
  { label: 'CTAs ativos', value: '7 diff.' },
];
const mW = (CW - 9) / 4;  // 4 cards com 3 gaps de 3px
const mH = 56;
metricCards.forEach((m, i) => {
  const mx = MARGIN + i * (mW + 3);
  drawCard(doc, mx, y, mW, mH, { bg: C.card, border: C.border });
  doc.font('Helvetica-Bold').fontSize(16).fillColor(C.white)
     .text(m.value, mx, y + 10, { width: mW, align: 'center' });
  doc.font('Helvetica').fontSize(8).fillColor(C.slate400)
     .text(m.label, mx, y + 32, { width: mW, align: 'center' });
});
y += mH + 14;

// Grid do perfil
const gridH = 160;
drawCard(doc, MARGIN, y, CW, gridH, { bg: C.card, border: C.border });
tryImage(doc, path.join(PRINTS, 'grid_posts.png'), MARGIN + 2, y + 2, CW - 4, gridH - 4, { cover: [CW - 4, gridH - 4] });
y += gridH + 16;

// Bio atual
drawCard(doc, MARGIN, y, CW, 90, { bg: '#0c1a2e', border: C.blue, radius: 8 });
doc.font('Helvetica-Bold').fontSize(9).fillColor(C.blue)
   .text('BIO ATUAL', MARGIN + 12, y + 10);
doc.font('Helvetica').fontSize(10).fillColor(C.slate300)
   .text('"Mostro como usar IA para criar conteúdo que gera autoridade e clientes.\n+50 MILHÕES DE VIEWS SEM PAGAR UM REAL EM ANÚNCIOS"',
     MARGIN + 12, y + 26, { width: CW - 24, lineGap: 2 });
// link
doc.font('Helvetica').fontSize(8).fillColor(C.yellow)
   .text('Link: obancodeprompts.omatheusai.com.br (produto GRATUITO — gap de monetização)', MARGIN + 12, y + 68, { width: CW - 24 });
y += 90 + 16;

// Semáforo
y = checkY(doc, y, 160);
doc.font('Helvetica-Bold').fontSize(11).fillColor(C.white)
   .text('Diagnóstico Rápido', MARGIN, y);
y += 18;

const semaforo = [
  { cor: C.green,  icone: '●', texto: 'Prova social forte', detalhe: '"+50M views sem pagar anúncios" é uma afirmação poderosa e específica.' },
  { cor: C.yellow, icone: '●', texto: 'Bio pode ser mais direta', detalhe: 'Boa estrutura, mas o CTA final está ausente.' },
  { cor: C.red,    icone: '●', texto: 'Link da bio vai para produto GRATUITO', detalhe: 'Banco de Prompts grátis não converte. Trocar para produto pago é prioridade #1.' },
  { cor: C.red,    icone: '●', texto: '7 CTAs diferentes = confusão', detalhe: 'CHAVE, ALCANCE, CRESCER, MAPA, DIAGNÓSTICO... o seguidor não sabe o que fazer.' },
  { cor: C.yellow, icone: '●', texto: 'Mix de conteúdo desequilibrado', detalhe: '~35% motivacional, ~30% IA prático. A meta é 40% IA. Foco é necessário.' },
];

semaforo.forEach(s => {
  y = checkY(doc, y, 40);
  drawCard(doc, MARGIN, y, CW, 38, { bg: C.card, border: C.border });
  doc.circle(MARGIN + 20, y + 19, 6).fill(s.cor);
  doc.font('Helvetica-Bold').fontSize(10).fillColor(C.white)
     .text(s.texto, MARGIN + 34, y + 7, { width: CW - 50 });
  doc.font('Helvetica').fontSize(8.5).fillColor(C.slate400)
     .text(s.detalhe, MARGIN + 34, y + 21, { width: CW - 50 });
  y += 38 + 5;
});

// ═══════════════════════════════════════════════════════════════
// PÁGINA 3 — RAIO-X DA BIO
// ═══════════════════════════════════════════════════════════════
doc.addPage();
y = MARGIN;

y = labelText(doc, MARGIN, y, 'Análise da Bio');
y = titleText(doc, MARGIN, y, 'Raio-X da Bio', 20);
y = divider(doc, y);

// Análise linha por linha
doc.font('Helvetica-Bold').fontSize(10).fillColor(C.slate300)
   .text('Análise linha por linha:', MARGIN, y);
y += 18;

const bioLinhas = [
  {
    linha: 'Linha 1: "Mostro como usar IA para criar conteúdo que gera autoridade e clientes."',
    analise: 'Promessa clara com resultado (autoridade + clientes). Boa. Poderia ter um diferencial de tempo ou método.',
    status: 'ok',
  },
  {
    linha: 'Linha 2: "+50 MILHÕES DE VIEWS SEM PAGAR UM REAL EM ANÚNCIOS"',
    analise: 'Prova social excelente. CAIXA ALTA funciona. Número específico gera credibilidade imediata.',
    status: 'ok',
  },
  {
    linha: 'Linha 3: (ausente — sem CTA direto na bio)',
    analise: 'Falta uma chamada para ação. O visitante lê a bio, se interessa... mas para onde vai? O link não indica claramente.',
    status: 'gap',
  },
  {
    linha: 'Link: obancodeprompts.omatheusai.com.br',
    analise: 'Produto gratuito como primeiro contato não gera receita. Cada clique no link é uma venda que não acontece.',
    status: 'problema',
  },
];

const statusColor = { ok: C.green, gap: C.yellow, problema: C.red };
const statusLabel  = { ok: 'OK', gap: 'GAP', problema: 'CRÍTICO' };

bioLinhas.forEach(b => {
  y = checkY(doc, y, 60);
  const cardH = 58;
  drawCard(doc, MARGIN, y, CW, cardH, { bg: C.card, border: statusColor[b.status] + '55' });
  // status badge
  badge(doc, MARGIN + 12, y + 9, statusLabel[b.status], statusColor[b.status]);
  doc.font('Helvetica-Bold').fontSize(8.5).fillColor(C.slate300)
     .text(b.linha, MARGIN + 12, y + 28, { width: CW - 24 });
  doc.font('Helvetica').fontSize(8).fillColor(C.slate400)
     .text(b.analise, MARGIN + 12, y + 40, { width: CW - 24 });
  y += cardH + 6;
});

y += 8;
doc.font('Helvetica-Bold').fontSize(11).fillColor(C.white)
   .text('3 Versões Sugeridas', MARGIN, y);
y += 18;

const bioSugestoes = [
  {
    versao: 'Versão A — Resultado + Prova + CTA',
    bio: 'Ensino a usar IA pra criar conteúdo que atrai clientes de verdade.\n+50M views sem gastar R$1 em anúncios.\n👇 Comenta CHAVE e te mando o método.',
    nota: '8.5/10',
  },
  {
    versao: 'Versão B — Identidade + Diferencial',
    bio: 'Matheus | IA e Criação de Conteúdo\nDo zero ao primeiro cliente usando só IA e criatividade.\n+50M views orgânicos comprovam o método. Comenta MAPA.',
    nota: '8/10',
  },
  {
    versao: 'Versão C — Provocação + Solução',
    bio: 'Tu posta todo dia e o alcance não sai do lugar?\nTe ensino o comando certo que muda isso — sem anúncio.\n+50M views. Comenta ALCANCE.',
    nota: '7.5/10',
  },
];

bioSugestoes.forEach(s => {
  y = checkY(doc, y, 90);
  const cardH = 82;
  drawCard(doc, MARGIN, y, CW, cardH, { bg: '#0f1e0f', border: C.green + '66' });
  doc.font('Helvetica-Bold').fontSize(9).fillColor(C.green)
     .text(s.versao, MARGIN + 12, y + 10);
  doc.font('Helvetica').fontSize(9.5).fillColor(C.white)
     .text(s.bio, MARGIN + 12, y + 24, { width: CW - 80, lineGap: 2 });
  doc.font('Helvetica-Bold').fontSize(13).fillColor(C.blue)
     .text(s.nota, MARGIN + CW - 60, y + 30);
  doc.font('Helvetica').fontSize(8).fillColor(C.slate500)
     .text('nota', MARGIN + CW - 60, y + 46);
  y += cardH + 8;
});

// Nota atual
y = checkY(doc, y, 50);
y += 10;
doc.font('Helvetica-Bold').fontSize(10).fillColor(C.white)
   .text('Bio atual: 7/10', MARGIN, y);
y += 14;
progressBar(doc, MARGIN, y, CW, 0.70, C.yellow, '7 / 10', 'com ajustes chega a 9/10');
y += 26;
doc.font('Helvetica').fontSize(9).fillColor(C.slate400)
   .text('Principal gap: ausência de CTA direto e link sem proposta de valor.', MARGIN, y, { width: CW });

// ═══════════════════════════════════════════════════════════════
// PÁGINA 4 — 5 POSTS RECENTES
// ═══════════════════════════════════════════════════════════════
doc.addPage();
y = MARGIN;

y = labelText(doc, MARGIN, y, 'Análise de Conteúdo');
y = titleText(doc, MARGIN, y, 'Os 5 Posts Mais Recentes', 20);
y = divider(doc, y);

const recentes = [
  { img: 'post_recente_1.png', data: 'Mar 15', tipo: 'Motivacional',          cta: 'Sem CTA',     likes: '831',   coments: '6',   insight: 'Alto alcance, baixo engajamento. Não qualifica lead.' },
  { img: 'post_recente_2.png', data: 'Mar 13', tipo: 'Carrossel IA',           cta: 'CTA CHAVE',   likes: '521',   coments: '314', insight: '314 comentários! O melhor da semana. Formato + CTA certos.' },
  { img: 'post_recente_3.png', data: 'Mar 10', tipo: 'Motivacional',          cta: 'Sem CTA',     likes: '2.400', coments: '8',   insight: '2.4k curtidas mas só 8 comentários. Viraliza mas não vende.' },
  { img: 'post_recente_4.png', data: 'Mar 10', tipo: 'Carrossel Estratégia',  cta: 'CTA ALCANCE', likes: '409',   coments: '266', insight: '266 comentários. CTA funciona quando conteúdo é prático.' },
  { img: 'post_recente_5.png', data: 'Mar 07', tipo: 'Fé / Reflexão',         cta: 'Sem CTA',     likes: '200',   coments: '0',   insight: 'Zero comentários. Humaniza mas não gera ação.' },
];

const postW = (CW - 8) / 2;
const postH = 130;

recentes.forEach((p, i) => {
  const col = i % 2;
  const isLast = (i === 4);
  const px = isLast ? MARGIN + postW / 2 + 4 : MARGIN + col * (postW + 8);

  y = checkY(doc, y, postH + 10);

  // só quebra linha a cada 2 posts (exceto o último)
  if (col === 0 && i > 0 && !isLast) y += 8;
  if (isLast) y += 8;

  const borderColor = p.coments !== '0' && parseInt(p.coments.replace('.','')) > 50
    ? C.green : C.border;
  drawCard(doc, px, y, postW, postH, { bg: C.card, border: borderColor });

  // miniatura
  const thumbW = 70, thumbH = 56;
  tryImage(doc, path.join(PRINTS, p.img), px + 8, y + 8, thumbW, thumbH, { cover: [thumbW, thumbH] });

  // info ao lado
  const tx = px + thumbW + 16;
  const tw2 = postW - thumbW - 24;
  doc.font('Helvetica-Bold').fontSize(8).fillColor(C.slate400)
     .text(p.data, tx, y + 10, { width: tw2 });
  badge(doc, tx, y + 22, p.tipo, C.blue);
  badge(doc, tx + 75, y + 22, p.cta, p.cta === 'Sem CTA' ? C.slate500 : C.green);
  doc.font('Helvetica-Bold').fontSize(12).fillColor(C.white)
     .text(p.likes, tx, y + 42, { lineBreak: false });
  doc.font('Helvetica').fontSize(8).fillColor(C.slate400)
     .text(' ♥', tx + doc.widthOfString(p.likes) + 2, y + 45, { lineBreak: false });
  doc.font('Helvetica-Bold').fontSize(12).fillColor(
      parseInt(p.coments.replace('.','')) > 50 ? C.green : C.white)
     .text(p.coments, tx + 52, y + 42, { lineBreak: false });
  doc.font('Helvetica').fontSize(8).fillColor(C.slate400)
     .text(' 💬', tx + 52 + doc.widthOfString(p.coments) + 2, y + 45, { lineBreak: false });

  // insight
  doc.font('Helvetica').fontSize(8).fillColor(C.slate400)
     .text(p.insight, px + 8, y + 78, { width: postW - 16, lineGap: 1 });

  // avança coluna ou linha
  if (col === 1 || isLast) {
    y += postH;
  }
});

// ═══════════════════════════════════════════════════════════════
// PÁGINA 5 — TOP ENGAJAMENTO
// ═══════════════════════════════════════════════════════════════
doc.addPage();
y = MARGIN;

y = labelText(doc, MARGIN, y, 'Melhores Posts');
y = titleText(doc, MARGIN, y, 'Posts com Maior Engajamento', 20);
y = divider(doc, y);

const topPosts = [
  { img: 'post_engajamento_1.png', rank: '#1', titulo: 'Reel "Aba Anônima" (Fixado)',    data: 'Ago/2025', likes: '2.300', coments: '28',  nota: 'Fixado na grade. Reel demonstração de recurso oculto. Formato "Recurso Escondido" funciona.' },
  { img: 'post_recente_2.png',     rank: '#2', titulo: 'Carrossel "Foto Perfeita com IA"', data: 'Mar 13',  likes: '521',   coments: '314', nota: 'Recorde de comentários recentes. Pergunta no título + CTA CHAVE. Formato ensino prático.' },
  { img: 'post_recente_3.png',     rank: '#3', titulo: 'Post Motivacional',              data: 'Mar 10',   likes: '2.400', coments: '8',   nota: 'Alto alcance, baixo engajamento qualificado. Útil para topo de funil, não para vendas.' },
  { img: 'post_recente_4.png',     rank: '#4', titulo: 'Carrossel "Postar por Postar"',  data: 'Mar 10',   likes: '409',   coments: '266', nota: 'Título provocador + conteúdo estratégico = comentários qualificados.' },
  { img: 'post_engajamento_2.png', rank: '#5', titulo: 'Post Fé + Motivacional',         data: 'Mar 04',   likes: '695',   coments: '4',   nota: 'Alcance médio, engajamento fraco. Humaniza o perfil mas não converte.' },
];

topPosts.forEach((p, i) => {
  y = checkY(doc, y, 78);
  const h = 72;
  drawCard(doc, MARGIN, y, CW, h, { bg: C.card, border: C.green + '55' });

  // rank
  doc.font('Helvetica-Bold').fontSize(18).fillColor(C.green + '66')
     .text(p.rank, MARGIN + 8, y + 22, { lineBreak: false });

  // imagem
  const imgX2 = MARGIN + 36, thumbH = 56;
  tryImage(doc, path.join(PRINTS, p.img), imgX2, y + 8, 70, thumbH, { cover: [70, thumbH] });

  // texto
  const tx2 = imgX2 + 78;
  const tw3 = CW - 78 - 40;
  doc.font('Helvetica-Bold').fontSize(10).fillColor(C.white)
     .text(p.titulo, tx2, y + 8, { width: tw3 });
  doc.font('Helvetica').fontSize(8).fillColor(C.slate400)
     .text(p.data, tx2, y + 22, { lineBreak: false });
  doc.font('Helvetica-Bold').fontSize(10).fillColor(C.white)
     .text(`${p.likes} ♥  `, tx2, y + 34, { lineBreak: false, continued: true })
     .fillColor(
       parseInt(p.coments.replace('.','')) > 50 ? C.green : C.slate300)
     .text(`${p.coments} 💬`);
  doc.font('Helvetica').fontSize(8).fillColor(C.slate400)
     .text(p.nota, tx2, y + 49, { width: tw3, lineGap: 1 });

  y += h + 6;
});

// Insight box
y = checkY(doc, y, 80);
y += 8;
drawCard(doc, MARGIN, y, CW, 70, { bg: '#0c1a0c', border: C.green });
doc.font('Helvetica-Bold').fontSize(10).fillColor(C.green)
   .text('INSIGHT CHAVE', MARGIN + 14, y + 10);
doc.font('Helvetica').fontSize(9.5).fillColor(C.slate300)
   .text('Posts de IA prático com CTA + pergunta no título dominam em comentários (314 vs. 6).\nMotivar é bom para alcance, mas não qualifica. O algoritmo premia o que gera conversa, não só curtida.', MARGIN + 14, y + 26, { width: CW - 28, lineGap: 3 });

// ═══════════════════════════════════════════════════════════════
// PÁGINA 6 — PADRÃO QUE FUNCIONA
// ═══════════════════════════════════════════════════════════════
doc.addPage();
y = MARGIN;

y = labelText(doc, MARGIN, y, 'O que já funciona');
y = titleText(doc, MARGIN, y, 'O Padrão que o Algoritmo Premia', 20);
y = divider(doc, y);

// Comparativo IA vs Motivacional
const compData = [
  { tipo: 'Carrossel IA Prático', alcance: '~15k', likes: '521', coments: '314', ctr: '12%', cor: C.blue },
  { tipo: 'Post Motivacional',    alcance: '~80k', likes: '2.400', coments: '8', ctr: '0.5%', cor: C.yellow },
];

doc.font('Helvetica-Bold').fontSize(10).fillColor(C.white)
   .text('Comparativo: IA Prático vs Motivacional', MARGIN, y);
y += 16;

const compW = (CW - 10) / 2;
compData.forEach((c, i) => {
  const cx2 = MARGIN + i * (compW + 10);
  const ch = 110;
  drawCard(doc, cx2, y, compW, ch, { bg: C.card, border: c.cor + '66' });
  doc.font('Helvetica-Bold').fontSize(10).fillColor(c.cor)
     .text(c.tipo, cx2 + 10, y + 10, { width: compW - 20 });
  const metrics = [
    { label: 'Alcance',     val: c.alcance },
    { label: 'Curtidas',    val: c.likes },
    { label: 'Comentários', val: c.coments },
    { label: 'Engaj. real', val: c.ctr },
  ];
  metrics.forEach((m, mi) => {
    const my = y + 28 + mi * 18;
    doc.font('Helvetica').fontSize(8).fillColor(C.slate400)
       .text(m.label + ':', cx2 + 10, my, { lineBreak: false, continued: true });
    doc.font('Helvetica-Bold').fontSize(9).fillColor(C.white)
       .text('  ' + m.val);
  });
});
y += 120;

// Insight cards
const insights = [
  { icon: '📌', titulo: 'Carrossel > Reel para IA prático', texto: 'O seguidor quer salvar e rever o conteúdo. Carrossel com passo a passo gera mais salvamentos.' },
  { icon: '💬', titulo: 'Pergunta no título = comentários', texto: '"Foto Perfeita com IA" + prompt + pergunta = 314 comentários. O algoritmo do IG premia comentários acima de curtidas em 2025.' },
  { icon: '🎯', titulo: 'CTA específico converte', texto: 'Posts com CTA (CHAVE, ALCANCE) têm 30-50x mais comentários que posts sem CTA.' },
  { icon: '🔥', titulo: 'Motivacional atrai mas não vende', texto: '2.400 curtidas e 8 comentários = audiência passiva. Serve para alcance, não para qualificar leads.' },
];

insights.forEach(ins => {
  y = checkY(doc, y, 68);
  const h = 62;
  drawCard(doc, MARGIN, y, CW, h, { bg: C.card, border: C.border });
  doc.font('Helvetica-Bold').fontSize(13)
     .text(ins.icon, MARGIN + 10, y + 18, { lineBreak: false });
  doc.font('Helvetica-Bold').fontSize(10).fillColor(C.white)
     .text(ins.titulo, MARGIN + 34, y + 10, { width: CW - 46 });
  doc.font('Helvetica').fontSize(8.5).fillColor(C.slate300)
     .text(ins.texto, MARGIN + 34, y + 26, { width: CW - 46, lineGap: 2 });
  y += h + 6;
});

// ═══════════════════════════════════════════════════════════════
// PÁGINA 7 — MIX DE CONTEÚDO
// ═══════════════════════════════════════════════════════════════
doc.addPage();
y = MARGIN;

y = labelText(doc, MARGIN, y, 'Mix de Conteúdo');
y = titleText(doc, MARGIN, y, 'Mix Atual vs. Mix Ideal', 20);
y = divider(doc, y);

doc.font('Helvetica').fontSize(9).fillColor(C.slate400)
   .text('Baseado na análise dos últimos 40 posts', MARGIN, y);
y += 20;

const mixItems = [
  { cat: 'IA / Criação Prático', atual: 0.30, meta: 0.40, corAtual: C.blue,   corMeta: C.green },
  { cat: 'Motivacional / Fé',    atual: 0.35, meta: 0.10, corAtual: C.yellow, corMeta: C.slate500 },
  { cat: 'Tech / Dicas',         atual: 0.20, meta: 0.25, corAtual: C.blue,   corMeta: C.green },
  { cat: 'Pessoal / Família',    atual: 0.10, meta: 0.15, corAtual: C.orange, corMeta: C.green },
  { cat: 'Segurança Digital',    atual: 0.05, meta: 0.10, corAtual: C.slate500, corMeta: C.green },
];

const barMaxW = CW * 0.55;

// legenda
let lx = MARGIN;
doc.circle(lx + 6, y + 6, 5).fill(C.blue);
doc.font('Helvetica').fontSize(8).fillColor(C.slate300).text('Atual', lx + 14, y + 2, { lineBreak: false });
lx += 55;
doc.circle(lx + 6, y + 6, 5).fill(C.green);
doc.font('Helvetica').fontSize(8).fillColor(C.slate300).text('Meta', lx + 14, y + 2);
y += 20;

mixItems.forEach(m => {
  y = checkY(doc, y, 60);
  // label categoria
  doc.font('Helvetica-Bold').fontSize(9.5).fillColor(C.white)
     .text(m.cat, MARGIN, y, { width: CW });
  y += 14;

  // barra atual
  doc.font('Helvetica').fontSize(8).fillColor(C.slate400)
     .text('Atual', MARGIN, y, { lineBreak: false });
  const barX = MARGIN + 48;
  doc.roundedRect(barX, y, barMaxW, 10, 3).fill(C.border);
  doc.roundedRect(barX, y, barMaxW * m.atual, 10, 3).fill(m.corAtual);
  doc.font('Helvetica-Bold').fontSize(9).fillColor(C.white)
     .text(Math.round(m.atual * 100) + '%', barX + barMaxW + 8, y - 1);
  y += 14;

  // barra meta
  doc.font('Helvetica').fontSize(8).fillColor(C.slate400)
     .text('Meta', MARGIN, y, { lineBreak: false });
  doc.roundedRect(barX, y, barMaxW, 10, 3).fill(C.border);
  doc.roundedRect(barX, y, barMaxW * m.meta, 10, 3).fill(m.corMeta);
  doc.font('Helvetica-Bold').fontSize(9).fillColor(C.green)
     .text(Math.round(m.meta * 100) + '%', barX + barMaxW + 8, y - 1);
  y += 18;
  divider(doc, y, C.border);
  y += 6;
});

// Conclusão
y = checkY(doc, y, 80);
y += 4;
drawCard(doc, MARGIN, y, CW, 70, { bg: '#0c1a2e', border: C.blue });
doc.font('Helvetica-Bold').fontSize(10).fillColor(C.blue)
   .text('O que isso significa?', MARGIN + 14, y + 10);
doc.font('Helvetica').fontSize(9).fillColor(C.slate300)
   .text('Reduzir motivacional de 35% → 10% e aumentar IA prático de 30% → 40% é a mudança mais impactante.\nEssa virada pode dobrar o número de leads qualificados sem precisar aumentar o volume de posts.', MARGIN + 14, y + 26, { width: CW - 28, lineGap: 3 });

// ═══════════════════════════════════════════════════════════════
// PÁGINA 8 — ANÁLISE DE CTAs
// ═══════════════════════════════════════════════════════════════
doc.addPage();
y = MARGIN;

y = labelText(doc, MARGIN, y, 'Análise de CTAs');
y = titleText(doc, MARGIN, y, 'O Problema dos 7 CTAs Diferentes', 20);
y = divider(doc, y);

doc.font('Helvetica').fontSize(9.5).fillColor(C.slate300)
   .text('Foram identificados os seguintes CTAs em uso ativo no perfil:', MARGIN, y);
y += 18;

const ctas = [
  { palavra: 'MAPA',        produto: 'Mapa da Viralização (R$97)',          status: 'manter' },
  { palavra: 'CHAVE',       produto: 'Chave AI (R$297-R$497)',              status: 'manter' },
  { palavra: 'DIAGNÓSTICO', produto: 'Análise de Perfil (R$47/R$297)',      status: 'manter' },
  { palavra: 'ALCANCE',     produto: 'Sem produto atrelado claro',          status: 'remover' },
  { palavra: 'CRESCER',     produto: 'Sem produto atrelado claro',          status: 'remover' },
  { palavra: 'PILAR',       produto: 'Qualifica → Chave AI (confuso)',      status: 'simplificar' },
  { palavra: 'IDEIA',       produto: 'Qualifica → Chave AI (confuso)',      status: 'simplificar' },
];

const statusCtaColor = { manter: C.green, remover: C.red, simplificar: C.yellow };
const statusCtaLabel = { manter: 'MANTER', remover: 'REMOVER', simplificar: 'SIMPLIFICAR' };

ctas.forEach(c => {
  y = checkY(doc, y, 36);
  const ch = 32;
  drawCard(doc, MARGIN, y, CW, ch, { bg: C.card, border: statusCtaColor[c.status] + '44' });
  doc.font('Helvetica-Bold').fontSize(11).fillColor(statusCtaColor[c.status])
     .text(c.palavra, MARGIN + 12, y + 9, { lineBreak: false });
  doc.font('Helvetica').fontSize(8.5).fillColor(C.slate400)
     .text(c.produto, MARGIN + 90, y + 11, { lineBreak: false });
  badge(doc, MARGIN + CW - 80, y + 8, statusCtaLabel[c.status], statusCtaColor[c.status]);
  y += ch + 4;
});

y += 12;
// Por que é problema
drawCard(doc, MARGIN, y, CW, 72, { bg: '#1a0c0c', border: C.red + '66' });
doc.font('Helvetica-Bold').fontSize(10).fillColor(C.red)
   .text('Por que muitos CTAs prejudicam as conversões?', MARGIN + 14, y + 10);
doc.font('Helvetica').fontSize(9).fillColor(C.slate300)
   .text('O seguidor encontra CHAVE num post, ALCANCE em outro, CRESCER no próximo.\nEle não sabe qual é o próximo passo. A clareza de CTA único aumenta conversão em até 3x.\n"Paradoxo da escolha": quanto mais opções, menos decisões são tomadas.', MARGIN + 14, y + 26, { width: CW - 28, lineGap: 3 });
y += 72 + 14;

y = checkY(doc, y, 100);
doc.font('Helvetica-Bold').fontSize(10).fillColor(C.white)
   .text('Recomendação: Calendário de CTAs', MARGIN, y);
y += 14;

const calCtas = [
  { fase: 'Semana 1-2', cta: 'CHAVE', foco: 'Lançamento ou reforço do curso principal' },
  { fase: 'Semana 3',   cta: 'DIAGNÓSTICO', foco: 'Captura de leads quentes com análise de perfil' },
  { fase: 'Semana 4',   cta: 'MAPA', foco: 'Entrada para iniciantes / topo de funil' },
];

calCtas.forEach(c => {
  y = checkY(doc, y, 36);
  const ch = 32;
  drawCard(doc, MARGIN, y, CW, ch, { bg: C.card, border: C.border });
  doc.font('Helvetica').fontSize(8).fillColor(C.slate400)
     .text(c.fase, MARGIN + 10, y + 4, { lineBreak: false });
  doc.font('Helvetica-Bold').fontSize(11).fillColor(C.blue)
     .text(c.cta, MARGIN + 10, y + 15, { lineBreak: false });
  doc.font('Helvetica').fontSize(8.5).fillColor(C.slate300)
     .text(c.foco, MARGIN + 80, y + 17, { lineBreak: false });
  y += ch + 4;
});

// ═══════════════════════════════════════════════════════════════
// PÁGINA 9 — FORMATOS DO PROTOCOLO
// ═══════════════════════════════════════════════════════════════
doc.addPage();
y = MARGIN;

y = labelText(doc, MARGIN, y, 'Formatos para Testar');
y = titleText(doc, MARGIN, y, 'Formatos que Podem Explodir no Teu Nicho', 19);

doc.font('Helvetica').fontSize(8.5).fillColor(C.yellow)
   .text('Não é para copiar. É para estudar o formato e adaptar ao nicho de IA e criação de conteúdo.', MARGIN, y, { width: CW });
y += 16;
y = divider(doc, y);

const formatos = [
  {
    nome: 'Ligação Oculta',
    engajamento: '18.95%',
    exemplo: '"oi desculpa não ter te respondido antes"',
    logica: 'Entra no meio de uma conversa que o seguidor já tem na cabeça. Gera identificação imediata.',
    adaptacao: '"tu já ficou 2 horas tentando fazer um prompt funcionar e o ChatGPT não entendeu?"',
    cor: C.blue,
  },
  {
    nome: 'Errado / Certo',
    engajamento: '11.05% · 6.6M views',
    exemplo: '"PROVANDO QUE A SENHORA NÃO É BURRA, SÓ É DESINFORMADA!"',
    logica: 'Defende o público do problema externo. Remove a culpa e apresenta a solução como revelação.',
    adaptacao: '"PROVANDO QUE TU NÃO É RUIM COM IA — só ninguém te ensinou o comando certo"',
    cor: C.green,
  },
  {
    nome: 'Lista',
    engajamento: '12.40%',
    exemplo: '"5 produtos que você usa errado e gasta mais"',
    logica: 'Número específico + promessa de revelação múltipla = salvamento garantido.',
    adaptacao: '"5 prompts que 99% dos criadores de conteúdo não conhecem (e que eu uso todo dia)"',
    cor: C.orange,
  },
  {
    nome: 'React',
    engajamento: '13.63%',
    exemplo: '"Esse é o vídeo mais viral do momento!" (reage a conteúdo alheio)',
    logica: 'Carona no viral alheio + perspectiva especialista = autoridade com alcance. Mais fácil de gravar.',
    adaptacao: 'Reagir a notícia de IA (OpenAI, Gemini) com análise prática. "Todo mundo está falando disso..."',
    cor: C.yellow,
  },
  {
    nome: 'Para isso / Faça isso',
    engajamento: '5.79% · 1.3M views',
    exemplo: '"Se sentindo fraco, come ovos. Está com cãibras, bebe água de coco."',
    logica: 'Formato telegráfico, lista de diagnósticos + soluções. Altamente salvável.',
    adaptacao: '"Quer crescer no Instagram? Posta carrossel. Quer viralizar? Usa o formato casal. Quer vender? Usa CTA direto."',
    cor: C.blue + 'cc',
  },
];

formatos.forEach(f => {
  y = checkY(doc, y, 110);
  const cardH = 104;
  drawCard(doc, MARGIN, y, CW, cardH, { bg: C.card, border: f.cor + '55' });

  // cabeçalho
  doc.font('Helvetica-Bold').fontSize(12).fillColor(f.cor)
     .text(f.nome, MARGIN + 12, y + 10, { lineBreak: false, continued: true })
     .font('Helvetica').fontSize(9).fillColor(C.slate400)
     .text('  ·  ' + f.engajamento);

  // exemplo real
  doc.font('Helvetica-Bold').fontSize(8).fillColor(C.slate500)
     .text('Exemplo real:', MARGIN + 12, y + 28, { lineBreak: false });
  doc.font('Helvetica').fontSize(8.5).fillColor(C.slate300)
     .text(' ' + f.exemplo, { lineBreak: false }).text('');
  y += 2; // ajuste fino

  // lógica
  doc.font('Helvetica-Bold').fontSize(8).fillColor(C.slate500)
     .text('Por que funciona:', MARGIN + 12, y + 40, { lineBreak: false });
  doc.font('Helvetica').fontSize(8.5).fillColor(C.slate300)
     .text(f.logica, MARGIN + 12, y + 51, { width: CW - 24 });

  // adaptação
  drawCard(doc, MARGIN + 8, y + 68, CW - 16, 28, { bg: C.bg, border: f.cor + '33', radius: 5 });
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(f.cor)
     .text('Para @omatheus.ai: ', MARGIN + 14, y + 74, { lineBreak: false, continued: true })
     .font('Helvetica').fillColor(C.white)
     .text(f.adaptacao, { width: CW - 30 });

  y += cardH + 8;
});

// ═══════════════════════════════════════════════════════════════
// PÁGINA 10 — DIAGNÓSTICO DO FUNIL
// ═══════════════════════════════════════════════════════════════
doc.addPage();
y = MARGIN;

y = labelText(doc, MARGIN, y, 'Diagnóstico do Funil');
y = titleText(doc, MARGIN, y, 'Onde o Funil Está Vazando', 20);
y = divider(doc, y);

// Funil visual em barras decrescentes
const funilEtapas = [
  { label: 'Alcance Total',            valor: '1.5M',    sub: 'contas alcançadas nos últimos 40 posts', pct: 1.00, cor: C.blue },
  { label: 'Engajamento',              valor: '~45k',    sub: 'curtidas + comentários estimados', pct: 0.70, cor: C.blue },
  { label: 'Cliques no Link da Bio',   valor: '~2k',     sub: 'estimativa (produto gratuito — sem urgência)', pct: 0.40, cor: C.yellow },
  { label: 'Leads Qualificados (CTAs)', valor: '~200',   sub: 'comentários CHAVE / MAPA / DIAGNÓSTICO por ciclo', pct: 0.20, cor: C.orange },
  { label: 'Compras Estimadas',         valor: '~7',     sub: 'por ciclo de 40 posts (dado real)', pct: 0.08, cor: C.red },
];

const funilMaxW = CW * 0.72;
doc.font('Helvetica-Bold').fontSize(9).fillColor(C.slate400)
   .text('LARGURA = VOLUME RELATIVO', MARGIN, y, { characterSpacing: 1 });
y += 16;

funilEtapas.forEach((e, i) => {
  y = checkY(doc, y, 44);
  const bw = funilMaxW * e.pct;
  const bx = MARGIN + (funilMaxW - bw) / 2;
  const bh = 28;
  doc.roundedRect(bx, y, bw, bh, 4).fill(e.cor + '33');
  doc.roundedRect(bx, y, bw, bh, 4).stroke(e.cor + '88');
  doc.font('Helvetica-Bold').fontSize(10).fillColor(C.white)
     .text(e.valor, bx + 8, y + 7, { lineBreak: false });
  doc.font('Helvetica').fontSize(8).fillColor(C.slate400)
     .text('  ' + e.label, bx + 8 + doc.widthOfString(e.valor) + 4, y + 9, { lineBreak: false });

  if (i < funilEtapas.length - 1) {
    // seta
    const ax = MARGIN + funilMaxW / 2;
    doc.moveTo(ax, y + bh).lineTo(ax, y + bh + 6)
       .strokeColor(C.slate600).lineWidth(1).stroke();
  }
  y += bh + 8;
});

y += 10;
doc.font('Helvetica-Bold').fontSize(10).fillColor(C.white)
   .text('3 Pontos de Vazamento Identificados', MARGIN, y);
y += 16;

const vazamentos = [
  {
    num: '01',
    titulo: 'Link da Bio → Produto Gratuito',
    desc: '1.5M de alcance sendo captado para um Banco de Prompts sem monetização. Cada visita ao link é uma venda que não acontece. Trocar para produto pago pode aumentar receita 5-10x.',
    cor: C.red,
  },
  {
    num: '02',
    titulo: 'Mix de Conteúdo Desbalanceado',
    desc: '35% motivacional gera curtidas mas não gera leads. O funil começa largo mas a qualificação é baixa porque o conteúdo não direciona ao produto.',
    cor: C.orange,
  },
  {
    num: '03',
    titulo: 'CTAs Fragmentados = Decisão Diluída',
    desc: '7 CTAs diferentes em 40 posts. O seguidor não sabe qual é o próximo passo. Concentrar em 1-2 CTAs por ciclo pode dobrar conversão.',
    cor: C.yellow,
  },
];

vazamentos.forEach(v => {
  y = checkY(doc, y, 72);
  const h = 66;
  drawCard(doc, MARGIN, y, CW, h, { bg: C.card, border: v.cor + '55' });
  doc.font('Helvetica-Bold').fontSize(22).fillColor(v.cor + '44')
     .text(v.num, MARGIN + 8, y + 14, { lineBreak: false });
  doc.font('Helvetica-Bold').fontSize(10).fillColor(v.cor)
     .text(v.titulo, MARGIN + 44, y + 10, { width: CW - 56 });
  doc.font('Helvetica').fontSize(8.5).fillColor(C.slate300)
     .text(v.desc, MARGIN + 44, y + 27, { width: CW - 56, lineGap: 2 });
  y += h + 6;
});

// ═══════════════════════════════════════════════════════════════
// PÁGINA 11 — PLANO DE AÇÃO
// ═══════════════════════════════════════════════════════════════
doc.addPage();
y = MARGIN;

y = labelText(doc, MARGIN, y, 'Plano de Ação');
y = titleText(doc, MARGIN, y, 'Plano de Ação — 4 Semanas', 20);
y = divider(doc, y);

const plano = [
  {
    semana: 'SEMANA 1 — Fundação',
    cor: C.red,
    acoes: [
      'Trocar link da bio para produto pago (Chave AI R$297+ ou Diagnóstico R$47/R$297)',
      'Atualizar bio com CTA direto ("Comenta CHAVE" ou link com proposta de valor)',
      'Auditar os 7 CTAs e escolher 1 CTA principal para o próximo ciclo',
      'Renomear destaques: "Processo" → "Como Funciona", "Essência" → "Quem Sou"',
    ],
  },
  {
    semana: 'SEMANA 2 — Conteúdo Novo',
    cor: C.orange,
    acoes: [
      'Gravar 1 Reel no formato "Errado / Certo" sobre IA (ex: prompt errado vs. certo)',
      'Testar formato "Ligação Oculta" — entrar no meio de uma conversa da audiência',
      'Publicar 1 carrossel no formato Lista ("5 prompts que eu uso todo dia")',
      'Usar 1 único CTA em todos os posts da semana',
    ],
  },
  {
    semana: 'SEMANA 3 — Escalar o que Funciona',
    cor: C.yellow,
    acoes: [
      'Dobrar frequência de posts de IA prático (mínimo 3 de 5 posts por semana)',
      'Criar série de Reels curtos no formato "Preguiçoso" (7-15s, um prompt por vídeo)',
      'Testar formato React — reagir a notícia de IA com análise prática em 60s',
      'Monitorar qual CTA gerou mais comentários qualificados na semana 2',
    ],
  },
  {
    semana: 'SEMANA 4 — Otimização',
    cor: C.green,
    acoes: [
      'Analisar métricas: qual formato trouxe mais comentários / leads?',
      'Criar sequência de Stories com CTA baseado no post de maior engajamento da semana',
      'Planejar o próximo ciclo com mix: 40% IA / 25% Tech / 15% Seg. / 20% Pessoal+Fe',
      'Avaliar receita gerada com novo link da bio vs. período anterior',
    ],
  },
];

plano.forEach(s => {
  y = checkY(doc, y, 120);
  const cardH = 14 + s.acoes.length * 26 + 10;
  drawCard(doc, MARGIN, y, CW, cardH, { bg: C.card, border: s.cor + '66' });
  doc.font('Helvetica-Bold').fontSize(10).fillColor(s.cor)
     .text(s.semana, MARGIN + 12, y + 10);
  s.acoes.forEach((a, ai) => {
    const ay = y + 28 + ai * 26;
    doc.circle(MARGIN + 22, ay + 6, 4).fill(s.cor + '44');
    doc.circle(MARGIN + 22, ay + 6, 4).stroke(s.cor);
    doc.font('Helvetica').fontSize(9).fillColor(C.slate300)
       .text(a, MARGIN + 34, ay, { width: CW - 46, lineGap: 1 });
  });
  y += cardH + 8;
});

// ═══════════════════════════════════════════════════════════════
// PÁGINA 12 — PRÓXIMOS PASSOS
// ═══════════════════════════════════════════════════════════════
doc.addPage();
y = MARGIN;

y = labelText(doc, MARGIN, y, 'Próximos Passos');
y = titleText(doc, MARGIN, y, '3 Ações Imediatas Esta Semana', 20);
y = divider(doc, y);

const acoes = [
  {
    num: '1',
    titulo: 'Trocar o link da bio para produto pago',
    desc: 'O Banco de Prompts gratuito pode ir para um link secundário. O link principal da bio precisa ir para um produto: Diagnóstico (R$47), Mapa (R$97) ou Chave AI (R$297). Esta é a ação de maior impacto imediato.',
    impacto: 'Alto impacto na receita',
    cor: C.red,
    tempo: '30 minutos',
  },
  {
    num: '2',
    titulo: 'Escolher 1 CTA único para o próximo ciclo',
    desc: 'Decida: qual produto vai ser o foco dos próximos 15 dias? Escolha 1 CTA e use-o em todos os posts com CTA. Clareza = mais conversão. "Quem confunde, não vende."',
    impacto: 'Impacto em conversão',
    cor: C.orange,
    tempo: '10 minutos',
  },
  {
    num: '3',
    titulo: 'Gravar 1 Reel no formato Errado/Certo sobre IA',
    desc: '"PROVANDO que tu não é ruim com IA — só ninguém te ensinou o comando certo." Mostrar prompt ruim vs. prompt correto. Título defensivo do público + solução prática = viral + qualificação.',
    impacto: 'Viral + qualifica lead',
    cor: C.green,
    tempo: '1-2 horas',
  },
];

acoes.forEach(a => {
  y = checkY(doc, y, 110);
  const h = 100;
  drawCard(doc, MARGIN, y, CW, h, { bg: C.card, border: a.cor });

  // número grande
  doc.font('Helvetica-Bold').fontSize(36).fillColor(a.cor + '33')
     .text(a.num, MARGIN + 10, y + 22, { lineBreak: false });

  // conteúdo
  const tx3 = MARGIN + 52;
  const tw4 = CW - 64;
  doc.font('Helvetica-Bold').fontSize(12).fillColor(a.cor)
     .text(a.titulo, tx3, y + 10, { width: tw4 });
  doc.font('Helvetica').fontSize(9).fillColor(C.slate300)
     .text(a.desc, tx3, y + 30, { width: tw4, lineGap: 2 });

  // badges
  badge(doc, tx3, y + 78, a.impacto, a.cor);
  badge(doc, tx3 + 120, y + 78, 'Tempo: ' + a.tempo, C.slate400);

  y += h + 10;
});

// Upsell
y = checkY(doc, y, 100);
y += 8;
drawCard(doc, MARGIN, y, CW, 90, { bg: '#0c1a2e', border: C.blue });
doc.font('Helvetica-Bold').fontSize(11).fillColor(C.blue)
   .text('Quer ir além com acompanhamento?', MARGIN + 14, y + 12);
doc.font('Helvetica').fontSize(9.5).fillColor(C.slate300)
   .text('Este PDF é o Degrau 1 da análise. Se quiser aprofundar com dados em tempo real,\nestratégia de conteúdo personalizada e acompanhamento ao vivo:', MARGIN + 14, y + 30, { width: CW - 28, lineGap: 3 });

// dois botões de upsell
const upW = (CW - 28 - 10) / 2;
const upY = y + 62;
drawCard(doc, MARGIN + 14, upY, upW, 22, { bg: C.blue + '22', border: C.blue, radius: 6 });
doc.font('Helvetica-Bold').fontSize(9).fillColor(C.blue)
   .text('Chave AI — R$497 · comenta CHAVE', MARGIN + 14, upY + 6, { width: upW, align: 'center' });
drawCard(doc, MARGIN + 14 + upW + 10, upY, upW, 22, { bg: C.green + '22', border: C.green, radius: 6 });
doc.font('Helvetica-Bold').fontSize(9).fillColor(C.green)
   .text('2 Encontros ao Vivo — R$297 · comenta DIAGNÓSTICO', MARGIN + 14 + upW + 10, upY + 6, { width: upW, align: 'center' });

y += 90 + 10;

// ═══════════════════════════════════════════════════════════════
// PÁGINA 13 — SOBRE O MATHEUS
// ═══════════════════════════════════════════════════════════════
doc.addPage();
y = MARGIN;

y = labelText(doc, MARGIN, y, 'Sobre o Analista');
y = titleText(doc, MARGIN, y, 'Quem Fez Esta Análise', 20);
y = divider(doc, y);

// Card bio
drawCard(doc, MARGIN, y, CW, 130, { bg: C.card, border: C.blue + '55' });
const bioImgW = 90, bioImgH = 90;
tryImage(doc, path.join(PRINTS, 'perfil_principal.png'), MARGIN + 16, y + 20, bioImgW, bioImgH, { cover: [bioImgW, bioImgH] });
const btx = MARGIN + bioImgW + 28;
const btw = CW - bioImgW - 40;
doc.font('Helvetica-Bold').fontSize(16).fillColor(C.white)
   .text('Matheus Soares', btx, y + 20, { width: btw });
doc.font('Helvetica').fontSize(9).fillColor(C.blue)
   .text('@omatheus.ai · IA e Criação de Conteúdo', btx, y + 40, { width: btw });
doc.font('Helvetica').fontSize(9).fillColor(C.slate300)
   .text('Nordestino, autodidata em tecnologia. Ensino a usar IA para criar conteúdo que gera autoridade e clientes — sem precisar pagar anúncio.', btx, y + 56, { width: btw, lineGap: 2 });
doc.font('Helvetica').fontSize(8).fillColor(C.slate400)
   .text('DESTRAVE ACADEMY LTDA · Embu-Guaçu/SP', btx, y + 100, { width: btw });
y += 130 + 16;

// Prova social
doc.font('Helvetica-Bold').fontSize(10).fillColor(C.white)
   .text('Resultados Comprovados', MARGIN, y);
y += 14;

const provas = [
  { numero: '+50M', label: 'Visualizações Orgânicas' },
  { numero: '424k', label: 'Seguidores Instagram' },
  { numero: '32k',  label: 'Inscritos YouTube' },
  { numero: '0',    label: 'Investido em Anúncios' },
];

const pvW = (CW - 9) / 4;
provas.forEach((p, i) => {
  const px2 = MARGIN + i * (pvW + 3);
  drawCard(doc, px2, y, pvW, 56, { bg: C.card, border: i === 3 ? C.green + '55' : C.border });
  doc.font('Helvetica-Bold').fontSize(16).fillColor(i === 3 ? C.green : C.blue)
     .text(p.numero, px2, y + 10, { width: pvW, align: 'center' });
  doc.font('Helvetica').fontSize(7.5).fillColor(C.slate400)
     .text(p.label, px2, y + 32, { width: pvW, align: 'center' });
});
y += 56 + 20;

// Escada de produtos
doc.font('Helvetica-Bold').fontSize(10).fillColor(C.white)
   .text('Escada de Produtos', MARGIN, y);
y += 14;

const produtos = [
  { nome: 'Mapa da Viralização',  preco: 'R$97',         cta: 'MAPA',         desc: 'Método base: 4 módulos + Template Notion' },
  { nome: 'Diagnóstico de Perfil', preco: 'R$47 / R$297', cta: 'DIAGNÓSTICO',  desc: 'PDF completo + opção de 2 encontros ao vivo' },
  { nome: 'Chave AI',              preco: 'R$297–R$497',   cta: 'CHAVE',        desc: 'Curso completo + Escritório de IA (SaaS)' },
  { nome: 'Mentoria MCM',          preco: 'R$3k–R$5k',    cta: 'Aplicar',      desc: '8 semanas Matheus + Catia — Brasil/Portugal' },
];

produtos.forEach((p, i) => {
  y = checkY(doc, y, 38);
  const ch = 34;
  const progPct = (i + 1) / produtos.length;
  drawCard(doc, MARGIN, y, CW, ch, { bg: C.card, border: C.border });
  // degrau visual
  doc.roundedRect(MARGIN + 2, y + 2, CW * 0.015 * (i + 1) * 2.5, ch - 4, 3).fill(C.blue + '44');
  doc.font('Helvetica-Bold').fontSize(9.5).fillColor(C.white)
     .text(p.nome, MARGIN + 12, y + 5, { lineBreak: false, continued: true })
     .font('Helvetica').fontSize(8.5).fillColor(C.slate400)
     .text('  ·  ' + p.desc);
  doc.font('Helvetica-Bold').fontSize(10).fillColor(C.blue)
     .text(p.preco, MARGIN + CW - 110, y + 5, { lineBreak: false });
  badge(doc, MARGIN + CW - 60, y + 10, p.cta, C.green);
  y += ch + 4;
});

// rodapé
y = checkY(doc, y, 60);
y = PAGE_HEIGHT - 50;
divider(doc, y, C.slate600);
y += 10;
doc.font('Helvetica').fontSize(8).fillColor(C.slate500)
   .text('Diagnóstico de Perfil com IA — @omatheus.ai — 19 de março de 2026 — v3.0', MARGIN, y, { width: CW, align: 'center' });
doc.font('Helvetica').fontSize(7.5).fillColor(C.slate600)
   .text('Este documento é confidencial e destinado exclusivamente ao cliente solicitante.', MARGIN, y + 12, { width: CW, align: 'center' });

// ─────────────────────────────────────────────
// FINALIZAR
// ─────────────────────────────────────────────
doc.end();
stream.on('finish', () => {
  const stats = fs.statSync(OUTPUT);
  const kb = (stats.size / 1024).toFixed(1);
  console.log(`\nPDF gerado com sucesso!`);
  console.log(`Arquivo: ${OUTPUT}`);
  console.log(`Tamanho: ${kb} KB`);
  console.log(`Páginas: 13`);
});
stream.on('error', (err) => {
  console.error('Erro ao gerar PDF:', err);
  process.exit(1);
});

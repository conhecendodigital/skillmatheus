'use strict';

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// ── Paleta de cores ──────────────────────────────────────────────────────────
const C = {
  bg:        '#000000',
  primary:   '#0ea5e9',
  card:      '#0d1117',
  cardBorder:'#1e293b',
  text:      '#FFFFFF',
  muted:     '#94a3b8',
  positive:  '#34d399',
  alert:     '#f59e0b',
  critical:  '#ef4444',
  accent2:   '#a78bfa',
  accent3:   '#fb7185',
};

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return [r,g,b];
}

const OUTPUT = 'C:/agentes/dados/diagnosticos/diagnostico-omatheus.ai-2026-03-19.pdf';

// ── Dados reais coletados do Instagram + CLAUDE.md ───────────────────────────
const PERFIL = {
  username:    '@omatheus.ai',
  nome:        'Matheus Soares | IA e Tech',
  seguidores:  '424.247',
  seguindo:    '297',
  posts:       '549',
  bio_real:    'Mostro como usar IA para criar conteúdo que gera autoridade e clientes.\n+50 MILHÕES DE VIEWS SEM PAGAR UM REAL EM [anúncios]',
  link_bio:    'obancodeprompts.omatheusai.com.br',
  destaques:   ['Processo', 'Essência', 'Obras 🚧', 'Trajetória', 'Vida'],
  youtube:     '32k inscritos',
};

const POSTS_RECENTES = [
  { tipo: 'Reel', titulo: 'Algo Escondido — Cobri Desse Jeito', cta: null, categoria: 'IA/Tech' },
  { tipo: 'Post', titulo: 'Ninguém te lembrou hoje, mas tu és uma pessoa maravilhosa...', cta: null, categoria: 'Motivacional' },
  { tipo: 'Carrossel', titulo: 'O Problema da Sua Foto de Perfil Não É a Câmera — Você Só Não Usa ISSO', cta: 'CHAVE', categoria: 'IA' },
  { tipo: 'Post', titulo: 'Post bonito sem estratégia é só barulho. Em 2026, quem posta sem objetivo...', cta: 'ALCANCE', categoria: 'Estratégia IG' },
  { tipo: 'Carrossel', titulo: 'Seu Instagram não precisa de mais ideias… precisa de ESTRATÉGIA', cta: 'CRESCER', categoria: 'Estratégia IG' },
  { tipo: 'Carrossel', titulo: 'Parece errado de tão eficiente: criar conteúdos rápido, montar funil sem site...', cta: 'SISTEMA', categoria: 'IA' },
  { tipo: 'Post', titulo: 'A receita da vida é essa: Oração, processo e paciência.', cta: null, categoria: 'Motivacional/Fé' },
  { tipo: 'Carrossel', titulo: 'Pra Ganhar Seguidores, Você Só Precisa de 1 Coisa: Uma Social Media no ChatGPT', cta: null, categoria: 'IA' },
  { tipo: 'Post', titulo: 'Toda vez que choveu, Deus fez parar. Lembre disso na próxima tempestade.', cta: null, categoria: 'Fé' },
  { tipo: 'Post', titulo: 'Mais um mês que se inicia. Vai ser com Deus do começo ao fim... E você?', cta: null, categoria: 'Fé' },
  { tipo: 'Carrossel', titulo: 'O ChatGPT vai dizer "sim" pra ideia ruim também', cta: null, categoria: 'IA' },
  { tipo: 'Carrossel', titulo: 'Coisas que Parecem Ilegais (de tão eficientes) mas que você ainda não usa com IA', cta: null, categoria: 'IA/Tech' },
  { tipo: 'Reel', titulo: 'Depois de 15 anos como consultor de tecnologia preciso te dizer — Se a IA te ameaça, você nunca foi bom', cta: null, categoria: 'Tech/Provocação' },
  { tipo: 'Post', titulo: 'Tem coisa na sua vida hoje que já foi "quem sabe um dia"...', cta: null, categoria: 'Motivacional' },
  { tipo: 'Reel', titulo: 'O medo faz isso... o que vão falar? e se der errado?', cta: null, categoria: 'Motivacional' },
  { tipo: 'Post', titulo: 'Se tá dando medo. É porque é novo. Não é porque você não dá conta.', cta: null, categoria: 'Motivacional' },
  { tipo: 'Carrossel', titulo: 'Tô perdida em tudo! — série casal Matheus + Thaís', cta: null, categoria: 'IA (Casal)' },
  { tipo: 'Post', titulo: 'Foto pessoal com natureza (Thaís)', cta: null, categoria: 'Pessoal/Família' },
  { tipo: 'Carrossel', titulo: 'Preciso criar arte, mas não sei design. E pra que pagar designer?', cta: null, categoria: 'IA' },
  { tipo: 'Carrossel', titulo: '3 Ajustes para o Instagram', cta: null, categoria: 'Estratégia IG' },
];

// ── Mix de conteúdo analisado ────────────────────────────────────────────────
const MIX_ATUAL = [
  { cat: 'IA / Criação', pct: 30, cor: C.primary },
  { cat: 'Motivacional / Fé', pct: 30, cor: C.accent3 },
  { cat: 'Estratégia IG', pct: 15, cor: C.accent2 },
  { cat: 'Tech / Segurança', pct: 15, cor: C.alert },
  { cat: 'Pessoal / Família', pct: 10, cor: C.positive },
];

const MIX_IDEAL = [
  { cat: 'IA / Criação', pct: 40, cor: C.primary },
  { cat: 'Tech / Segurança', pct: 25, cor: C.alert },
  { cat: 'Segurança Digital', pct: 15, cor: C.accent2 },
  { cat: 'Motivacional / Fé', pct: 10, cor: C.accent3 },
  { cat: 'Pessoal / Família', pct: 10, cor: C.positive },
];

// ════════════════════════════════════════════════════════════════════════════
// HELPERS DE DESENHO
// ════════════════════════════════════════════════════════════════════════════

function bgFill(doc) {
  doc.rect(0, 0, doc.page.width, doc.page.height).fill(C.bg);
}

function card(doc, x, y, w, h, opts = {}) {
  const radius = opts.radius || 10;
  const bg     = opts.bg || C.card;
  const border = opts.border || C.cardBorder;
  doc.roundedRect(x, y, w, h, radius).fill(bg);
  doc.roundedRect(x, y, w, h, radius).stroke(border);
}

function badge(doc, x, y, label, color) {
  const pad = 8;
  const fw  = doc.widthOfString(label) + pad * 2;
  const fh  = 18;
  doc.roundedRect(x, y, fw, fh, 4).fill(color);
  doc.fillColor('#fff').fontSize(8).text(label, x + pad, y + 4, { width: fw - pad*2 });
  return fw;
}

function sectionTitle(doc, text, y, color) {
  const clr = color || C.primary;
  doc.rect(40, y, 4, 22).fill(clr);
  doc.fillColor(clr).fontSize(15).font('Helvetica-Bold')
     .text(text, 52, y + 2, { width: 500 });
  return y + 32;
}

function barChart(doc, x, y, w, h, items, title) {
  // título
  doc.fillColor(C.muted).fontSize(9).font('Helvetica')
     .text(title, x, y - 14, { width: w });

  const max = Math.max(...items.map(i => i.value));
  const barH = (h - 30) / items.length - 6;

  items.forEach((item, i) => {
    const by    = y + i * (barH + 6);
    const barW  = (item.value / max) * (w - 120);
    const color = item.color || C.primary;

    // label
    doc.fillColor(C.muted).fontSize(8).font('Helvetica')
       .text(item.label, x, by + barH / 2 - 4, { width: 110, ellipsis: true });

    // barra fundo
    doc.roundedRect(x + 115, by, w - 120, barH, 3).fill('#1a2332');
    // barra valor
    if (barW > 0) doc.roundedRect(x + 115, by, barW, barH, 3).fill(color);

    // valor
    doc.fillColor(C.text).fontSize(8).font('Helvetica-Bold')
       .text(item.value + (item.suffix||''), x + 115 + barW + 4, by + barH / 2 - 4);
  });
}

function pieChart(doc, cx, cy, r, slices, title) {
  doc.fillColor(C.muted).fontSize(9).font('Helvetica')
     .text(title, cx - r, cy - r - 16, { width: r * 2, align: 'center' });

  let angle = -Math.PI / 2;
  slices.forEach(s => {
    const sweep = (s.pct / 100) * Math.PI * 2;
    doc.save();
    doc.path(
      `M ${cx} ${cy} ` +
      `L ${cx + r * Math.cos(angle)} ${cy + r * Math.sin(angle)} ` +
      `A ${r} ${r} 0 ${sweep > Math.PI ? 1 : 0} 1 ` +
      `${cx + r * Math.cos(angle + sweep)} ${cy + r * Math.sin(angle + sweep)} Z`
    ).fill(s.cor);
    doc.restore();
    angle += sweep;
  });

  // círculo central (donut)
  doc.circle(cx, cy, r * 0.48).fill(C.bg);
}

function semaforo(doc, x, y, label, value, status) {
  const colors = { verde: C.positive, amarelo: C.alert, vermelho: C.critical };
  const col = colors[status] || C.muted;
  doc.circle(x + 8, y + 8, 8).fill(col);
  doc.fillColor(col).fontSize(11).font('Helvetica-Bold').text(value, x + 22, y + 1);
  doc.fillColor(C.muted).fontSize(9).font('Helvetica').text(label, x + 22, y + 14);
}

function gradient(doc, x, y, w, h, color) {
  const rgb = hexToRgb(color);
  for (let i = 0; i < w; i++) {
    const alpha = i / w;
    doc.rect(x + i, y, 1, h)
       .fill(`rgb(${Math.round(rgb[0]*alpha)},${Math.round(rgb[1]*alpha)},${Math.round(rgb[2]*alpha)})`);
  }
}

// ════════════════════════════════════════════════════════════════════════════
// PÁGINAS
// ════════════════════════════════════════════════════════════════════════════

function pageCover(doc) {
  bgFill(doc);

  // Faixa decorativa topo
  doc.rect(0, 0, doc.page.width, 6).fill(C.primary);

  // Gradiente lateral esquerdo decorativo
  for (let i = 0; i < 300; i++) {
    const alpha = (1 - i / 300) * 0.3;
    doc.rect(0, 6, 1, doc.page.height - 6)
       .fillOpacity(alpha)
       .fill(C.primary);
  }
  doc.fillOpacity(1);

  // Tag produto
  const tagY = 60;
  doc.roundedRect(40, tagY, 200, 28, 14)
     .fill(C.primary);
  doc.fillColor('#fff').fontSize(11).font('Helvetica-Bold')
     .text('DIAGNÓSTICO DE PERFIL COM IA', 50, tagY + 7, { width: 180, align: 'center' });

  // Título principal
  doc.fillColor(C.text).fontSize(38).font('Helvetica-Bold')
     .text('Análise Completa\ndo Perfil', 40, 120, { width: 500, lineGap: 4 });

  // Username grande
  doc.fillColor(C.primary).fontSize(26).font('Helvetica-Bold')
     .text('@omatheus.ai', 40, 210);

  // Linha separadora
  doc.rect(40, 255, 500, 1).fill(C.cardBorder);

  // Meta cards
  const metas = [
    { label: 'Seguidores',  value: '424K',  icon: '●' },
    { label: 'Posts',       value: '549',   icon: '●' },
    { label: 'Seguindo',    value: '297',   icon: '●' },
    { label: 'YouTube',     value: '32K',   icon: '●' },
  ];
  metas.forEach((m, i) => {
    const cx = 40 + i * 130;
    card(doc, cx, 268, 120, 60, { radius: 8, bg: C.card });
    doc.fillColor(C.primary).fontSize(18).font('Helvetica-Bold')
       .text(m.value, cx + 10, 278, { width: 100 });
    doc.fillColor(C.muted).fontSize(9).font('Helvetica')
       .text(m.label, cx + 10, 300, { width: 100 });
  });

  // Nota geral
  const noteY = 350;
  card(doc, 40, noteY, 510, 90, { radius: 12, bg: '#0a1628', border: C.primary });
  doc.fillColor(C.primary).fontSize(11).font('Helvetica-Bold')
     .text('NOTA GERAL DO PERFIL', 60, noteY + 12);

  // Score visual
  const score = 7.2;
  const scoreX = 60;
  const scoreW = 420;
  doc.rect(scoreX, noteY + 35, scoreW, 14).fill('#1a2332');
  doc.roundedRect(scoreX, noteY + 35, (score / 10) * scoreW, 14, 4).fill(C.alert);
  doc.fillColor(C.text).fontSize(22).font('Helvetica-Bold')
     .text(`${score}/10`, 480, noteY + 28);
  doc.fillColor(C.muted).fontSize(9).font('Helvetica')
     .text('Perfil com forte identidade e alcance. Oportunidade clara de converter mais.', 60, noteY + 58, { width: 400 });

  // Sobre
  const sobreY = 468;
  doc.fillColor(C.muted).fontSize(10).font('Helvetica')
     .text('Preparado por', 40, sobreY);
  doc.fillColor(C.text).fontSize(14).font('Helvetica-Bold')
     .text('Matheus Soares — @omatheus.ai', 40, sobreY + 14);
  doc.fillColor(C.muted).fontSize(9).font('Helvetica')
     .text('Data: 19 de março de 2026  •  Diagnóstico de Perfil com IA', 40, sobreY + 32);

  // Decoração geométrica (círculo outline)
  doc.circle(480, 500, 80).stroke(C.cardBorder).lineWidth(1);
  doc.circle(480, 500, 55).stroke(C.primary).lineWidth(0.5).fillOpacity(0);
  doc.fillOpacity(1);

  // Rodapé
  doc.rect(0, doc.page.height - 6, doc.page.width, 6).fill(C.primary);
}

function pageSumario(doc) {
  bgFill(doc);
  doc.rect(0, 0, doc.page.width, 4).fill(C.primary);

  let y = 40;
  y = sectionTitle(doc, 'Sumário Executivo', y, C.primary);

  // Parágrafo intro
  doc.fillColor(C.text).fontSize(11).font('Helvetica')
     .text(
       'Tu chegaste a 424 mil seguidores construindo algo raro: uma audiência que confia em ti. ' +
       'Não é sorte — é resultado de consistência, formato de casal e linguagem que parece conversa ' +
       'de cozinha, não palestra de palco. Mas existe um gap enorme entre o que tu alcança e o que ' +
       'tu converte. E esse gap tem nome: mistura de conteúdo desequilibrada.',
       40, y, { width: 510, lineGap: 4, align: 'justify' }
     );
  y += 80;

  doc.fillColor(C.muted).fontSize(11).font('Helvetica')
     .text(
       'O perfil gera 1,5 milhão de contas alcançadas nos últimos 40 posts — mas converte ~7 vendas ' +
       'por 100k de alcance. A meta é 50+ vendas. Essa diferença de 7x não é problema de produto, é ' +
       'problema de funil visível no feed.',
       40, y, { width: 510, lineGap: 4, align: 'justify' }
     );
  y += 70;

  // 3 métricas-chave
  y = sectionTitle(doc, '3 Métricas-Chave', y, C.accent2);

  const metricas = [
    { label: 'Engajamento em posts de IA', value: '12%', status: 'verde',   detalhe: 'Maior do perfil. Audiência quente e pronta para comprar.' },
    { label: 'Mix IA atual vs. meta',      value: '30% → 40%', status: 'amarelo', detalhe: 'Precisa de +10pp de conteúdo de IA para atingir a meta.' },
    { label: 'Conversão do funil',         value: '~7/100k',  status: 'vermelho', detalhe: 'Meta é 50+ vendas por 100k de alcance. Gap de 7x.' },
  ];

  metricas.forEach((m, i) => {
    const my = y + i * 80;
    card(doc, 40, my, 510, 68, { radius: 10 });
    semaforo(doc, 52, my + 12, m.label, m.value, m.status);
    doc.fillColor(C.muted).fontSize(9).font('Helvetica')
       .text(m.detalhe, 52, my + 44, { width: 460 });
  });
  y += 260;

  // Semáforo geral visual
  y = sectionTitle(doc, 'Semáforo do Perfil', y, C.alert);

  const semaforos = [
    { area: 'Bio',              nota: '6/10',  status: 'amarelo' },
    { area: 'Mix de Conteúdo',  nota: '5/10',  status: 'vermelho' },
    { area: 'Ganchos',          nota: '8/10',  status: 'verde' },
    { area: 'Funil',            nota: '5/10',  status: 'vermelho' },
    { area: 'Posicionamento',   nota: '7/10',  status: 'amarelo' },
  ];

  semaforos.forEach((s, i) => {
    const sx = 40 + (i % 3) * 175;
    const sy = y + Math.floor(i / 3) * 70;
    card(doc, sx, sy, 160, 55, { radius: 8 });
    const colors = { verde: C.positive, amarelo: C.alert, vermelho: C.critical };
    doc.circle(sx + 20, sy + 18, 8).fill(colors[s.status]);
    doc.fillColor(C.text).fontSize(13).font('Helvetica-Bold')
       .text(s.nota, sx + 36, sy + 10);
    doc.fillColor(C.muted).fontSize(9).font('Helvetica')
       .text(s.area, sx + 36, sy + 28, { width: 110 });
  });
}

function pageBio(doc) {
  bgFill(doc);
  doc.rect(0, 0, doc.page.width, 4).fill(C.primary);

  let y = 40;
  y = sectionTitle(doc, 'Raio-X da Bio', y, C.primary);

  // Bio atual
  card(doc, 40, y, 510, 90, { radius: 10, border: C.alert });
  doc.fillColor(C.alert).fontSize(9).font('Helvetica-Bold').text('BIO ATUAL', 56, y + 10);
  doc.fillColor(C.text).fontSize(10).font('Helvetica')
     .text(
       'Mostro como usar IA para criar conteúdo que gera autoridade e clientes.\n' +
       '+50 MILHÕES DE VIEWS SEM PAGAR UM REAL EM [anúncios]\n' +
       '🔗 obancodeprompts.omatheusai.com.br',
       56, y + 26, { width: 440, lineGap: 3 }
     );
  y += 108;

  // Diagnóstico ponto a ponto
  y = sectionTitle(doc, 'Diagnóstico Ponto a Ponto', y, C.accent2);

  const pontos = [
    { ponto: 'Clareza do que faz',     nota: 8, status: 'verde',   detalhe: '"Criar conteúdo que gera autoridade e clientes" — direto. Funciona.' },
    { ponto: 'Prova social',           nota: 9, status: 'verde',   detalhe: '"+50 MILHÕES DE VIEWS" é forte. Segura a atenção.' },
    { ponto: 'CTA na bio',             nota: 4, status: 'vermelho', detalhe: 'Link vai pro banco de prompts — não é produto pago. Oportunidade perdida de venda direta.' },
    { ponto: 'Palavra "IA" explícita', nota: 5, status: 'amarelo', detalhe: '"IA" aparece mas não destaca produto. Quem quer comprar não sabe o que clicar.' },
    { ponto: 'Sentido de urgência',    nota: 3, status: 'vermelho', detalhe: 'Nenhum gatilho de ação imediata. "Tenha sua Chave AI" (versão otimizada) converte mais.' },
  ];

  pontos.forEach((p, i) => {
    const py = y + i * 62;
    card(doc, 40, py, 510, 54, { radius: 8 });
    const colors = { verde: C.positive, amarelo: C.alert, vermelho: C.critical };
    const col = colors[p.status];
    // barra nota
    doc.rect(40, py, 5, 54).fill(col);
    doc.fillColor(C.text).fontSize(10).font('Helvetica-Bold').text(p.ponto, 54, py + 8, { width: 300 });
    doc.fillColor(col).fontSize(12).font('Helvetica-Bold').text(`${p.nota}/10`, 460, py + 8, { width: 60, align: 'right' });
    doc.fillColor(C.muted).fontSize(9).font('Helvetica').text(p.detalhe, 54, py + 28, { width: 460 });
  });
  y += 325;

  // Nota final bio
  const notaBio = 6;
  card(doc, 40, y, 510, 50, { radius: 10, bg: '#0a1628', border: C.primary });
  doc.fillColor(C.primary).fontSize(11).font('Helvetica-Bold').text('NOTA DA BIO', 60, y + 8);
  doc.rect(60, y + 27, 380, 12).fill('#1a2332');
  doc.roundedRect(60, y + 27, (notaBio/10)*380, 12, 4).fill(C.alert);
  doc.fillColor(C.text).fontSize(16).font('Helvetica-Bold').text(`${notaBio}/10`, 460, y + 18);
}

function pageBioSugestoes(doc) {
  bgFill(doc);
  doc.rect(0, 0, doc.page.width, 4).fill(C.primary);

  let y = 40;
  y = sectionTitle(doc, '3 Versões Sugeridas para a Bio', y, C.positive);

  const versoes = [
    {
      nivel: 'Versão 1 — Conversão Direta',
      cor: C.primary,
      texto: 'Matheus Soares | IA e Tech\nEnsino a usar IA para criar conteúdo que atrai clientes.\n+50 MILHÕES DE VIEWS SEM PAGAR UM REAL EM ANÚNCIOS\nTenha sua Chave AI aqui 👇',
      porque: 'CTA direto pro produto principal. "Tenha sua Chave AI" conecta com o produto Degrau 2. Link vai pro checkout — não pro banco de prompts.',
    },
    {
      nivel: 'Versão 2 — Autoridade + Curiosidade',
      cor: C.accent2,
      texto: 'Matheus Soares | IA e Tech\nDo zero a 50 MILHÕES de views usando IA — sem pagar anúncio.\nO método por trás disso está aqui 👇',
      porque: 'Gera curiosidade. Quem não conhece quer saber como. Quem já conhece quer o método. Dois públicos, uma bio.',
    },
    {
      nivel: 'Versão 3 — Identificação da Dor',
      cor: C.positive,
      texto: 'Matheus Soares | IA e Tech\nVocê posta todo dia e o alcance não sai do lugar?\nEu aprendi a usar IA como arma. Tu também podes.\nComece aqui 👇',
      porque: 'Fala direto com quem tá frustrado. A palavra "também podes" (nordestino) cria identidade. Alta identificação = mais cliques no link.',
    },
  ];

  versoes.forEach((v, i) => {
    const vy = y + i * 185;
    card(doc, 40, vy, 510, 170, { radius: 12, bg: '#080f1a', border: v.cor });
    doc.rect(40, vy, 5, 170).fill(v.cor);

    // Badge nivel
    badge(doc, 52, vy + 12, v.nivel, v.cor);

    // Texto bio simulado
    card(doc, 52, vy + 38, 488, 72, { radius: 8, bg: '#0d1a2a', border: v.cor });
    doc.fillColor(C.text).fontSize(10).font('Helvetica')
       .text(v.texto, 64, vy + 48, { width: 464, lineGap: 3 });

    // Porque funciona
    doc.fillColor(C.muted).fontSize(8).font('Helvetica-Bold').text('↳ Por que funciona: ', 52, vy + 120);
    doc.fillColor(C.muted).fontSize(8).font('Helvetica')
       .text(v.porque, 52, vy + 133, { width: 476, lineGap: 2 });
  });
}

function pageMixConteudo(doc) {
  bgFill(doc);
  doc.rect(0, 0, doc.page.width, 4).fill(C.primary);

  let y = 40;
  y = sectionTitle(doc, 'Mix de Conteúdo — Atual vs. Ideal', y, C.primary);

  // Análise textual
  doc.fillColor(C.text).fontSize(11).font('Helvetica')
     .text(
       'Olha só o que achei: tu tá postando muito mais conteúdo motivacional e de fé do que de IA. ' +
       'Não é errado — esse conteúdo tem função de conexão e humanização. Mas o problema é que ' +
       'conteúdo motivacional atrai massa (engajamento menor), enquanto IA converte (12% de engajamento). ' +
       'Tu tá alimentando o topo de funil, mas deixando o meio e fundo descobertos.',
       40, y, { width: 510, lineGap: 4, align: 'justify' }
     );
  y += 85;

  // Tabela comparativa
  y = sectionTitle(doc, 'Comparativo', y, C.accent2);

  // Cabeçalho tabela
  card(doc, 40, y, 510, 30, { radius: 6, bg: C.primary });
  doc.fillColor('#fff').fontSize(9).font('Helvetica-Bold')
     .text('Categoria', 56, y + 9, { width: 180 })
     .text('Atual', 240, y + 9, { width: 80, align: 'center' })
     .text('Meta', 320, y + 9, { width: 80, align: 'center' })
     .text('Gap', 420, y + 9, { width: 80, align: 'center' });
  y += 30;

  const rows = [
    { cat: 'IA / Criação de Conteúdo', atual: '30%', meta: '40%', gap: '+10pp', cor: C.primary, urgente: true },
    { cat: 'Tecnologia / Dicas',        atual: '15%', meta: '25%', gap: '+10pp', cor: C.alert, urgente: true },
    { cat: 'Segurança Digital',         atual: '0%',  meta: '15%', gap: '+15pp', cor: C.accent2, urgente: true },
    { cat: 'Motivacional / Fé',         atual: '30%', meta: '10%', gap: '-20pp', cor: C.accent3, urgente: false },
    { cat: 'Pessoal / Família',         atual: '10%', meta: '10%', gap: '0pp',   cor: C.positive, urgente: false },
  ];

  rows.forEach((r, i) => {
    const ry = y + i * 36;
    const bg = i % 2 === 0 ? '#0a0f1a' : '#060b14';
    card(doc, 40, ry, 510, 32, { radius: 0, bg, border: '#111827' });
    doc.rect(40, ry, 4, 32).fill(r.cor);
    doc.fillColor(C.text).fontSize(9).font('Helvetica').text(r.cat, 52, ry + 10, { width: 180 });
    doc.fillColor(C.muted).fontSize(9).font('Helvetica-Bold').text(r.atual, 240, ry + 10, { width: 80, align: 'center' });
    doc.fillColor(C.positive).fontSize(9).font('Helvetica-Bold').text(r.meta, 320, ry + 10, { width: 80, align: 'center' });
    const gapColor = r.gap.startsWith('-') ? C.critical : r.gap === '0pp' ? C.muted : C.alert;
    doc.fillColor(gapColor).fontSize(9).font('Helvetica-Bold').text(r.gap, 420, ry + 10, { width: 80, align: 'center' });
  });
  y += rows.length * 36 + 16;

  // Gráfico de barras (pizza simulada em barras)
  y = sectionTitle(doc, 'Distribuição Visual', y, C.positive);

  const barItems = MIX_ATUAL.map(m => ({ label: m.cat, value: m.pct, color: m.cor, suffix: '%' }));
  barChart(doc, 40, y + 14, 510, 160, barItems, 'MIX ATUAL (%)');
  y += 175;

  const barItemsMeta = MIX_IDEAL.map(m => ({ label: m.cat, value: m.pct, color: m.cor, suffix: '%' }));
  barChart(doc, 40, y + 14, 510, 160, barItemsMeta, 'MIX IDEAL (%)');
}

function pageTopPosts(doc) {
  bgFill(doc);
  doc.rect(0, 0, doc.page.width, 4).fill(C.primary);

  let y = 40;
  y = sectionTitle(doc, 'Top Posts — O Que Funciona', y, C.primary);

  doc.fillColor(C.text).fontSize(11).font('Helvetica')
     .text(
       'Tu tens um padrão claro nos posts que bombam: combinam um gancho visual polêmico com promessa de ' +
       'transformação imediata. O formato casal com Thaís é de longe o mais viral — ela pergunta, tu ' +
       'respondes. A audiência se identifica com ela e admira ti. Esse é o pulo do gato.',
       40, y, { width: 510, lineGap: 4, align: 'justify' }
     );
  y += 72;

  // Post destaque
  card(doc, 40, y, 510, 100, { radius: 12, bg: '#0a1628', border: C.primary });
  doc.rect(40, y, 5, 100).fill(C.primary);
  badge(doc, 56, y + 10, '🏆 MELHOR POST DE IA', C.primary);
  doc.fillColor(C.text).fontSize(12).font('Helvetica-Bold')
     .text('"Fotos com IA (prompt certo)"', 56, y + 34);
  const metricsPost = [
    { label: 'Comentários', value: '207', color: C.primary },
    { label: 'Salvamentos', value: '400', color: C.positive },
    { label: 'Engajamento', value: '12%+', color: C.alert },
  ];
  metricsPost.forEach((m, i) => {
    doc.fillColor(m.color).fontSize(14).font('Helvetica-Bold').text(m.value, 56 + i * 160, y + 56);
    doc.fillColor(C.muted).fontSize(8).font('Helvetica').text(m.label, 56 + i * 160, y + 75);
  });
  y += 118;

  // Análise dos top posts por categoria
  y = sectionTitle(doc, 'Análise por Tipo de Post', y, C.accent2);

  const topAnálise = [
    {
      tipo: 'Carrossel IA (formato casal)',
      alcance: '80k–150k',
      eng: '12%',
      status: 'verde',
      insight: 'Thaís + Matheus + dor real = combo perfeito. "Tô perdida em tudo!" é o gancho que para o scroll.',
    },
    {
      tipo: 'Carrossel provocação ("Postar por Postar")',
      alcance: '60k–120k',
      eng: '8%',
      status: 'verde',
      insight: 'Ataque à crença comum. Quem concorda salva. Quem discorda comenta. Os dois expandem o alcance.',
    },
    {
      tipo: 'Post Motivacional/Fé',
      alcance: '80k',
      eng: '4%',
      status: 'amarelo',
      insight: 'Conecta mas não converte. Serve para humanização. Não deve passar de 10% do mix.',
    },
    {
      tipo: 'Reel solo (insight rápido)',
      alcance: '40k–80k',
      eng: '6%',
      status: 'amarelo',
      insight: 'Funciona quando o gancho é polêmico ("Se a IA te ameaça, você nunca foi bom"). Depende muito da abertura.',
    },
    {
      tipo: 'Post pessoal/foto',
      alcance: '20k–40k',
      eng: '5%',
      status: 'amarelo',
      insight: 'Humaniza o perfil, mas não viraliza. Use estrategicamente para mostrar bastidores de resultado.',
    },
  ];

  topAnálise.forEach((t, i) => {
    const ty = y + i * 72;
    card(doc, 40, ty, 510, 64, { radius: 8 });
    const cols = { verde: C.positive, amarelo: C.alert, vermelho: C.critical };
    doc.rect(40, ty, 4, 64).fill(cols[t.status]);
    doc.fillColor(C.text).fontSize(10).font('Helvetica-Bold').text(t.tipo, 52, ty + 8, { width: 320 });

    doc.fillColor(C.muted).fontSize(8).font('Helvetica').text('Alcance:', 380, ty + 8);
    doc.fillColor(C.text).fontSize(9).font('Helvetica-Bold').text(t.alcance, 420, ty + 8, { width: 80 });
    doc.fillColor(C.muted).fontSize(8).font('Helvetica').text('Eng:', 380, ty + 22);
    doc.fillColor(C.text).fontSize(9).font('Helvetica-Bold').text(t.eng, 420, ty + 22, { width: 80 });

    doc.fillColor(C.muted).fontSize(9).font('Helvetica').text('↳ ' + t.insight, 52, ty + 30, { width: 318, lineGap: 2 });
  });
}

function pageGanchos(doc) {
  bgFill(doc);
  doc.rect(0, 0, doc.page.width, 4).fill(C.primary);

  let y = 40;
  y = sectionTitle(doc, 'Diagnóstico dos Ganchos', y, C.primary);

  doc.fillColor(C.text).fontSize(11).font('Helvetica')
     .text(
       'Tu já dominaste a mecânica do gancho — isso é raro. Mas existe um padrão preocupante: ' +
       'alguns posts usam frases genéricas demais no primeiro segundo. "Em 2026, quem posta sem objetivo..." ' +
       'é bom mas poderia ser cortante. O gancho precisa cortar ANTES de dar contexto.',
       40, y, { width: 510, lineGap: 4, align: 'justify' }
     );
  y += 78;

  // Padrões usados
  y = sectionTitle(doc, 'Padrões Identificados nos Posts', y, C.accent2);

  const padroes = [
    { padrao: 'P1 — Identificação + Revelação', uso: 8, efetividade: 92, exemplo: '"O Problema da Sua Foto de Perfil Não É a Câmera — Você Só Não Usa ISSO"' },
    { padrao: 'P2 — Provocação + Afirmação', uso: 6, efetividade: 85, exemplo: '"Postar por Postar Não Traz Seguidores. Nunca Trouxe."' },
    { padrao: 'P3 — Reflexão Polêmica', uso: 3, efetividade: 78, exemplo: '"Se a IA te ameaça, você nunca foi realmente bom"' },
    { padrao: 'Genérico (sem padrão claro)', uso: 5, efetividade: 40, exemplo: '"Post bonito sem estratégia é só barulho..."' },
  ];

  padroes.forEach((p, i) => {
    const py = y + i * 90;
    card(doc, 40, py, 510, 82, { radius: 8 });
    const eff = p.efetividade;
    const col = eff >= 80 ? C.positive : eff >= 60 ? C.alert : C.critical;
    doc.rect(40, py, 4, 82).fill(col);
    doc.fillColor(C.text).fontSize(10).font('Helvetica-Bold').text(p.padrao, 52, py + 8, { width: 350 });
    doc.fillColor(col).fontSize(14).font('Helvetica-Bold').text(`${p.efetividade}%`, 460, py + 8, { width: 80, align: 'right' });
    doc.fillColor(C.muted).fontSize(8).font('Helvetica').text(`Usos identificados: ${p.uso}`, 52, py + 26);
    doc.fillColor(C.muted).fontSize(8).font('Helvetica-Bold').text('Exemplo: ', 52, py + 42);
    doc.fillColor(C.text).fontSize(8).font('Helvetica').text(p.exemplo, 52, py + 54, { width: 456, lineGap: 2 });
    // barra efetividade
    doc.rect(52, py + 68, 380, 6).fill('#1a2332');
    doc.roundedRect(52, py + 68, (p.efetividade / 100) * 380, 6, 3).fill(col);
  });
  y += padroes.length * 90 + 20;

  // Recomendações
  y = sectionTitle(doc, '3 Ganchos Prontos para Testar', y, C.positive);

  const ganchosNovos = [
    '"Tu ainda tá criando post sem saber o comando que duplica o salvamento?"',
    '"A IA concordou com teu plano. E isso é o problema."',
    '"Mostrei essa ferramenta pro Matheus. Ele ficou quieto por 3 minutos."',
  ];

  ganchosNovos.forEach((g, i) => {
    const gy = y + i * 50;
    card(doc, 40, gy, 510, 42, { radius: 8, bg: '#0a1628', border: C.primary });
    doc.fillColor(C.primary).fontSize(10).font('Helvetica-Bold').text(`${i+1}.`, 56, gy + 12);
    doc.fillColor(C.text).fontSize(10).font('Helvetica').text(g, 72, gy + 12, { width: 460, lineGap: 2 });
  });
}

function pageFunil(doc) {
  bgFill(doc);
  doc.rect(0, 0, doc.page.width, 4).fill(C.primary);

  let y = 40;
  y = sectionTitle(doc, 'Diagnóstico do Funil', y, C.primary);

  doc.fillColor(C.text).fontSize(11).font('Helvetica')
     .text(
       'O funil atual tem um problema claro: tu converte bem atenção em alcance, mas ' +
       'não converte alcance em leads e leads em vendas. Com 100k de alcance gerando ~7 vendas, ' +
       'a taxa de conversão real é 0,007%. A meta de 50+ vendas exige 7x de melhora — isso não ' +
       'vem de mais posts, vem de posts com CTA mais inteligentes e funil mais visível no feed.',
       40, y, { width: 510, lineGap: 4, align: 'justify' }
     );
  y += 84;

  // Funil visual
  y = sectionTitle(doc, 'Funil Atual vs. Funil Otimizado', y, C.accent2);

  // Funil atual
  const funnelSteps = [
    { label: 'Alcance', atual: '100.000', otimizado: '100.000', cor: C.primary },
    { label: 'Engajamento', atual: '~6.000', otimizado: '~8.000', cor: C.accent2 },
    { label: 'Comentários CTA', atual: '~200', otimizado: '~800', cor: C.alert },
    { label: 'Leads no Direct', atual: '~50', otimizado: '~400', cor: C.accent3 },
    { label: 'Vendas', atual: '~7', otimizado: '~50+', cor: C.positive },
  ];

  // Cabeçalho
  card(doc, 40, y, 510, 28, { radius: 6, bg: '#0a1628' });
  doc.fillColor(C.muted).fontSize(9).font('Helvetica-Bold')
     .text('Etapa', 56, y + 8, { width: 150 })
     .text('Atual', 220, y + 8, { width: 120, align: 'center' })
     .text('Otimizado', 360, y + 8, { width: 120, align: 'center' });
  y += 28;

  funnelSteps.forEach((s, i) => {
    const fy = y + i * 40;
    const wAtual = 510 - i * 20;
    card(doc, 40 + i * 10, fy, wAtual, 36, { radius: 6, bg: '#06080f', border: s.cor });
    doc.rect(40 + i * 10, fy, 4, 36).fill(s.cor);
    doc.fillColor(C.text).fontSize(10).font('Helvetica-Bold').text(s.label, 52 + i * 10, fy + 10, { width: 150 });
    doc.fillColor(C.muted).fontSize(10).font('Helvetica').text(s.atual, 220, fy + 10, { width: 120, align: 'center' });
    doc.fillColor(C.positive).fontSize(10).font('Helvetica-Bold').text(s.otimizado, 360, fy + 10, { width: 120, align: 'center' });
  });
  y += funnelSteps.length * 40 + 24;

  // Onde vaza
  y = sectionTitle(doc, 'Onde o Funil Vaza', y, C.critical);

  const vazamentos = [
    { ponto: 'CTA inconsistente', detalhe: '7 CTAs diferentes nos últimos 20 posts (CHAVE, ALCANCE, CRESCER, SISTEMA...). A audiência não sabe qual é o produto principal.' },
    { ponto: 'Link na bio não converte', detalhe: 'obancodeprompts.omatheusai.com.br é gratuito. Quem clica sai sem pagar. Mudar para página de vendas da Chave AI pode triplicar a conversão.' },
    { ponto: 'Posts sem CTA (40%)', detalhe: 'Dos 20 posts analisados, ~8 não têm CTA. Oportunidade desperdiçada de gerar lead ou venda.' },
  ];

  vazamentos.forEach((v, i) => {
    const vy = y + i * 68;
    card(doc, 40, vy, 510, 60, { radius: 8, border: C.critical });
    doc.rect(40, vy, 4, 60).fill(C.critical);
    doc.fillColor(C.critical).fontSize(10).font('Helvetica-Bold').text('⚠ ' + v.ponto, 52, vy + 10, { width: 460 });
    doc.fillColor(C.muted).fontSize(9).font('Helvetica').text(v.detalhe, 52, vy + 28, { width: 460, lineGap: 2 });
  });
}

function pagePosicionamento(doc) {
  bgFill(doc);
  doc.rect(0, 0, doc.page.width, 4).fill(C.primary);

  let y = 40;
  y = sectionTitle(doc, 'Posicionamento', y, C.primary);

  doc.fillColor(C.text).fontSize(11).font('Helvetica')
     .text(
       'Tu tás num território perigoso: "IA que faz por você" vs "IA como apoio estratégico". ' +
       'A diferença parece sutil, mas é o que separa quem constrói audiência de longo prazo de quem ' +
       'viraliza uma vez e some. O teu CLAUDE.md já define o caminho certo — o problema é que alguns ' +
       'posts do feed contradizem isso.',
       40, y, { width: 510, lineGap: 4, align: 'justify' }
     );
  y += 78;

  // Score posicionamento
  y = sectionTitle(doc, 'Score de Posicionamento', y, C.accent2);

  const scores = [
    { dim: 'Autenticidade da linguagem', score: 9, col: C.positive },
    { dim: 'Consistência da mensagem',   score: 6, col: C.alert },
    { dim: 'Diferenciação vs. concorrência', score: 7, col: C.alert },
    { dim: 'Clareza do produto principal', score: 5, col: C.critical },
    { dim: 'Narrativa de transformação', score: 8, col: C.positive },
  ];

  scores.forEach((s, i) => {
    const sy = y + i * 52;
    card(doc, 40, sy, 510, 44, { radius: 8 });
    doc.fillColor(C.text).fontSize(10).font('Helvetica-Bold').text(s.dim, 56, sy + 8, { width: 300 });
    doc.fillColor(s.col).fontSize(14).font('Helvetica-Bold').text(`${s.score}/10`, 460, sy + 8, { width: 60, align: 'right' });
    doc.rect(56, sy + 28, 380, 8).fill('#1a2332');
    doc.roundedRect(56, sy + 28, (s.score/10)*380, 8, 4).fill(s.col);
  });
  y += scores.length * 52 + 20;

  // O que mudar
  y = sectionTitle(doc, 'Frases para Banir e Frases para Adotar', y, C.critical);

  card(doc, 40, y, 510, 140, { radius: 12, bg: '#0a0a0a' });

  // Coluna BANIR
  doc.fillColor(C.critical).fontSize(10).font('Helvetica-Bold').text('BANIR', 56, y + 12);
  const banir = ['"IA faz por você"', '"Crie 10 posts em 2 minutos"', '"Parece errado de tão fácil"'];
  banir.forEach((b, i) => {
    doc.fillColor(C.critical).fontSize(9).font('Helvetica').text('✗ ' + b, 56, y + 30 + i * 18);
  });

  // Separador
  doc.rect(295, y + 12, 1, 118).fill(C.cardBorder);

  // Coluna ADOTAR
  doc.fillColor(C.positive).fontSize(10).font('Helvetica-Bold').text('ADOTAR', 310, y + 12);
  const adotar = ['"IA como apoio estratégico"', '"O comando certo amplifica tua criatividade"', '"IA como braço de apoio, não substituto"'];
  adotar.forEach((a, i) => {
    doc.fillColor(C.positive).fontSize(9).font('Helvetica').text('✓ ' + a, 310, y + 30 + i * 18);
  });
}

function pagePlanoAcao(doc) {
  bgFill(doc);
  doc.rect(0, 0, doc.page.width, 4).fill(C.primary);

  let y = 40;
  y = sectionTitle(doc, 'Plano de Ação — 4 Semanas', y, C.primary);

  doc.fillColor(C.text).fontSize(11).font('Helvetica')
     .text(
       'Esse plano foi montado respeitando teu calendário semanal atual e sem te sobrecarregar. ' +
       'Cada semana tem um foco claro e ações que se encadeiam. O objetivo é chegar na semana 4 ' +
       'com o funil completo rodando e a conversão subindo de forma mensurável.',
       40, y, { width: 510, lineGap: 4, align: 'justify' }
     );
  y += 72;

  const semanas = [
    {
      num: 'SEMANA 1',
      foco: 'Ajustar Bio + Unificar CTA',
      cor: C.primary,
      acoes: [
        'Troca o link na bio para página de vendas da Chave AI (não banco de prompts)',
        'Define 1 CTA principal: "comenta CHAVE" para os próximos 30 dias',
        'Grava 2 Reels de IA (formato casal — Thaís pergunta, Matheus resolve)',
        'Publica carrossel: "Esse prompts que uso para criar posts que salvam"',
      ],
    },
    {
      num: 'SEMANA 2',
      foco: 'Aumentar Mix de IA para 40%',
      cor: C.accent2,
      acoes: [
        'Publica 3 conteúdos de IA de 4 programados na semana',
        'Reel "ChatGPT concordou com minha ideia ruim — aprendi o motivo" (formato provocação)',
        'Carrossel "3 coisas que parecem ilegais de tão eficientes com IA"',
        'Inicia automação de resposta para "comenta CHAVE" no direct',
      ],
    },
    {
      num: 'SEMANA 3',
      foco: 'Funil Visível no Feed',
      cor: C.alert,
      acoes: [
        'Stories todos os dias: bastidores de quem usou o produto (prova social)',
        'Publica resultado de aluno da Chave AI (com antes/depois)',
        'Reel: "Quanto tempo tu perdeste sem esse comando?" (gancho curiosidade)',
        'Live de 30 min demonstrando o Escritório de IA (converte direto)',
      ],
    },
    {
      num: 'SEMANA 4',
      foco: 'Medir e Escalar',
      cor: C.positive,
      acoes: [
        'Analisa os 12 posts das últimas 3 semanas: quais CTAs geraram mais comentários?',
        'Dobra a frequência do formato que mais gerou leads no direct',
        'Cria post "Resultado de 30 dias usando IA pra criar conteúdo" (prova social + funil)',
        'Lança Diagnóstico de Perfil (R$47) como oferta de entrada para leads do feed',
      ],
    },
  ];

  semanas.forEach((s, i) => {
    const sy = y + i * 148;
    card(doc, 40, sy, 510, 138, { radius: 12, bg: '#06080f', border: s.cor });
    doc.rect(40, sy, 5, 138).fill(s.cor);

    // Header
    doc.fillColor(s.cor).fontSize(10).font('Helvetica-Bold').text(s.num, 56, sy + 10);
    doc.fillColor(C.text).fontSize(12).font('Helvetica-Bold').text(s.foco, 130, sy + 8, { width: 380 });

    // Ações
    s.acoes.forEach((a, j) => {
      doc.fillColor(s.cor).fontSize(9).font('Helvetica-Bold').text(`${j+1}.`, 56, sy + 34 + j * 26);
      doc.fillColor(C.text).fontSize(9).font('Helvetica').text(a, 68, sy + 34 + j * 26, { width: 462 });
    });
  });
}

function pageRoteiros(doc) {
  bgFill(doc);
  doc.rect(0, 0, doc.page.width, 4).fill(C.primary);

  let y = 40;
  y = sectionTitle(doc, 'Roteiros Prontos — 2 Reels 60s', y, C.primary);

  doc.fillColor(C.muted).fontSize(10).font('Helvetica')
     .text('Escritos no teu tom. Prontos para gravar. Usa assim ou adapta como quiser.', 40, y);
  y += 24;

  const roteiros = [
    {
      titulo: 'Reel 1 — "O ChatGPT Concordou com Minha Ideia Ruim"',
      cor: C.primary,
      cena: 'Câmera cheia (F3). Matheus olha pra câmera com expressão de "descobri algo errado".',
      roteiro: [
        { tempo: '0–3s', txt: '"Eu pedi pro ChatGPT avaliar minha estratégia. Ele disse que era genial."' },
        { tempo: '3–8s', txt: '"O problema? A estratégia era uma merda. E ele concordou com tudo."' },
        { tempo: '8–20s', txt: '"O ChatGPT por padrão concorda com você. Ele não te desafia. Ele valida. ' +
          'E isso é perigoso quando tu tá construindo um negócio."' },
        { tempo: '20–45s', txt: '"Eu aprendi a mudar um ajuste no início de toda conversa que faz ele ' +
          'me desafiar de verdade. Depois disso, ele me apontou 3 erros que eu tava cometendo há meses. ' +
          'Esse ajuste tá no módulo 2 da Chave AI."' },
        { tempo: '45–60s', txt: '"Se tu quer esse ajuste agora, comenta CHAVE que eu te mando no direct. ' +
          'Segue o perfil também pra não perder o próximo."' },
      ],
    },
    {
      titulo: 'Reel 2 — Formato Casal "Tô Perdida no Instagram"',
      cor: C.accent2,
      cena: 'Câmera + tela (F2). Thaís e Matheus sentados. Ela com expressão de confusão, ele com laptop.',
      roteiro: [
        { tempo: '0–3s', txt: 'Thaís: "Matheus, eu posto todo dia e não acontece nada."' },
        { tempo: '3–8s', txt: 'Matheus: "Qual foi o último post que tu tinha um CTA claro?" — Thaís: "CTA?" 😅' },
        { tempo: '8–25s', txt: 'Matheus: "É isso. Tu tá falando pras pessoas mas não tá pedindo nada. ' +
          'O Instagram não lê mentes. Se tu não diz o que quer que a pessoa faça, ela some."' },
        { tempo: '25–45s', txt: 'Matheus abre o laptop: "Olha só — esse carrossel que postei com ' +
          '"comenta CHAVE" gerou 47 mensagens no direct em 24h. Esse aqui sem CTA — 2 mensagens."' },
        { tempo: '45–60s', txt: 'Thaís: "Que diferença..." — Matheus: "Comenta CHAVE aqui embaixo ' +
          'e eu te mando o comando que uso pra criar todo CTA. De graça, direto no direct."' },
      ],
    },
  ];

  roteiros.forEach((r, ri) => {
    const ry = y + ri * 330;
    card(doc, 40, ry, 510, 318, { radius: 12, bg: '#06080f', border: r.cor });
    doc.rect(40, ry, 5, 318).fill(r.cor);

    doc.fillColor(r.cor).fontSize(11).font('Helvetica-Bold').text(r.titulo, 56, ry + 10, { width: 460 });
    doc.fillColor(C.muted).fontSize(9).font('Helvetica-Bold').text('CENA: ', 56, ry + 30);
    doc.fillColor(C.muted).fontSize(9).font('Helvetica').text(r.cena, 56, ry + 42, { width: 460 });

    let lineY = ry + 62;
    r.roteiro.forEach((line, li) => {
      doc.fillColor(r.cor).fontSize(8).font('Helvetica-Bold').text(line.tempo, 56, lineY, { width: 40 });
      doc.fillColor(C.text).fontSize(9).font('Helvetica').text(line.txt, 100, lineY, { width: 420, lineGap: 2 });
      lineY += doc.heightOfString(line.txt, { width: 420 }) + 6;
    });
  });
}

function pageProximosPassos(doc) {
  bgFill(doc);
  doc.rect(0, 0, doc.page.width, 4).fill(C.primary);

  let y = 40;
  y = sectionTitle(doc, 'Próximos Passos', y, C.primary);

  doc.fillColor(C.text).fontSize(11).font('Helvetica')
     .text(
       'Tu já tem tudo que precisa. O perfil tem audiência, tem autoridade e tem produto. ' +
       'O que falta é alinhar o funil para que cada post empurre a pessoa para o próximo degrau. ' +
       'Aqui estão as 3 ações que eu implementaria ainda essa semana se fosse tu.',
       40, y, { width: 510, lineGap: 4, align: 'justify' }
     );
  y += 72;

  // 3 ações imediatas
  const acoes = [
    {
      num: '01',
      titulo: 'Troca o link na bio HOJE',
      urgencia: 'IMEDIATO',
      cor: C.critical,
      detalhe: 'O link da bio vai pro banco de prompts gratuito. Isso significa que tu tá pagando com atenção ' +
               'de 424k seguidores e mandando eles pra um produto de R$0. Muda hoje para a página da Chave AI. ' +
               'Tempo necessário: 5 minutos.',
    },
    {
      num: '02',
      titulo: 'Unifica o CTA para "CHAVE" por 30 dias',
      urgencia: 'ESSA SEMANA',
      cor: C.alert,
      detalhe: 'Tu tem 7 CTAs diferentes rodando ao mesmo tempo. A audiência não sabe o que é o produto ' +
               'principal. Escolhe "comenta CHAVE" como único CTA de produto nos próximos 30 dias. ' +
               'Isso treina o algoritmo e cria memória de marca.',
    },
    {
      num: '03',
      titulo: 'Grava 2 Reels de IA com Thaís essa semana',
      urgencia: 'ESSA SEMANA',
      cor: C.positive,
      detalhe: 'O formato casal é de longe o maior viral do perfil. Thaís confusa + Matheus explicando = ' +
               'alta identificação. Usa os 2 roteiros prontos desse diagnóstico e grava na próxima segunda.',
    },
  ];

  acoes.forEach((a, i) => {
    const ay = y + i * 120;
    card(doc, 40, ay, 510, 108, { radius: 12, bg: '#06080f', border: a.cor });
    doc.rect(40, ay, 5, 108).fill(a.cor);

    // Número grande
    doc.fillColor(a.cor).fontSize(28).font('Helvetica-Bold').text(a.num, 56, ay + 15, { width: 60 });

    // Badge urgência
    const bw = badge(doc, 120, ay + 20, a.urgencia, a.cor);

    doc.fillColor(C.text).fontSize(12).font('Helvetica-Bold').text(a.titulo, 56, ay + 50, { width: 460 });
    doc.fillColor(C.muted).fontSize(9).font('Helvetica').text(a.detalhe, 56, ay + 70, { width: 460, lineGap: 2 });
  });

  y += acoes.length * 120 + 24;

  // Upsell sutil
  card(doc, 40, y, 510, 90, { radius: 12, bg: '#0a1628', border: C.primary });
  doc.fillColor(C.primary).fontSize(11).font('Helvetica-Bold').text('Quer aprofundar?', 60, y + 12);
  doc.fillColor(C.text).fontSize(10).font('Helvetica')
     .text(
       'Esse diagnóstico cobriu o essencial. Se tu quiser 2 encontros ao vivo comigo para ' +
       'implementar isso junto — com revisão da bio em tempo real, revisão do mix e construção ' +
       'do funil — é só responder essa mensagem com "ENCONTROS".',
       60, y + 30, { width: 440, lineGap: 3 }
     );
  doc.fillColor(C.muted).fontSize(9).font('Helvetica').text('Diagnóstico com 2 encontros: R$297 (tu pagou R$47 por esse PDF)', 60, y + 74);
}

function pageSobre(doc) {
  bgFill(doc);
  doc.rect(0, 0, doc.page.width, 4).fill(C.primary);

  let y = 40;
  y = sectionTitle(doc, 'Sobre o Matheus', y, C.primary);

  // Card principal
  card(doc, 40, y, 510, 200, { radius: 16, bg: '#06080f', border: C.primary });
  doc.rect(40, y, 5, 200).fill(C.primary);

  doc.fillColor(C.text).fontSize(16).font('Helvetica-Bold').text('Matheus Soares', 60, y + 16);
  doc.fillColor(C.primary).fontSize(11).font('Helvetica-Bold').text('@omatheus.ai', 60, y + 38);

  doc.fillColor(C.muted).fontSize(10).font('Helvetica')
     .text(
       'Nordestino, autodidata, criador de conteúdo sobre IA e automação. ' +
       'Chegou a 424k seguidores no Instagram e 32k no YouTube sem pagar anúncio — ' +
       'usando estratégia de conteúdo, formato de casal com Thaís e IA como ferramenta de criação.',
       60, y + 60, { width: 440, lineGap: 4 }
     );

  doc.fillColor(C.muted).fontSize(10).font('Helvetica')
     .text(
       'Fundador da DESTRAVE ACADEMY LTDA. Criador do método por trás de +50 milhões de views. ' +
       'Ensina pessoas a usar IA não como atalho, mas como braço de apoio estratégico.',
       60, y + 120, { width: 440, lineGap: 4 }
     );

  // Prova social
  const provas = [
    { label: '+50M', desc: 'Visualizações' },
    { label: '424K', desc: 'Seguidores IG' },
    { label: '32K', desc: 'Inscritos YT' },
    { label: '1,5M', desc: 'Alcance/40 posts' },
  ];
  provas.forEach((p, i) => {
    doc.fillColor(C.primary).fontSize(18).font('Helvetica-Bold').text(p.label, 60 + i * 120, y + 168);
    doc.fillColor(C.muted).fontSize(8).font('Helvetica').text(p.desc, 60 + i * 120, y + 190);
  });
  y += 218;

  // Produtos
  y = sectionTitle(doc, 'Escada de Produtos', y, C.accent2);

  const produtos = [
    { nome: 'Mapa da Viralização', preco: 'R$67–97',    cta: 'MAPA',       desc: 'Mini-curso 4 módulos + Template Notion + Protocolo Viral' },
    { nome: 'Chave AI',            preco: 'R$297–497',  cta: 'CHAVE',      desc: 'Curso 5 módulos + Escritório de IA (SaaS)' },
    { nome: 'Diagnóstico de Perfil',preco: 'R$47/R$297', cta: 'DIAGNÓSTICO', desc: 'PDF análise completa / Com 2 encontros ao vivo' },
    { nome: 'Mentoria MCM',        preco: 'R$3k–5k',    cta: 'APLICAR',    desc: '8 semanas com Matheus + Catia (Brasil–Portugal)' },
  ];

  produtos.forEach((p, i) => {
    const py = y + i * 56;
    const cols = [C.muted, C.primary, C.accent2, C.alert];
    const col = cols[i] || C.primary;
    card(doc, 40, py, 510, 48, { radius: 8 });
    doc.rect(40, py, 4, 48).fill(col);
    doc.fillColor(C.text).fontSize(10).font('Helvetica-Bold').text(p.nome, 52, py + 8, { width: 200 });
    doc.fillColor(col).fontSize(10).font('Helvetica-Bold').text(p.preco, 260, py + 8, { width: 100 });
    badge(doc, 380, py + 8, p.cta, col);
    doc.fillColor(C.muted).fontSize(8).font('Helvetica').text(p.desc, 52, py + 28, { width: 460 });
  });
  y += produtos.length * 56 + 16;

  // Rodapé final
  card(doc, 40, y, 510, 50, { radius: 10, bg: '#0a1628', border: C.primary });
  doc.fillColor(C.muted).fontSize(9).font('Helvetica')
     .text(
       'Este diagnóstico foi gerado exclusivamente para @omatheus.ai | ' +
       'Data: 19/03/2026 | Por: Matheus Soares — Sistema de Agentes IA',
       56, y + 18, { width: 460, align: 'center' }
     );
}

// ════════════════════════════════════════════════════════════════════════════
// GERAÇÃO PRINCIPAL
// ════════════════════════════════════════════════════════════════════════════

function gerarPDF() {
  console.log('Iniciando geração do PDF...');

  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 0, bottom: 0, left: 0, right: 0 },
    info: {
      Title: 'Diagnóstico de Perfil com IA — @omatheus.ai',
      Author: 'Matheus Soares',
      Subject: 'Análise completa do perfil Instagram @omatheus.ai',
      Creator: 'Sistema de Agentes IA — @omatheus.ai',
    },
  });

  const stream = fs.createWriteStream(OUTPUT);
  doc.pipe(stream);

  // Página 1 — Capa
  console.log('  → Capa...');
  pageCover(doc);

  // Página 2 — Sumário Executivo
  console.log('  → Sumário Executivo...');
  doc.addPage();
  pageSumario(doc);

  // Página 3 — Raio-X da Bio
  console.log('  → Raio-X da Bio...');
  doc.addPage();
  pageBio(doc);

  // Página 4 — Sugestões de Bio
  console.log('  → Sugestões de Bio...');
  doc.addPage();
  pageBioSugestoes(doc);

  // Página 5 — Mix de Conteúdo
  console.log('  → Mix de Conteúdo...');
  doc.addPage();
  pageMixConteudo(doc);

  // Página 6 — Top Posts
  console.log('  → Top Posts...');
  doc.addPage();
  pageTopPosts(doc);

  // Página 7 — Ganchos
  console.log('  → Diagnóstico de Ganchos...');
  doc.addPage();
  pageGanchos(doc);

  // Página 8 — Funil
  console.log('  → Diagnóstico do Funil...');
  doc.addPage();
  pageFunil(doc);

  // Página 9 — Posicionamento
  console.log('  → Posicionamento...');
  doc.addPage();
  pagePosicionamento(doc);

  // Página 10 — Plano de Ação
  console.log('  → Plano de Ação 4 Semanas...');
  doc.addPage();
  pagePlanoAcao(doc);

  // Página 11 — Roteiros
  console.log('  → Roteiros Prontos...');
  doc.addPage();
  pageRoteiros(doc);

  // Página 12 — Próximos Passos
  console.log('  → Próximos Passos...');
  doc.addPage();
  pageProximosPassos(doc);

  // Página 13 — Sobre
  console.log('  → Sobre o Matheus...');
  doc.addPage();
  pageSobre(doc);

  doc.end();

  stream.on('finish', () => {
    const stats = fs.statSync(OUTPUT);
    const sizeKB = Math.round(stats.size / 1024);
    console.log(`\n✅ PDF gerado com sucesso!`);
    console.log(`   Arquivo: ${OUTPUT}`);
    console.log(`   Tamanho: ${sizeKB} KB`);
    console.log(`   Páginas: 13`);
  });

  stream.on('error', (err) => {
    console.error('Erro ao salvar PDF:', err);
  });
}

gerarPDF();

---
name: diagnostico-pdf
description: |
  Gera PDF profissional "Estudo Completo de Perfil" para CLIENTES do @omatheus.ai.
  Acessa Instagram via Playwright, scrolla 30-50 posts recentes, coleta prints e metricas
  reais (Reels, Carrosseis, Fotos), busca formatos em protocolo.omatheusai.com.br/formatos,
  gera HTML dark/glassmorphism e converte para PDF via Playwright.
  NUNCA mencionar IA. O cliente deve sentir que um profissional analisou o perfil dele.
---

# Skill: Estudo Completo de Perfil — Gerador de PDF

## ETAPA 0 — FORMULARIO PRE-DIAGNOSTICO (OBRIGATORIO)

O agente NAO PODE gerar o PDF sem os dados do formulario preenchido pelo cliente.

### O que o formulario informa:
1. O que o cliente QUER (objetivo, dificuldade, expectativa)
2. O que o cliente JA FAZ (frequencia, formatos, legendas, pedidos no final)
3. O que o cliente GANHA (faturamento, produto, monetizacao)
4. Quem e a audiencia (idade, genero, DMs, comentarios)
5. Como quer ser tratado (tom: direto, carinhoso, motivacional)

### Como os dados mudam a analise:

**Cliente diz "Nunca vendi nada":**
→ NAO falar de faturamento perdido. FOCAR em como criar o primeiro produto.

**Cliente diz "Fatura R$5.000-15.000/mes":**
→ Ele JA converte. NAO dizer "tu nao converte". FOCAR em otimizar e escalar.

**Cliente diz "Nao gosto de ficar pedindo":**
→ NAO ser agressivo sobre pedido em todo post. FOCAR em formas sutis.

**Tom direto:** Firme, sem enrolar, numeros crus.
**Tom direto com carinho:** Equilibrado, problema + solucao junto.
**Tom motivacional:** Encorajador, focar no que ta bom e no potencial.

**Cliente marca "Fotos com frase" como formato:**
→ NAO tratar como erro. Analisar se funciona pra ELE e sugerir complementos.

**Objetivo "Ganhar seguidores":** Focar em alcance, Reels, viralizacao.
**Objetivo "Vender produto":** Focar em conversao, pedidos, link na bio.

### Cruzamento: formulario x dados do Instagram

O poder do diagnostico e CRUZAR o que o cliente DIZ com o que os DADOS MOSTRAM:

"Tu disse que tua maior dificuldade e '[dificuldade]'. Olhando teus numeros, [dado real]. MAS [outro dado] mostra que [observacao]. Isso sugere que [hipotese]."

"Tu disse que fatura entre R$X-Y/mes. Isso mostra que tu JA tem um sistema que funciona. A questao nao e criar algo do zero — e otimizar."

### Template de inicio do PDF (personalizado):

Na capa e sumario, usar:
- NOME que o cliente escolheu (campo "como quer ser chamado")
- OBJETIVO que ele disse ter
- DIFICULDADE que mencionou
- TOM conforme preferencia

Exemplo: "[Nome], tu me disse que teu objetivo principal e [objetivo] e que tua maior dificuldade e [dificuldade]. Olhei teu perfil com essa lente e vou te mostrar o que encontrei..."

### Arquivo dos dados:

Formulario salvo em: C:\agentes\dados\diagnosticos\formularios\formulario-USERNAME-YYYY-MM-DD.md
Referenciado durante toda a geracao do PDF.

---

## 15 REGRAS PERMANENTES (aplicar em TODA geracao de PDF, pra qualquer perfil)

### REGRA 0 — DADOS REAIS, NUNCA INVENTAR (INVIOLAVEL)

Bio, metricas, nomes, legendas, comentarios: EXTRAIR via Playwright (snapshot/getText), SALVAR em .txt, COPIAR pro HTML. Nunca interpretar screenshot visualmente. Nunca reescrever, resumir ou parafrasear textos do cliente. Numeros no formato EXATO que o Instagram exibe.

Arquivos obrigatorios antes de gerar HTML:
- prints/USERNAME/bio-raw.txt
- prints/USERNAME/metricas-raw.txt
- prints/USERNAME/posts-data.txt
- prints/USERNAME/comments-raw.txt

Verificacao cruzada: comparar .txt com HTML antes de gerar PDF. Se diferentes = ERRO.

Um PDF com 15 paginas de dados REAIS vale 10x mais que um de 25 com dados inventados.

### REGRA 1 — ANALISE DO GRID E POR RESULTADO, NUNCA POR ESTETICA

PROIBIDO: cores consistentes, harmonia visual, "parece de 2021", capas bonitas, variedade visual.

OBRIGATORIO: performance REAL por formato comparando posts DO PROPRIO CLIENTE.

Template: "Olhei teus ultimos [N] posts e comparei a performance de cada formato: Fotos: [N] posts — media de X likes e Y comentarios. Carrosseis: [N] posts — media de X likes e Y comentarios. Reels: [N] posts — media de X views e Y comentarios. O padrao e claro: [formato] gera [N]x mais [metrica] que [outro formato]."

Nota do grid baseada em: mix de formatos (40%), interacao media (30%), posts com pedido no final (20%), frequencia (10%). Estetica = 0%.

### REGRA 2 — TOM DE OBSERVACAO, NUNCA AFIRMACAO DO QUE NAO PODE PROVAR

Antes de CADA frase: "Eu consigo provar isso com dados do perfil publico?"

PROIBIDO: "Tu ta postando como se fosse 2019", "Esse formato morreu", "Tu nao ta convertendo", "Tu ta tratando como hobby", "Tu ta deixando dinheiro na mesa", "Alcance morto", "Grid parece de [ano]", "Ninguem compartilha", "Zero salvamentos" (sem ter visto), qualquer "Tu NAO ta..." sem prova.

CORRETO: "Comparando teus proprios posts, o padrao mostra que...", "Os numeros sugerem que...", "Isso pode indicar que...", "Nao sei como ta nos bastidores, mas olhando o que e publico...", "Vale a pena testar...", "A diferenca e expressiva: [dado] vs [dado]".

Tom do sumario: elogiar o inegavel → mostrar dados reais → apontar padroes → sugerir hipoteses com humildade → plano como sugestao.

### REGRA 3 — NUNCA USAR JARGAO DE MARKETING

Termos PROIBIDOS e traducoes:
- CTA → "pedido no final do post"
- Lead → "pessoa interessada"
- Conversao → "quando alguem compra"
- Funil → "o caminho de te conhecer ate comprar"
- Engajamento → "interacao" ou "quantas pessoas interagem"
- Taxa de engajamento → "de cada 1.000 que veem, quantas interagem"
- Alcance organico → "quantas pessoas viram sem pagar anuncio"
- Revenue per follower → "quanto cada seguidor vale em faturamento"
- Benchmark → "media pra perfis desse tamanho"
- KPI → "numero importante"
- ROI → "retorno do investimento"
- Copy → "texto"
- Headline → "primeira frase"
- Impressoes → "quantas vezes apareceu na tela de alguem"
- Churn → "pessoas que deixam de seguir"

Pode usar direto: Reel, Carrossel, Stories, Gancho.
Se precisar de termo tecnico: explicar entre parenteses na primeira vez.

### REGRA 4 — POSTS SEM PEDIDO NAO SAO AUTOMATICAMENTE UM PROBLEMA

Classificar cada post por objetivo do pedido final:
- CRESCIMENTO — pede follow/salvar/compartilhar
- RELACIONAMENTO — pede comentario/opiniao
- CONVERSAO — pede DM/link/compra
- SEM PEDIDO — termina sem pedir nada

O problema e DESEQUILIBRIO, nao a existencia de posts sem pedido.
NUNCA: "Todo post precisa de pedido. Sem excecao."
SEMPRE: "Nem todo post precisa pedir venda. Mas a maioria deveria terminar com algo — pode ser simples como 'salva esse post'."

Mix ideal de pedidos por patamar:
| Objetivo | 0-1K | 1K-10K | 10K-100K | 100K-500K | 500K+ |
|---|---|---|---|---|---|
| Crescimento | 50% | 40% | 25% | 20% | 15% |
| Relacionamento | 30% | 30% | 30% | 25% | 20% |
| Conversao | 20% | 30% | 45% | 55% | 65% |

### REGRA 5 — PAGINA DO CAMINHO USA "OPORTUNIDADE", NUNCA "VAZAMENTO"

Titulo: "O CAMINHO DO TEU SEGUIDOR — ONDE DA PRA MELHORAR"
NUNCA: "Onde ta vazando", "Vazamento 1/2/3", "Alcance morto"
SEMPRE: "Oportunidade 1/2/3" com: "O que observei → O que pode significar → Sugestao pra testar"

### REGRA 6 — OBRIGATORIO CLICAR NO LINK DA BIO

Antes de opinar sobre o link:
1. Clicar via Playwright
2. Esperar carregar
3. Screenshot → prints/USERNAME/link-bio/
4. Descrever: "Cliquei no teu link e encontrei [descrever]"

Se link quebrado: "Tentei acessar [URL] e [descrever erro]. Isso precisa de atencao."
NUNCA opinar sem ter clicado. NUNCA "nao comunica valor" sem ter visto a pagina.

### REGRA 7 — COMENTARIOS DEVEM SER REAIS

Comentarios entre aspas = extraidos via Playwright e salvos em prints/USERNAME/comentarios/
Se nao extraiu: "Li os comentarios e a maioria sao [padrao geral]" — sem citar textos especificos.
NUNCA inventar comentarios de exemplo.

### REGRA 8 — HONESTIDADE SOBRE TAMANHO DA AMOSTRA

Sempre informar: "Analisei os ultimos [N] posts"
Se amostra pequena (<20): "Amostra recente. O padrao pode variar, mas a tendencia observada e [X]."
NUNCA "60% do teu conteudo e X" sem informar quantos posts analisou.

### REGRA 9 — PROJECOES FINANCEIRAS COM RESSALVA

Toda projecao como POTENCIAL: "SE converter X% a R$Y, o potencial e de R$Z"
SEMPRE adicionar: "Depende de como tu atende, do produto que oferece e de outros fatores. Mas o potencial ta ali."
NUNCA: "Tu VAI faturar X"

### REGRA 10 — PAGINA FINAL: SO MAPA DO ENGAJAMENTO R$197

Upsell UNICO na ultima pagina: Mapa do Engajamento R$197
ZERO outros produtos (nem Chave AI, nem Mentoria, nem encontros)
Preco CORRETO: R$197 (nao R$97, nao R$47)
Penultima pagina (proximos passos): 3 acoes + no maximo "Quer ir alem? Na proxima pagina."
Se aparecer "Chave AI" ou "Mentoria MCM" em qualquer lugar do PDF = ERRO.

### REGRA 11 — ANALISE DE REELS POR TIPO

Classificar ANTES de analisar:
- ALCANCE → medir por views
- EDUCATIVO → medir por salvamentos e comentarios (views menores = normal)
- CONEXAO → medir por comentarios pessoais (views menores = normal)
- CONVERSAO → medir por comentarios com pedido/DM

NUNCA: "views baixas pra X seguidores" sem considerar o tipo.
Reel educativo com 15K views + muitos salvamentos = SUCESSO.

### REGRA 12 — CADA ANALISE DE POST DEVE SER UNICA

NUNCA copiar mesma analise pra posts diferentes. Se 2 analises ficarem iguais = REFAZER.
Cada post: contexto proprio, formato proprio, metricas proprias, analise propria.

### REGRA 13 — ESTRUTURA TOPO → MEIO → FUNDO EM CADA POST

Analisar VISUAL + LEGENDA juntos:
- Visual: capa/primeiros segundos (TOPO), slides/corpo (MEIO), final (FUNDO?)
- Legenda: primeira linha (TOPO), corpo (MEIO), final (FUNDO?)
- O agente DEVE clicar em "mais" e extrair legenda completa via Playwright
- Salvar legendas em: prints/USERNAME/legendas/post-N-legenda.txt

### REGRA 14 — BIO ANALISADA POR PATAMAR

0-1K: CLAREZA (o que faz, pra quem, por que seguir)
1K-10K: POSICIONAMENTO (o que diferencia)
10K-100K: AUTORIDADE + PRODUTO
100K-500K: CONVERSAO
500K+: ECOSSISTEMA

Sugestao de bio REALISTA pro patamar. Nunca sugerir prova social que o cliente nao tem.

### REGRA 15 — ZERO PAGINAS COM MAIS DE 30% DE ESPACO VAZIO

Se pagina tem menos de 70% de conteudo: redistribuir, juntar secoes, expandir analises, adicionar graficos. NUNCA meia pagina em branco.

---

## PATAMARES DE PERFIL (referencia rapida)

| Patamar | Seguidores | Prioridade | Meta interacao | Tom |
|---|---|---|---|---|
| 1 INICIO | 0-1K | EXISTIR | 5-15% | Encorajador |
| 2 CRESCIMENTO | 1K-10K | CRESCER | 3-8% | Direto |
| 3 AUTORIDADE | 10K-100K | MONETIZAR | 2-5% | Estrategico |
| 4 ESCALA | 100K-500K | SISTEMATIZAR | 1-3% | Consultor |
| 5 IMPERIO | 500K+ | OTIMIZAR | 0.5-2% | Socio |

### FORMATOS DO PROTOCOLO POR PATAMAR

| Formato | 0-1K | 1K-10K | 10K-100K | 100K-500K | 500K+ |
|---|---|---|---|---|---|
| Tutorial | SIM | SIM | SIM | SIM | SIM |
| Errado/Certo | SIM | SIM | SIM | SIM | SIM |
| Lista | SIM | SIM | SIM | SIM | SIM |
| Pergunta/Resposta | — | SIM | SIM | SIM | SIM |
| React | — | SIM | SIM | SIM | SIM |
| Ligacao Oculta | — | — | SIM | SIM | SIM |
| Ancoragem | — | — | SIM | SIM | SIM |
| Empresa | — | — | — | SIM | SIM |

---

## Identidade do Produto

- **Nome correto:** "Estudo Completo de Perfil" ou "Diagnostico de Perfil"
- **NUNCA usar:** "com IA", "gerado por IA", "analise automatica"
- **Rodape de cada pagina:** "Produzido por Matheus Soares · @omatheus.ai"
- **O cliente deve sentir** que Matheus analisou o perfil pessoalmente

---

## ETAPA 1 — Coleta de Dados via Playwright (~10-15 min)

### 1.1 Perfil principal
```
navigate → https://www.instagram.com/USERNAME/
screenshot (fullPage:false) → prints/USERNAME/perfil_principal.png
snapshot → extrair: bio, seguidores, seguindo, posts, destaques, link na bio
SALVAR bio-raw.txt e metricas-raw.txt
```

### 1.2 Grid dos posts recentes
- Scrollar 3-4x ate carregar 30-50 posts
- Screenshot do grid → prints/USERNAME/grid_posts.png
- Contar: Reels / Carrosseis / Fotos

### 1.3 Aba de Reels (se existir)
- Clicar na aba Reels
- Screenshot → prints/USERNAME/grid_reels.png

### 1.4 Top 5 Reels
- Classificar tipo (ALCANCE/EDUCATIVO/CONEXAO/CONVERSAO) ANTES de analisar
- Screenshot + legenda completa de cada
- Salvar legendas em prints/USERNAME/legendas/

### 1.5 Top 5 Carrosseis
- Screenshot da capa + legenda completa
- Coletar: likes, comentarios, tema

### 1.6 Top 5 Fotos
- Screenshot + metricas + legenda

### 1.7 Comentarios dos top 3 posts
- Scrollar comentarios, extrair texto via snapshot
- Salvar em prints/USERNAME/comments-raw.txt
- NUNCA inventar comentarios

### 1.8 Link da bio (OBRIGATORIO)
- Clicar no link via Playwright
- Screenshot da pagina que abriu → prints/USERNAME/link-bio/
- Descrever o que encontrou

### 1.9 Protocolo de Formatos
```
navigate → https://protocolo.omatheusai.com.br/formatos
(login: teste@teste.com.br / teste123)
snapshot → formatos com metricas
```
Selecionar 3-5 formatos pro patamar do cliente.

---

## ETAPA 2 — Analise dos Dados

1. Identificar PATAMAR pelo numero de seguidores
2. Identificar nicho pela bio e conteudo
3. Calcular performance por formato (comparar posts do proprio cliente)
4. Classificar posts por objetivo do pedido final
5. Identificar padroes nos comentarios
6. Score geral 0-10

---

## ETAPA 3 — Gerar HTML do Diagnostico

Arquivo: C:\agentes\dados\diagnosticos\temp\diagnostico-USERNAME.html

### CSS Base (incluir no HEAD)
```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Plus Jakarta Sans',sans-serif;background:#000;color:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
.page{width:210mm;min-height:297mm;padding:36px 40px;page-break-after:always;position:relative;background:#0a0a0f;overflow:hidden;display:flex;flex-direction:column;}
.glass{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:18px;margin-bottom:14px;}
.glass-blue{background:rgba(14,165,233,0.06);border:1px solid rgba(14,165,233,0.2);border-radius:14px;padding:18px;margin-bottom:14px;}
.label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#0ea5e9;margin-bottom:6px;display:block;}
.title{font-size:20px;font-weight:800;color:#fff;line-height:1.2;margin-bottom:16px;}
.text{font-size:12px;color:#cbd5e1;line-height:1.7;}
.text-sm{font-size:11px;color:#94a3b8;line-height:1.6;}
.num-big{font-size:34px;font-weight:800;color:#fff;line-height:1;}
.num-label{font-size:10px;color:#64748b;margin-top:3px;text-transform:uppercase;letter-spacing:0.05em;}
.badge{display:inline-flex;align-items:center;padding:3px 10px;border-radius:999px;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;}
.ok{background:rgba(52,211,153,0.12);color:#34d399;border:1px solid rgba(52,211,153,0.25);}
.atencao{background:rgba(245,158,11,0.12);color:#f59e0b;border:1px solid rgba(245,158,11,0.25);}
.critico{background:rgba(239,68,68,0.12);color:#ef4444;border:1px solid rgba(239,68,68,0.25);}
.reel-badge{background:rgba(52,211,153,0.12);color:#34d399;border:1px solid rgba(52,211,153,0.25);}
.carrossel-badge{background:rgba(167,139,250,0.12);color:#a78bfa;border:1px solid rgba(167,139,250,0.25);}
.foto-badge{background:rgba(14,165,233,0.12);color:#0ea5e9;border:1px solid rgba(14,165,233,0.25);}
.cta-badge{background:rgba(251,146,60,0.12);color:#fb923c;border:1px solid rgba(251,146,60,0.25);}
.screenshot{border-radius:10px;border:1px solid rgba(255,255,255,0.08);max-width:100%;display:block;}
.placeholder{background:rgba(255,255,255,0.03);border:1px dashed rgba(255,255,255,0.1);border-radius:10px;display:flex;align-items:center;justify-content:center;color:#475569;font-size:11px;}
.footer{position:absolute;bottom:16px;left:40px;right:40px;font-size:9px;color:#1e293b;border-top:1px solid rgba(255,255,255,0.04);padding-top:8px;display:flex;justify-content:space-between;}
.divider{height:1px;background:rgba(255,255,255,0.05);margin:12px 0;}
.bar-bg{background:rgba(255,255,255,0.07);border-radius:999px;height:5px;width:100%;margin-top:5px;}
.bar{height:5px;border-radius:999px;}
.bar-azul{background:linear-gradient(90deg,#0ea5e9,#2563eb);}
.bar-verde{background:linear-gradient(90deg,#34d399,#10b981);}
.bar-amarelo{background:linear-gradient(90deg,#f59e0b,#d97706);}
.bar-vermelho{background:linear-gradient(90deg,#ef4444,#dc2626);}
.bar-roxo{background:linear-gradient(90deg,#a78bfa,#7c3aed);}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
.grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;}
.grid4{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px;}
.row{display:flex;gap:16px;align-items:flex-start;}
table{width:100%;border-collapse:collapse;font-size:11px;}
th{text-align:left;color:#64748b;font-weight:600;padding:8px 10px;border-bottom:1px solid rgba(255,255,255,0.06);font-size:10px;text-transform:uppercase;}
td{padding:8px 10px;border-bottom:1px solid rgba(255,255,255,0.04);color:#cbd5e1;}
@media print{*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;}.page{page-break-after:always!important;background:#0a0a0f!important;}}
```

### Funcao imageToBase64 (Node.js)
```javascript
const fs = require('fs');
const path = require('path');
function img(imagePath, cssStyle, altText) {
  if (fs.existsSync(imagePath)) {
    const ext = path.extname(imagePath).slice(1).replace('jpg','jpeg');
    const b64 = fs.readFileSync(imagePath).toString('base64');
    return `<img src="data:image/${ext};base64,${b64}" class="screenshot" style="${cssStyle||''}" alt="${altText||''}">`;
  }
  return `<div class="placeholder" style="${cssStyle||'height:180px;'}">${altText||'Imagem nao disponivel'}</div>`;
}
```

---

## ETAPA 4 — Estrutura do PDF (18-20 paginas)

### PAG 1 — Capa
Banner gradiente + foto perfil + @username + patamar + score + metricas + semaforo

### PAG 2 — Sumario Executivo (CHEIA)
4-5 paragrafos observacionais + semaforo 5 dimensoes + metricas destaque

### PAG 3 — Print do Perfil + Analise da Bio (por PATAMAR)
Screenshot perfil + bio REAL (do bio-raw.txt) + analise linha por linha + score + sugestoes

### PAG 4 — Performance por Formato (RESULTADO, nao estetica)
Screenshot grid + tabela comparativa de performance + qual formato funciona melhor

### PAG 5-6 — Top 5 Reels (classificados por TIPO)
Cada reel: tipo identificado + metrica correta pro tipo + analise UNICA

### PAG 7-8 — Top 5 Carrosseis
Screenshot capa + metricas + analise da estrutura topo/meio/fundo

### PAG 9 — Top 5 Fotos
Grid condensado + metricas + analise

### PAG 10 — Analise dos Comentarios (REAIS)
Padroes observados + sinais de demanda (sem inventar comentarios)

### PAG 11 — O que tu ta postando (Mix)
Distribuicao atual + sugestao por patamar + nota sobre tamanho da amostra

### PAG 12 — O que tu pede no final dos posts
Tabela de pedidos + equilibrio + sugestoes em linguagem simples

### PAG 13 — O Caminho do Seguidor (OPORTUNIDADES, nao vazamentos)
Infografico + dados do link da bio (CLICADO via Playwright) + 3 oportunidades

### PAG 14-15 — Formatos Recomendados (do Protocolo, filtrados por patamar)

### PAG 16 — Plano de Acao 4 Semanas

### PAG 17 — 2 Roteiros Prontos (com marcacao [TOPO] [MEIO] [FUNDO])

### PAG 18 — Proximos Passos (3 acoes + "Quer ir alem? Vira a pagina.")

### PAG 19 — Quem Fez + Mapa do Engajamento R$197 (UNICO upsell)

---

## ETAPA 5 — Converter HTML em PDF

```bash
node C:\agentes\scripts\html-to-pdf.js [html] [pdf]
```

Script: C:\agentes\scripts\html-to-pdf.js
Playwright/Chromium: C:\agentes\scripts\node_modules

---

## Linguagem do Matheus

Tom: nordestino, usa "tu", direto, sem guru, pessoal
NUNCA: "com base na analise", "podemos observar", "e importante destacar", "Em suma"
SEMPRE: "Olha so o que encontrei...", "Os numeros mostram que...", "Vale a pena testar..."
NUNCA emojis no texto — usar badges CSS

---

## Caminhos de Arquivo

```
Prints: C:\agentes\dados\diagnosticos\prints\USERNAME\
Legendas: C:\agentes\dados\diagnosticos\prints\USERNAME\legendas\
Link bio: C:\agentes\dados\diagnosticos\prints\USERNAME\link-bio\
HTML: C:\agentes\dados\diagnosticos\temp\diagnostico-USERNAME.html
PDF: C:\agentes\dados\diagnosticos\diagnostico-USERNAME-YYYY-MM-DD.pdf
Script: C:\agentes\scripts\html-to-pdf.js
```

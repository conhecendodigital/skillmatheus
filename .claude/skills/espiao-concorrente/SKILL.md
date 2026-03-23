---
name: espiao-concorrente
description: |
  Agente de inteligência competitiva para @omatheus.ai.
  Usa Playwright MCP para navegar em perfis de concorrentes no Instagram.
  Analisa ganchos, capas, formatos e linguagem de IA usando os 3 padrões validados
  do @omatheus.ai como framework. Classifica hooks nos 5 gatilhos emocionais.
  Detecta se concorrentes usam "IA como apoio" ou "IA como atalho".
  Salva banco de hooks e insights em C:\agentes\dados\espionagem\.
---

# Skill: Espião de Concorrentes

## Contexto
Analisar o que os melhores perfis de criadores de conteúdo sobre IA estão fazendo.
Extrair padrões, decodificar fórmulas e adaptar para o posicionamento do @omatheus.ai.
NUNCA copiar — sempre adaptar com a voz e o posicionamento do Matheus.

## Acesso via Playwright MCP

```
- Navegar até o perfil do concorrente: https://www.instagram.com/[username]/
- Coletar os últimos 20-30 posts (rolar o feed)
- Acessar os 10 posts com mais engajamento (estimar por curtidas visíveis)
- Ler legendas completas clicando em "mais"
- Registrar tipo de post (Reel, Carrossel, Imagem)
- Delay mínimo de 3s entre cliques, 15s entre posts
- Máximo 3 perfis por sessão
```

---

## Framework de Análise: 3 Padrões de Gancho Validados

Todo hook deve ser classificado em um dos padrões que FUNCIONAM para @omatheus.ai:

| Padrão | Estrutura | Exemplo |
|---|---|---|
| **P1: Identificação + Revelação** | Nomeia a dor → revela o segredo | "Você posta todo dia e não cresce? O algoritmo esconde quem faz ISSO" |
| **P2: Provocação + Afirmação Polêmica** | Ataca crença comum → afirma o contrário | "Postar mais não resolve. Nunca resolveu. O problema é outro." |
| **P3: Reflexão Polêmica (dois lados)** | Apresenta dilema → toma partido | "IA vai substituir criadores? Depende de qual dos 3 tipos você é." |

---

## Framework da Capa Perfeita (Carrossel)

Avaliar cada capa de carrossel contra esta fórmula:

| Elemento | O que verificar | Pontuação |
|---|---|---|
| Frase curta e polêmica | Ataca dor ou crença? | 0-3 |
| Palavra em CAIXA ALTA | Tem contraste visual? Cor contrastante? | 0-3 |
| Palavra de mistério | Usa ISSO, ERRADO, ESCONDIDO, SEGREDO? | 0-2 |
| Clareza do benefício | Promessa ou dor identificável em 2s? | 0-2 |
| **Total** | | **/10** |

---

## Framework do Gancho Perfeito (Legenda/Reel)

Avaliar o gancho dos 5 primeiros segundos do Reel ou primeira linha da legenda:

| Elemento | Presente? |
|---|---|
| 1. Começa com a Dor (frustração da audiência) | Sim/Não |
| 2. Apresenta Solução IA com twist ("se souber o comando certo") | Sim/Não |
| 3. Conecta com Autoridade (prova social, número, resultado) | Sim/Não |
| 4. CTA claro (palavra-chave para comentar) | Sim/Não |

---

## Análise de Linguagem: Apoio vs. Atalho

Para cada concorrente, classificar a linguagem dominante:

**Linguagem de ATALHO (evitar — atrai cliente errado):**
- "Crie 10 posts em 2 minutos"
- "Parece errado de tão fácil"
- "Nunca mais trabalhe de graça"
- "IA faz tudo por você"

**Linguagem de APOIO (preferir — atrai cliente ideal):**
- "Use IA para escalar sua estratégia"
- "O comando certo amplifica sua criatividade"
- "IA como braço de apoio, não substituto"
- "Trabalhe menos, crie com mais intenção"

Classificar o perfil como: `ATALHO` / `APOIO` / `MISTO`

---

## Banco de Hooks: Classificação por Gatilho Emocional

Para cada hook coletado, classificar em um dos 5 gatilhos:

| Gatilho | Indicadores | Resultado esperado |
|---|---|---|
| **Medo/Urgência** | "te escondendo", "vai perder", "cuidado" | Alto alcance, compartilhamento |
| **Curiosidade** | "comando que ninguém te contou", "função escondida" | Alto salvamento |
| **Identificação** | "posta todo dia e não cresce?", "você também sente isso?" | Comentários qualificados |
| **Provocação** | "postar por postar não funciona", "para de fazer isso" | Debate + compartilhamento |
| **Revelação** | "depois de X milhões de views, aprendi...", "o que mudou tudo" | Autoridade + salvamento |

---

## Fluxo de Análise

### Passo 1 — Coletar dados do perfil

Via Playwright:
1. Acessar o perfil
2. Registrar: seguidores, bio atual, link na bio, produto mencionado
3. Rolar o feed e listar os últimos 20-30 posts com tipo e métricas visíveis
4. Identificar os top 10 por engajamento

### Passo 2 — Analisar cada post relevante

Para cada post do top 10:
- Tipo (Reel, Carrossel, Imagem)
- Hook (primeiros 5s do Reel ou primeira linha da legenda)
- Capa (se carrossel — avaliar pela fórmula da capa)
- Padrão de gancho (P1, P2, P3 ou outro)
- Gatilho emocional (5 categorias)
- CTA usado
- Linguagem: ATALHO ou APOIO
- Métricas visíveis (curtidas, comentários)

### Passo 3 — Gerar relatório

Estrutura do relatório em `C:\agentes\dados\espionagem\[username]-[data].md`:

```markdown
# Análise: @[username] — [data]

## Perfil
- Seguidores: X
- Bio: [texto]
- Produto principal: [nome + preço se visível]
- Linguagem dominante: ATALHO / APOIO / MISTO

## Top Posts Analisados
[tabela com tipo, hook, gatilho, CTA, métricas]

## Padrões Identificados
- Mix de conteúdo: X% IA, X% Tech, X% Segurança...
- Formato dominante: [Reel / Carrossel]
- Hook mais usado: [padrão]
- CTA mais usado: [palavra]

## Pontuação de Capas
[top 3 capas com pontuação /10 e justificativa]

## Banco de Hooks Coletados
[lista classificada por gatilho]

## Oportunidades para @omatheus.ai
- [O que o concorrente NÃO faz que Matheus pode explorar]
- [Hook adaptado com a voz do Matheus]
- [Formato que pode ser testado]

## Versão Adaptada (1 post pronto para usar)
[Hook + estrutura adaptada para @omatheus.ai]
```

---

## Regras

1. NUNCA salvar dados sensíveis dos concorrentes fora da pasta `espionagem/`
2. Sempre adaptar, nunca copiar diretamente
3. Manter linguagem de APOIO em qualquer adaptação
4. Limitar a 3 perfis por sessão de análise
5. Se detectar conteúdo enganoso no concorrente, registrar como "prática a evitar"
6. Hooks coletados alimentam automaticamente o `/roteirista`

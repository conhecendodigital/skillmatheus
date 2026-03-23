---
name: instagram-content-strategy
description: |
  Análise estratégica de perfis do Instagram e criação de planos de conteúdo
  para @omatheus.ai. Usa Playwright MCP (não manus-mcp-cli) para coletar dados
  navegando no Instagram logado como @omatheus.ai.
  Diagnostica mix de conteúdo, identifica oportunidades, cria planos de ação.
  Mix ideal: 40% IA + 25% Tech + 15% Segurança + 10% Motivacional + 10% Pessoal.
  Dados reais: 17% atual em IA (meta: 40%), funil 100k alcance → 7 compras (meta: 50+).
  Escada: Mapa R$97 / Chave AI R$497/ano / Diagnóstico R$97 / Mentoria MCM R$5k.
---

# Skill: Estratégia de Conteúdo @omatheus.ai

## Contexto e Dados Reais do Perfil

**@omatheus.ai** — Matheus, 425k seguidores, IA e automação
- Mix atual: **17% IA** (meta: **40%**) — principal gap a corrigir
- Posts de IA geram MAIS comentários e salvamentos qualificados (engajamento que vende)
- Posts de segurança/utilidade geram alcance massivo (topo de funil)
- Funil atual: 100.000 alcance → ~7 compras | Meta: 50+ compras
- Melhor post de IA: "Fotos com IA (prompt certo)" — 207 comentários, 400 salvamentos
- Comentários "avalia meu perfil" = sinal de demanda de produto (leads quentes)
- 3 padrões de gancho validados: (P1) Identificação+Revelação / (P2) Provocação Polêmica / (P3) Reflexão dois lados

---

## Fluxo 1: Análise de Perfil via Playwright MCP

### Passo 1 — Coletar dados

Via Playwright, abrir o Instagram já logado como @omatheus.ai:

```
1. Abrir: https://www.instagram.com/omatheus.ai/
2. Rolar o feed e listar os últimos 60-80 posts
   - Registrar: tipo (Reel/Carrossel/Imagem), thumbnail, métricas visíveis
3. Acessar os top 15-20 posts por curtidas/comentários
   - Para cada post registrar:
     * Tipo de conteúdo
     * Primeiras 3 linhas da legenda (gancho)
     * CTA usado (MAPA/CHAVE/DIAGNÓSTICO/outro)
     * Curtidas, comentários, visualizações visíveis
     * Comentários com palavras-chave de compra
4. Delay: mínimo 5s entre posts, 30s entre páginas
```

### Passo 2 — Categorizar posts

| Categoria | Palavras-chave | Qualifica para venda? |
|---|---|---|
| **IA / Criação** | ChatGPT, prompt, IA, conteúdo, algoritmo, Escritório | **Sim — principal** |
| **Tecnologia / Dicas** | app, ferramenta, recurso, tutorial, função | Parcialmente |
| **Segurança Digital** | CPF, PIX, golpe, proteção, privacidade | Não (alcance) |
| **Motivacional / Fé** | superação, Deus, fé, gratidão | Não (humanização) |
| **Pessoal / Família** | Thaís, filha, casal, bastidores | Humanização |

**Mix ideal:** 40% IA + 25% Tech + 15% Segurança + 10% Motivacional + 10% Pessoal

### Passo 3 — Diagnosticar linguagem

- **Linguagem de APOIO** (preferir): "o comando certo amplifica sua criatividade", "IA como braço estratégico"
- **Linguagem de ATALHO** (evitar): "crie 10 posts em 2 minutos", "parece errado de tão fácil"

### Passo 4 — Métricas-chave

| Métrica | Cálculo | Excelente |
|---|---|---|
| Taxa de utilidade | Salvamentos / Alcance | > 2% |
| Potencial viral | Compartilhamentos / Alcance | > 2% |
| Engajamento qualificado | Comentários longos (>10 palavras) | Registrar |
| Retenção (Reels) | Views / Alcance | > 150% |

Identificar nos comentários: "avalia meu perfil", pedidos de links = leads quentes.

### Passo 5 — Gerar relatório

Salvar em `C:\agentes\dados\estrategia-[data].md`:

```markdown
# Relatório de Análise — @omatheus.ai — [data]

## Mix atual vs. ideal
[tabela com % atual e % ideal por categoria]

## Top 10 posts por engajamento qualificado
[tabela: tipo, gancho, categoria, salvamentos, comentários, CTA]

## Posts de IA com melhor performance
[análise detalhada dos top 5 posts de IA]

## Sinais de demanda de produto (comentários)
[lista de comentários que indicam interesse de compra]

## Diagnóstico de linguagem
[% de posts com linguagem de apoio vs. atalho]

## Plano de ação (próximas 4 semanas)
[semana a semana, formatos, categorias e CTAs]
```

---

## Fluxo 2: Criação de Estratégia de Conteúdo

### Metodologia do Funil Único

Cada post funciona como funil completo:

| Ato | Etapa | Duração (Reel) | Função |
|---|---|---|---|
| **Gancho** | Topo | 0-5s | Quebrar padrão. SEMPRE nomear a ferramenta. |
| **Tensão** | Meio início | 5-20s | Aprofundar dor, mostrar por que solução comum falha |
| **Virada** | Meio fim | 20-50s | O pulo do gato. Autoridade. |
| **Ação** | Fundo | 50-60s | CTA conectado ao produto certo |

### Escada de Produtos

| Nível | Produto | Preço | CTA | Função |
|---|---|---|---|---|
| **Low-ticket** | Mapa do Engajamento Essencial | R$97 | MAPA | Quebrar barreira da 1ª compra |
| **Mid-ticket** | Chave AI + Escritório de IA | R$497/ano | CHAVE | Produto principal |
| **Avulso** | Diagnóstico de Perfil com IA | R$97 | DIAGNÓSTICO | Entrada qualificada |
| **High-ticket** | Mentoria MCM (Brasil-Portugal c/ Catia) | R$5.000 | Link na bio | Transformação |

### Bio Otimizada (4 linhas)

```
Matheus Soares | IA e Tech
Ensino a usar IA para criar conteúdo que atrai clientes.
+50 MILHÕES DE VISUALIZAÇÕES SEM TRÁFEGO PAGO 🌎
Acesse a Chave AI aqui 👇
```

---

## Fluxo 3: Plano de Conteúdo Semanal Tipo

| Dia | Formato | Categoria | CTA |
|---|---|---|---|
| Segunda | Carrossel | IA | CHAVE ou DIAGNÓSTICO |
| Terça | Reel (Recurso Escondido) | Tech | MAPA |
| Quarta | Reel (Casal Problema/Solução) | IA | CHAVE |
| Quinta | Carrossel | Segurança | — (alcance) |
| Sexta | Reel (Isso vs. Aquilo) | IA | CHAVE |
| Sábado | Carrossel ou Imagem | Motivacional/Pessoal | — |
| Domingo | Reel (Os 3 Caminhos) | IA | DIAGNÓSTICO |

---

## Entregáveis por Solicitação

| Solicitação | Entregável |
|---|---|
| "Analisa meu Instagram" | Relatório com mix atual vs. ideal, top posts, diagnóstico, plano de ação |
| "Melhora minha bio" | 3 versões com justificativas |
| "Cria plano de conteúdo" | 4 semanas com mix correto, formatos, CTAs, temas |
| "Diagnóstico de posicionamento" | Análise linguagem apoio vs. atalho + recomendações |
| "Analisa posts de referência" | Decodificação + versão adaptada para @omatheus.ai |

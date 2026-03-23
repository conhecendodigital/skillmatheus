---
name: stories-diario
description: |
  Agente que gera automaticamente a sequência de Stories do dia para @omatheus.ai toda manhã.
  Use quando precisar: planejar os stories do dia, gerar roteiros de stories baseados nos 19 modelos SPE,
  criar sequências de venda/conexão/engajamento para stories, enviar o plano por email ou salvar no calendário.
  Roda automaticamente às 6h da manhã ou sob demanda.
---

# Skill: Agente de Stories Diário — @omatheus.ai

## Missão
Todo dia às 6h da manhã, gerar uma sequência completa de 5-8 stories para o dia,
baseada nos 19 modelos SPE (Stories para Enriquecer), no dossiê estratégico do perfil,
e no calendário de conteúdo da semana. Salvar e enviar por email pro Matheus.

Para os 19 modelos completos com roteiros: ver [MODELOS_STORIES_COMPLETO.md](references/MODELOS_STORIES_COMPLETO.md)

## Contexto do Perfil

- **Perfil:** @omatheus.ai (425k seguidores)
- **Nicho:** IA + Criação de Conteúdo
- **Tom:** Nordestino ("tu"), direto, sem guru, lo-fi
- **Casal:** Matheus + Thaís (ela é avatar do público)
- **Posicionamento:** "IA como apoio, não atalho"
- **Produtos:** Mapa R$97 | Chave AI R$497 | Mentoria MCM R$5.000 | Diagnóstico R$47

## Rotina de Stories por Período

| Período | Objetivo | Modelos Prioritários |
|---|---|---|
| **Manhã (7-9h)** | Conexão + Contexto | Ritual de Preparação, Storyvlog, Modelo de Histórias |
| **Tarde (13-15h)** | Autoridade + Engajamento | Enquete, Caixinha Contra-Popular, Ativador de Opinião |
| **Noite (19-21h)** | Conversão | Colheita, Sequência de Vendas, Prova Social |

## Lógica de Geração Diária

### Passo 1 — Verificar o calendário da semana
Consultar `C:\agentes\dados\roteiros\` para saber:
- Qual post vai pro feed hoje (Reel ou Carrossel)?
- Qual produto está em destaque essa semana?
- Estamos em período de lançamento?

### Passo 2 — Definir o mix do dia (5-8 stories)

**Dia normal (sem lançamento):**
- 2 stories de CONEXÃO (manhã)
- 2 stories de ENGAJAMENTO (tarde)
- 1 story de AUTORIDADE (tarde/noite)
- 1 story de VENDA SUAVE (noite)

**Dia de lançamento:**
- 1 story de CONEXÃO (manhã)
- 1 story de ENGAJAMENTO (tarde)
- 4-5 stories de SEQUÊNCIA DE VENDA (tarde/noite)

**Dia de descanso (domingo):**
- 2-3 stories pessoais/casal
- 1 enquete leve
- 0 venda

### Passo 3 — Selecionar modelos específicos

Usar a tabela de 19 modelos (referência completa no arquivo de referência):

**CONEXÃO (escolher 1-2 por dia):**
- Aula 1: Modelo de Histórias (você no presente, dificuldade real, aprendizado do dia)
- Aula 5: Ativador de Memória (objetos, bordões, identidade visual)
- Aula 10: Storyvlog (rotina vira tutorial, câmera distante)
- Aula 13: Antes x Depois (transformação pessoal ou de cliente)
- Aula 23: Rituais (preparação, bordão + comportamento)

**ENGAJAMENTO (escolher 1-2 por dia):**
- Aula 2: Ativador de Opinião (questionar verdade absoluta, elefante na sala)
- Aula 3: Ativador de Resposta (conversa natural, repost de print)
- Aula 11: Conteúdo Desdobrado (validar, contra-argumentar, questionar, consequência)
- Aula 12: Opinião Contra-Popular (framework contra-popular de 4 passos)
- Aula 14: Caixinha de Perguntas (conhecer audiência, pesquisa de produto)
- Aula 15: Enquetes (colaboração, batalha, pesquisa, identificação)
- Aula 16: Sequência (identificação → problema → solução → CTA)

**VENDA (escolher 0-2 por dia):**
- Aula 18: Sequência que Converte sem Aparecer (10 stories, só texto e prints)
- Aula 19: Venda que Não Parece Venda (vulnerabilidade → quebra de crença → anti-pitch)
- Aula 20: Colheita (story único com convite ao DM)
- Aula 21: Prova que Ativa Desejo (depoimentos estratégicos)

**ATRAÇÃO (1-2x por semana):**
- Aula 22: Repost Intencional (aparecer nos stories de outros criadores)
- Aula 24: Mineração (reciclar stories bons pro feed, destaques, carrosséis)

### Passo 4 — Gerar os roteiros

Para cada story, gerar:

```markdown
## Story [N] — [Período: Manhã/Tarde/Noite]
**Modelo:** [Nome do modelo — ex: Ativador de Opinião]
**Objetivo:** [Conexão / Engajamento / Autoridade / Venda]
**Ferramenta IG:** [Caixinha / Enquete / Vídeo / Texto+Foto / Storyvlog]

### Antes de gravar:
- [Pergunta de preparação 1]
- [Pergunta de preparação 2]

### Roteiro:
> "[Fala exata do story — no tom do Matheus, nordestino, direto]"
> "[Continuação...]"

### Texto na tela (se aplicável):
"[Texto sobreposto para quem assiste no mudo]"

### CTA (se aplicável):
- [Caixinha: "pergunta aqui"]
- [Enquete: "Opção A / Opção B"]
- [Link: "link na bio"]

### Conexão com produto:
- [Qual produto esse story aquece: Mapa / Chave AI / Diagnóstico / Mentoria / Nenhum]
```

### Passo 5 — Aplicar bordões e objetos de marca

Garantir que TODO DIA apareça pelo menos:
- 1 bordão: "IA como apoio, não atalho" OU "Estratégia antes de ferramenta" OU "O sistema é o diferencial"
- 1 objeto: Notebook com Notion OU Café OU Caderno com anotações OU Fone de ouvido
- Tom nordestino com "tu" (nunca "você" nos stories falados)

### Passo 6 — Salvar e entregar

Salvar em: `C:\agentes\dados\stories\plano-stories-YYYY-MM-DD.md`

Estrutura do arquivo:
```markdown
# Plano de Stories — DD/MM/YYYY (dia da semana)
**Produto em destaque:** [produto da semana]
**Post do feed hoje:** [Reel/Carrossel sobre X]
**Mix do dia:** [X conexão + X engajamento + X venda]

---
[Stories completos aqui]
---

## Checklist antes de gravar:
- [ ] Objetos de marca visíveis no cenário
- [ ] Bordão do dia definido
- [ ] Caixinha/enquete preparada
- [ ] Produto da semana mencionado pelo menos 1x
```

## Regras Anti-IA nos Stories

1. Tom de conversa: como se tivesse falando com amigo no FaceTime
2. NUNCA decorar roteiro — usar como guia, falar com naturalidade
3. Não regravar mais de 2x — imperfeição gera conexão
4. Variar: vídeo falado + foto com texto + storyvlog + enquete
5. Máximo 8 stories por dia em dia normal (não sobrecarregar)
6. Sempre responder quem interagir — compartilhar prints nos stories
7. Usar "tu" e expressões nordestinas naturais
8. Incluir Thaís em pelo menos 2 stories por semana

## Integração com Outros Agentes

- **Espião** → traz tendências e hooks pra usar como tema nos stories
- **Roteirista** → alinha stories com o post do feed do dia
- **Engajador** → monitora respostas das caixinhas e enquetes
- **Boas-vindas** → stories de colheita geram DMs que o vendedor captura

## Execução Automática

Rodar via cron ou /loop toda manhã às 6h:
1. Ler calendário da semana
2. Gerar plano de stories do dia
3. Salvar em `C:\agentes\dados\stories\`
4. Enviar resumo por email pro Matheus (usar n8n webhook ou SMTP)

Comando: `/loop 24h /stories-diario`

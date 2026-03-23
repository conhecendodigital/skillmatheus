const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  VerticalAlign, LevelFormat, PageNumber, Header, Footer
} = require('docx');
const fs = require('fs');

const tableBorder = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const cellBorders = { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder };
const headerShading = { fill: "1A1A2E", type: ShadingType.CLEAR };
const accentShading = { fill: "F0F4FF", type: ShadingType.CLEAR };

function h1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(text)] });
}
function h2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(text)] });
}
function body(text) {
  return new Paragraph({ spacing: { after: 160 }, children: [new TextRun({ text, size: 24 })] });
}
function bullet(text, ref) {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { after: 100 },
    children: [new TextRun({ text, size: 24 })]
  });
}
function boldLine(label, value) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [
      new TextRun({ text: label, bold: true, size: 24 }),
      new TextRun({ text: value, size: 24 })
    ]
  });
}
function space() {
  return new Paragraph({ spacing: { after: 200 }, children: [new TextRun("")] });
}

// Table helper
function tableRow(col1, col2, col3, isHeader = false) {
  const shading = isHeader ? headerShading : { fill: "FFFFFF", type: ShadingType.CLEAR };
  const textColor = isHeader ? "FFFFFF" : "1A1A1A";
  const bold = isHeader;
  return new TableRow({
    tableHeader: isHeader,
    children: [col1, col2, col3].map((text, i) =>
      new TableCell({
        borders: cellBorders,
        width: { size: i === 0 ? 2200 : i === 1 ? 3580 : 3580, type: WidthType.DXA },
        shading,
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({
          spacing: { before: 80, after: 80 },
          children: [new TextRun({ text, bold, color: textColor, size: isHeader ? 22 : 22 })]
        })]
      })
    )
  });
}

function weekRow(day, type, content, isHeader = false) {
  const shading = isHeader ? headerShading : { fill: "FFFFFF", type: ShadingType.CLEAR };
  const textColor = isHeader ? "FFFFFF" : "1A1A1A";
  const bold = isHeader;
  return new TableRow({
    tableHeader: isHeader,
    children: [day, type, content].map((text, i) =>
      new TableCell({
        borders: cellBorders,
        width: { size: i === 0 ? 1400 : i === 1 ? 2200 : 5760, type: WidthType.DXA },
        shading,
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({
          spacing: { before: 80, after: 80 },
          children: [new TextRun({ text, bold, color: textColor, size: 22 })]
        })]
      })
    )
  });
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 24 } } },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal",
        run: { size: 36, bold: true, color: "1A1A2E", font: "Arial" },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 }
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal",
        run: { size: 28, bold: true, color: "2E4057", font: "Arial" },
        paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 }
      }
    ]
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]
      },
      {
        reference: "numbered",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]
      },
      {
        reference: "modulos",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]
      },
      {
        reference: "stories",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]
      }
    ]
  },
  sections: [{
    properties: {
      page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
    },
    headers: {
      default: new Header({ children: [new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: "@omatheus.ai — Mapa do Engajamento", color: "888888", size: 18 })]
      })] })
    },
    footers: {
      default: new Footer({ children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: "Página ", color: "888888", size: 18 }),
          new TextRun({ children: [PageNumber.CURRENT], color: "888888", size: 18 }),
          new TextRun({ text: " de ", color: "888888", size: 18 }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], color: "888888", size: 18 })
        ]
      })] })
    },
    children: [

      // TÍTULO
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 480, after: 120 },
        children: [new TextRun({ text: "Mapa do Engajamento", bold: true, size: 56, color: "1A1A2E", font: "Arial" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [new TextRun({ text: "Estratégia Completa de Produto, Aulas e Stories", size: 28, color: "555555", font: "Arial" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 600 },
        children: [new TextRun({ text: "@omatheus.ai  |  19/03/2026", size: 22, color: "888888", italics: true })]
      }),

      // SEÇÃO 1
      h1("1. O que é o Mapa do Engajamento"),
      body("A plataforma Mapa do Engajamento (protocolo.omatheusai.com.br) é um ecossistema gamificado e prático de criação de conteúdo. Foi desenhada para resolver a principal dor dos criadores: a falta de direção e a paralisia na hora de criar."),
      body("O diferencial é a transição do modelo de \"aulas teóricas\" para \"ferramentas de execução imediata\". O usuário não entra para assistir horas de vídeo — entra para executar tarefas claras, usar geradores de IA e copiar frameworks validados."),
      space(),

      h2("A Promessa Central"),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 200 },
        shading: { fill: "F0F4FF", type: ShadingType.CLEAR },
        children: [new TextRun({
          text: "\"Não te dou apenas a teoria — te dou as ferramentas exatas que eu uso para viralizar e vender.\"",
          italics: true, bold: true, size: 26, color: "1A1A2E"
        })]
      }),
      space(),

      h2("Os 3 Diferenciais da Oferta"),
      boldLine("Velocidade: ", "O usuário não precisa pensar do zero. Usa os geradores e ganchos prontos."),
      boldLine("Direção: ", "A Jornada de 30 Estações diz exatamente o que fazer a cada passo."),
      boldLine("Gamificação: ", "O sistema de XP e níveis (Iniciante, Crescimento, Autoridade) vicia o usuário em executar."),
      space(),

      // SEÇÃO 2 — 7 FERRAMENTAS
      h1("2. As 7 Ferramentas da Plataforma"),
      space(),
      new Table({
        columnWidths: [2200, 3580, 3580],
        margins: { top: 80, bottom: 80, left: 160, right: 160 },
        rows: [
          tableRow("Ferramenta", "O Problema que Resolve", "Como Funciona", true),
          tableRow("Jornada de Conteúdo", "\"Não sei por onde começar\"", "30 estações: Início, Crescimento e Autoridade. Cada estação tem um objetivo claro e um prompt pronto."),
          tableRow("Gerador de Prompts", "\"Não sei usar IA para criar\"", "5 geradores sequenciais (Clareza, Persona, Ideias, Roteiro, Vendas) baseados no Método NOEIXO."),
          tableRow("Ganchos Virais", "\"Ninguém assiste meus vídeos\"", "Banco com 50 ganchos de abertura categorizados (Curiosidade, Autoridade, Vulnerabilidade) prontos para copiar."),
          tableRow("Formatos que Viralizam", "\"Não sei que tipo de vídeo gravar\"", "Biblioteca com análises de Reels reais categorizados por estilo (Ligação Oculta, Pergunta/Resposta, Problema/Solução)."),
          tableRow("Stories que Vendem", "\"Meus stories não convertem\"", "Frameworks prontos para sequências estratégicas (Vendas, Engajamento, Storytelling, Lançamento)."),
          tableRow("Rotina Semanal", "\"Não tenho consistência\"", "Checklist interativo de segunda a domingo com estimativa de tempo (15-30 min/dia)."),
          tableRow("Analisador de Bio", "\"Meu perfil não atrai seguidores\"", "IA analisa a bio atual do usuário e entrega análise de conversão + sugestões de melhoria.")
        ]
      }),
      space(),

      // SEÇÃO 3 — ESTRUTURA DAS AULAS
      h1("3. Estrutura das Aulas para Gravar"),
      body("Ordem recomendada: da ferramenta mais simples para a mais complexa. Foco em demonstração ao vivo — mostrar a tela funcionando é o maior gatilho de conversão."),
      space(),

      h2("Módulo 0 — Boas-vindas (5 min)"),
      bullet("Mostra o dashboard, o sistema de XP e os níveis", "modulos"),
      bullet("Explica a Jornada de 30 Estações no geral", "modulos"),
      bullet("Define a expectativa: não é um curso, é uma ferramenta de execução", "modulos"),
      space(),

      h2("Módulo 1 — Jornada de Conteúdo (15 min)"),
      bullet("O que são as estações Início / Crescimento / Autoridade", "bullets"),
      bullet("Como completar a Estação 01 ao vivo: Definir Nicho em 5 minutos", "bullets"),
      bullet("Mostrar a sensação de \"tarefa concluída\" e o XP sendo ganho", "bullets"),
      space(),

      h2("Módulo 2 — Gerador de Prompts (15 min)"),
      bullet("Método NOEIXO explicado em 2 minutos", "bullets"),
      bullet("Demo ao vivo dos 5 geradores: Clareza → Persona → Ideias → Roteiro → Vendas", "bullets"),
      bullet("Mostrar o output gerado e como adaptar pro perfil", "bullets"),
      space(),

      h2("Módulo 3 — Ganchos Virais (10 min)"),
      bullet("Apresentar as categorias: Curiosidade, Autoridade, Vulnerabilidade, Urgência", "bullets"),
      bullet("Pegar um gancho ao vivo e aplicar num exemplo real de Reel", "bullets"),
      bullet("Mostrar a diferença entre gancho genérico e gancho calibrado pro nicho", "bullets"),
      space(),

      h2("Módulo 4 — Formatos que Viralizam (10 min)"),
      bullet("Ligação Oculta / Pergunta-Resposta / Problema-Solução — análise de 1 Reel real de cada", "bullets"),
      bullet("Como identificar qual formato serve para cada objetivo (alcance, engajamento, venda)", "bullets"),
      space(),

      h2("Módulo 5 — Stories que Vendem (10 min)"),
      bullet("Os 4 frameworks: Vendas / Engajamento / Storytelling / Lançamento", "bullets"),
      bullet("Montar ao vivo uma sequência de vendas do zero, story por story", "bullets"),
      bullet("Mostrar o link entre stories e DM (colheita)", "bullets"),
      space(),

      h2("Módulo 6 — Rotina Semanal + Analisador de Bio (10 min)"),
      bullet("Mostrar o checklist interativo de segunda a domingo", "bullets"),
      bullet("Demo do Analisador de Bio ao vivo com uma bio real", "bullets"),
      bullet("Encerramento: próximos passos dentro da Jornada", "bullets"),
      space(),

      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun({ text: "Tempo total estimado de gravação: ~75 minutos de conteúdo.", bold: true, size: 24, color: "1A1A2E" })]
      }),
      space(),

      // SEÇÃO 4 — STORIES
      h1("4. Estratégia de Stories para Aumentar Views e Vender"),

      h2("Por que as views caem (causa raiz)"),
      body("O Instagram mede retenção entre stories. Se as pessoas pulam ou saem no story 2, o algoritmo enterra os próximos. O problema não é alcance — é que os primeiros stories não prendem o suficiente para o próximo ser entregue."),
      space(),

      h2("Os 3 Mecanismos para Aumentar Views"),
      boldLine("1. Gancho no Story 1: ", "O primeiro story decide se a pessoa assiste o resto. Precisa parar o dedo."),
      boldLine("2. Loop entre stories: ", "Cada story precisa criar razão para ver o próximo. Informação incompleta, \"a resposta tá no próximo\"."),
      boldLine("3. Interação nos primeiros 3 stories: ", "Enquete, caixinha ou slider antes do meio. Quem interage vê todos os próximos — e o algoritmo entrega mais."),
      space(),

      h2("Funil de Stories — Venda Somente no Final"),
      body("A venda no último story converte muito mais porque quem chegou até ali já está quente. Não desperdice CTA em audiência fria."),
      space(),
      bullet("Story 1 — GANCHO (para o dedo)", "stories"),
      bullet("Story 2 — CONEXÃO (cria identificação)", "stories"),
      bullet("Story 3 — INTERAÇÃO (enquete/caixinha — aumenta alcance algorítmico)", "stories"),
      bullet("Story 4 — CONTEÚDO DE VALOR (autoridade)", "stories"),
      bullet("Story 5 — PROVA (print de resultado ou depoimento)", "stories"),
      bullet("Story 6 — VENDA (colheita — CTA para DM ou link)", "stories"),
      space(),

      h2("Plano de 7 Dias para Vender o Mapa do Engajamento"),
      space(),
      new Table({
        columnWidths: [1400, 2200, 5760],
        margins: { top: 80, bottom: 80, left: 160, right: 160 },
        rows: [
          weekRow("Dia", "Tipo", "O que postar", true),
          weekRow("Qui (hoje)", "Curiosidade", "Bastidor da gravação — tela aberta, sem explicar. \"Gravando as aulas hoje. Esse negócio vai mudar como tu cria conteúdo.\""),
          weekRow("Sex", "Contraste", "\"Jeito antigo: curso de 40h. Jeito novo: copia o prompt, grava o Reel. Fim.\" — mostrar a diferença em texto."),
          weekRow("Sáb", "Conexão", "Story com Thaís — ela pergunta: \"mas como a pessoa sabe o que pedir pra IA?\" Matheus mostra o Gerador de Prompts."),
          weekRow("Dom", "Autoridade", "Print de resultado real de aluno (ou resultado próprio). Sem texto excessivo — deixar o resultado falar."),
          weekRow("Seg", "Demo", "Storyvlog mostrando o Gerador de Prompts funcionando em 30 segundos na tela. Sem edição, câmera distante."),
          weekRow("Ter", "Engajamento", "Enquete: \"Tu trava mais em: criar o roteiro / achar o gancho / ser consistente?\" — resultado vira conteúdo do dia seguinte."),
          weekRow("Qua", "Venda", "Colheita: \"Mapa do Engajamento abre amanhã. Manda MAPA aqui.\" Foto natural, sem vídeo, texto na tela.")
        ]
      }),
      space(),

      h2("Regras de Gravação dos Stories"),
      bullet("Tom de conversa: como se estivesse falando com amigo no FaceTime", "bullets"),
      bullet("Usar \"tu\" — nunca \"você\" nos stories falados", "bullets"),
      bullet("Não regravar mais de 2x — imperfeição gera conexão", "bullets"),
      bullet("Variar: vídeo falado + foto com texto + storyvlog + enquete", "bullets"),
      bullet("Máximo 8 stories por dia em dia normal", "bullets"),
      bullet("Sempre responder quem interagir — compartilhar prints nos stories seguintes", "bullets"),
      space(),

      // SEÇÃO 5 — POSICIONAMENTO DE VENDA
      h1("5. Como Posicionar o Mapa do Engajamento na Venda"),

      h2("O Contraste (Velho vs. Novo)"),
      boldLine("Jeito Antigo: ", "Comprar um curso de 40 horas, assistir aulas teóricas, tentar aplicar sozinho, ficar travado na tela em branco e desistir."),
      boldLine("Jeito Novo: ", "Entrar na plataforma, clicar na Estação 1, copiar o prompt, colar no ChatGPT, ter o nicho definido em 2 minutos. Ir para a biblioteca de ganchos, escolher um, gravar o Reel. Fim."),
      space(),

      h2("A Ancoragem de Preço"),
      body("Você não está vendendo um curso — está vendendo Software + Metodologia (SaaS + Info)."),
      body("\"Só o acesso a um gerador de prompts focado em Instagram custaria R$97/mês. Só um banco de ganchos atualizado custaria R$47. Você leva o ecossistema completo por [Preço da Oferta].\""),
      space(),

      h2("A Demonstração Prática (Show, Don't Tell)"),
      body("A melhor forma de vender uma ferramenta de software é mostrando ela funcionando. Seus conteúdos de fundo de funil devem ser \"tour pela plataforma\"."),
      bullet("Mostre o Gerador de Prompts criando um roteiro em tempo real", "bullets"),
      bullet("Mostre a biblioteca de Ganchos Virais com filtros de categoria", "bullets"),
      bullet("Mostre a barra de progresso XP e os níveis de gamificação", "bullets"),
      body("A tangibilidade de ver o software funcionando ativa o gatilho da facilidade e elimina a objeção de \"será que funciona pra mim?\""),
      space(),

      // RODAPÉ
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 600, after: 120 },
        children: [new TextRun({ text: "Documento gerado por Claude Code — Sistema de Agentes @omatheus.ai", size: 18, color: "AAAAAA", italics: true })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "19/03/2026", size: 18, color: "AAAAAA", italics: true })]
      }),

    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("C:/agentes/documentos/Mapa_do_Engajamento_Estrategia_Completa.docx", buffer);
  console.log("Documento salvo com sucesso.");
});

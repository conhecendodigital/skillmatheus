# Instagram Browser Automation — Regras de Comportamento Humano

## Princípio geral
Toda ação via Playwright no Instagram deve simular comportamento humano real.
NUNCA executar ações em sequência rápida. SEMPRE adicionar delays entre ações.

## Tabela de delays obrigatórios

| Ação | Delay mínimo | Delay máximo | Observação |
|---|---|---|---|
| Entre abrir DMs diferentes | 45s | 120s | Variar aleatoriamente |
| Antes de digitar mensagem | 3s | 8s | Simula leitura do perfil |
| Velocidade de digitação | 80ms | 200ms | Por caractere |
| Após enviar mensagem | 30s | 90s | Antes de ir pra próxima |
| Entre ações de scroll | 2s | 5s | Movimento natural |
| Entre sessões de trabalho | 10min | 30min | Pausas obrigatórias |
| Máximo de DMs por hora | — | 10 | Nunca ultrapassar |
| Máximo de DMs por dia | — | 40 | Limite seguro |

## Padrão de código para delays

```javascript
// Delay aleatório entre min e max milissegundos
async function humanDelay(minMs, maxMs) {
  const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  await new Promise(resolve => setTimeout(resolve, delay));
}

// Exemplos de uso:
await humanDelay(45000, 120000);  // entre DMs
await humanDelay(3000, 8000);     // antes de digitar
await humanDelay(30000, 90000);   // após enviar
```

## Padrão de digitação humana

```javascript
async function humanType(page, selector, text) {
  await page.click(selector);
  await humanDelay(500, 1500); // pausa antes de começar a digitar

  for (const char of text) {
    await page.keyboard.type(char);
    // Delay variável por caractere (mais lento em pontuação)
    const isPunctuation = /[.,!?;:]/.test(char);
    await humanDelay(
      isPunctuation ? 150 : 80,
      isPunctuation ? 400 : 200
    );
  }

  await humanDelay(1000, 3000); // pausa antes de enviar
}
```

## Horários permitidos

- Início: 8h00 (horário de Brasília)
- Fim: 21h00 (horário de Brasília)
- Nunca rodar durante a madrugada

## Comportamento em caso de erro

- Se o Instagram mostrar CAPTCHA ou aviso: parar TUDO imediatamente
- Aguardar 24h antes de retomar
- Nunca tentar contornar verificações

## Sessão segura

- Usar sempre o Chrome já logado (@omatheus.ai)
- Não abrir múltiplas abas do Instagram ao mesmo tempo
- Fechar o browser ao terminar a sessão

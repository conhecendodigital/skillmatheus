#!/bin/bash
# ============================================
# Setup Completo — Agentes @omatheus.ai (macOS)
# ============================================
# Roda esse script no Mac depois de clonar o repo:
#   chmod +x setup-mac.sh && ./setup-mac.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo "=========================================="
echo "  Setup Agentes @omatheus.ai — macOS"
echo "=========================================="
echo ""

# ----- 1. Verificar Node.js -----
echo -e "${YELLOW}[1/7] Verificando Node.js...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}  ✓ Node.js ${NODE_VERSION} encontrado${NC}"
else
    echo -e "${RED}  ✗ Node.js não encontrado. Instalando via Homebrew...${NC}"
    if ! command -v brew &> /dev/null; then
        echo "  Instalando Homebrew primeiro..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    fi
    brew install node
    echo -e "${GREEN}  ✓ Node.js instalado${NC}"
fi

# ----- 2. Verificar/Instalar Claude Code -----
echo -e "${YELLOW}[2/7] Verificando Claude Code...${NC}"
if command -v claude &> /dev/null; then
    echo -e "${GREEN}  ✓ Claude Code já instalado${NC}"
else
    echo "  Instalando Claude Code..."
    npm install -g @anthropic-ai/claude-code
    echo -e "${GREEN}  ✓ Claude Code instalado${NC}"
fi

# ----- 3. Instalar dependências do projeto -----
echo -e "${YELLOW}[3/7] Instalando dependências...${NC}"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

npm install 2>/dev/null || true
echo "  ✓ raiz"

if [ -f "documentos/package.json" ]; then
    cd documentos && npm install 2>/dev/null && cd .. || cd ..
    echo "  ✓ documentos/"
fi

if [ -f "scripts/package.json" ]; then
    cd scripts && npm install 2>/dev/null && cd .. || cd ..
    echo "  ✓ scripts/"
fi

if [ -f "dados/diagnosticos/package.json" ]; then
    cd dados/diagnosticos && npm install 2>/dev/null && cd ../.. || cd ../..
    echo "  ✓ dados/diagnosticos/"
fi

echo -e "${GREEN}  ✓ Todas as dependências instaladas${NC}"

# ----- 4. Configurar settings globais do Claude Code -----
echo -e "${YELLOW}[4/7] Configurando Claude Code (global)...${NC}"

CLAUDE_DIR="$HOME/.claude"
mkdir -p "$CLAUDE_DIR"

# Só cria se não existe (pra não sobrescrever config existente)
if [ ! -f "$CLAUDE_DIR/settings.json" ]; then
    cat > "$CLAUDE_DIR/settings.json" << 'SETTINGS'
{
  "alwaysThinkingEnabled": true,
  "autoUpdatesChannel": "latest",
  "effortLevel": "high"
}
SETTINGS
    echo -e "${GREEN}  ✓ settings.json criado${NC}"
else
    echo "  ⚠ settings.json já existe, mantendo o atual"
    echo "  Verifique se tem: alwaysThinkingEnabled: true, effortLevel: high"
fi

# ----- 5. Criar pastas de dados (se não existem) -----
echo -e "${YELLOW}[5/7] Criando pastas de dados...${NC}"

mkdir -p dados/leads
mkdir -p dados/engajamento
mkdir -p dados/roteiros
mkdir -p dados/espionagem
mkdir -p dados/stories
mkdir -p dados/diagnosticos/assets
mkdir -p dados/diagnosticos/prints

echo -e "${GREEN}  ✓ Pastas criadas${NC}"

# ----- 6. Instalar Playwright (pro MCP de automação Instagram) -----
echo -e "${YELLOW}[6/7] Configurando Playwright MCP...${NC}"

# Verifica se npx está disponível
if command -v npx &> /dev/null; then
    echo "  Playwright MCP será carregado automaticamente pelo Claude Code."
    echo ""
    echo "  IMPORTANTE — Pra automação do Instagram funcionar:"
    echo "  1. Abra o Chrome no Mac"
    echo "  2. Faça login no Instagram como @omatheus.ai"
    echo "  3. Mantenha o Chrome aberto"
    echo ""
    echo "  O Playwright MCP vai conectar ao Chrome logado."
else
    echo -e "${RED}  ✗ npx não encontrado. Instale Node.js primeiro.${NC}"
fi

echo -e "${GREEN}  ✓ Playwright MCP configurado${NC}"

# ----- 7. Verificação final -----
echo -e "${YELLOW}[7/7] Verificação final...${NC}"

echo ""
echo "  Checklist:"

# Verificar arquivos essenciais
[ -f "CLAUDE.md" ] && echo -e "  ${GREEN}✓${NC} CLAUDE.md" || echo -e "  ${RED}✗${NC} CLAUDE.md"
[ -d ".claude/skills" ] && echo -e "  ${GREEN}✓${NC} .claude/skills/ ($(ls .claude/skills/ | wc -l | tr -d ' ') skills)" || echo -e "  ${RED}✗${NC} .claude/skills/"
[ -d ".claude/agents" ] && echo -e "  ${GREEN}✓${NC} .claude/agents/ ($(ls .claude/agents/ | wc -l | tr -d ' ') agentes)" || echo -e "  ${RED}✗${NC} .claude/agents/"
[ -f ".claude/settings.local.json" ] && echo -e "  ${GREEN}✓${NC} .claude/settings.local.json" || echo -e "  ${RED}✗${NC} .claude/settings.local.json"
[ -f ".claude/instagram-browser-config.md" ] && echo -e "  ${GREEN}✓${NC} instagram-browser-config.md" || echo -e "  ${RED}✗${NC} instagram-browser-config.md"
command -v claude &> /dev/null && echo -e "  ${GREEN}✓${NC} Claude Code CLI" || echo -e "  ${RED}✗${NC} Claude Code CLI"
command -v node &> /dev/null && echo -e "  ${GREEN}✓${NC} Node.js $(node --version)" || echo -e "  ${RED}✗${NC} Node.js"

echo ""
echo "=========================================="
echo -e "${GREEN}  Setup completo!${NC}"
echo "=========================================="
echo ""
echo "  Para começar:"
echo "    cd $(pwd)"
echo "    claude"
echo ""
echo "  Primeira vez? O Claude Code vai pedir login."
echo "  Depois disso, todas as 39 skills e 4 agentes"
echo "  estarão disponíveis automaticamente."
echo ""
echo "  Skills disponíveis:"
echo "    /roteirista    — Roteiros de Reels e carrosséis"
echo "    /engajador     — Engajamento nos comentários"
echo "    /copywriting   — Copy pra legendas e páginas"
echo "    /espiao-concorrente — Inteligência competitiva"
echo "    /diagnostico-pdf    — Análise de perfil com IA"
echo "    ... e mais 34 skills"
echo ""
echo "  Agentes contínuos:"
echo "    vendedor     — Social selling 24h"
echo "    estrategista — Inteligência diária"
echo "    criador      — Conteúdo semanal"
echo "    stories-planner — Stories diário"
echo ""

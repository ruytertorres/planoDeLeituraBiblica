# 🎨 AUDITORIA FORMAL: notas_overlay.js

**Data:** 27 de janeiro de 2026  
**Auditor:** Sistema Automatizado  
**Status:** ⚠️ CRÍTICO - REFATORAÇÃO NECESSÁRIA  
**Score:** 5.2/10

---

## 📋 RESUMO EXECUTIVO

| Aspecto                        | Status     | Score |
| ------------------------------ | ---------- | ----- |
| Conformidade Contratual        | ❌ CRÍTICO | 3/10  |
| Responsabilidade Única         | ❌ CRÍTICO | 4/10  |
| Tiempo Soberano (§2.1-2.2)     | ✅ OK      | 8/10  |
| Hierarquia de Camadas (§3)     | ❌ CRÍTICO | 2/10  |
| Contrato da UI (§8)            | ❌ CRÍTICO | 3/10  |
| Separação de Responsabilidades | ❌ CRÍTICO | 4/10  |
| Documentação                   | 🟡 MÉDIA   | 6/10  |

**SCORE FINAL: 5.2/10** ❌ **NÃO CONFORME - REFATORAÇÃO OBRIGATÓRIA**

---

## 🎯 ARQUIVO AUDITADO

- **Nome:** notas_overlay.js
- **Localização:** `js/core/services/notas/notas_overlay.js`
- **Tipo:** Orquestrador UI (INCORRETO - vide §8)
- **Linhas:** 458
- **Versão:** 1.1.0 (COM ATALHOS)

---

## ❌ VIOLAÇÕES CRÍTICAS

### Violação #1: Hierarquia Quebrada (§3) ❌

**Critério:** UI não deve conter lógica de orquestração, domínio não deve manipular DOM.

**Achado - Linha 6-7:**

```javascript
export function initNotasOverlay(notasManager) {
  // ❌ MISTURA de Orquestração + UI em UM arquivo
  const botaoAbrir = document.getElementById("btn-notas");
  const overlay = document.getElementById("notas-overlay");
  const editor = document.getElementById("notas-editor");
  const btnFechar = document.getElementById("btn-fechar");
  const btnLimpar = document.getElementById("btn-limpar");
```

**Problema:**

- 458 linhas de Orquestração + UI misturadas
- Não pode estar em `js/core/services/notas/`
- Violação direta de § 3 (Hierarquia de Camadas)

**Deve ser dividido em:**

1. **NotasOverlayOrquestrador.js** (em `js/core/services/notas/`) - Orquestração
2. **NotasOverlayUI.js** (em `js/ui/components/notas/`) - Apresentação

---

### Violação #2: Responsabilidade Múltipla (SRP) ❌

**Critério:** Um arquivo = Uma responsabilidade

**Achados no arquivo:**

```javascript
// RESPONSABILIDADE 1: Gerenciar estado do overlay
const abrirNotas = () => { ... };
const fecharNotas = () => { ... };
const alternarNotas = () => { ... };

// RESPONSABILIDADE 2: Gerenciar conteúdo do editor
const carregarNotasDoDia = () => { ... };
editor.addEventListener("input", () => { ... });

// RESPONSABILIDADE 3: Toolbar de formatação
function criarToolbar() { ... }
initNotasToolbar(editor);

// RESPONSABILIDADE 4: Atalhos de teclado
document.addEventListener("keydown", (e) => { ... });
editor.addEventListener("keydown", (e) => { ... });

// RESPONSABILIDADE 5: Limpeza de notas
if (btnLimpar) { btnLimpar.addEventListener("click", () => { ... }); }

// RESPONSABILIDADE 6: Exportação
function exportarNotas() { ... }
```

**Violação:** **6 responsabilidades em 1 arquivo** ❌

---

### Violação #3: Falta de Separação DOM/Lógica ❌

**Critério:** Lógica não deve estar acoplada a DOM queries.

**Exemplo - Linhas 224-246:**

```javascript
// LÓGICA DE ATALHOS misturada com DOM
document.addEventListener("keydown", (e) => {
  // ESC fecha as notas
  if (e.key === "Escape" && notasAbertas()) {
    e.preventDefault();
    fecharNotas(); // ❌ Chama UI diretamente
    return;
  }

  // Ctrl+Alt+N abre/fecha as notas
  if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "n") {
    e.preventDefault();
    alternarNotas(); // ❌ Chama UI diretamente
  }
});
```

**Problema:**

- Lógica de atalhos está misturada com manipulação de DOM
- Se mudar keybinding, precisa editar arquivo de Orquestração
- Não é testável isoladamente

---

### Violação #4: Console.log em Produção ❌

**Linha 455:**

```javascript
console.log("Bloco de notas inicializado com atalhos de teclado");
```

**Problema:**

- Violação de (§6 - Zero Logs)
- Deve ser removido

---

### Violação #5: ENTER Handler Muito Complexo ❌

**Linhas 265-369 (105 linhas!):**

```javascript
editor.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;

  e.preventDefault();

  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return;

  const range = sel.getRangeAt(0);
  const startContainer = range.startContainer;
  const startOffset = range.startOffset;

  // Encontra o bloco atual (P, H2, H3, LI)
  let blocoAtual = startContainer;
  while (blocoAtual && blocoAtual !== editor) { ... }

  // 3x if/else com lógica de divisão de blocos
  // 100+ linhas de lógica de DOM manipulation
});
```

**Problema:**

- ❌ Deve estar em função separada
- ❌ Muito complexo para estar inline
- ❌ Difícil de testar
- ❌ Difícil de manter

---

### Violação #6: Uso Direto de querySelector em Handlers ❌

**Linhas 276-286:**

```javascript
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey || e.metaKey) {
    switch (e.key.toLowerCase()) {
      case "b": // Ctrl+B - Negrito
        e.preventDefault();
        document.querySelector('[data-nota-action="bold"]')?.click(); // ❌ Busca DOM
        break;
```

**Problema:**

- ❌ Handler faz querySelector toda vez que tecla é pressionada
- ❌ Performance ruim
- ❌ Acoplamento tight ao DOM
- ✅ Deveria cachear elementos na inicialização

---

### Violação #7: Falta de Validação de Input ❌

**Linha 174:**

```javascript
function carregarNotasDoDia() {
  const conteudo = notasManager.getConteudo(); // ❌ Sem validação
  editor.innerHTML = conteudo && conteudo.trim() ? conteudo : "<p></p>";
  // ❌ XSS vulnerable! notasManager.getConteudo() pode conter código malicioso
}
```

**Problema:**

- ❌ innerHTML com conteúdo não sanitizado
- ❌ Potencial XSS
- ✅ Deveria usar textContent ou DOMPurify

---

### Violação #8: Exportação com Acesso Direto a notasManager.diaAtual ❌

**Linhas 387-420:**

```javascript
function exportarNotas() {
  const conteudo = notasManager.getConteudo();
  // ...
  <h1>Anotações - Dia ${notasManager.diaAtual}</h1>; // ❌ Acesso direto
  a.download = `anotacoes-dia-${notasManager.diaAtual}.html`;
}
```

**Problema:**

- ❌ Acessa propriedade privada de notasManager
- ❌ notasManager é de Domínio, não deve expor diaAtual assim
- ❌ Torna exportação dependente de implementação interna

---

## 📊 ANÁLISE DETALHADA

### Estrutura Atual (ERRADA)

```
notas_overlay.js (458 linhas)
├── initNotasOverlay(notasManager) ← FUNÇÃO MEGA
│   ├── Estado (overlay, editor, botões)
│   ├── criarToolbar()
│   ├── abrirNotas()
│   ├── fecharNotas()
│   ├── alternarNotas()
│   ├── carregarNotasDoDia()
│   ├── keydown handler GLOBAL (atalhos)
│   ├── keydown handler EDITOR (formatação + ENTER)
│   ├── input handler (persistência)
│   ├── click handler btnLimpar
│   ├── exportarNotas()
│   └── click handler btnExportar
```

**Problemas:**

- ❌ 1 função gigante (458 linhas)
- ❌ 6+ responsabilidades
- ❌ 8+ listeners registrados
- ❌ Sem separação de concerns
- ❌ Impossível testar isoladamente

---

### Estrutura Correta (PROPOSTA)

```
NotasOverlayOrquestrador.js (100-120 linhas)
├── Responsabilidades:
│   ├── Coordenar abertura/fechamento
│   ├── Sincronizar com dia alterado
│   ├── Emitir eventos (notas-abertas, notas-fechadas)
│   └── Gerenciar estado de overlay
└── Não acessa DOM (apenas eventos)

NotasOverlayUI.js (200-250 linhas)
├── Responsabilidades:
│   ├── Renderizar overlay
│   ├── Listeners de UI (botões)
│   ├── Handlers de teclado (ESC, Ctrl+Alt+N)
│   └── Sincronizar visual (classes CSS)
└── Acessa DOM livremente (é UI)

NotasToolbarUI.js (150-200 linhas)
├── Responsabilidades:
│   ├── Renderizar toolbar
│   ├── Handlers de formatação
│   └── Atalhos de teclado (Ctrl+B, Ctrl+I, etc)
└── Já existe notas_toolbar.js (reutilizar)

NotasEnterHandler.js (50-100 linhas)
├── Responsabilidades:
│   ├── Lógica de divisão de blocos ao pressionar ENTER
│   └── Manipulação de Selection/Range
└── Função pura (testável)

NotasExportUI.js (50-80 linhas)
├── Responsabilidades:
│   ├── Botão de exportação
│   ├── Dialog de confirmação
│   └── Download de arquivo
└── Acessa DOM e notasManager
```

---

## 🔴 IMPACTO NO SISTEMA

### Risco de Produção: **ALTO**

1. **Manutenibilidade:** 📉 PÉSSIMA
   - 458 linhas em 1 função é impossível de manter
   - Qualquer mudança pode quebrar outra funcionalidade

2. **Testabilidade:** 📉 NENHUMA
   - Não pode ser testada isoladamente
   - Acoplada a DOM, notasManager, eventos globais

3. **Reutilização:** 📉 IMPOSSÍVEL
   - Outro projeto não pode aproveitar handlers
   - Tudo é spaghetti code

4. **Segurança:** 📉 VULNERÁVEL
   - innerHTML sem sanitização (XSS)
   - Acesso a propriedades privadas

5. **Performance:** 📉 RUIM
   - querySelector em cada keydown é desperdiçador
   - Sem event delegation

---

## ✅ RECOMENDAÇÕES

### 1. SEPARA EM 4 ARQUIVOS (IMEDIATO)

```javascript
// js/core/services/notas/NotasOverlayOrquestrador.js
export class NotasOverlayOrquestrador {
  constructor(notasManager) {
    this.notasManager = notasManager;
    this.aberto = false;
  }

  abrir() {
    this.aberto = true;
    document.dispatchEvent(new CustomEvent("notas-abertas"));
  }

  fechar() {
    this.aberto = false;
    document.dispatchEvent(new CustomEvent("notas-fechadas"));
  }

  alternar() {
    this.aberto ? this.fechar() : this.abrir();
  }

  carregarNotasDoDia(diaAtual) {
    const conteudo = this.notasManager.getConteudo(diaAtual);
    document.dispatchEvent(
      new CustomEvent("notas-carregadas", { detail: { conteudo } }),
    );
  }
}
```

```javascript
// js/ui/components/notas/NotasOverlayUI.js
export function initNotasOverlayUI(orquestrador, notasManager) {
  const overlay = document.getElementById("notas-overlay");
  const editor = document.getElementById("notas-editor");
  const botaoAbrir = document.getElementById("btn-notas");
  const btnFechar = document.getElementById("btn-fechar");

  // Listeners
  botaoAbrir.addEventListener("click", () => orquestrador.alternar());
  btnFechar.addEventListener("click", () => orquestrador.fechar());

  // Atalhos globais
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("aberto")) {
      orquestrador.fechar();
    }
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "n") {
      orquestrador.alternar();
    }
  });

  // Eventos do orquestrador
  document.addEventListener("notas-abertas", () => {
    overlay.classList.add("aberto");
    editor.focus();
  });

  document.addEventListener("notas-fechadas", () => {
    overlay.classList.remove("aberto");
  });
}
```

```javascript
// js/ui/components/notas/NotasEnterHandler.js
export function setupEnterHandler(editor) {
  editor.addEventListener("keydown", handleEnter);
}

function handleEnter(e) {
  if (e.key !== "Enter") return;

  e.preventDefault();

  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return;

  const range = sel.getRangeAt(0);
  // ... resto da lógica
}
```

---

### 2. REMOVER console.log

**Linha 455:** Delete

```javascript
// ❌ REMOVER
console.log("Bloco de notas inicializado com atalhos de teclado");
```

---

### 3. SANITIZAR innerHTML

**Linha 172-174:**

```javascript
// ❌ ANTES
editor.innerHTML = conteudo && conteudo.trim() ? conteudo : "<p></p>";

// ✅ DEPOIS (usar notas_toolbar.js que já faz sanitização)
const sanitized = sanitizeHTML(conteudo);
editor.innerHTML = sanitized && sanitized.trim() ? sanitized : "<p></p>";
```

---

### 4. CACHE DE ELEMENTOS

**Linhas 276-286:**

```javascript
// ❌ ANTES
document.querySelector('[data-nota-action="bold"]')?.click();

// ✅ DEPOIS
const buttons = {
  bold: document.querySelector('[data-nota-action="bold"]'),
  italic: document.querySelector('[data-nota-action="italic"]'),
  underline: document.querySelector('[data-nota-action="underline"]'),
  // ...
};

// No handler:
buttons.bold?.click();
```

---

### 5. USAR EVENT DELEGATION

```javascript
// ❌ ANTES - Listener em cada botão
botoes.forEach((btn) => {
  button.addEventListener("click", () => { ... });
});

// ✅ DEPOIS - Delegação
toolbar.addEventListener("click", (e) => {
  if (e.target.dataset.notaAction === "bold") {
    applyBold();
  }
});
```

---

## 🧪 PLANO DE REFATORAÇÃO

### Fase 1: Separar Orquestração (Dia 1)

- [ ] Criar NotasOverlayOrquestrador.js
- [ ] Mover lógica de estado
- [ ] Criar eventos CustomEvent
- [ ] Auditar conformidade

### Fase 2: Separar UI (Dia 1-2)

- [ ] Criar NotasOverlayUI.js em js/ui/components/notas/
- [ ] Mover listeners de DOM
- [ ] Conectar com orquestrador via eventos
- [ ] Auditar conformidade

### Fase 3: Separar ENTER Handler (Dia 2)

- [ ] Criar NotasEnterHandler.js
- [ ] Extrair lógica de 105 linhas
- [ ] Testar isoladamente
- [ ] Auditar conformidade

### Fase 4: Separar Exportação (Dia 2-3)

- [ ] Criar NotasExportUI.js
- [ ] Remover acesso a notasManager.diaAtual
- [ ] Usar evento ou callback
- [ ] Auditar conformidade

### Fase 5: Cleanup & Tests (Dia 3)

- [ ] Remover console.log
- [ ] Adicionar sanitização
- [ ] Cache de elementos
- [ ] Testes unitários
- [ ] Commit & Push

---

## 📝 CONCLUSÃO

### Status: ❌ NÃO CONFORME - REFATORAÇÃO OBRIGATÓRIA

**Problemas Críticos:**

- ❌ Hierarquia de camadas quebrada
- ❌ 6 responsabilidades em 1 arquivo
- ❌ 458 linhas em 1 função
- ❌ console.log em produção
- ❌ XSS vulnerability (innerHTML)
- ❌ Performance ruim (querySelector em handlers)

**Não Autorizado para Produção até refatoração.**

**Impacto:** 🔴 ALTO

- Impossível de manter
- Impossível de testar
- Alto risco de bugs
- Não segue contrato

---

## 📋 CHECKLIST DE REFATORAÇÃO

- [ ] NotasOverlayOrquestrador.js criado (9/10 esperado)
- [ ] NotasOverlayUI.js criado em js/ui/components/notas/ (9/10 esperado)
- [ ] NotasEnterHandler.js criado (8/10 esperado)
- [ ] NotasExportUI.js criado (8/10 esperado)
- [ ] console.log removido
- [ ] innerHTML sanitizado
- [ ] Elementos cacheados
- [ ] Event delegation implementada
- [ ] main.js atualizado com imports
- [ ] Todos os arquivos auditados
- [ ] Todos os testes passando
- [ ] Commits & Push realizados

---

**Assinado:** Auditoria Automatizada  
**Data:** 27/01/2026  
**Versão do Contrato:** 1.2.0  
**Próximo Audit:** Após refatoração (esperado 9.2/10)

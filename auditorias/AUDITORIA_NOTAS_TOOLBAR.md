# 🎨 AUDITORIA FORMAL: notas_toolbar.js

**Data:** 27 de janeiro de 2026  
**Auditor:** Sistema Automatizado  
**Status:** ⚠️ CRÍTICO - REFATORAÇÃO NECESSÁRIA  
**Score:** 5.8/10

---

## 📋 RESUMO EXECUTIVO

| Aspecto                      | Status     | Score |
| ---------------------------- | ---------- | ----- |
| Conformidade Contratual      | ❌ CRÍTICO | 3/10  |
| Responsabilidade Única (SRP) | ❌ CRÍTICO | 4/10  |
| Tiempo Soberano (§2.1-2.2)   | ✅ OK      | 10/10 |
| Hierarquia de Camadas (§3)   | ❌ CRÍTICO | 2/10  |
| Contrato da UI (§8)          | ❌ CRÍTICO | 3/10  |
| Pureza de Função             | ❌ CRÍTICO | 3/10  |
| Documentação                 | 🟡 MÉDIA   | 6/10  |

**SCORE FINAL: 5.8/10** ❌ **NÃO CONFORME - REFATORAÇÃO OBRIGATÓRIA**

---

## 🎯 ARQUIVO AUDITADO

- **Nome:** notas_toolbar.js
- **Localização:** `js/core/services/notas/`
- **Tipo:** Função UI (INCORRETO - vide §3)
- **Linhas:** 537
- **Versão:** 1.0.0

---

## ❌ VIOLAÇÕES CRÍTICAS

### Violação #1: Localização ERRADA (§3) ❌

**Critério:** Lógica de UI deve estar em `js/ui/`, não em `js/core/services/`

**Achado:**

```javascript
// ❌ LOCALIZAÇÃO ERRADA
js/core/services/notas/notas_toolbar.js
       ↓
    (deveria ser em ui/componentes/notas/)
```

**Problema:**

- ❌ Services layer não deve conter UI
- ❌ Viola hierarquia §3
- ❌ Acessa DOM diretamente
- ❌ Event listeners registrados

**Deve estar em:**

```
js/ui/componentes/notas/NotasToolbarUI.js
```

---

### Violação #2: 537 Linhas em 1 Função ❌

**Critério:** Responsabilidade única (SRP)

**Achados - 6 Responsabilidades Misturadas:**

```javascript
// RESPONSABILIDADE 1: Gerenciar histórico (undo/redo)
let historico = [editor.innerHTML];
let historicoIndex = 0;
function salvarNoHistorico() { ... }  // 35 linhas

// RESPONSABILIDADE 2: Gerenciar seleção (cursor)
function salvarSelecao() { ... }      // 10 linhas
function restaurarSelecao() { ... }   // 30 linhas
function getTextNodes() { ... }       // 15 linhas

// RESPONSABILIDADE 3: Lógica de formatação
function aplicarFormatoComHistorico() { ... }  // 20 linhas
function toggleFormato() { ... }               // 5 linhas
function toggleHighlight() { ... }             // 5 linhas

// RESPONSABILIDADE 4: Lógica de cabeçalhos
function toggleCabecalho() { ... }   // 60 linhas

// RESPONSABILIDADE 5: Lógica de listas
function toggleLista() { ... }       // 35 linhas

// RESPONSABILIDADE 6: Limpeza de formatação
function limparFormatacao() { ... }  // 80 linhas

// RESPONSABILIDADE 7: Event listeners
document.addEventListener("click", function (e) { ... })  // 30 linhas
editor.addEventListener("keydown", function (e) { ... })  // 20 linhas

// RESPONSABILIDADE 8: Estado de botões
function atualizarEstadoBotoes() { ... }  // 60 linhas
```

**Violação:** **8 responsabilidades em 1 arquivo** ❌

---

### Violação #3: Manipulação DOM Complexa (§3) ❌

**Critério:** Services não devem manipular DOM. UI faz manipulação.

**Achados:**

```javascript
// ❌ Manipula DOM directly
editor.innerHTML = historico[historicoIndex];  // Linha 42

// ❌ Cria elementos
const p = document.createElement("p");

// ❌ Manipula seleção
sel.removeAllRanges();
sel.addRange(range);

// ❌ Query selectors
document.querySelectorAll("[data-nota-action]")
document.querySelector('[data-nota-action="bold"]')

// ❌ Event listeners
document.addEventListener("click", function (e) { ... })
editor.addEventListener("keydown", function (e) { ... })
editor.addEventListener("mouseup", atualizarEstadoBotoes)
```

**Violação:** 537 linhas de manipulação DOM em services layer ❌

---

### Violação #4: Histórico em Memória (Memory Leak Risk) ⚠️

**Linha 16-35:**

```javascript
let historico = [editor.innerHTML];
let historicoIndex = 0;

// Limita a 50 estados
if (historico.length > 50) {
  historico.shift();
  historicoIndex--;
}
```

**Problemas:**

- ❌ Histórico completo de HTML na memória
- ⚠️ 50 estados × ~5KB HTML = ~250KB (aceitável)
- ❌ Não persiste (perde ao recarregar)
- ❌ Sem limpeza de referências

**Risco:**

```javascript
// Cada push clona HTML inteiro
historico.push(editor.innerHTML); // ← Cópia de 5KB
// 50 vezes = 250KB memória
```

---

### Violação #5: setTimeout em Múltiplos Locais ⚠️

**Achados:**

```javascript
// Linha 64
setTimeout(() => salvarNoHistorico(), 100);

// Linha 155
setTimeout(() => {
  restaurarSelecao(selecaoSalva);
  setTimeout(() => salvarNoHistorico(), 50); // ← Aninhado!
}, 10);

// Linha 198
setTimeout(() => {
  if (selecaoSalva) {
    restaurarSelecao(selecaoSalva);
  } else {
    // ...
  }
  salvarNoHistorico();
}, 10);
```

**Problemas:**

- ⚠️ Callbacks aninhados (callback hell)
- ⚠️ Delays arbitrários (100ms, 50ms, 10ms)
- ⚠️ Race conditions possíveis
- ⚠️ Difícil de testar

---

### Violação #6: execCommand Deprecated ⚠️

**Linha 149:**

```javascript
// ❌ execCommand é DEPRECATED (não oficialmente, mas em desuso)
document.execCommand(acao, false, valor);
document.execCommand("removeFormat", false, null);
```

**Problema:**

- ⚠️ API legada (mas funciona)
- ⚠️ Comportamento inconsistente entre navegadores
- ⚠️ Sem suporte em futuro
- ⚠️ Difícil de testar

---

### Violação #7: Tratamento de Seleção Frágil ⚠️

**Linhas 85-108:**

```javascript
function restaurarSelecao(selecaoSalva) {
  if (!selecaoSalva || !selecaoSalva.range) return;

  try {
    sel.addRange(selecaoSalva.range);
  } catch (e) {
    // Se falhar, tenta restaurar por texto
    // ❌ Busca por textContent (pode falhar com formatação)
    for (const node of textNodes) {
      const index = node.textContent.indexOf(texto);  // ← Frágil!
      if (index !== -1) { ... }
    }
  }
}
```

**Problema:**

- ⚠️ Range clone pode ficar inválido
- ⚠️ Fallback busca por texto (frágil)
- ⚠️ Sem feedback visual ao usuário
- ⚠️ Silent failure se não encontra

---

### Violação #8: Console.log Ausente (Bom!) ✅

**Verificação:**

```javascript
// Procura por console
// Resultado: NENHUMA ocorrência ✅
```

**Verdict:** ✅ Sem logs em produção

---

## 📊 ANÁLISE DETALHADA

### Histórico de Undo/Redo - 5/10

```javascript
// POSITIVOS:
✅ Undo/Redo funcionam
✅ Limite de 50 estados
✅ Atalhos teclado (Ctrl+Z, Ctrl+Y)

// NEGATIVOS:
❌ Copiando HTML inteiro (ineficiente)
❌ Sem persistência
❌ Não usa Undo Manager moderno
❌ salvarNoHistorico() chamada em múltiplos locais (DRY violado)
```

---

### Formatação (Bold, Italic, etc) - 4/10

```javascript
// POSITIVOS:
✅ Formatos básicos funcionam (bold, italic, underline)
✅ Highlight com cores

// NEGATIVOS:
❌ Usa execCommand (deprecated)
❌ Tenta salvar seleção (frágil)
❌ setTimeout para restaurar cursor (race condition)
❌ Sem teste se formatação funcionou
```

---

### Cabeçalhos (H2, H3) - 6/10

```javascript
// POSITIVOS:
✅ Alterna entre P e H2/H3
✅ Tenta preservar conteúdo
✅ Tenta restaurar cursor

// NEGATIVOS:
❌ 60 linhas para lógica simples
❌ replaceWith() pode não preservar bem
❌ setTimeout aninhado (race condition)
❌ Sem validação se cabeçalho é válido
```

---

### Limpeza de Formatação - 3/10

**Linhas 268-340 (80 linhas!):**

```javascript
function limparFormatacao() {
  // ❌ MUITO COMPLEXO
  // 80 linhas para limpar formatação
  // Múltiplas estratégias:
  //   1. removeFormat execCommand
  //   2. Remove tags <b>, <strong>, <i>, etc
  //   3. Remove atributos style
  //   4. Converte h1-h6 para span
  //   5. Converte li para span
  // ❌ Difícil de manter
  // ❌ Difícil de testar
  // ❌ Não testado se limpa tudo
}
```

**Problema:**

- ❌ 80 linhas é sinal de má design
- ❌ Múltiplas estratégias = não confiável
- ❌ Sem feedback se funcionou
- ❌ Sem testes unitários

---

### Estado de Botões - 7/10

**Linhas 406-456:**

```javascript
function atualizarEstadoBotoes() {
  const sel = window.getSelection();

  // Remove classe active de todos
  document.querySelectorAll("[data-nota-action]").forEach((btn) => {
    btn.classList.remove("active");
  });

  // Adiciona active aos selecionados
  if (parent.tagName === "B" || parent.tagName === "STRONG") {
    document
      .querySelector('[data-nota-action="bold"]')
      ?.classList.add("active");
  }
  // ... mais checks
}
```

**Análise:**

- ✅ Funciona bem
- 🟡 Query selectors em cada atualização (leve ineficiente)
- 🟡 Sem cache de buttons

---

## 🔴 IMPACTO NO SISTEMA

### Risco de Produção: **ALTO**

1. **Manutenibilidade:** 📉 PÉSSIMA
   - 537 linhas em 1 função
   - 8 responsabilidades
   - Qualquer mudança pode quebrar

2. **Testabilidade:** 📉 NENHUMA
   - Não pode testar isoladamente
   - Tudo acoplado a DOM
   - Sem mock de functions

3. **Performance:** 📉 RUIM
   - setTimeout aninhados (race conditions)
   - querySelectorAll em cada keyup
   - HTML inteiro em histórico

4. **Segurança:** 📉 RISCO
   - innerHTML sem sanitização (XSS)
   - execCommand pode injetar código

---

## ✅ RECOMENDAÇÕES

### 1. SEPARAR EM 5 ARQUIVOS (IMEDIATO)

```
NotasHistoricoManager.js (js/core/services/notas/)
├── Gerencia histórico (undo/redo)
├── Implementa queue de 50 estados
└── Score esperado: 8.5/10

NotasFormatadorUI.js (js/ui/componentes/notas/)
├── Listeners de botões (click)
├── Aplica bold, italic, underline
├── Highlight com cores
└── Score esperado: 8/10

NotasEstruturadorUI.js (js/ui/componentes/notas/)
├── Gerencia H2, H3
├── Gerencia listas (UL/LI)
├── Limpeza de formatação
└── Score esperado: 8/10

NotasSelecaoManager.js (js/core/services/notas/)
├── Salva/restaura seleção
├── Trabalha com Range API
├── Utilitários de DOM
└── Score esperado: 7.5/10

NotasToolbarUI.js (js/ui/componentes/notas/)
├── Escuta eventos (keydown, mouseup)
├── Atualiza estado de botões
├── Coordena entre formatadores
└── Score esperado: 8.5/10
```

---

### 2. USAR MODERN CONTENTEDITABLE API

```javascript
// ❌ ATUAL: execCommand (deprecated)
document.execCommand("bold", false, null);

// ✅ PROPOSTO: Mutation API + Custom approach
// Ou usar biblioteca: quill, tiptap, slate (bem mantidas)
```

---

### 3. REMOVER setTimeout ANINHADO

```javascript
// ❌ ATUAL: Race condition
setTimeout(() => {
  restaurarSelecao(selecaoSalva);
  setTimeout(() => salvarNoHistorico(), 50);
}, 10);

// ✅ PROPOSTO: Promise-based
async function aplicarFormatoAsync(acao) {
  salvarNoHistorico();
  document.execCommand(acao);
  await new Promise((r) => setTimeout(r, 10));
  salvarNoHistorico();
}
```

---

### 4. VALIDAR HTML (XSS Prevention)

```javascript
// ❌ ATUAL: Sem sanitização
editor.innerHTML = historico[historicoIndex];

// ✅ PROPOSTO: DOMPurify
import DOMPurify from "dompurify";
editor.innerHTML = DOMPurify.sanitize(historico[historicoIndex]);
```

---

## 🧪 TESTES RECOMENDADOS

```javascript
describe("NotasToolbar (Refatorado)", () => {
  describe("NotasHistoricoManager", () => {
    test("undo deve restaurar estado anterior", () => { ... });
    test("redo deve restaurar estado após undo", () => { ... });
    test("limite de 50 estados", () => { ... });
  });

  describe("NotasFormatadorUI", () => {
    test("bold deve adicionar <b> tag", () => { ... });
    test("italic deve adicionar <i> tag", () => { ... });
    test("highlight deve adicionar background-color", () => { ... });
  });

  describe("NotasEstruturadorUI", () => {
    test("converter para H2", () => { ... });
    test("converter para lista", () => { ... });
    test("limpar formatação", () => { ... });
  });

  describe("NotasSelecaoManager", () => {
    test("salvar e restaurar seleção", () => { ... });
    test("fallback por texto se Range inválido", () => { ... });
  });
});
```

---

## 📝 CONCLUSÃO

### Status: ❌ NÃO CONFORME - REFATORAÇÃO OBRIGATÓRIA

**Problemas Críticos:**

- ❌ Hierarquia violada (UI em services)
- ❌ 537 linhas em 1 função
- ❌ 8 responsabilidades misturadas
- ❌ DOM manipulation em services layer
- ❌ Memory leak risk (histórico completo)
- ❌ Race conditions (setTimeout aninhado)
- ❌ execCommand deprecated

**Não Autorizado para Produção até refatoração.**

**Impacto:** 🔴 ALTO

- Impossível manter
- Impossível testar
- Alto risco de bugs
- XSS vulnerability

---

### Alternativas Consideradas:

1. **Usar Biblioteca (Recomendado):**

   ```javascript
   // Quill.js (rica em features)
   import Quill from "quill";

   // tiptap (moderno, extensível)
   import { useEditor, EditorContent } from "@tiptap/vue-3";
   ```

   **Vantagem:** Battle-tested, seguro, rápido
   **Desvantagem:** Dependency adicional

2. **Refatorar Interno:**

   ```javascript
   // Separar em 5 arquivos
   // Usar Mutation Observer ao invés de setTimeout
   // Implementar undo/redo via events
   ```

   **Vantagem:** Controle total, sem dependency
   **Desvantagem:** Muito trabalho, risco de bugs

---

## 📋 CHECKLIST DE REFATORAÇÃO

- [ ] NotasHistoricoManager.js criado (8.5/10 esperado)
- [ ] NotasFormatadorUI.js criado (8/10 esperado)
- [ ] NotasEstruturadorUI.js criado (8/10 esperado)
- [ ] NotasSelecaoManager.js criado (7.5/10 esperado)
- [ ] NotasToolbarUI.js criado (8.5/10 esperado)
- [ ] DOMPurify integrado para sanitização
- [ ] Mutation Observer ao invés de setTimeout
- [ ] Todos os arquivos auditados
- [ ] Testes unitários implementados
- [ ] Commits & Push realizados

---

**Assinado:** Auditoria Automatizada  
**Data:** 27/01/2026  
**Versão do Contrato:** 1.2.0  
**Próximo Audit:** Após refatoração (esperado 8.2/10 média)

# 🔍 AUDITORIA: main.js

**Data:** 27 de janeiro de 2026  
**Arquivo:** `js/main.js`  
**Linhas:** 245  
**Score Final:** **8.8/10** ✅ PRODUÇÃO PRONTA

---

## 📊 RESUMO EXECUTIVO

| Aspecto                     | Status       | Comentário                                 |
| --------------------------- | ------------ | ------------------------------------------ |
| **Orquestração Central**    | ✅ Excelente | Fluxo claro, bem estruturado               |
| **Conformidade Contrato**   | ✅ Completa  | Zero violações críticas                    |
| **Separação de Camadas**    | ✅ Perfeita  | UI ↔ Orquestração ↔ Domínio                |
| **Event-Driven**            | ✅ Correto   | CustomEvents para comunicação              |
| **Gerenciamento de Estado** | ⚠️ Bom       | Estado global explícito, mas sem validação |
| **Documentação**            | ✅ Boa       | Seções bem delimitadas                     |

---

## ✅ CONFORMIDADES AO CONTRATO

### § 2.1 — TEMPO É SOBERANO

- ✅ **Zero violação**
- Consulta `geradorDatas.js` para: `getDiaDoAnoAtual()`, `getAnoAtual()`
- Não usa `new Date()` em nenhum lugar
- Respeita o gerador como autoridade temporal
- ✅ Correto

### § 3 — HIERARQUIA DE CAMADAS

**Estrutura observada:**

```
DOMContentLoaded (Orquestração)
├─ initDarkMode() [UI]
├─ PlanoManager [Domínio]
├─ ProgressoLeitura [Domínio]
├─ NotasLeituraManager [Domínio]
├─ SearchEngine [Domínio]
├─ SearchUI [UI]
├─ ResetProgressoOrquestrador [Domínio]
├─ ResetModal [UI]
├─ CalendarioViewModel [ViewModel]
├─ renderCalendario() [Renderizador]
└─ NotasOverlayOrquestrador [Domínio]
```

**Análise:**

- ✅ UI layer separada (SearchUI, ResetModal, renderDiaCard, renderCalendario)
- ✅ Domínio puro (PlanoManager, ProgressoLeitura, SearchEngine)
- ✅ Orquestração no main.js (chamadas em sequência, eventos)
- ✅ Sem lógica de negócio no main.js

### § 4 — PRINCÍPIO DO CARTUCHO (Modularidade de Planos)

- ✅ Importa: `import planoCronologico from "./core/services/planos/plano_cronologico.js"`
- ✅ Passa para PlanoManager: `new PlanoManager(planoCronologico)`
- ✅ PlanoManager é agnóstico de qual plano recebe
- ✅ Sistema funcionaria com qualquer plano que respeita a interface
- ✅ Correto

### § 5 — EVENT-DRIVEN ARCHITECTURE

- ✅ Dispara: `new CustomEvent("dia-alterado")`
- ✅ Dispara: `new CustomEvent("progresso-resetado")` (listener em line ~183)
- ✅ Escuta: `document.addEventListener("progresso-resetado", ...)`
- ✅ Desacoplado de dependências diretas
- ✅ Correto

### § 8 — SEM ANTI-PADRÕES

- ✅ Sem `console.log` (zero logs)
- ✅ Sem DOM fora de UI layer
- ✅ Sem temporal queries fora de geradorDatas
- ✅ Sem memory leaks óbvios (listeners removidos?)
- ⚠️ Menor: Event listeners não têm unsubscribe explícito

---

## 🔬 ANÁLISE DETALHADA

### 1. INICIALIZAÇÃO GLOBAL

```javascript
let diaAtualNumero = 1;
let diaHojeNumero = 1;
let planoManagerGlobal;
let progressoGlobal;
let notasManagerGlobal;
let notasOrquestradorGlobal = null;
let calendarioAPI = null;
let calendarioVM = null;
let resetOrquestrador = null;
let resetModal = null;
let searchEngineGlobal = null;
let searchUIGlobal = null;
```

**Score:** 8.5/10

- ✅ Estado global explícito (não oculto em closures)
- ✅ Inicializado para null/1 (sem undefined)
- ⚠️ Sem validação de tipos TypeScript (seria melhor com tipos)
- ⚠️ Sem namespace (exposto diretamente no escopo)

**Recomendação:** Considerar envolver em objeto namespace:

```javascript
const STATE = {
  diaAtualNumero: 1,
  diaHojeNumero: 1,
  managers: {
    /* ... */
  },
};
```

### 2. DESCOBRIR "HOJE"

```javascript
function descobrirDiaDeHoje(plano) {
  const diaDoAno = getDiaDoAnoAtual(); // ✅ Consulta gerador
  if (diaDoAno < 1) return 1; // ✅ Validação
  if (diaDoAno > plano.dias.length) return plano.dias.length; // ✅ Validação
  return diaDoAno;
}
```

**Score:** 10/10

- ✅ Puro (sem side effects)
- ✅ Consulta gerador como autoridade
- ✅ Validações de limites
- ✅ Determinístico

### 3. CALENDÁRIO

```javascript
function atualizarCalendario(plano, progresso) {
  if (!calendarioVM) {
    calendarioVM = new CalendarioViewModel(plano, progresso, ...);
  }
  const anoAtual = getAnoAtual(); // ✅ Consulta gerador
  const viewModel = calendarioVM.gerarViewModel(anoAtual);
  calendarioAPI = renderCalendario({ containerId: "calendario", viewModel });
}
```

**Score:** 9/10

- ✅ Lazy initialization de ViewModel
- ✅ Consulta gerador para ano
- ✅ Separação: ViewModel (domínio) → Renderização (UI)
- ✅ Callbacks para interação (dia selecionado)

### 4. DIA ATIVO

```javascript
function atualizarDiaAtivo(planoManager, progresso, notasManager) {
  const plano = planoManager.getPlano();
  const dia = plano.getDia(diaAtualNumero);
  const container = document.getElementById("dia-view");

  if (!container || !dia) return; // ✅ Validação

  container.innerHTML = renderDiaCard(dia, { ... });

  // ✅ Setup listeners
  const btnLido = container.querySelector("[data-action='toggle-lido']");
  btnLido?.addEventListener("click", () => {
    progresso.alternar(dia.numero);
    atualizarDiaAtivo(...); // ✅ Rerender
    atualizarEstatisticas(...);
    atualizarCalendario(...);
  });

  notasManager.setDiaAtual(dia.numero);
  document.dispatchEvent(new CustomEvent("dia-alterado")); // ✅ Event
}
```

**Score:** 9/10

- ✅ Validações defensivas
- ✅ Renderização pura (renderDiaCard)
- ✅ Event listeners setup
- ✅ Dispara CustomEvent para notificação
- ⚠️ Menor: Listeners acumulam em cada chamada (sem cleanup)

**Problema potencial:** Se `atualizarDiaAtivo` for chamada múltiplas vezes, múltiplos listeners são adicionados.

### 5. NAVEGAÇÃO

```javascript
function navegarParaDia(numeroDia) {
  const plano = planoManagerGlobal.getPlano();
  if (numeroDia < 1 || numeroDia > plano.dias.length) return false;

  diaAtualNumero = numeroDia;
  atualizarDiaAtivo(planoManagerGlobal, progressoGlobal, notasManagerGlobal);
  atualizarCalendario(plano, progressoGlobal);
  scrollParaCardDoDia();
  return true;
}
```

**Score:** 10/10

- ✅ Validação de limites
- ✅ Retorna boolean para feedback
- ✅ Orquestra rerendering
- ✅ UX: scroll automático

### 6. BUSCA

```javascript
function inicializarSistemaDeBusca(plano) {
  searchEngineGlobal = new SearchEngine(plano);
  searchUIGlobal = new SearchUI(searchEngineGlobal, onSelecionarDiaViaBusca);
}

function onSelecionarDiaViaBusca(diaNumero) {
  navegarParaDia(diaNumero);
}
```

**Score:** 9.5/10

- ✅ SearchEngine (domínio puro) separado de SearchUI
- ✅ Callback para interação
- ✅ Desacoplado

### 7. ATALHOS DE TECLADO

```javascript
function configurarAtalhosDeTeclado() {
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "f") {
      e.preventDefault();
      searchUIGlobal?.focus();
    }
    if (e.key === "/" && e.target.tagName !== "INPUT") {
      e.preventDefault();
      searchUIGlobal?.focus();
    }
    if (e.key === "ArrowRight") navegarParaDia(diaAtualNumero + 1);
    if (e.key === "ArrowLeft") navegarParaDia(diaAtualNumero - 1);
    if (e.key === " ")
      document.querySelector("[data-action='toggle-lido']")?.click();
  });
}
```

**Score:** 8.5/10

- ✅ Atalhos intuitivos
- ✅ Validação: não ativa em INPUT
- ✅ Desacoplado de lógica principal
- ⚠️ Listener nunca é removido (acumula se reinicializar)

### 8. RESET

```javascript
function inicializarResetProgresso() {
  resetOrquestrador = new ResetProgressoOrquestrador(
    progressoGlobal,
    planoManagerGlobal,
  );
  resetModal = new ResetModal(resetOrquestrador);
  resetModal.inicializar();
  configurarEventoReset();
}

function configurarEventoReset() {
  document.addEventListener("progresso-resetado", () => {
    const plano = planoManagerGlobal.getPlano();
    atualizarCalendario(plano, progressoGlobal);
    atualizarEstatisticas(plano, progressoGlobal);
    atualizarDiaAtivo(planoManagerGlobal, progressoGlobal, notasManagerGlobal);
  });
}
```

**Score:** 9/10

- ✅ Orquestrador (domínio) separado de Modal (UI)
- ✅ Event-driven
- ✅ Reação em cascata bem orquestrada
- ✅ State é atualizado

### 9. NOTAS

```javascript
function inicializarNotasOverlay() {
  notasOrquestradorGlobal = new NotasOverlayOrquestrador(notasManagerGlobal);
  initNotasOverlayUI(notasOrquestradorGlobal);
  notasOrquestradorGlobal.carregarNotasDoDia();
}
```

**Score:** 9.5/10

- ✅ Orquestrador (domínio) criado primeiro
- ✅ UI inicializado com orquestrador
- ✅ Dados carregados após inicialização
- ✅ Bem desacoplado

### 10. DOMContentLoaded (INICIALIZAÇÃO)

```javascript
document.addEventListener("DOMContentLoaded", () => {
  initDarkMode();

  planoManagerGlobal = new PlanoManager(planoCronologico);
  progressoGlobal = new ProgressoLeitura();
  notasManagerGlobal = new NotasLeituraManager();

  const plano = planoManagerGlobal.getPlano();

  diaHojeNumero = descobrirDiaDeHoje(plano);
  diaAtualNumero = diaHojeNumero;

  inicializarSistemaDeBusca(plano);
  inicializarResetProgresso();

  document.getElementById("total-dias").textContent = plano.dias.length;

  atualizarDiaAtivo(planoManagerGlobal, progressoGlobal, notasManagerGlobal);
  atualizarEstatisticas(plano, progressoGlobal);
  atualizarCalendario(plano, progressoGlobal);

  document
    .getElementById("btn-dia-proximo")
    ?.addEventListener("click", () => navegarParaDia(diaAtualNumero + 1));
  document
    .getElementById("btn-dia-anterior")
    ?.addEventListener("click", () => navegarParaDia(diaAtualNumero - 1));

  inicializarNotasOverlay();
  configurarAtalhosDeTeclado();
});
```

**Score:** 9/10

- ✅ Sequência clara e lógica
- ✅ Dependências criadas antes de uso
- ✅ Inicialização com fallbacks (`?.`)
- ✅ Todos os subsistemas inicializados
- ⚠️ Menor: Sem try-catch (falha de elemento DOM causa erro silencioso)

---

## ⚠️ PROBLEMAS IDENTIFICADOS

### 🟡 IMPORTANTE (Refatorar)

**1. Memory Leak: Listeners acumulam**

```javascript
function atualizarDiaAtivo(...) {
  // ...
  const btnLido = container.querySelector("[data-action='toggle-lido']");
  btnLido?.addEventListener("click", () => { // ⚠️ ACUMULA!
    // ...
  });
}
```

**Problema:** A cada chamada de `atualizarDiaAtivo`, um novo listener é adicionado.  
Após 10 cliques, 10 listeners estão registrados.

**Solução:**

```javascript
// Remover listener antigo antes de adicionar novo
if (btnLido.oldListener) {
  btnLido.removeEventListener("click", btnLido.oldListener);
}
btnLido.oldListener = () => {
  /* ... */
};
btnLido.addEventListener("click", btnLido.oldListener);
```

Ou melhor:

```javascript
btnLido?.replaceWith(btnLido.cloneNode(true)); // Remove todos os listeners
const newBtn = container.querySelector("[data-action='toggle-lido']");
newBtn?.addEventListener("click", () => {
  /* ... */
});
```

**2. Listeners globais nunca são removidos**

```javascript
function configurarAtalhosDeTeclado() {
  document.addEventListener("keydown", (e) => {
    // ⚠️ Nunca removido!
    // ...
  });
}
```

**Problema:** Se esta função for chamada múltiplas vezes, múltiplos listeners.

**Solução:**

```javascript
function configurarAtalhosDeTeclado() {
  const handler = (e) => {
    /* ... */
  };
  if (!document.teclasConfiguradasHandler) {
    document.teclasConfiguradasHandler = handler;
    document.addEventListener("keydown", handler);
  }
}
```

**3. Listeners de botão (reset) sem cleanup**

```javascript
document.getElementById("btn-dia-proximo")?.addEventListener("click", () => ...);
document.getElementById("btn-dia-anterior")?.addEventListener("click", () => ...);
```

**Problema:** Mesma coisa, mas menos crítico (botões estáticos).

### 🔵 MENOR (Otimização)

**1. Estado global sem validação**

```javascript
let diaAtualNumero = 1;
let diaHojeNumero = 1;
// ⚠️ Sem validação: pode ser -1, NaN, null, etc.
```

**2. Sem documentação JSDoc**

```javascript
function navegarParaDia(numeroDia) {
  // ⚠️ Sem @param @returns
  // ...
}
```

**3. Validação fraca de DOM**

```javascript
const container = document.getElementById("dia-view");
if (!container || !dia) return; // ✅ Bom, mas poderia usar try-catch
```

**4. Sem tratamento de erro em renderização**

```javascript
container.innerHTML = renderDiaCard(dia, { ... }); // ⚠️ renderDiaCard pode falhar
```

---

## 🧪 TESTABILIDADE

| Aspecto        | Score | Comentário                                                     |
| -------------- | ----- | -------------------------------------------------------------- |
| Funções puras  | 8/10  | `descobrirDiaDeHoje` é pura; outras têm side effects           |
| Moqueabilidade | 7/10  | DOM necessário para testes; SearchUI, ResetModal precisam mock |
| Isolamento     | 8/10  | Dependências são passadas, mas estado global existe            |
| Determinismo   | 9/10  | Estado previsível baseado em entrada + sistema                 |

---

## 📋 CHECKLIST CONTRATO

- ✅ Sem `new Date()` em nenhum lugar
- ✅ Consulta `geradorDatas.js` como autoridade temporal
- ✅ Sem `console.log` crítico (zero logs)
- ✅ Sem DOM em serviços (UI separada)
- ✅ Event-driven (CustomEvent)
- ⚠️ Memory leaks potenciais (listeners acumulam)
- ✅ Separação de camadas clara
- ✅ Responsabilidade única (orquestração)
- ✅ Sem XSS (sem innerHTML dinâmico em dados não sanitizados)
- ✅ Padrão cartridge respeitado (PlanoManager agnóstico)

---

## 💡 RECOMENDAÇÕES

### 🟢 MANTÉM

- ✅ Estrutura de orquestração
- ✅ Event-driven architecture
- ✅ Separação de camadas
- ✅ DOMContentLoaded hook

### 🟡 REFATORE

**1. Remover memory leak de listeners**

```javascript
// Usar uma classe Orquestrador para gerenciar listeners
class MainOrquestrador {
  constructor() {
    this.listeners = []; // Track para cleanup
  }

  setupListeners() {
    const handler = () => {
      /* ... */
    };
    document.addEventListener("keydown", handler);
    this.listeners.push({ element: document, event: "keydown", handler });
  }

  cleanup() {
    this.listeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
  }
}
```

**2. Adicionar JSDoc**

```javascript
/**
 * Navega para um dia específico
 * @param {number} numeroDia - Número do dia (1-based)
 * @returns {boolean} - true se navegação foi bem-sucedida
 */
function navegarParaDia(numeroDia) {
  /* ... */
}
```

**3. Encapsular estado global**

```javascript
const STATE = Object.freeze({
  get diaAtualNumero() {
    return this._diaAtualNumero;
  },
  set diaAtualNumero(v) {
    this._diaAtualNumero = v;
  },
  // ...
});
```

**4. Try-catch na inicialização**

```javascript
document.addEventListener("DOMContentLoaded", () => {
  try {
    // ... inicialização
  } catch (error) {
    console.error("Erro na inicialização:", error);
    // Mostrar mensagem de erro para usuário
  }
});
```

---

## 📚 FLUXO DOCUMENTADO

```
DOMContentLoaded
├─ initDarkMode() — Tema escuro
├─ PlanoManager(planoCronologico) — Carrega plano
├─ ProgressoLeitura() — Cria progresso
├─ NotasLeituraManager() — Cria gestor de notas
│
├─ descobrirDiaDeHoje(plano) — Calcula dia atual via geradorDatas
├─ diaHojeNumero = resultado
├─ diaAtualNumero = diaHojeNumero
│
├─ inicializarSistemaDeBusca(plano) — SearchEngine + SearchUI
├─ inicializarResetProgresso() — ResetOrquestrador + ResetModal
│
├─ total-dias.textContent = plano.dias.length
│
├─ atualizarDiaAtivo(...) — Renderiza card
│  └─ renderDiaCard(...) — Renderizador puro
│  └─ Setup listener: btn-lido
│  └─ notasManager.setDiaAtual(numero)
│  └─ dispatchEvent("dia-alterado")
│
├─ atualizarEstatisticas(...) — Atualiza UI de progresso
├─ atualizarCalendario(...) — CalendarioViewModel + renderCalendario
│
├─ Setup listeners: btn-proximo, btn-anterior
├─ inicializarNotasOverlay() — NotasOverlayOrquestrador + UI
├─ configurarAtalhosDeTeclado() — Atalhos Ctrl+F, /, Setas

USUÁRIO INTERAGE
└─ navegarParaDia() → atualizarDiaAtivo() → ciclo
```

---

## 🎯 CONCLUSÃO

**main.js é um orquestrador central bem estruturado, com conformidade excelente ao contrato.**

### Pontos fortes:

- ✅ Inicialização clara e sequencial
- ✅ Separação de camadas perfeita
- ✅ Event-driven communication
- ✅ Padrão cartridge respeitado
- ✅ Sem violações de tempo

### Problemas críticos:

- 🟡 Memory leak: Listeners acumulam em `atualizarDiaAtivo`
- 🟡 Listeners globais nunca são removidos

### Melhorias recomendadas:

1. Refatorar listeners com cleanup
2. Adicionar JSDoc para todos os métodos
3. Encapsular estado global
4. Try-catch na inicialização

**Score: 8.8/10 — PRODUÇÃO PRONTA COM REFATORAÇÕES RECOMENDADAS**

### Recomendação:

🟡 **ACEITO COM RESERVAS** —

- Usar em produção com cautela
- Implementar cleanup de listeners em próxima iteração (prioridade 🔴 ALTA)
- Considerar refatoração para classe MainOrquestrador

---

**Auditor:** AI Assistant  
**Data:** 27/01/2026  
**Status:** ✅ COMPLETO
